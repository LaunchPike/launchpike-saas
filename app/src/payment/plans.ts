import { requireNodeEnvVar } from '../server/utils';

export enum SubscriptionStatus {
  PastDue = 'past_due',
  CancelAtPeriodEnd = 'cancel_at_period_end',
  Active = 'active',
  Deleted = 'deleted',
}

export enum PaymentPlanId {
  Hobby = 'hobby',
  Pro = 'pro',
  Credits10 = 'credits10',
}

export interface PaymentPlan {
  // Returns the id under which this payment plan is identified on your payment processor.
  // E.g. this might be price id on Stripe, or variant id on LemonSqueezy.
  getPaymentProcessorPlanId: () => string;
  effect: PaymentPlanEffect;
  getPlanType: () => PaymentPlanId;
}

export type PaymentPlanEffect = { kind: 'subscription' } | { kind: 'credits'; amount: number };

export const paymentPlans: Record<PaymentPlanId, PaymentPlan> = {
  [PaymentPlanId.Hobby]: {
    getPaymentProcessorPlanId: () => '768', // Unibee Hobby plan ID
    effect: { kind: 'subscription' },
    getPlanType: () => PaymentPlanId.Hobby,
  },
  [PaymentPlanId.Pro]: {
    getPaymentProcessorPlanId: () => '767', // Unibee Pro plan ID
    effect: { kind: 'subscription' },
    getPlanType: () => PaymentPlanId.Pro,
  },
  [PaymentPlanId.Credits10]: {
    getPaymentProcessorPlanId: () => '769', // Unibee Credits plan ID
    effect: { kind: 'credits', amount: 10 },
    getPlanType: () => PaymentPlanId.Credits10,
  },
};

export function prettyPaymentPlanName(planId: PaymentPlanId): string {
  const planToName: Record<PaymentPlanId, string> = {
    [PaymentPlanId.Hobby]: 'Hobby',
    [PaymentPlanId.Pro]: 'Pro',
    [PaymentPlanId.Credits10]: '10 Credits',
  };
  return planToName[planId];
}

export function parsePaymentPlanId(planId: string): PaymentPlanId {
  if ((Object.values(PaymentPlanId) as string[]).includes(planId)) {
    return planId as PaymentPlanId;
  } else {
    throw new Error(`Invalid PaymentPlanId: ${planId}`);
  }
}

export function getSubscriptionPaymentPlanIds(): PaymentPlanId[] {
  return Object.values(PaymentPlanId).filter((planId) => paymentPlans[planId].effect.kind === 'subscription');
}
