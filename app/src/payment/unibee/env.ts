import { requireNodeEnvVar } from '../../server/utils';

export const UNIBEE_CONFIG = {
  API_KEY: requireNodeEnvVar('UNIBEE_API_KEY'),
  WEBHOOK_SECRET: requireNodeEnvVar('UNIBEE_WEBHOOK_SECRET'),
  BASE_URL: process.env.UNIBEE_BASE_URL || 'https://api.unibee.com',
  CUSTOMER_PORTAL_URL: process.env.UNIBEE_CUSTOMER_PORTAL_URL,
} as const; 