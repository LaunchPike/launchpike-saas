import * as z from 'zod';
import { UnhandledWebhookEventError } from '../errors';
import { HttpError } from 'wasp/server';

export async function parseWebhookPayload(rawUnibeeEvent: any) {
  try {
    const event = await genericUnibeeEventSchema.parseAsync(rawUnibeeEvent);
    switch (event.type) {
      case 'subscription.created':
        const subscription = await subscriptionCreatedDataSchema.parseAsync(event.data);
        return { eventName: event.type, data: subscription };
      case 'subscription.updated':
        const updatedSubscription = await subscriptionUpdatedDataSchema.parseAsync(event.data);
        return { eventName: event.type, data: updatedSubscription };
      case 'subscription.cancelled':
        const cancelledSubscription = await subscriptionCancelledDataSchema.parseAsync(event.data);
        return { eventName: event.type, data: cancelledSubscription };
      case 'invoice.paid':
        const invoice = await invoicePaidDataSchema.parseAsync(event.data);
        return { eventName: event.type, data: invoice };
      case 'checkout.completed':
        const checkout = await checkoutCompletedDataSchema.parseAsync(event.data);
        return { eventName: event.type, data: checkout };
      default:
        throw new UnhandledWebhookEventError(event.type);
    }
  } catch (e: unknown) {
    if (e instanceof UnhandledWebhookEventError) {
      throw e;
    } else {
      console.error(e);
      throw new HttpError(400, 'Error parsing Unibee event object');
    }
  }
}

const genericUnibeeEventSchema = z.object({
  type: z.string(),
  data: z.unknown(),
  timestamp: z.number(),
});

const subscriptionCreatedDataSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  productId: z.string(),
  status: z.string(),
  currentPeriodStart: z.number(),
  currentPeriodEnd: z.number(),
  metadata: z.record(z.string()).optional(),
});

const subscriptionUpdatedDataSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  productId: z.string(),
  status: z.string(),
  currentPeriodStart: z.number(),
  currentPeriodEnd: z.number(),
  cancelAtPeriodEnd: z.boolean(),
  metadata: z.record(z.string()).optional(),
});

const subscriptionCancelledDataSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  productId: z.string(),
  status: z.string(),
  cancelledAt: z.number(),
  metadata: z.record(z.string()).optional(),
});

const invoicePaidDataSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  subscriptionId: z.string().optional(),
  productId: z.string(),
  amount: z.number(),
  currency: z.string(),
  status: z.string(),
  paidAt: z.number(),
  metadata: z.record(z.string()).optional(),
});

const checkoutCompletedDataSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  productId: z.string(),
  status: z.string(),
  amount: z.number(),
  currency: z.string(),
  completedAt: z.number(),
  metadata: z.record(z.string()).optional(),
});

export type SubscriptionCreatedData = z.infer<typeof subscriptionCreatedDataSchema>;
export type SubscriptionUpdatedData = z.infer<typeof subscriptionUpdatedDataSchema>;
export type SubscriptionCancelledData = z.infer<typeof subscriptionCancelledDataSchema>;
export type InvoicePaidData = z.infer<typeof invoicePaidDataSchema>;
export type CheckoutCompletedData = z.infer<typeof checkoutCompletedDataSchema>; 