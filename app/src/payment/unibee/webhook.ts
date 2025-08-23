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
  
  if (!request.body || Object.keys(request.body).length === 0) {
    console.error('❌ Empty webhook body received');
    return response.status(400).json({ error: 'Empty webhook body' });
  }
  
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
      case 'ordercreated':
        console.log('Handling order.created event');
        await handleOrderCreated(data as UnibeeOrderData, prismaUserDelegate);
        break;
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
      case 'invoicecreated':
        console.log('Handling invoice.created event');
        await handleInvoiceCreated(data as any, prismaUserDelegate);
        break;
      case 'paymentsucceeded':
        console.log('Handling payment.succeeded event');
        await handlePaymentSucceeded(data as UnibeePaymentData, prismaUserDelegate);
        break;
      case 'paymentfailed':
        console.log('Handling payment.failed event');
        await handlePaymentFailed(data as UnibeePaymentData, prismaUserDelegate);
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
  console.log('Processing order created:', order);
  
  try {
    const customerId = order.customer_id;
    const customerEmail = order.customer_email;
    
    if (!customerId || !customerEmail) {
      console.warn('⚠️ Missing customer information in order:', order);
      return;
    }
    
    console.log(`🛒 Processing order for customer: ${customerEmail} (ID: ${customerId})`);
    console.log(`📦 Order items:`, order.items);
    
    for (const item of order.items) {
      try {
        const planId = getPlanIdByVariantId(item.variant_id);
        const plan = paymentPlans[planId];
        const { numOfCreditsPurchased } = getPlanEffectPaymentDetails({ planId, planEffect: plan.effect });
        
        if (numOfCreditsPurchased) {
          await createOrUpdateUserUnibeePaymentDetails(
            {
              userUnibeeId: customerId,
              userEmail: customerEmail,
              numOfCreditsPurchased,
              datePaid: new Date(order.created_at),
            },
            prismaUserDelegate
          );
          
          console.log(`✅ Added ${numOfCreditsPurchased} credits to user ${customerEmail}`);
        } else {
          console.log(`ℹ️ No credits to add for plan ${planId}`);
        }
      } catch (error) {
        console.error(`❌ Error processing order item ${item.id}:`, error);
      }
    }
    
  } catch (error) {
    console.error('❌ Error processing order.created event:', error);
    console.error('Order data:', JSON.stringify(order, null, 2));
  }
}

async function handleSubscriptionCreated(
  subscription: UnibeeSubscriptionData,
  prismaUserDelegate: PrismaClient['user']
) {
  console.log('Processing subscription created:', subscription);
  
  try {
    const customerId = subscription.customer_id;
    const customerEmail = subscription.customer_email;
    const variantId = subscription.variant_id;
    
    if (!customerId || !customerEmail) {
      console.warn('⚠️ Missing customer information in subscription:', subscription);
      return;
    }
    
    if (!variantId) {
      console.warn('⚠️ Missing variant_id in subscription:', subscription);
      return;
    }
    
    let planId: PaymentPlanId;
    try {
      planId = getPlanIdByVariantId(variantId);
    } catch (error) {
      console.error('❌ Could not determine plan from variant_id:', variantId, error);
      return;
    }
    
    console.log(`📋 Processing subscription for plan: ${planId}`);
    console.log(`👤 Customer: ${customerEmail} (ID: ${customerId})`);
    
    await createOrUpdateUserUnibeePaymentDetails(
      {
        userUnibeeId: customerId,
        userEmail: customerEmail,
        subscriptionPlan: planId,
        subscriptionStatus: SubscriptionStatus.Active,
        datePaid: new Date(subscription.created_at),
      },
      prismaUserDelegate
    );
    
    console.log(`✅ Successfully activated subscription ${planId} for user ${customerEmail}`);
    
  } catch (error) {
    console.error('❌ Error processing subscription.created event:', error);
    console.error('Subscription data:', JSON.stringify(subscription, null, 2));
  }
}

async function handleSubscriptionUpdated(
  subscription: UnibeeSubscriptionData,
  prismaUserDelegate: PrismaClient['user']
) {
  console.log('Processing subscription updated:', subscription);
  
  try {
    const customerId = subscription.customer_id;
    const customerEmail = subscription.customer_email;
    const variantId = subscription.variant_id;
    
    if (!customerId || !customerEmail) {
      console.warn('⚠️ Missing customer information in subscription update:', subscription);
      return;
    }
    
    if (!variantId) {
      console.warn('⚠️ Missing variant_id in subscription update:', subscription);
      return;
    }
    
    let planId: PaymentPlanId;
    try {
      planId = getPlanIdByVariantId(variantId);
    } catch (error) {
      console.error('❌ Could not determine plan from variant_id:', variantId, error);
      return;
    }
    
    let subscriptionStatus: SubscriptionStatus;

    const statusStr = subscription.status?.toString() || '';
    
    switch (statusStr) {
      case '1':
      case 'active':
        subscriptionStatus = SubscriptionStatus.Active;
        break;
      case '2':
      case 'past_due':
        subscriptionStatus = SubscriptionStatus.PastDue;
        break;
      case '3':
      case 'cancelled':
        subscriptionStatus = SubscriptionStatus.Deleted;
        break;
      default:
        console.log(`ℹ️ Unknown subscription status: ${subscription.status}`);
        subscriptionStatus = SubscriptionStatus.Active;
    }
    
    console.log(`📋 Updating subscription for plan: ${planId}`);
    console.log(`👤 Customer: ${customerEmail} (ID: ${customerId})`);
    console.log(`🔄 New status: ${subscriptionStatus}`);
    
    await createOrUpdateUserUnibeePaymentDetails(
      {
        userUnibeeId: customerId,
        userEmail: customerEmail,
        subscriptionPlan: planId,
        subscriptionStatus,
        datePaid: new Date(subscription.updated_at),
      },
      prismaUserDelegate
    );
    
    console.log(`✅ Successfully updated subscription ${planId} status to ${subscriptionStatus} for user ${customerEmail}`);
    
  } catch (error) {
    console.error('❌ Error processing subscription.updated event:', error);
    console.error('Subscription data:', JSON.stringify(subscription, null, 2));
  }
}

