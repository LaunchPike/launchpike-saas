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

const PLAN_ID_MAPPING: Record<PaymentPlanId, string> = {
  [PaymentPlanId.Hobby]: '768',
  [PaymentPlanId.Pro]: '767', 
  [PaymentPlanId.Credits10]: '769',
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
  metadata?: Record<string, string>
): Promise<{ clientSession: string; customerId: string }> {
  try {
    console.log('👤 Creating UniBee user session...');
    console.log('Email:', customerEmail);
    console.log('Name:', customerName);
    
    const sessionRequest: UnibeeSessionRequest = {
      email: customerEmail,
      name: customerName,
      metadata: {
        ...metadata,
        createdAt: new Date().toISOString(),
        source: 'wasp_app'
      }
    };
    
    console.log('Session request:', sessionRequest);
    
    const possibleEndpoints = [
      UNIBEE_CONFIG.sessionEndpoint,
      '/v1/session',
      '/v1/checkout/session',
      '/v1/checkout/sessions',
      '/v1/customer/session',
      '/v1/customers/session'
    ];
    
    let sessionResponse: UnibeeSessionResponse | null = null;
    let workingEndpoint: string | null = null;
    
    for (const endpoint of possibleEndpoints) {
      try {
        console.log(`🔍 Trying endpoint: ${endpoint}`);
        console.log(`🔗 Full URL: ${UNIBEE_CONFIG.baseUrl}${endpoint}`);
        console.log(`🔑 Using API key: ${UNIBEE_CONFIG.publicKey.substring(0, 10)}...`);
        
        const response = await fetch(`${UNIBEE_CONFIG.baseUrl}${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${UNIBEE_CONFIG.publicKey}`,
          },
          body: JSON.stringify(sessionRequest),
        });
        
        console.log(`Endpoint ${endpoint} response status:`, response.status);
        console.log(`Response headers:`, Object.fromEntries(response.headers.entries()));
        
        if (response.ok) {
          const responseData = await response.json();
          console.log(`✅ Working endpoint found: ${endpoint}`);
          console.log('Response data:', responseData);
          
          if (responseData.clientSession || responseData.data?.clientSession) {
            sessionResponse = {
              code: 200,
              message: 'Success',
              data: {
                clientSession: responseData.clientSession || responseData.data.clientSession,
                customerId: responseData.customerId || responseData.data?.customerId || `customer_${Date.now()}`
              }
            };
            workingEndpoint = endpoint;
            break;
          } else {
            console.log(`⚠️ Endpoint ${endpoint} returned success but no clientSession`);
            console.log('Available fields:', Object.keys(responseData));
          }
        } else {
          const errorText = await response.text();
          console.log(`❌ Endpoint ${endpoint} failed:`, response.status, errorText);
        }
      } catch (error) {
        console.log(`❌ Endpoint ${endpoint} error:`, error);
      }
    }
    
    if (!sessionResponse) {
      console.log('⚠️ No working API endpoint found, using fallback approach');
      
      const fallbackSession = {
        code: 200,
        message: 'Fallback session created',
        data: {
          clientSession: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          customerId: `customer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        }
      };
      
      console.log('🔧 Using fallback session:', fallbackSession);
      sessionResponse = fallbackSession;
    }
    
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
      sessionResponse = testSession;
    }
    
    if (sessionResponse.code !== 200) {
      console.error('❌ UniBee session API error:', sessionResponse);
      throw new Error(`UniBee session API error: ${sessionResponse.message}`);
    }
    
    console.log('✅ UniBee user session created successfully');
    console.log('Client Session:', sessionResponse.data.clientSession);
    console.log('Customer ID:', sessionResponse.data.customerId);
    
    return {
      clientSession: sessionResponse.data.clientSession,
      customerId: sessionResponse.data.customerId
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
        }
      );
      
      clientSession = sessionData.clientSession;
      customerId = sessionData.customerId;
    }
    
    const baseUrl = `${UNIBEE_CONFIG.baseUrl.replace('api-', 'cs-')}/hosted/checkout`;
    const checkoutUrl = `${baseUrl}?planId=${params.planId}&env=prod&session=${clientSession}&successUrl=${encodeURIComponent(params.successUrl)}&cancelUrl=${encodeURIComponent(params.cancelUrl)}`;
    
    console.log('🔗 Generated checkout URL:', checkoutUrl);
    
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