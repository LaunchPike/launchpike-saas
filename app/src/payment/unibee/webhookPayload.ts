import { PaymentPlanId, paymentPlans, type PaymentPlanEffect } from '../plans';

export type UnibeeWebhookEventType = 
  | 'order.created' | 'order_created' | 'orderCreated'
  | 'order.updated' | 'order_updated' | 'orderUpdated'
  | 'subscription.created' | 'subscription_created' | 'subscriptionCreated'
  | 'subscription.updated' | 'subscription_updated' | 'subscriptionUpdated'
  | 'subscription.cancelled' | 'subscription_cancelled' | 'subscriptionCancelled'
  | 'subscription.resumed' | 'subscription_resumed' | 'subscriptionResumed'
  | 'subscription.paused' | 'subscription_paused' | 'subscriptionPaused'
  | 'subscription.expired' | 'subscription_expired' | 'subscriptionExpired'
  | 'subscription.trial_ended' | 'subscription_trial_ended' | 'subscriptionTrialEnded'
  | 'subscription.payment_failed' | 'subscription_payment_failed' | 'subscriptionPaymentFailed'
  | 'subscription.payment_succeeded' | 'subscription_payment_succeeded' | 'subscriptionPaymentSucceeded'
  | 'subscription.payment_refunded' | 'subscription_payment_refunded' | 'subscriptionPaymentRefunded';

export interface UnibeeWebhookEvent {
  id: string;
  type: UnibeeWebhookEventType;
  data: any;
  created_at: string;
}

export interface UnibeeOrderData {
  id: string;
  customer_id: string;
  customer_email: string;
  status: string;
  total: number;
  currency: string;
  created_at: string;
  updated_at: string;
  items: UnibeeOrderItem[];
  metadata?: Record<string, any>;
}

export interface UnibeeOrderItem {
  id: string;
  variant_id: string;
  variant_name: string;
  price: number;
  quantity: number;
  metadata?: Record<string, any>;
}

export interface UnibeeSubscriptionData {
  id: string;
  customer_id: string;
  customer_email: string;
  status: string;
  variant_id: string;
  variant_name: string;
  price: number;
  currency: string;
  trial_ends_at?: string;
  renews_at?: string;
  ends_at?: string;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
}

export interface UnibeePaymentData {
  id: string;
  customer_id: string;
  customer_email: string;
  status: string;
  amount: number;
  currency: string;
  created_at: string;
  metadata?: Record<string, any>;
}

export function parseUnibeeWebhookPayload(rawEvent: any): {
  eventName: UnibeeWebhookEventType;
  data: UnibeeOrderData | UnibeeSubscriptionData | UnibeePaymentData;
} {
  try {
    const event = rawEvent as UnibeeWebhookEvent;
    
    if (!event.type || !event.data) {
      throw new Error('Invalid webhook event structure');
    }

    return {
      eventName: event.type,
      data: event.data,
    };
  } catch (error) {
    throw new Error(`Failed to parse Unibee webhook payload: ${error}`);
  }
}

export function getPlanIdByVariantId(variantId: string): PaymentPlanId {
  const variantToPlanMapping: Record<string, PaymentPlanId> = {
    '768': PaymentPlanId.Hobby,    // Hobby plan
    '767': PaymentPlanId.Pro,      // Pro plan
    '769': PaymentPlanId.Credits10, // Credits plan
  };

  const planId = variantToPlanMapping[variantId];
  if (!planId) {
    throw new Error(`No plan found for Unibee variant ID: ${variantId}`);
  }

  return planId;
}

export function getPlanEffectPaymentDetails({
  planId,
  planEffect,
}: {
  planId: PaymentPlanId;
  planEffect: PaymentPlanEffect;
}): {
  subscriptionPlan: PaymentPlanId | undefined;
  numOfCreditsPurchased: number | undefined;
} {
  switch (planEffect.kind) {
    case 'subscription':
      return { subscriptionPlan: planId, numOfCreditsPurchased: undefined };
    case 'credits':
      return { subscriptionPlan: undefined, numOfCreditsPurchased: planEffect.amount };
    default:
      throw new Error(`Unknown plan effect kind: ${(planEffect as any).kind}`);
  }
} 