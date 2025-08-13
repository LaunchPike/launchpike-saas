import type { PaymentPlanEffect, PaymentPlanId } from '../plans';
import type { CreateCheckoutSessionArgs, FetchCustomerPortalUrlArgs, PaymentProcessor } from '../paymentProcessor';
import { createUnibeeCheckoutSessionForPlan, getUnibeePlanId, logUnibeeConfig } from './checkoutUtils';
import { requireNodeEnvVar } from '../../server/utils';
import { unibeeWebhook, unibeeMiddlewareConfigFn } from './webhook';

export type UnibeeMode = 'subscription' | 'payment';

export const unibeePaymentProcessor: PaymentProcessor = {
  id: 'unibee',
  createCheckoutSession: async ({ userId, userEmail, paymentPlan, prismaUserDelegate }: CreateCheckoutSessionArgs) => {
    logUnibeeConfig();
    
    const planType = paymentPlan.getPlanType();
    const planId = getUnibeePlanId(planType);
    
    console.log(`🎯 Creating checkout session for plan: ${planType} (UniBee ID: ${planId})`);
    console.log(`👤 User: ${userEmail} (ID: ${userId})`);
    
    const user = await prismaUserDelegate.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        createdAt: true,
      }
    });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    const unibeeSession = await createUnibeeCheckoutSessionForPlan(
      planId,
      userEmail,
      undefined,
      {
        metadata: {
          userId: user.id,
          userPlan: planType,
          userCreatedAt: user.createdAt.toISOString(),
          source: 'web_app',
          userAgent: 'wasp_app',
        }
      }
    );
    
    await prismaUserDelegate.update({
      where: { id: userId },
      data: { 
        paymentProcessorUserId: unibeeSession.customerId || unibeeSession.id,
      }
    });
    
    if (!unibeeSession.url) {
      throw new Error('Error creating Unibee Checkout Session');
    }
    
    const session = {
      url: unibeeSession.url,
      id: unibeeSession.id,
    };
    
    console.log('✅ Checkout session created successfully');
    console.log('Session ID:', session.id);
    console.log('Checkout URL:', session.url);
    
    return { session };
  },
  
  fetchCustomerPortalUrl: async (_args: FetchCustomerPortalUrlArgs) => {
    return requireNodeEnvVar('UNIBEE_CUSTOMER_PORTAL_URL');
  },
  
  webhook: unibeeWebhook,
  webhookMiddlewareConfigFn: unibeeMiddlewareConfigFn,
}; 