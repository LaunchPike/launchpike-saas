import { type MiddlewareConfigFn, HttpError } from 'wasp/server';
import { type PaymentsWebhook } from 'wasp/server/api';
import { type PrismaClient } from '@prisma/client';
import express from 'express';
import { paymentPlans, PaymentPlanId, SubscriptionStatus, type PaymentPlanEffect } from '../plans';
import { createOrUpdateUserUnibeePaymentDetails } from './paymentDetails';
import { emailSender } from 'wasp/server/email';
import { requireNodeEnvVar } from '../../server/utils';
import {
  parseUnibeeWebhookPayload,
  getPlanIdByVariantId,
  getPlanEffectPaymentDetails,
  type UnibeeWebhookEventType,
  type UnibeeOrderData,
  type UnibeeSubscriptionData,
  type UnibeePaymentData,
} from './webhookPayload';

export const unibeeWebhook: PaymentsWebhook = async (request, response, context) => {
  console.log('🔥 WEBHOOK FUNCTION CALLED! 🔥');
  console.log('🔥 WEBHOOK FUNCTION CALLED! 🔥');
  console.log('🔥 WEBHOOK FUNCTION CALLED! 🔥');
  console.log('🔥 WEBHOOK FUNCTION CALLED! 🔥');
  console.log('🔥 WEBHOOK FUNCTION CALLED! 🔥');
  console.log('=== UNIBEE WEBHOOK RECEIVED ===');
  console.log('Method:', request.method);
  console.log('URL:', request.url);
  console.log('Headers:', JSON.stringify(request.headers, null, 2));
  console.log('Body:', JSON.stringify(request.body, null, 2));
  console.log('Body type:', typeof request.body);
  console.log('Body keys:', request.body ? Object.keys(request.body) : 'No body');
  console.log('Timestamp:', new Date().toISOString());
  console.log('Request IP:', request.ip);
  console.log('User Agent:', request.headers['user-agent']);
  
  try {
    const authHeader = request.headers.authorization;
    const expectedApiKey = requireNodeEnvVar('UNIBEE_PUBLIC_KEY');
    
    console.log('Auth header:', authHeader);
    console.log('Expected API key:', expectedApiKey);
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('Missing or invalid Authorization header');
      return response.status(401).json({ error: 'Unauthorized' });
    }
    
    const receivedApiKey = authHeader.replace('Bearer ', '');
    if (receivedApiKey !== expectedApiKey) {
      console.error('Invalid API key');
      console.error('Received:', receivedApiKey);
      console.error('Expected:', expectedApiKey);
      return response.status(401).json({ error: 'Unauthorized' });
    }
    
    console.log('Webhook verified successfully with API key');
    
    const { eventName, data } = parseUnibeeWebhookPayload(request.body);
    const prismaUserDelegate = context.entities.User;
    
    console.log(`Processing Unibee webhook: ${eventName}`, data);
    
    const normalizedEventName = eventName.replace(/[._]/g, '').toLowerCase();
    console.log('Normalized event name:', normalizedEventName);
    
    switch (normalizedEventName) {
      case 'subscriptioncreated':
        console.log('Handling subscription.created event');
        await handleSubscriptionCreated(data as UnibeeSubscriptionData, prismaUserDelegate);
        break;
      case 'subscriptionupdated':
        console.log('Handling subscription.updated event');
        await handleSubscriptionUpdated(data as UnibeeSubscriptionData, prismaUserDelegate);
        break;
      case 'subscriptioncancelled':
        console.log('Handling subscription.cancelled event');
        await handleSubscriptionCancelled(data as UnibeeSubscriptionData, prismaUserDelegate);
        break;
      case 'invoicepaid':
        console.log('Handling invoice.paid event');
        await handleInvoicePaid(data as any, prismaUserDelegate);
        break;
      default:
        console.log(`Unhandled Unibee webhook event: ${eventName}`);
        console.log('Normalized event name:', normalizedEventName);
        console.log('Available event types:', Object.keys(request.body));
        console.log('Full request body structure:', JSON.stringify(request.body, null, 2));
    }
    
    console.log('=== UNIBEE WEBHOOK PROCESSED SUCCESSFULLY ===');
    return response.json({ success: true });
  } catch (err) {
    console.error('=== UNIBEE WEBHOOK ERROR ===');
    console.error('Error details:', err);
    console.error('Error stack:', err instanceof Error ? err.stack : 'No stack trace');
    
    if (err instanceof HttpError) {
      return response.status(err.statusCode).json({ error: err.message });
    } else {
      return response.status(400).json({ error: 'Error processing Unibee webhook event' });
    }
  }
};

export const unibeeMiddlewareConfigFn: MiddlewareConfigFn = (middlewareConfig) => {
  return middlewareConfig;
};

async function handleOrderCreated(
  order: UnibeeOrderData,
  prismaUserDelegate: PrismaClient['user']
) {
  console.log('Processing order created:', order.id);
  
  for (const item of order.items) {
    const planId = getPlanIdByVariantId(item.variant_id);
    const plan = paymentPlans[planId];
    const { numOfCreditsPurchased } = getPlanEffectPaymentDetails({ planId, planEffect: plan.effect });
    
    if (numOfCreditsPurchased) {
      await createOrUpdateUserUnibeePaymentDetails(
        {
          userUnibeeId: order.customer_id,
          userEmail: order.customer_email,
          numOfCreditsPurchased,
          datePaid: new Date(order.created_at),
        },
        prismaUserDelegate
      );
      
      console.log(`Added ${numOfCreditsPurchased} credits to user ${order.customer_email}`);
    }
  }
}

