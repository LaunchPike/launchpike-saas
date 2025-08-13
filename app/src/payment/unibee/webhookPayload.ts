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
  | 'subscription.payment_refunded' | 'subscription_payment_refunded' | 'subscriptionPaymentRefunded'
  | 'invoice.paid' | 'invoice_paid' | 'invoicePaid'
  | 'invoice.payment_failed' | 'invoice_payment_failed' | 'invoicePaymentFailed'
  | 'invoice.created' | 'invoice_created' | 'invoiceCreated'
  | 'payment.succeeded' | 'payment_succeeded' | 'paymentSucceeded'
  | 'payment.failed' | 'payment_failed' | 'paymentFailed';

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
    console.log('🔍 Parsing webhook payload:', JSON.stringify(rawEvent, null, 2));
    
    // Проверяем различные возможные структуры webhook'а
    let event: UnibeeWebhookEvent;
    
    if (rawEvent.type && rawEvent.data) {
      // Стандартная структура
      event = rawEvent as UnibeeWebhookEvent;
    } else if (rawEvent.eventType && (rawEvent.subscription || rawEvent.user || rawEvent.latestInvoice)) {
      // Структура Unibee: eventType + subscription/user/invoice данные
      event = {
        id: rawEvent.eventId || `event_${Date.now()}`,
        type: rawEvent.eventType as UnibeeWebhookEventType,
        data: {
          // Создаем структуру данных на основе доступной информации
          id: rawEvent.subscription?.id || rawEvent.user?.id || rawEvent.latestInvoice?.id || `data_${Date.now()}`,
          customer_id: rawEvent.subscription?.userId?.toString() || rawEvent.user?.id?.toString() || '',
          customer_email: rawEvent.user?.email || '',
          status: rawEvent.subscription?.status?.toString() || 'active',
          variant_id: rawEvent.subscription?.planId?.toString() || rawEvent.plan?.id?.toString() || '',
          variant_name: rawEvent.plan?.planName || rawEvent.subscription?.subscriptionName || '',
          price: rawEvent.subscription?.amount || rawEvent.plan?.amount || 0,
          currency: rawEvent.subscription?.currency || rawEvent.plan?.currency || 'USD',
          created_at: rawEvent.subscription?.createTime ? new Date(rawEvent.subscription.createTime * 1000).toISOString() : new Date().toISOString(),
          updated_at: rawEvent.subscription?.lastUpdateTime ? new Date(rawEvent.subscription.lastUpdateTime * 1000).toISOString() : new Date().toISOString(),
          // Для order событий
          total: rawEvent.latestInvoice?.totalAmount || rawEvent.subscription?.amount || 0,
          items: rawEvent.latestInvoice?.lines ? rawEvent.latestInvoice.lines.map((line: any) => ({
            id: line.id?.toString() || `item_${Date.now()}`,
            variant_id: rawEvent.subscription?.planId?.toString() || rawEvent.plan?.id?.toString() || '',
            variant_name: line.name || rawEvent.plan?.planName || '',
            price: line.amount || 0,
            quantity: line.quantity || 1
          })) : []
        },
        created_at: rawEvent.datetime || new Date().toISOString()
      };
    } else if (rawEvent.event_type && rawEvent.data) {
      // Альтернативная структура
      event = {
        id: rawEvent.id || `event_${Date.now()}`,
        type: rawEvent.event_type as UnibeeWebhookEventType,
        data: rawEvent.data,
        created_at: rawEvent.created_at || new Date().toISOString()
      };
    } else if (rawEvent.event && rawEvent.data) {
      // Еще одна возможная структура
      event = {
        id: rawEvent.id || `event_${Date.now()}`,
        type: rawEvent.event as UnibeeWebhookEventType,
        data: rawEvent.data,
        created_at: rawEvent.created_at || new Date().toISOString()
      };
    } else {
      // Если структура не распознана, логируем и пытаемся извлечь данные
      console.log('⚠️ Unknown webhook structure, attempting to extract data...');
      console.log('Raw event keys:', Object.keys(rawEvent));
      
      // Пытаемся найти event type в различных местах
      const possibleEventTypes = ['type', 'eventType', 'event_type', 'event', 'name', 'eventName'];
      let foundEventType: string | null = null;
      
      for (const key of possibleEventTypes) {
        if (rawEvent[key]) {
          foundEventType = rawEvent[key];
          break;
        }
      }
      
      if (!foundEventType) {
        throw new Error('Could not find event type in webhook payload');
      }
      
      event = {
        id: rawEvent.id || rawEvent.eventId || `event_${Date.now()}`,
        type: foundEventType as UnibeeWebhookEventType,
        data: rawEvent.data || rawEvent,
        created_at: rawEvent.created_at || rawEvent.datetime || new Date().toISOString()
      };
    }
    
    if (!event.type || !event.data) {
      throw new Error('Invalid webhook event structure after parsing');
    }

    console.log('✅ Successfully parsed webhook event:', {
      id: event.id,
      type: event.type,
      dataKeys: Object.keys(event.data),
      createdAt: event.created_at
    });

    return {
      eventName: event.type,
      data: event.data,
    };
  } catch (error) {
    console.error('❌ Failed to parse Unibee webhook payload:', error);
    console.error('Raw payload:', JSON.stringify(rawEvent, null, 2));
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