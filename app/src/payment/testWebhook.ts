import type { PaymentsWebhook } from 'wasp/server/api';

export const testWebhook: PaymentsWebhook = async (request, response, context) => {
  console.log('🧪 TEST WEBHOOK CALLED! 🧪');
  console.log('=== TEST WEBHOOK RECEIVED ===');
  console.log('Method:', request.method);
  console.log('URL:', request.url);
  console.log('Headers:', JSON.stringify(request.headers, null, 2));
  console.log('Body:', JSON.stringify(request.body, null, 2));
  console.log('Context entities:', Object.keys(context.entities));
  
  if (context.entities.User) {
    console.log('✅ User entity is available');
  } else {
    console.log('❌ User entity is NOT available');
  }
  
  return response.json({ 
    success: true, 
    message: 'Test webhook received successfully',
    timestamp: new Date().toISOString(),
    method: request.method,
    url: request.url
  });
};