async function handleSubscriptionCancelled(
  subscription: UnibeeSubscriptionData,
  prismaUserDelegate: PrismaClient['user']
) {
  console.log('Processing subscription cancelled:', subscription);
  
  try {
    const customerId = subscription.customer_id;
    const customerEmail = subscription.customer_email;
    
    if (!customerId || !customerEmail) {
      console.warn('⚠️ Missing customer information in subscription cancellation:', subscription);
      return;
    }
    
    console.log(`❌ Cancelling subscription for customer: ${customerEmail} (ID: ${customerId})`);
    
    await createOrUpdateUserUnibeePaymentDetails(
      {
        userUnibeeId: customerId,
        userEmail: customerEmail,
        subscriptionStatus: SubscriptionStatus.Deleted,
        datePaid: new Date(subscription.updated_at),
      },
      prismaUserDelegate
    );
    
    console.log(`✅ Successfully cancelled subscription for user ${customerEmail}`);
    
    try {
      await emailSender.send({
        to: customerEmail,
        subject: 'We hate to see you go :(',
        text: 'We hate to see you go. Here is a sweet offer...',
        html: 'We hate to see you go. Here is a sweet offer...',
      });
      console.log(`📧 Sent cancellation email to ${customerEmail}`);
    } catch (error) {
      console.error('❌ Failed to send cancellation email:', error);
    }
    
  } catch (error) {
    console.error('❌ Error processing subscription.cancelled event:', error);
    console.error('Subscription data:', JSON.stringify(subscription, null, 2));
  }
}

async function handleInvoicePaid(
  invoice: any,
  prismaUserDelegate: PrismaClient['user']
) {
  console.log('Processing invoice.paid event:', invoice);
  
  try {
    let userEmail: string | null = null;
    let userId: string | null = null;
    
    if (invoice.customer?.email) {
      userEmail = invoice.customer.email;
    } else if (invoice.user?.email) {
      userEmail = invoice.user.email;
    } else if (invoice.email) {
      userEmail = invoice.email;
    }
    
    if (invoice.customer?.id) {
      userId = invoice.customer.id;
    } else if (invoice.user?.id) {
      userId = invoice.user.id;
    } else if (invoice.customer_id) {
      userId = invoice.customer_id;
    }
    
    if (!userEmail) {
      console.warn('⚠️ Could not extract user email from invoice:', invoice);
      return;
    }
    
    if (!userId) {
      console.warn('⚠️ Could not extract user ID from invoice:', invoice);
      return;
    }
    
    let planId: PaymentPlanId | null = null;
    
    if (invoice.subscription?.variant_id) {
      try {
        planId = getPlanIdByVariantId(invoice.subscription.variant_id);
      } catch (error) {
        console.warn('⚠️ Could not determine plan from variant_id:', invoice.subscription.variant_id);
      }
    } else if (invoice.variant_id) {
      try {
        planId = getPlanIdByVariantId(invoice.variant_id);
      } catch (error) {
        console.warn('⚠️ Could not determine plan from variant_id:', invoice.variant_id);
      }
    }
    
    let datePaid: Date;
    if (invoice.createTime) {
      datePaid = new Date(invoice.createTime * 1000);
    } else if (invoice.created_at) {
      datePaid = new Date(invoice.created_at);
    } else if (invoice.paid_at) {
      datePaid = new Date(invoice.paid_at);
    } else {
      datePaid = new Date();
    }
    
    await createOrUpdateUserUnibeePaymentDetails(
      {
        userUnibeeId: userId,
        userEmail: userEmail,
        subscriptionPlan: planId || undefined,
        subscriptionStatus: SubscriptionStatus.Active,
        datePaid: datePaid,
      },
      prismaUserDelegate
    );
    
    console.log(`✅ Invoice paid processed successfully for user ${userEmail}`);
    if (planId) {
      console.log(`📋 Subscription plan: ${planId}`);
    }
    
  } catch (error) {
    console.error('❌ Error processing invoice.paid event:', error);
    console.error('Invoice data:', JSON.stringify(invoice, null, 2));
  }
}

async function handleInvoiceCreated(
  invoice: any,
  prismaUserDelegate: PrismaClient['user']
) {
  console.log('Processing invoice.created event:', invoice);
  
  console.log('Invoice created for:', {
    id: invoice.id,
    amount: invoice.amount,
    currency: invoice.currency,
    customerEmail: invoice.customer?.email || invoice.user?.email,
    status: invoice.status
  });
}

async function handlePaymentSucceeded(
  payment: UnibeePaymentData,
  prismaUserDelegate: PrismaClient['user']
) {
  console.log('Processing payment.succeeded event:', payment);
  
  await createOrUpdateUserUnibeePaymentDetails(
    {
      userUnibeeId: payment.customer_id,
      userEmail: payment.customer_email,
      datePaid: new Date(payment.created_at),
    },
    prismaUserDelegate
  );
  
  console.log(`Payment succeeded for user ${payment.customer_email}`);
}

async function handlePaymentFailed(
  payment: UnibeePaymentData,
  prismaUserDelegate: PrismaClient['user']
) {
  console.log('Processing payment.failed event:', payment);
  
  console.log(`Payment failed for user ${payment.customer_email}, amount: ${payment.amount} ${payment.currency}`);
} 