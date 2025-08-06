import type { CreateCheckoutSessionArgs, FetchCustomerPortalUrlArgs, PaymentProcessor } from '../paymentProcessor';
import { requireNodeEnvVar } from '../../server/utils';
import { createUnibeeCheckoutSession } from './checkoutUtils';
import { unibeeWebhook, unibeeMiddlewareConfigFn } from './webhook';

export const unibeePaymentProcessor: PaymentProcessor = {
  id: 'unibee',
  createCheckoutSession: async ({ userId, userEmail, paymentPlan }: CreateCheckoutSessionArgs) => {
    if (!userId) throw new Error('User ID needed to create Unibee Checkout Session');
    const session = await createUnibeeCheckoutSession({
      productId: paymentPlan.getPaymentProcessorPlanId(),
      userEmail,
      userId,
    });
    return { session };
  },
  fetchCustomerPortalUrl: async (args: FetchCustomerPortalUrlArgs) => {
    const user = await args.prismaUserDelegate.findUniqueOrThrow({
      where: {
        id: args.userId,
      },
      select: {
        unibeeCustomerPortalUrl: true,
      },
    });
    // Note that Unibee assigns a unique URL to each user after the first successful payment.
    // This is handled in the Unibee webhook.
    return user.unibeeCustomerPortalUrl;
  },
  webhook: unibeeWebhook,
  webhookMiddlewareConfigFn: unibeeMiddlewareConfigFn,
}; 