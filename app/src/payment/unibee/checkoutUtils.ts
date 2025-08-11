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
    const checkoutUrl = `${UNIBEE_CONFIG.baseUrl.replace('api-', 'cs-')}/hosted/checkout?planId=${params.planId}&env=daily`;
    
    const session: UnibeeCheckoutSession = {
      id: `session_${Date.now()}`,
      url: checkoutUrl,
      status: 'created',
    };
    
    console.log('Created Unibee checkout session:', session);
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