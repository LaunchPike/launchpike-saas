// Unibee API Types
export interface UnibeeApiConfig {
  apiKey: string;
  baseURL: string;
}

export interface UnibeeCustomer {
  id: string;
  email: string;
  metadata?: Record<string, string>;
}

export interface UnibeeCheckoutSession {
  id: string;
  url: string;
  customerId: string;
  productId: string;
  status: string;
  metadata?: Record<string, string>;
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