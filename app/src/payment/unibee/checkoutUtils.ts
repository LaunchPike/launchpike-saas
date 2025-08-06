import { UNIBEE_CONFIG } from './env';
import { MockUnibeeApi, type UnibeeApi } from './types';

// Initialize Unibee API client
// Note: Using MockUnibeeApi for development. Replace with actual UnibeeApi when available
const unibeeApi: UnibeeApi = new MockUnibeeApi({
  apiKey: UNIBEE_CONFIG.API_KEY,
  baseURL: UNIBEE_CONFIG.BASE_URL,
});

interface UnibeeCheckoutSessionParams {
  productId: string;
  userEmail: string;
  userId: string;
}

export async function createUnibeeCheckoutSession({ 
  productId, 
  userEmail, 
  userId 
}: UnibeeCheckoutSessionParams) {
  try {
    // Create or get customer
    const customer = await fetchOrCreateUnibeeCustomer(userEmail, userId);
    
    // Create checkout session
    const checkoutSession = await unibeeApi.checkout.createCheckoutSession({
      customerId: customer.id,
      productId: productId,
      successUrl: `${process.env.WASP_WEB_CLIENT_URL || 'http://localhost:3000'}/checkout?success=true`,
      cancelUrl: `${process.env.WASP_WEB_CLIENT_URL || 'http://localhost:3000'}/checkout?canceled=true`,
      metadata: {
        userId: userId,
      },
    });

    if (!checkoutSession.url) {
      throw new Error('Failed to create Unibee checkout session');
    }

    return {
      url: checkoutSession.url,
      id: checkoutSession.id,
    };
  } catch (error) {
    console.error('Error creating Unibee checkout session:', error);
    throw error;
  }
}

async function fetchOrCreateUnibeeCustomer(email: string, userId: string) {
  try {
    // Try to find existing customer by email
    const existingCustomers = await unibeeApi.customer.listCustomers({
      email: email,
    });

    if (existingCustomers.data && existingCustomers.data.length > 0) {
      console.log('Using existing Unibee customer');
      return existingCustomers.data[0];
    }

    // Create new customer
    console.log('Creating new Unibee customer');
    const newCustomer = await unibeeApi.customer.createCustomer({
      email: email,
      metadata: {
        userId: userId,
      },
    });

    return newCustomer;
  } catch (error) {
    console.error('Error fetching/creating Unibee customer:', error);
    throw error;
  }
} 