async function handleSubscriptionCreated(
  subscription: UnibeeSubscriptionData,
  prismaUserDelegate: PrismaClient['user']
) {
  console.log('Processing subscription created:', subscription.id);
  
  const planId = getPlanIdByVariantId(subscription.variant_id);
  const plan = paymentPlans[planId];
  
  await createOrUpdateUserUnibeePaymentDetails(
    {
      userUnibeeId: subscription.customer_id,
      userEmail: subscription.customer_email,
      subscriptionPlan: planId,
      subscriptionStatus: SubscriptionStatus.Active,
      datePaid: new Date(subscription.created_at),
    },
    prismaUserDelegate
  );
  
  console.log(`Activated subscription ${planId} for user ${subscription.customer_email}`);
}

async function handleSubscriptionUpdated(
  subscription: UnibeeSubscriptionData,
  prismaUserDelegate: PrismaClient['user']
) {
  console.log('Processing subscription updated:', subscription.id);
  
  const planId = getPlanIdByVariantId(subscription.variant_id);
  let subscriptionStatus: SubscriptionStatus;
  
  switch (subscription.status) {
    case 'active':
      subscriptionStatus = SubscriptionStatus.Active;
      break;
    case 'past_due':
      subscriptionStatus = SubscriptionStatus.PastDue;
      break;
    case 'cancelled':
      subscriptionStatus = SubscriptionStatus.Deleted;
      break;
    default:
      console.log(`Unknown subscription status: ${subscription.status}`);
      return;
  }
  
  await createOrUpdateUserUnibeePaymentDetails(
    {
      userUnibeeId: subscription.customer_id,
      userEmail: subscription.customer_email,
      subscriptionPlan: planId,
      subscriptionStatus,
      datePaid: new Date(subscription.updated_at),
    },
    prismaUserDelegate
  );
  
  console.log(`Updated subscription ${planId} status to ${subscriptionStatus} for user ${subscription.customer_email}`);
}

async function handleSubscriptionCancelled(
  subscription: UnibeeSubscriptionData,
  prismaUserDelegate: PrismaClient['user']
) {
  console.log('Processing subscription cancelled:', subscription.id);
  
  await createOrUpdateUserUnibeePaymentDetails(
    {
      userUnibeeId: subscription.customer_id,
      userEmail: subscription.customer_email,
      subscriptionStatus: SubscriptionStatus.Deleted,
      datePaid: new Date(subscription.updated_at),
    },
    prismaUserDelegate
  );
  
  console.log(`Cancelled subscription for user ${subscription.customer_email}`);
  
  try {
    await emailSender.send({
      to: subscription.customer_email,
      subject: 'We hate to see you go :(',
      text: 'We hate to see you go. Here is a sweet offer...',
      html: 'We hate to see you go. Here is a sweet offer...',
    });
  } catch (error) {
    console.error('Failed to send cancellation email:', error);
  }
}

async function handleSubscriptionPaymentSucceeded(
  subscription: UnibeeSubscriptionData,
  prismaUserDelegate: PrismaClient['user']
) {
  console.log('Processing subscription payment succeeded:', subscription.id);
  
  const planId = getPlanIdByVariantId(subscription.variant_id);
  
  await createOrUpdateUserUnibeePaymentDetails(
    {
      userUnibeeId: subscription.customer_id,
      userEmail: subscription.customer_email,
      subscriptionPlan: planId,
      subscriptionStatus: SubscriptionStatus.Active,
      datePaid: new Date(subscription.updated_at),
    },
    prismaUserDelegate
  );
  
  console.log(`Confirmed payment for subscription ${planId} for user ${subscription.customer_email}`);
}

async function handleSubscriptionPaymentFailed(
  subscription: UnibeeSubscriptionData,
  prismaUserDelegate: PrismaClient['user']
) {
  console.log('Processing subscription payment failed:', subscription.id);
  
  await createOrUpdateUserUnibeePaymentDetails(
    {
      userUnibeeId: subscription.customer_id,
      userEmail: subscription.customer_email,
      subscriptionStatus: SubscriptionStatus.PastDue,
      datePaid: new Date(subscription.updated_at),
    },
    prismaUserDelegate
  );
  
  console.log(`Marked subscription as past due for user ${subscription.customer_email}`);
}

async function handleInvoicePaid(
  invoice: any,
  prismaUserDelegate: PrismaClient['user']
) {
  console.log('Processing invoice.paid event:', invoice);
  
  if (invoice.subscription) {
    const subscription = invoice.subscription;
    const planId = getPlanIdByVariantId(subscription.planId?.toString() || '');
    
    await createOrUpdateUserUnibeePaymentDetails(
      {
        userUnibeeId: subscription.userId?.toString() || '',
        userEmail: invoice.user?.email || '',
        subscriptionPlan: planId,
        subscriptionStatus: SubscriptionStatus.Active,
        datePaid: new Date(invoice.createTime * 1000),
      },
      prismaUserDelegate
    );
    
    console.log(`Activated subscription ${planId} for user ${invoice.user?.email}`);
  }
} 