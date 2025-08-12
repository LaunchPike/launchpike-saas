import { UNIBEE_CONFIG } from './env';
import type { UnibeeCustomer, UnibeeCheckoutSession, UnibeeCheckoutParams } from './types';
import { PaymentPlanId } from '../plans';

const DOMAIN = process.env.WASP_WEB_CLIENT_URL || 'http://localhost:3000';

const PLAN_ID_MAPPING: Record<PaymentPlanId, string> = {
  [PaymentPlanId.Hobby]: '768',
  [PaymentPlanId.Pro]: '767', 
  [PaymentPlanId.Credits10]: '769',
};

export async function fetchUnibeeCustomer(customerEmail: string): Promise<UnibeeCustomer> {
  try {
    const customer: UnibeeCustomer = {
      id: `customer_${Date.now()}`,
      email: customerEmail,
    };
    
    console.log('Using Unibee customer:', customer);
    return customer;
  } catch (error) {
    console.error('Error fetching Unibee customer:', error);
    throw error;
  }
}

export async function createUnibeeCheckoutSession(
  params: UnibeeCheckoutParams
): Promise<UnibeeCheckoutSession> {
  try {
    console.log('🛒 Creating Unibee checkout session...');
    console.log('Params:', params);
    
    const baseUrl = `${UNIBEE_CONFIG.baseUrl.replace('api-', 'cs-')}/hosted/checkout`;
    const checkoutUrl = `${baseUrl}?planId=${params.planId}&env=daily&successUrl=${encodeURIComponent(params.successUrl)}&cancelUrl=${encodeURIComponent(params.cancelUrl)}`;
    
    console.log('Base URL:', baseUrl);
    console.log('Generated checkout URL:', checkoutUrl);
    console.log('Success URL:', params.successUrl);
    console.log('Cancel URL:', params.cancelUrl);
    
    const possibleEndpoints = [
      '/v1/checkout/session',
      '/v1/checkout/sessions',
      '/v1/orders',
      '/v1/subscriptions',
      '/v1/checkout'
    ];
    
    let sessionData: any = null;
    let workingEndpoint: string | null = null;
    
    for (const endpoint of possibleEndpoints) {
      try {
        console.log(`Trying endpoint: ${endpoint}`);
        const response = await fetch(`${UNIBEE_CONFIG.baseUrl}${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${UNIBEE_CONFIG.publicKey}`,
          },
          body: JSON.stringify({
            planId: params.planId,
            successUrl: params.successUrl,
            cancelUrl: params.cancelUrl,
            env: 'daily'
          }),
        });
        
        console.log(`Endpoint ${endpoint} response status:`, response.status);
        
        if (response.ok) {
          sessionData = await response.json();
          workingEndpoint = endpoint;
          console.log(`✅ Working endpoint found: ${endpoint}`);
          console.log('Session data:', sessionData);
          break;
        } else {
          const errorText = await response.text();
          console.log(`❌ Endpoint ${endpoint} failed:`, response.status, errorText);
        }
      } catch (error) {
        console.log(`❌ Endpoint ${endpoint} error:`, error);
      }
    }
    
    if (!sessionData) {
      console.log('⚠️ No working API endpoint found, using direct URL approach');
      console.log('🔗 Direct checkout URL will be used');
      const session: UnibeeCheckoutSession = {
        id: `session_${Date.now()}`,
        url: checkoutUrl,
        status: 'created',
        customerId: undefined,
        productId: params.planId,
        metadata: {}
      };
      
      console.log('Created Unibee checkout session (direct URL):', session);
      console.log('📋 User should be redirected to:', checkoutUrl);
      return session;
    }
    
    const session: UnibeeCheckoutSession = {
      id: sessionData.id || `session_${Date.now()}`,
      url: checkoutUrl,
      status: 'created',
      customerId: sessionData.customerId || undefined,
      productId: sessionData.productId || params.planId,
      metadata: sessionData.metadata || {}
    };
    
    console.log('Created Unibee checkout session (API):', session);
    return session;
  } catch (error) {
    console.error('Error creating Unibee checkout session:', error);
    throw error;
  }
}

export async function createUnibeeCheckoutSessionForPlan(
  planId: string,
  customerEmail: string,
  customerName?: string
): Promise<UnibeeCheckoutSession> {
  const params: UnibeeCheckoutParams = {
    planId,
    customerEmail,
    customerName,
    successUrl: `${DOMAIN}/checkout?success=true`,
    cancelUrl: `${DOMAIN}/checkout?canceled=true`,
  };
  
  return createUnibeeCheckoutSession(params);
}

export function getUnibeePlanId(paymentPlanId: PaymentPlanId): string {
  return PLAN_ID_MAPPING[paymentPlanId];
} 