const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const aiSupport = require('../services/ai-support');

const router = express.Router();

// Get chat sessions
router.get('/sessions', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT cs.*, u.first_name as agent_name, u.last_name as agent_last_name
       FROM chat_sessions cs
       LEFT JOIN users u ON cs.assigned_agent_id = u.id
       WHERE cs.organization_id = $1
       ORDER BY cs.started_at DESC
       LIMIT 50`,
      [req.user.organization_id]
    );

    res.json({ sessions: result.rows });
  } catch (error) {
    console.error('Get chat sessions error:', error);
    res.status(500).json({ error: 'Failed to get chat sessions' });
  }
});

// Get chat messages for session
router.get('/sessions/:sessionId/messages', authenticateToken, async (req, res) => {
  const { sessionId } = req.params;

  try {
    const result = await db.query(
      `SELECT cm.*, u.first_name, u.last_name
       FROM chat_messages cm
       LEFT JOIN users u ON cm.sender_id = u.id
       WHERE cm.session_id = $1
       ORDER BY cm.created_at ASC`,
      [sessionId]
    );

    res.json({ messages: result.rows });
  } catch (error) {
    console.error('Get chat messages error:', error);
    res.status(500).json({ error: 'Failed to get chat messages' });
  }
});

// Send chat message
router.post('/sessions/:sessionId/messages', authenticateToken, async (req, res) => {
  const { sessionId } = req.params;
  const { message, messageType = 'text' } = req.body;

  try {
    const messageId = uuidv4();
    
    await db.query(
      `INSERT INTO chat_messages (
        id, session_id, sender_type, sender_id, sender_name, message, message_type
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        messageId, sessionId, 'agent', req.user.id,
        `${req.user.first_name} ${req.user.last_name}`,
        message, messageType
      ]
    );

    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Send chat message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// AI Support endpoints

