import { UNIBEE_CONFIG } from './env';
import type { 
  UnibeeCustomer, 
  UnibeeCheckoutSession, 
  UnibeeCheckoutParams,
  UnibeeSessionRequest,
  UnibeeSessionResponse
} from './types';
import { PaymentPlanId } from '../plans';

const DOMAIN = process.env.WASP_WEB_CLIENT_URL || 'http://localhost:3000';

// UniBee Plan ID mapping - update these to match your actual UniBee plan IDs
// You can also set these via environment variables if needed
const PLAN_ID_MAPPING: Record<PaymentPlanId, string> = {
  [PaymentPlanId.Hobby]: process.env.UNIBEE_HOBBY_PLAN_ID || '768',
  [PaymentPlanId.Pro]: process.env.UNIBEE_PRO_PLAN_ID || '767', 
  [PaymentPlanId.Credits10]: process.env.UNIBEE_CREDITS_10_PLAN_ID || '769',
};

export function logUnibeeConfig() {
  console.log('🔧 UniBee Configuration:');
  console.log('Base URL:', UNIBEE_CONFIG.baseUrl);
  console.log('Session Endpoint:', UNIBEE_CONFIG.sessionEndpoint);
  console.log('API Key (first 10 chars):', UNIBEE_CONFIG.publicKey.substring(0, 10) + '...');
  console.log('Test Mode:', UNIBEE_CONFIG.isTestMode ? '✅ Enabled' : '❌ Disabled');
  console.log('Environment:', process.env.NODE_ENV || 'development');
  
  if (UNIBEE_CONFIG.isTestMode) {
    console.log('🧪 Test mode is enabled - API calls will be mocked');
  }
}

export async function createUnibeeUserSession(
  customerEmail: string,
  customerName?: string,
  metadata?: Record<string, string>,
  successUrl?: string,
  cancelUrl?: string
): Promise<{ clientSession: string; customerId: string }> {
  try {
    console.log('👤 Creating UniBee user session...');
    console.log('Email:', customerEmail);
    console.log('Name:', customerName);
    console.log('Success URL:', successUrl);
    console.log('Cancel URL:', cancelUrl);
    
    // Generate a unique external user ID
    const externalUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const sessionRequest: UnibeeSessionRequest = {
      email: customerEmail,
      externalUserId: externalUserId,
      successUrl,
      cancelUrl,
      metadata: {
        ...metadata,
        createdAt: new Date().toISOString(),
        source: 'wasp_app',
        customerName: customerName || 'Unknown'
      }
    };
    
    console.log('Session request:', sessionRequest);
    console.log('🔗 Full URL: ${UNIBEE_CONFIG.baseUrl}${UNIBEE_CONFIG.sessionEndpoint}');
    console.log(`🔑 Using API key: ${UNIBEE_CONFIG.publicKey.substring(0, 10)}...`);
    
    if (UNIBEE_CONFIG.isTestMode) {
      console.log('🧪 Test mode enabled, using fallback session');
      const testSession = {
        code: 200,
        message: 'Test mode session',
        data: {
          clientSession: `test_session_${Date.now()}`,
          customerId: `test_customer_${Date.now()}`
        }
      };
      return {
        clientSession: testSession.data.clientSession,
        customerId: testSession.data.customerId
      };
    }
    
    const response = await fetch(`${UNIBEE_CONFIG.baseUrl}${UNIBEE_CONFIG.sessionEndpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${UNIBEE_CONFIG.publicKey}`,
        'accept': 'application/json',
      },
      body: JSON.stringify(sessionRequest),
    });
    
    console.log(`Response status:`, response.status);
    console.log(`Response headers:`, Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ UniBee session API failed:`, response.status, errorText);
      throw new Error(`UniBee session API error: ${response.status} - ${errorText}`);
    }
    
    const responseData: UnibeeSessionResponse = await response.json();
    console.log('✅ UniBee session API response:', responseData);
    
    if (responseData.code !== 0) {
      console.error('❌ UniBee session API error:', responseData);
      throw new Error(`UniBee session API error: ${responseData.message}`);
    }
    
    if (!responseData.data?.clientSession) {
      console.error('❌ No clientSession in response:', responseData);
      throw new Error('No clientSession received from UniBee API');
    }
    
    console.log('✅ UniBee user session created successfully');
    console.log('Client Session:', responseData.data.clientSession);
    console.log('User ID:', responseData.data.userId);
    console.log('📧 User email will be passed to checkout:', customerEmail);
    
    return {
      clientSession: responseData.data.clientSession,
      customerId: responseData.data.userId
    };
    
  } catch (error) {
    console.error('❌ Error creating UniBee user session:', error);
    throw error;
  }
}

export async function createUnibeeCheckoutSession(
  params: UnibeeCheckoutParams
): Promise<UnibeeCheckoutSession> {
  try {
    console.log('🛒 Creating Unibee checkout session...');
    console.log('Params:', params);
    
    let clientSession: string;
    let customerId: string;
    
    if (params.clientSession && params.customerId) {
      clientSession = params.clientSession;
      customerId = params.customerId;
      console.log('Using existing client session:', clientSession);
    } else {
      console.log('Creating new user session...');
      const sessionData = await createUnibeeUserSession(
        params.customerEmail,
        params.customerName,
        {
          planId: params.planId,
          userId: params.customerEmail,
        },
        params.successUrl,
        params.cancelUrl
      );
      
      clientSession = sessionData.clientSession;
      customerId = sessionData.customerId;
    }
    
    // Use the correct checkout URL format as shown in your example
    const baseUrl = `${UNIBEE_CONFIG.baseUrl.replace('api-', 'cs-')}/hosted/checkout`;
    const checkoutUrl = `${baseUrl}?planId=${params.planId}&env=daily&session=${clientSession}`;
    
    console.log('🔗 Generated checkout URL:', checkoutUrl);
    console.log('📧 User email included in session metadata:', params.customerEmail);
    
    const session: UnibeeCheckoutSession = {
      id: clientSession,
      url: checkoutUrl,
      status: 'created',
      customerId: customerId,
      productId: params.planId,
      metadata: {
        clientSession,
        customerId,
        planId: params.planId,
        userEmail: params.customerEmail,
        createdAt: new Date().toISOString(),
      }
    };
    
    console.log('✅ Created Unibee checkout session:', session);
    return session;
    
  } catch (error) {
    console.error('❌ Error creating Unibee checkout session:', error);
    throw error;
  }
}

export async function createUnibeeCheckoutSessionForPlan(
  planId: string,
  customerEmail: string,
  customerName?: string,
  additionalParams?: {
    clientSession?: string;
    customerId?: string;
    metadata?: Record<string, string>;
  }
): Promise<UnibeeCheckoutSession> {
  const params: UnibeeCheckoutParams = {
    planId,
    customerEmail,
    customerName,
    successUrl: `${DOMAIN}/checkout?success=true`,
    cancelUrl: `${DOMAIN}/checkout?canceled=true`,
    clientSession: additionalParams?.clientSession,
    customerId: additionalParams?.customerId,
  };
  
  return createUnibeeCheckoutSession(params);
}

export function getUnibeePlanId(paymentPlanId: PaymentPlanId): string {
  return PLAN_ID_MAPPING[paymentPlanId];
} 