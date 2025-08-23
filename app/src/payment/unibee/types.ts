// Unibee API Types
export interface UnibeeApiConfig {
  apiKey: string;
  baseURL: string;
}

export interface UnibeeCheckoutSession {
  id: string;
  url: string;
  status: string;
  customerId?: string;
  productId?: string;
  metadata?: Record<string, string>;
}

export interface UnibeeCustomer {
  id: string;
  email: string;
  name?: string;
  metadata?: Record<string, string>;
}

export interface UnibeeSubscription {
  id: string;
  status: string;
  planId: string;
  customerId: string;
  startDate: string;
  endDate?: string;
}

export interface UnibeeInvoice {
  id: string;
  status: string;
  amount: number;
  currency: string;
  subscriptionId?: string;
  customerId: string;
}

export interface UnibeeWebhookEvent {
  id: string;
  type: string;
  data: any;
  created: number;
}

// Updated to match the actual UniBee API structure
export interface UnibeeSessionRequest {
  email: string;
  externalUserId: string;
  successUrl?: string;
  cancelUrl?: string;
  metadata?: Record<string, string>;
}

export interface UnibeeSessionResponse {
  code: number;
  message: string;
  data: {
    userId: string;
    externalUserId: string;
    email: string;
    url: string;
    clientToken: string;
    clientSession: string;
  };
  redirect: string;
  requestId: string;
}

export interface UnibeeCheckoutParams {
  planId: string;
  customerEmail: string;
  customerName?: string;
  successUrl: string;
  cancelUrl: string;
  clientSession?: string;
  customerId?: string;
}

export interface UnibeeCustomerPortalParams {
  customerId: string;
  returnUrl: string;
}

export interface UnibeeApi {
  customer: {
    listCustomers: (params: { email: string }) => Promise<{ data: UnibeeCustomer[] }>;
    createCustomer: (params: { email: string; metadata?: Record<string, string> }) => Promise<UnibeeCustomer>;
  };
  checkout: {
    createCheckoutSession: (params: {
      customerId: string;
      productId: string;
      successUrl: string;
      cancelUrl: string;
      metadata?: Record<string, string>;
    }) => Promise<UnibeeCheckoutSession>;
  };
}

// Mock implementation for development
export class MockUnibeeApi implements UnibeeApi {
  constructor(private config: UnibeeApiConfig) {}

  customer = {
    listCustomers: async (params: { email: string }): Promise<{ data: UnibeeCustomer[] }> => {
      // Mock implementation - in real implementation, this would call Unibee API
      console.log('Mock: Searching for customer with email:', params.email);
      return { data: [] };
    },
    createCustomer: async (params: { email: string; metadata?: Record<string, string> }): Promise<UnibeeCustomer> => {
      // Mock implementation - in real implementation, this would call Unibee API
      console.log('Mock: Creating customer with email:', params.email);
      return {
        id: `cust_${Date.now()}`,
        email: params.email,
        metadata: params.metadata,
      };
    },
  };

  checkout = {
    createCheckoutSession: async (params: {
      customerId: string;
      productId: string;
      successUrl: string;
      cancelUrl: string;
      metadata?: Record<string, string>;
    }): Promise<UnibeeCheckoutSession> => {
      // Mock implementation - in real implementation, this would call Unibee API
      console.log('Mock: Creating checkout session for customer:', params.customerId);
      return {
        id: `cs_${Date.now()}`,
        url: `${this.config.baseURL}/checkout/mock-session-${Date.now()}`,
        customerId: params.customerId,
        productId: params.productId,
        status: 'pending',
        metadata: params.metadata,
      };
    },
  };
} 