// Get AI response to customer message
router.post('/ai-response', authenticateToken, async (req, res) => {
  const { message, sessionId, customerInfo = {} } = req.body;

  try {
    console.log('🤖 AI Support request:', { message, sessionId });

    // Get conversation context
    let context = {
      customerPlan: customerInfo.plan || 'Unknown',
      previousMessages: []
    };

    if (sessionId) {
      const messagesResult = await db.query(
        `SELECT message, sender_type FROM chat_messages 
         WHERE session_id = $1 ORDER BY created_at DESC LIMIT 5`,
        [sessionId]
      );
      context.previousMessages = messagesResult.rows;
    }

    // Generate AI response
    const aiResponse = await aiSupport.generateResponse(message, context);
    
    // Check if should escalate to human
    const shouldEscalate = aiSupport.shouldEscalateToHuman(message, aiResponse.confidence);
    
    // Get quick reply suggestions
    const quickReplies = aiSupport.getQuickReplies(context);

    res.json({
      response: aiResponse.message,
      isAI: true,
      confidence: aiResponse.confidence,
      shouldEscalate,
      suggestedActions: aiResponse.suggestedActions,
      quickReplies,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI Support error:', error);
    res.status(500).json({ 
      error: 'AI support temporarily unavailable',
      fallback: 'Let me connect you with a human agent who can help you right away.'
    });
  }
});

// Create new customer chat session (for customer-facing widget)
router.post('/customer-session', async (req, res) => {
  const { visitorName, visitorEmail, initialMessage, organizationId } = req.body;

  try {
    const sessionId = uuidv4();
    
    // Create chat session
    await db.query(
      `INSERT INTO chat_sessions (
        id, organization_id, visitor_name, visitor_email, status, started_at
      ) VALUES ($1, $2, $3, $4, $5, NOW())`,
      [sessionId, organizationId, visitorName, visitorEmail, 'active']
    );

    // Add initial customer message if provided
    if (initialMessage) {
      const messageId = uuidv4();
      await db.query(
        `INSERT INTO chat_messages (
          id, session_id, sender_type, sender_name, message, message_type
        ) VALUES ($1, $2, $3, $4, $5, $6)`,
        [messageId, sessionId, 'customer', visitorName, initialMessage, 'text']
      );

      // Get AI response to initial message
      try {
        const aiResponse = await aiSupport.generateResponse(initialMessage, {
          customerPlan: 'Unknown',
          previousMessages: []
        });

        // Add AI response
        const aiMessageId = uuidv4();
        await db.query(
          `INSERT INTO chat_messages (
            id, session_id, sender_type, sender_name, message, message_type
          ) VALUES ($1, $2, $3, $4, $5, $6)`,
          [aiMessageId, sessionId, 'ai', 'SimpleDesk AI', aiResponse.message, 'text']
        );

      } catch (aiError) {
        console.error('AI response error:', aiError);
        // Continue without AI response if it fails
      }
    }

    res.status(201).json({
      sessionId,
      message: 'Chat session created successfully',
      aiEnabled: true
    });

  } catch (error) {
    console.error('Create customer session error:', error);
    res.status(500).json({ error: 'Failed to create chat session' });
  }
});

// Send customer message and get AI response
router.post('/customer-message', async (req, res) => {
  const { sessionId, message, senderName } = req.body;

  try {
    const messageId = uuidv4();
    
    // Add customer message
    await db.query(
      `INSERT INTO chat_messages (
        id, session_id, sender_type, sender_name, message, message_type
      ) VALUES ($1, $2, $3, $4, $5, $6)`,
      [messageId, sessionId, 'customer', senderName, message, 'text']
    );

    // Get conversation context
    const messagesResult = await db.query(
      `SELECT message, sender_type FROM chat_messages 
       WHERE session_id = $1 ORDER BY created_at DESC LIMIT 10`,
      [sessionId]
    );

    const context = {
      previousMessages: messagesResult.rows,
      customerPlan: 'Unknown'
    };

    // Generate AI response
    const aiResponse = await aiSupport.generateResponse(message, context);
    
    // Check if should escalate to human
    const shouldEscalate = aiSupport.shouldEscalateToHuman(message, aiResponse.confidence);

    if (shouldEscalate) {
      // Mark session for human takeover
      await db.query(
        'UPDATE chat_sessions SET needs_human = true WHERE id = $1',
        [sessionId]
      );
    }

    // Add AI response
    const aiMessageId = uuidv4();
    await db.query(
      `INSERT INTO chat_messages (
        id, session_id, sender_type, sender_name, message, message_type
      ) VALUES ($1, $2, $3, $4, $5, $6)`,
      [aiMessageId, sessionId, 'ai', 'SimpleDesk AI', aiResponse.message, 'text']
    );

    res.json({
      aiResponse: aiResponse.message,
      shouldEscalate,
      suggestedActions: aiResponse.suggestedActions,
      quickReplies: aiSupport.getQuickReplies(context),
      confidence: aiResponse.confidence
    });

  } catch (error) {
    console.error('Customer message error:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

// Transfer chat to human agent
router.post('/sessions/:sessionId/transfer-to-human', authenticateToken, async (req, res) => {
  const { sessionId } = req.params;
  const { transferReason } = req.body;

  try {
    // Mark session as needing human agent
    await db.query(
      `UPDATE chat_sessions SET 
        needs_human = true, 
        assigned_agent_id = $2,
        transfer_reason = $3,
        transferred_at = NOW()
       WHERE id = $1`,
      [sessionId, req.user.id, transferReason]
    );

    // Add system message about transfer
    const messageId = uuidv4();
    await db.query(
      `INSERT INTO chat_messages (
        id, session_id, sender_type, sender_name, message, message_type
      ) VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        messageId, sessionId, 'system', 'System',
        `Chat transferred to human agent: ${req.user.first_name} ${req.user.last_name}`,
        'system'
      ]
    );

    res.json({ message: 'Chat transferred to human agent successfully' });

  } catch (error) {
    console.error('Transfer to human error:', error);
    res.status(500).json({ error: 'Failed to transfer chat' });
  }
});

// Public AI test endpoint (no auth required)
router.post('/test-ai', async (req, res) => {
  const { message } = req.body;

  try {
    console.log('🧪 AI Test request:', { message });

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log('🤖 Calling AI service...');
    // Generate AI response without database interaction
    const aiResponse = await aiSupport.generateResponse(message, {
      customerPlan: 'Test',
      previousMessages: []
    });
    
    console.log('✅ AI Response received:', aiResponse);
    
    res.json({
      response: aiResponse.message,
      isAI: true,
      confidence: aiResponse.confidence,
      suggestedActions: aiResponse.suggestedActions,
      timestamp: new Date().toISOString(),
      testMode: true
    });

  } catch (error) {
    console.error('❌ AI Test error:', error);
    res.status(500).json({ 
      error: 'AI test failed',
      message: error.message,
      stack: error.stack
    });
  }
});

module.exports = router;