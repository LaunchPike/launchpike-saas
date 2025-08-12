import { UNIBEE_CONFIG } from './env';
import type { UnibeeCustomer, UnibeeCheckoutSession, UnibeeCheckoutParams } from './types';
import { PaymentPlanId } from '../plans';

// WASP_WEB_CLIENT_URL будет установлен Wasp при деплое в production
const DOMAIN = process.env.WASP_WEB_CLIENT_URL || 'http://localhost:3000';

// Маппинг планов на Unibee variant ID
const PLAN_ID_MAPPING: Record<PaymentPlanId, string> = {
  [PaymentPlanId.Hobby]: '768',
  [PaymentPlanId.Pro]: '767', 
  [PaymentPlanId.Credits10]: '769',
};

export async function fetchUnibeeCustomer(customerEmail: string): Promise<UnibeeCustomer> {
  try {
    // В Unibee мы можем создать клиента или найти существующего
    // Для простоты создаем нового клиента каждый раз
    const customer: UnibeeCustomer = {
      id: `customer_${Date.now()}`, // В реальном приложении это должно быть ID из Unibee API
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
    // Создаем checkout URL для Unibee
    const checkoutUrl = `${UNIBEE_CONFIG.baseUrl.replace('api-', 'cs-')}/hosted/checkout?planId=${params.planId}&env=daily`;
    
    // В реальном приложении здесь должен быть вызов Unibee API
    // для создания checkout сессии
    
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