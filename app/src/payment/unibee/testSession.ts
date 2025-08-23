import { createUnibeeUserSession } from './checkoutUtils';
import { UNIBEE_CONFIG } from './env';

// Test script for UniBee session creation
export async function testUnibeeSession() {
  console.log('🧪 Testing UniBee Session Creation');
  console.log('=====================================');
  
  try {
    // Test session creation
    const sessionData = await createUnibeeUserSession(
      'test@example.com',
      'Test User',
      {
        testMode: 'true',
        source: 'test_script'
      },
      'https://example.com/success',
      'https://example.com/cancel'
    );
    
    console.log('✅ Session created successfully!');
    console.log('Client Session:', sessionData.clientSession);
    console.log('Customer ID:', sessionData.customerId);
    
    // Test checkout URL generation
    const baseUrl = `${UNIBEE_CONFIG.baseUrl.replace('api-', 'cs-')}/hosted/checkout`;
    const checkoutUrl = `${baseUrl}?planId=620&env=daily&session=${sessionData.clientSession}`;
    
    console.log('\n🔗 Generated Checkout URL:');
    console.log(checkoutUrl);
    
    return sessionData;
    
  } catch (error) {
    console.error('❌ Session creation failed:', error);
    throw error;
  }
}

// Example usage:
// import { testUnibeeSession } from './testSession';
// testUnibeeSession().catch(console.error);
