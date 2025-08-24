const aiSupport = require('./services/ai-support');

async function testAI() {
  console.log('🤖 Testing MySimpleDesk AI...\n');
  
  const testMessages = [
    "Hello, what is MySimpleDesk?",
    "What are your pricing plans?", 
    "How do I get started?",
    "I need technical support"
  ];

  for (const message of testMessages) {
    console.log(`👤 Customer: ${message}`);
    
    try {
      const response = await aiSupport.generateResponse(message, {
        customerPlan: 'Starter',
        previousMessages: []
      });
      
      console.log(`🤖 AI Response:`);
      console.log(response.message);
      console.log(`📊 Confidence: ${response.confidence}`);
      console.log(`🎯 Actions: ${response.suggestedActions ? response.suggestedActions.join(', ') : 'None'}`);
      console.log('\n' + '='.repeat(50) + '\n');
      
    } catch (error) {
      console.error('❌ Error:', error.message);
      console.log('\n' + '='.repeat(50) + '\n');
    }
  }
}

testAI();