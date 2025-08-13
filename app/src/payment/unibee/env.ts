import { requireNodeEnvVar } from '../../server/utils';

export const UNIBEE_CONFIG = {
  publicKey: requireNodeEnvVar('UNIBEE_PUBLIC_KEY'),
  baseUrl: requireNodeEnvVar('UNIBEE_API_URL'),
} as const; 