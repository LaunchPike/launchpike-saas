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
  try {
    console.log('=== UNIBEE WEBHOOK RECEIVED ===');
    console.log('Headers:', request.headers);
    console.log('Body:', JSON.stringify(request.body, null, 2));
    
    // Верифицируем webhook (в реальном приложении здесь должна быть проверка подписи)
    const webhookSecret = requireNodeEnvVar('UNIBEE_WEBHOOK_SECRET');
    console.log('Webhook secret configured:', !!webhookSecret);
    
    // Парсим webhook payload
    const { eventName, data } = parseUnibeeWebhookPayload(request.body);
    const prismaUserDelegate = context.entities.User;
    
    console.log(`Processing Unibee webhook: ${eventName}`, data);
    
    // Нормализуем название события
    const normalizedEventName = eventName.replace(/[._]/g, '').toLowerCase();
    console.log('Normalized event name:', normalizedEventName);
    
    // Обрабатываем различные типы событий
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
      case 'subscriptionpaymentsucceeded':
        console.log('Handling subscription.payment_succeeded event');
        await handleSubscriptionPaymentSucceeded(data as UnibeeSubscriptionData, prismaUserDelegate);
        break;
      case 'subscriptionpaymentfailed':
        console.log('Handling subscription.payment_failed event');
        await handleSubscriptionPaymentFailed(data as UnibeeSubscriptionData, prismaUserDelegate);
        break;
      default:
        console.log(`Unhandled Unibee webhook event: ${eventName}`);
        console.log('Normalized event name:', normalizedEventName);
        console.log('Available event types:', Object.keys(request.body));
        // Не выбрасываем ошибку для необработанных событий
    }
    
    console.log('=== UNIBEE WEBHOOK PROCESSED SUCCESSFULLY ===');
    return response.json({ received: true });
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

// Middleware для Unibee webhook
export const unibeeMiddlewareConfigFn: MiddlewareConfigFn = (middlewareConfig) => {
  // Для Unibee используем стандартный JSON middleware
  return middlewareConfig;
};

// Обработчик создания заказа (для разовых платежей)
async function handleOrderCreated(
  order: UnibeeOrderData,
  prismaUserDelegate: PrismaClient['user']
) {
  console.log('Processing order created:', order.id);
  
  // Обрабатываем каждый элемент заказа
  for (const item of order.items) {
    const planId = getPlanIdByVariantId(item.variant_id);
    const plan = paymentPlans[planId];
    const { numOfCreditsPurchased } = getPlanEffectPaymentDetails({ planId, planEffect: plan.effect });
    
    if (numOfCreditsPurchased) {
      // Это покупка кредитов
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

// Обработчик создания подписки
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

// Обработчик обновления подписки
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

// Обработчик отмены подписки
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
  
  // Отправляем email с предложением вернуться
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

// Обработчик успешного платежа по подписке
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

// Обработчик неудачного платежа по подписке
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