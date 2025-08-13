import { requireNodeEnvVar } from '../../server/utils';

export const UNIBEE_CONFIG = {
  publicKey: requireNodeEnvVar('UNIBEE_PUBLIC_KEY'),
  baseUrl: requireNodeEnvVar('UNIBEE_API_URL'),
  sessionEndpoint: process.env.UNIBEE_SESSION_ENDPOINT || '/v1/session',
  isTestMode: process.env.UNIBEE_TEST_MODE === 'true',
} as const;