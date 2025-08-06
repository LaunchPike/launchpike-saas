import { type MiddlewareConfigFn, HttpError } from 'wasp/server';
import { type PaymentsWebhook } from 'wasp/server/api';
import { type PrismaClient } from '@prisma/client';
import express from 'express';
import { paymentPlans, PaymentPlanId, SubscriptionStatus, type PaymentPlanEffect } from '../plans';
import { updateUserUnibeePaymentDetails } from './paymentDetails';
import { emailSender } from 'wasp/server/email';
import { assertUnreachable } from '../../shared/utils';
import { requireNodeEnvVar } from '../../server/utils';
import {
  parseWebhookPayload,
  type InvoicePaidData,
  type CheckoutCompletedData,
  type SubscriptionCancelledData,
  type SubscriptionUpdatedData,
  type SubscriptionCreatedData,
} from './webhookPayload';
import { UnhandledWebhookEventError } from '../errors';
import crypto from 'crypto';

export const unibeeWebhook: PaymentsWebhook = async (request, response, context) => {
  try {
    const rawUnibeeEvent = constructUnibeeEvent(request);
    const { eventName, data } = await parseWebhookPayload(rawUnibeeEvent);
    const prismaUserDelegate = context.entities.User;
    
    switch (eventName) {
      case 'checkout.completed':
        await handleCheckoutCompleted(data, prismaUserDelegate);
        break;
      case 'invoice.paid':
        await handleInvoicePaid(data, prismaUserDelegate);
        break;
      case 'subscription.created':
        await handleSubscriptionCreated(data, prismaUserDelegate);
        break;
      case 'subscription.updated':
        await handleSubscriptionUpdated(data, prismaUserDelegate);
        break;
      case 'subscription.cancelled':
        await handleSubscriptionCancelled(data, prismaUserDelegate);
        break;
      default:
        assertUnreachable(eventName);
    }
    return response.json({ received: true });
  } catch (err) {
    if (err instanceof UnhandledWebhookEventError) {
      console.error(err.message);
      return response.status(422).json({ error: err.message });
    }

    console.error('Webhook error:', err);
    if (err instanceof HttpError) {
      return response.status(err.statusCode).json({ error: err.message });
    } else {
      return response.status(400).json({ error: 'Error processing Unibee webhook event' });
    }
  }
};

function constructUnibeeEvent(request: express.Request): any {
  try {
    const secret = requireNodeEnvVar('UNIBEE_WEBHOOK_SECRET');
    const signature = request.headers['x-unibee-signature'];
    if (!signature) {
      throw new HttpError(400, 'Unibee webhook signature not provided');
    }
    
    // Verify webhook signature
    const payload = request.body;
    const hmac = crypto.createHmac('sha256', secret);
    const digest = hmac.update(JSON.stringify(payload)).digest('hex');
    
    if (signature !== digest) {
      throw new HttpError(400, 'Invalid Unibee webhook signature');
    }
    
    return payload;
  } catch (err) {
    throw new HttpError(500, 'Error constructing Unibee webhook event');
  }
}

export const unibeeMiddlewareConfigFn: MiddlewareConfigFn = (middlewareConfig) => {
  // We need to delete the default 'express.json' middleware and replace it with 'express.raw' middleware
  // because webhook data comes in the body of the request as raw JSON, not as JSON in the body of the request.
  middlewareConfig.delete('express.json');
  middlewareConfig.set('express.raw', express.raw({ type: 'application/json' }));
  return middlewareConfig;
};

async function handleCheckoutCompleted(
  checkout: CheckoutCompletedData,
  prismaUserDelegate: PrismaClient['user']
) {
  const planId = getPlanIdByProductId(checkout.productId);
  const plan = paymentPlans[planId];
  
  if (plan.effect.kind === 'credits') {
    await saveSuccessfulOneTimePayment(checkout, planId, prismaUserDelegate);
  }
}

async function saveSuccessfulOneTimePayment(
  checkout: CheckoutCompletedData,
  planId: PaymentPlanId,
  prismaUserDelegate: PrismaClient['user']
) {
  const plan = paymentPlans[planId];
  const numOfCreditsPurchased = plan.effect.kind === 'credits' ? plan.effect.amount : 0;
  
  await updateUserUnibeePaymentDetails(
    {
      userUnibeeId: checkout.customerId,
      numOfCreditsPurchased,
      datePaid: new Date(checkout.completedAt * 1000),
    },
    prismaUserDelegate
  );

  // Send confirmation email
  await emailSender.send({
    to: checkout.customerId, // You might need to get the actual email from the customer
    subject: 'Payment Confirmation',
    text: `Thank you for your purchase! You have received ${numOfCreditsPurchased} credits.`,
    html: `<p>Thank you for your purchase! You have received ${numOfCreditsPurchased} credits.</p>`,
  });
}

async function handleInvoicePaid(
  invoice: InvoicePaidData,
  prismaUserDelegate: PrismaClient['user']
) {
  if (invoice.subscriptionId) {
    await saveActiveSubscription(invoice, prismaUserDelegate);
  }
}

async function saveActiveSubscription(
  invoice: InvoicePaidData,
  prismaUserDelegate: PrismaClient['user']
) {
  const planId = getPlanIdByProductId(invoice.productId);
  
  await updateUserUnibeePaymentDetails(
    {
      userUnibeeId: invoice.customerId,
      subscriptionPlan: planId,
      subscriptionStatus: SubscriptionStatus.Active,
      datePaid: new Date(invoice.paidAt * 1000),
    },
    prismaUserDelegate
  );
}

async function handleSubscriptionCreated(
  subscription: SubscriptionCreatedData,
  prismaUserDelegate: PrismaClient['user']
) {
  const planId = getPlanIdByProductId(subscription.productId);
  
  await updateUserUnibeePaymentDetails(
    {
      userUnibeeId: subscription.customerId,
      subscriptionPlan: planId,
      subscriptionStatus: SubscriptionStatus.Active,
      datePaid: new Date(subscription.currentPeriodStart * 1000),
    },
    prismaUserDelegate
  );
}

async function handleSubscriptionUpdated(
  subscription: SubscriptionUpdatedData,
  prismaUserDelegate: PrismaClient['user']
) {
  const planId = getPlanIdByProductId(subscription.productId);
  let subscriptionStatus: SubscriptionStatus;
  
  if (subscription.status === 'active') {
    subscriptionStatus = subscription.cancelAtPeriodEnd 
      ? SubscriptionStatus.CancelAtPeriodEnd 
      : SubscriptionStatus.Active;
  } else if (subscription.status === 'past_due') {
    subscriptionStatus = SubscriptionStatus.PastDue;
  } else {
    subscriptionStatus = SubscriptionStatus.Deleted;
  }
  
  await updateUserUnibeePaymentDetails(
    {
      userUnibeeId: subscription.customerId,
      subscriptionPlan: planId,
      subscriptionStatus,
    },
    prismaUserDelegate
  );
}

async function handleSubscriptionCancelled(
  subscription: SubscriptionCancelledData,
  prismaUserDelegate: PrismaClient['user']
) {
  await updateUserUnibeePaymentDetails(
    {
      userUnibeeId: subscription.customerId,
      subscriptionStatus: SubscriptionStatus.Deleted,
    },
    prismaUserDelegate
  );
}

function getPlanIdByProductId(productId: string): PaymentPlanId {
  for (const [planId, plan] of Object.entries(paymentPlans)) {
    if (plan.getPaymentProcessorPlanId() === productId) {
      return planId as PaymentPlanId;
    }
  }
  throw new Error(`No plan found for product ID: ${productId}`);
} 