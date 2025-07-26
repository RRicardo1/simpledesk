const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

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

module.exports = router;