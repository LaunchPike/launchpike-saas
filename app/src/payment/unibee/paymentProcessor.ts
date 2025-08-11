import type { PaymentPlanEffect, PaymentPlanId } from '../plans';
import type { CreateCheckoutSessionArgs, FetchCustomerPortalUrlArgs, PaymentProcessor } from '../paymentProcessor';
import { createUnibeeCheckoutSessionForPlan, getUnibeePlanId } from './checkoutUtils';
import { requireNodeEnvVar } from '../../server/utils';
import { unibeeWebhook, unibeeMiddlewareConfigFn } from './webhook';

export type UnibeeMode = 'subscription' | 'payment';

export const unibeePaymentProcessor: PaymentProcessor = {
  id: 'unibee',
  createCheckoutSession: async ({ userId, userEmail, paymentPlan, prismaUserDelegate }: CreateCheckoutSessionArgs) => {
    const planType = paymentPlan.getPlanType();
    const planId = getUnibeePlanId(planType);
    
    const unibeeSession = await createUnibeeCheckoutSessionForPlan(
      planId,
      userEmail
    );
    
    await prismaUserDelegate.update({
      where: { id: userId },
      data: { paymentProcessorUserId: unibeeSession.id }
    });
    
    if (!unibeeSession.url) {
      throw new Error('Error creating Unibee Checkout Session');
    }
    
    const session = {
      url: unibeeSession.url,
      id: unibeeSession.id,
    };
    
    return { session };
  },
  
  fetchCustomerPortalUrl: async (_args: FetchCustomerPortalUrlArgs) => {
    return requireNodeEnvVar('UNIBEE_CUSTOMER_PORTAL_URL');
  },
  
  webhook: unibeeWebhook,
  webhookMiddlewareConfigFn: unibeeMiddlewareConfigFn,
}; 