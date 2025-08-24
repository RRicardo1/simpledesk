const axios = require('axios');

class AISupport {
  constructor() {
    // Use OpenAI API or fallback to rule-based responses
    this.openaiApiKey = process.env.OPENAI_API_KEY;
    this.useOpenAI = !!this.openaiApiKey;
    
    console.log('🤖 AI Support initialized:', this.useOpenAI ? 'OpenAI API' : 'Rule-based');
  }

  async generateResponse(userMessage, context = {}) {
    try {
      console.log('🤖 generateResponse called with:', { userMessage, useOpenAI: this.useOpenAI });
      if (this.useOpenAI) {
        console.log('🤖 Using OpenAI API');
        return await this.getOpenAIResponse(userMessage, context);
      } else {
        console.log('🤖 Using rule-based response');
        const result = this.getRuleBasedResponse(userMessage, context);
        console.log('🤖 Rule-based result:', result);
        return result;
      }
    } catch (error) {
      console.error('❌ AI Support error:', error);
      console.error('❌ Error stack:', error.stack);
      return this.getFallbackResponse();
    }
  }

  async getOpenAIResponse(userMessage, context) {
    const systemPrompt = `You are a helpful customer support agent for MySimpleDesk, the fastest help desk setup on the planet.

Company Information:
- MySimpleDesk gets you helping customers in 5 minutes instead of 5 weeks
- We offer three plans: Starter ($29/month), Growth ($59/month), Business ($99/month)
- Key features: 5-minute setup, AI + human agents, Live chat, Knowledge base, Email integration
- We provide 50% cost savings and 10x faster setup than traditional platforms
- Our motto: "Skip the complex setup nightmare"

Guidelines:
- Be helpful, professional, and friendly
- Keep responses concise but informative
- If asked about billing/account issues, suggest contacting human support
- For technical issues, try to provide helpful troubleshooting steps
- Always end with asking if there's anything else you can help with

Customer Context:
- Customer plan: ${context.customerPlan || 'Not specified'}
- Previous messages: ${context.previousMessages || 'None'}

Respond to the customer's message professionally and helpfully.`;

    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ],
      max_tokens: 300,
      temperature: 0.7
    }, {
      headers: {
        'Authorization': `Bearer ${this.openaiApiKey}`,
        'Content-Type': 'application/json'
      }
    });

    return {
      message: response.data.choices[0].message.content,
      isAI: true,
      confidence: 'high',
      suggestedActions: this.getSuggestedActions(userMessage)
    };
  }

  getRuleBasedResponse(userMessage, context) {
    const message = userMessage.toLowerCase();
    
    // Billing and pricing inquiries
    if (message.includes('price') || message.includes('cost') || message.includes('billing') || message.includes('plan')) {
      return {
        message: `Hi! I'd be happy to help with pricing information. 

MySimpleDesk offers three plans:
• **Starter** - $29/month (up to 3 agents, 1,000 tickets/month)
• **Growth** - $59/month (up to 10 agents, 5,000 tickets/month) 
• **Business** - $99/month (unlimited agents & tickets)

All plans include live chat, knowledge base, and email support. You save 50% and get 10x faster setup than traditional platforms!

For billing questions or plan changes, I can connect you with our billing team. Would you like me to do that?`,
        isAI: true,
        confidence: 'high',
        suggestedActions: ['connect_billing', 'view_pricing']
      };
    }

    // Getting started / setup
    if (message.includes('setup') || message.includes('getting started') || message.includes('how to start') || message.includes('get started') || message.includes('how do i')) {
      return {
        message: `Welcome to MySimpleDesk! I'm here to help you get started. 

Here's how to set up your help desk in 5 minutes (guaranteed!):

1. **Add your team** - Invite agents from Settings > Users
2. **Create departments** - Organize your support teams
3. **Set up email forwarding** - Route support emails to MySimpleDesk
4. **Customize your knowledge base** - Add helpful articles
5. **Test the chat widget** - Install on your website

Would you like detailed instructions for any of these steps? I can also connect you with a human agent for personalized setup assistance.`,
        isAI: true,
        confidence: 'high',
        suggestedActions: ['human_support', 'setup_guide']
      };
    }

    // Technical issues
    if (message.includes('bug') || message.includes('error') || message.includes('not working') || message.includes('problem')) {
      return {
        message: `I'm sorry you're experiencing technical issues! Let me help troubleshoot.

Common solutions:
• **Clear your browser cache** and refresh the page
• **Check your internet connection** 
• **Try a different browser** (Chrome, Firefox, Safari)
• **Disable browser extensions** temporarily

If the issue persists, I'll connect you with our technical team who can investigate further. 

Can you tell me more about what specific error you're seeing?`,
        isAI: true,
        confidence: 'medium',
        suggestedActions: ['human_support', 'technical_support']
      };
    }

    // Features and capabilities
    if (message.includes('feature') || message.includes('can you') || message.includes('does simpledesk')) {
      return {
        message: `MySimpleDesk includes all the features you need for excellent customer support:

**Core Features:**
• 📧 Email ticket management
• 💬 Live chat (like this one!)
• 📚 Knowledge base & FAQ
• 👥 Team collaboration tools
• 📊 Performance analytics
• 🔧 Customizable workflows

**Advanced Features:**
• 🤖 AI-powered responses (that's me!)
• 📱 Mobile app for agents
• 🔗 Third-party integrations
• 📈 Customer satisfaction surveys

What specific feature would you like to know more about?`,
        isAI: true,
        confidence: 'high',
        suggestedActions: ['feature_demo', 'human_support']
      };
    }

    // Default greeting/general inquiry
    if (message.includes('hello') || message.includes('hi') || message.includes('help') || message.length < 20) {
      return {
        message: `Hello! 👋 I'm MySimpleDesk's AI assistant, and I'm here to help you with any questions about our help desk software.

I can assist you with:
• **Pricing and plans** information
• **Getting started** guidance  
• **Feature** explanations
• **Basic troubleshooting**
• **Connecting you** with human support

What can I help you with today?`,
        isAI: true,
        confidence: 'high',
        suggestedActions: ['view_pricing', 'getting_started', 'human_support']
      };
    }

    // Fallback for unrecognized queries
    return {
      message: `Thank you for contacting MySimpleDesk! While I'd love to help with your specific question, I think one of our human support agents would be better equipped to assist you.

I can connect you with a live agent right now, or you can browse our knowledge base for detailed articles.

Would you like me to transfer you to a human agent?`,
      isAI: true,
      confidence: 'low',
      suggestedActions: ['human_support', 'knowledge_base']
    };
  }

  getSuggestedActions(message) {
    const actions = [];
    const msg = message.toLowerCase();
    
    if (msg.includes('price') || msg.includes('billing')) {
      actions.push('view_pricing', 'connect_billing');
    }
    if (msg.includes('setup') || msg.includes('start')) {
      actions.push('getting_started', 'setup_guide');
    }
    if (msg.includes('feature') || msg.includes('demo')) {
      actions.push('feature_demo', 'schedule_demo');
    }
    if (msg.includes('problem') || msg.includes('error')) {
      actions.push('technical_support', 'human_support');
    }
    
    // Always offer human support as an option
    if (!actions.includes('human_support')) {
      actions.push('human_support');
    }
    
    return actions;
  }

  getFallbackResponse() {
    return {
      message: `I apologize, but I'm experiencing some technical difficulties right now. 

Let me connect you with one of our human support agents who can assist you immediately. They'll be able to help with any questions about MySimpleDesk.

Please hold on while I transfer your chat...`,
      isAI: true,
      confidence: 'low',
      suggestedActions: ['human_support']
    };
  }

  shouldEscalateToHuman(userMessage, aiConfidence) {
    const escalationTriggers = [
      'speak to human', 'human agent', 'real person', 'not helpful',
      'escalate', 'manager', 'refund', 'cancel', 'angry', 'frustrated'
    ];
    
    const message = userMessage.toLowerCase();
    const hasEscalationTrigger = escalationTriggers.some(trigger => message.includes(trigger));
    const lowConfidence = aiConfidence === 'low';
    
    return hasEscalationTrigger || lowConfidence;
  }

  getQuickReplies(context) {
    return [
      { text: "📋 View Pricing Plans", action: "view_pricing" },
      { text: "🚀 Getting Started Guide", action: "getting_started" },
      { text: "👥 Talk to Human Agent", action: "human_support" },
      { text: "📚 Knowledge Base", action: "knowledge_base" },
      { text: "🔧 Technical Support", action: "technical_support" }
    ];
  }
}

module.exports = new AISupport();