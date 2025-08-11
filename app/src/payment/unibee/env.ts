import { requireNodeEnvVar } from '../../server/utils';

export const UNIBEE_CONFIG = {
  publicKey: requireNodeEnvVar('UNIBEE_PUBLIC_KEY'),
  baseUrl: requireNodeEnvVar('UNIBEE_BASE_URL'),
  webhookSecret: requireNodeEnvVar('UNIBEE_WEBHOOK_SECRET'),
} as const; 