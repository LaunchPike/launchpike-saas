import type { SubscriptionStatus } from '../plans';
import { PaymentPlanId } from '../plans';
import { PrismaClient } from '@prisma/client';

export const updateUserUnibeePaymentDetails = async (
  { userUnibeeId, subscriptionPlan, subscriptionStatus, datePaid, numOfCreditsPurchased }: {
    userUnibeeId: string;
    subscriptionPlan?: PaymentPlanId;
    subscriptionStatus?: SubscriptionStatus;
    numOfCreditsPurchased?: number;
    datePaid?: Date;
  },
  userDelegate: PrismaClient['user']
) => {
  return userDelegate.update({
    where: {
      paymentProcessorUserId: userUnibeeId
    },
    data: {
      paymentProcessorUserId: userUnibeeId,
      subscriptionPlan,
      subscriptionStatus,
      datePaid,
      credits: numOfCreditsPurchased !== undefined ? { increment: numOfCreditsPurchased } : undefined,
    },
  });
};

export const createOrUpdateUserUnibeePaymentDetails = async (
  { userUnibeeId, userEmail, subscriptionPlan, subscriptionStatus, datePaid, numOfCreditsPurchased }: {
    userUnibeeId: string;
    userEmail: string;
    subscriptionPlan?: PaymentPlanId;
    subscriptionStatus?: SubscriptionStatus;
    numOfCreditsPurchased?: number;
    datePaid?: Date;
  },
  userDelegate: PrismaClient['user']
) => {
  let user = await userDelegate.findFirst({
    where: { paymentProcessorUserId: userUnibeeId }
  });

  if (!user) {
    user = await userDelegate.findFirst({
      where: { email: userEmail }
    });
  }

  if (!user) {
    throw new Error(`User not found with Unibee ID: ${userUnibeeId} or email: ${userEmail}`);
  }

  return userDelegate.update({
    where: { id: user.id },
    data: {
      paymentProcessorUserId: userUnibeeId,
      subscriptionPlan,
      subscriptionStatus,
      datePaid,
      credits: numOfCreditsPurchased !== undefined ? { increment: numOfCreditsPurchased } : undefined,
    },
  });
}; 