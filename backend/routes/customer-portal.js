const express = require('express');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const automationEngine = require('../services/automation');

const router = express.Router();

// Middleware for customer authentication
const authenticateCustomer = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verify customer exists
    const customerResult = await db.query(
      'SELECT * FROM customers WHERE id = $1',
      [decoded.id]
    );

    if (customerResult.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.customer = customerResult.rows[0];
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Customer registration/login
router.post('/register', async (req, res) => {
  const { email, password, firstName, lastName, organizationDomain } = req.body;

  try {
    // Find organization by domain
    const orgResult = await db.query(
      'SELECT id FROM organizations WHERE domain = $1 OR name = $1',
      [organizationDomain]
    );

    if (orgResult.rows.length === 0) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    const organizationId = orgResult.rows[0].id;

    // Check if customer already exists
    const existingCustomer = await db.query(
      'SELECT id FROM customers WHERE email = $1 AND organization_id = $2',
      [email, organizationId]
    );

    if (existingCustomer.rows.length > 0) {
      return res.status(400).json({ error: 'Customer already exists' });
    }

    const customerId = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create customer
    await db.query(
      `INSERT INTO customers (id, organization_id, email, password_hash, first_name, last_name)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [customerId, organizationId, email, hashedPassword, firstName, lastName]
    );

    // Generate token
    const token = jwt.sign(
      { id: customerId, email, type: 'customer' },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      message: 'Customer registered successfully',
      token,
      customer: {
        id: customerId,
        email,
        firstName,
        lastName,
        organizationId
      }
    });

  } catch (error) {
    console.error('Customer registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password, organizationDomain } = req.body;

  try {
    // Find organization
    const orgResult = await db.query(
      'SELECT id FROM organizations WHERE domain = $1 OR name = $1',
      [organizationDomain]
    );

    if (orgResult.rows.length === 0) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    const organizationId = orgResult.rows[0].id;

    // Find customer
    const customerResult = await db.query(
      'SELECT * FROM customers WHERE email = $1 AND organization_id = $2',
      [email, organizationId]
    );

    if (customerResult.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const customer = customerResult.rows[0];

    // Check password
    const validPassword = await bcrypt.compare(password, customer.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { id: customer.id, email: customer.email, type: 'customer' },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      message: 'Login successful',
      token,
      customer: {
        id: customer.id,
        email: customer.email,
        firstName: customer.first_name,
        lastName: customer.last_name,
        organizationId: customer.organization_id
      }
    });

  } catch (error) {
    console.error('Customer login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get customer's tickets
router.get('/tickets', authenticateCustomer, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT t.*, 
              (SELECT COUNT(*) FROM ticket_comments tc WHERE tc.ticket_id = t.id AND tc.is_public = true) as comment_count,
              (SELECT created_at FROM ticket_comments tc WHERE tc.ticket_id = t.id ORDER BY tc.created_at DESC LIMIT 1) as last_update
       FROM tickets t
       WHERE t.organization_id = $1 AND (t.requester_email = $2 OR t.requester_id IN (
         SELECT id FROM users WHERE email = $2 AND organization_id = $1
       ))
       ORDER BY t.updated_at DESC`,
      [req.customer.organization_id, req.customer.email]
    );

    res.json({
      tickets: result.rows.map(ticket => ({
        ...ticket,
        custom_fields: typeof ticket.custom_fields === 'string' 
          ? JSON.parse(ticket.custom_fields) 
          : ticket.custom_fields
      }))
    });

  } catch (error) {
    console.error('Get customer tickets error:', error);
    res.status(500).json({ error: 'Failed to get tickets' });
  }
});

// Get specific ticket with comments
router.get('/tickets/:ticketId', authenticateCustomer, async (req, res) => {
  const { ticketId } = req.params;

  try {
    // Get ticket
    const ticketResult = await db.query(
      `SELECT t.*, u.first_name as assignee_first_name, u.last_name as assignee_last_name
       FROM tickets t
       LEFT JOIN users u ON t.assignee_id = u.id
       WHERE t.id = $1 AND t.organization_id = $2 AND (t.requester_email = $3 OR t.requester_id IN (
         SELECT id FROM users WHERE email = $3 AND organization_id = $2
       ))`,
      [ticketId, req.customer.organization_id, req.customer.email]
    );

    if (ticketResult.rows.length === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Get public comments
    const commentsResult = await db.query(
      `SELECT tc.*, u.first_name, u.last_name
       FROM ticket_comments tc
       LEFT JOIN users u ON tc.user_id = u.id
       WHERE tc.ticket_id = $1 AND tc.is_public = true
       ORDER BY tc.created_at ASC`,
      [ticketId]
    );

    const ticket = ticketResult.rows[0];
    ticket.custom_fields = typeof ticket.custom_fields === 'string' 
      ? JSON.parse(ticket.custom_fields) 
      : ticket.custom_fields;

    res.json({
      ticket,
      comments: commentsResult.rows.map(comment => ({
        ...comment,
        attachments: typeof comment.attachments === 'string' 
          ? JSON.parse(comment.attachments) 
          : comment.attachments
      }))
    });

  } catch (error) {
    console.error('Get customer ticket error:', error);
    res.status(500).json({ error: 'Failed to get ticket' });
  }
});

// Create new ticket
router.post('/tickets', authenticateCustomer, async (req, res) => {
  const { subject, description, priority = 'normal', attachments = [] } = req.body;

  try {
    if (!subject) {
      return res.status(400).json({ error: 'Subject is required' });
    }

    const ticketId = uuidv4();

    // Create ticket
    const result = await db.query(
      `INSERT INTO tickets (
        id, organization_id, subject, description, priority,
        requester_email, requester_name, source
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [
        ticketId, req.customer.organization_id, subject, description, priority,
        req.customer.email, `${req.customer.first_name} ${req.customer.last_name}`,
        'customer_portal'
      ]
    );

    // Add initial comment with description
    if (description) {
      await db.query(
        `INSERT INTO ticket_comments (
          id, ticket_id, author_email, author_name, body, is_public, attachments
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          uuidv4(), ticketId, req.customer.email,
          `${req.customer.first_name} ${req.customer.last_name}`,
          description, true, JSON.stringify(attachments)
        ]
      );
    }

    // Trigger automation
    const createdTicket = result.rows[0];
    try {
      await automationEngine.onTicketCreated(createdTicket);
    } catch (automationError) {
      console.error('Automation trigger failed:', automationError);
    }

    res.status(201).json({
      message: 'Ticket created successfully',
      ticket: createdTicket
    });

  } catch (error) {
    console.error('Create customer ticket error:', error);
    res.status(500).json({ error: 'Failed to create ticket' });
  }
});

// Add comment to ticket
router.post('/tickets/:ticketId/comments', authenticateCustomer, async (req, res) => {
  const { ticketId } = req.params;
  const { body, attachments = [] } = req.body;

  try {
    if (!body || body.trim().length === 0) {
      return res.status(400).json({ error: 'Comment body is required' });
    }

    // Verify ticket ownership
    const ticketResult = await db.query(
      `SELECT id FROM tickets 
       WHERE id = $1 AND organization_id = $2 AND (requester_email = $3 OR requester_id IN (
         SELECT id FROM users WHERE email = $3 AND organization_id = $2
       ))`,
      [ticketId, req.customer.organization_id, req.customer.email]
    );

    if (ticketResult.rows.length === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Create comment
    const commentId = uuidv4();
    const result = await db.query(
      `INSERT INTO ticket_comments (
        id, ticket_id, author_email, author_name, body, is_public, attachments
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        commentId, ticketId, req.customer.email,
        `${req.customer.first_name} ${req.customer.last_name}`,
        body, true, JSON.stringify(attachments)
      ]
    );

    // Update ticket timestamp
    await db.query(
      'UPDATE tickets SET updated_at = NOW() WHERE id = $1',
      [ticketId]
    );

    res.status(201).json({
      message: 'Comment added successfully',
      comment: result.rows[0]
    });

  } catch (error) {
    console.error('Add customer comment error:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

// Get knowledge base articles
router.get('/knowledge-base', async (req, res) => {
  const { organizationDomain, search, category } = req.query;

  try {
    // Find organization
    let organizationId = null;
    if (organizationDomain) {
      const orgResult = await db.query(
        'SELECT id FROM organizations WHERE domain = $1 OR name = $1',
        [organizationDomain]
      );
      if (orgResult.rows.length > 0) {
        organizationId = orgResult.rows[0].id;
      }
    }

    let query = `
      SELECT id, title, slug, body, category, tags, view_count, 
             helpful_count, unhelpful_count, published_at
      FROM kb_articles 
      WHERE status = 'published'
    `;
    
    const queryParams = [];
    let paramCount = 0;

    if (organizationId) {
      paramCount++;
      query += ` AND organization_id = $${paramCount}`;
      queryParams.push(organizationId);
    }

    if (search) {
      paramCount++;
      query += ` AND (title ILIKE $${paramCount} OR body ILIKE $${paramCount})`;
      queryParams.push(`%${search}%`);
    }

    if (category) {
      paramCount++;
      query += ` AND category = $${paramCount}`;
      queryParams.push(category);
    }

    query += ' ORDER BY view_count DESC, published_at DESC';

    const result = await db.query(query, queryParams);

    res.json({
      articles: result.rows.map(article => ({
        ...article,
        body: article.body?.substring(0, 200) + '...' // Truncate for list view
      }))
    });

  } catch (error) {
    console.error('Get knowledge base error:', error);
    res.status(500).json({ error: 'Failed to get articles' });
  }
});

// Get specific knowledge base article
router.get('/knowledge-base/:articleId', async (req, res) => {
  const { articleId } = req.params;

  try {
    const result = await db.query(
      `SELECT * FROM kb_articles 
       WHERE (id = $1 OR slug = $1) AND status = 'published'`,
      [articleId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }

    const article = result.rows[0];

    // Increment view count
    await db.query(
      'UPDATE kb_articles SET view_count = view_count + 1 WHERE id = $1',
      [article.id]
    );

    res.json({ article });

  } catch (error) {
    console.error('Get knowledge base article error:', error);
    res.status(500).json({ error: 'Failed to get article' });
  }
});

// Rate knowledge base article
router.post('/knowledge-base/:articleId/rate', async (req, res) => {
  const { articleId } = req.params;
  const { helpful } = req.body;

  try {
    const field = helpful ? 'helpful_count' : 'unhelpful_count';
    
    await db.query(
      `UPDATE kb_articles SET ${field} = ${field} + 1 WHERE id = $1`,
      [articleId]
    );

    res.json({ message: 'Rating recorded successfully' });

  } catch (error) {
    console.error('Rate article error:', error);
    res.status(500).json({ error: 'Failed to record rating' });
  }
});

// Start chat session
router.post('/chat', async (req, res) => {
  const { organizationDomain, visitorName, visitorEmail, initialMessage } = req.body;

  try {
    // Find organization
    const orgResult = await db.query(
      'SELECT id FROM organizations WHERE domain = $1 OR name = $1',
      [organizationDomain]
    );

    if (orgResult.rows.length === 0) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    const sessionId = uuidv4();
    
    // Create chat session
    await db.query(
      `INSERT INTO chat_sessions (
        id, organization_id, visitor_name, visitor_email, status, started_at
      ) VALUES ($1, $2, $3, $4, $5, NOW())`,
      [sessionId, orgResult.rows[0].id, visitorName, visitorEmail, 'active']
    );

    // Add initial message if provided
    if (initialMessage) {
      const messageId = uuidv4();
      await db.query(
        `INSERT INTO chat_messages (
          id, session_id, sender_type, sender_name, message, message_type
        ) VALUES ($1, $2, $3, $4, $5, $6)`,
        [messageId, sessionId, 'customer', visitorName, initialMessage, 'text']
      );
    }

    res.status(201).json({
      sessionId,
      message: 'Chat session created successfully'
    });

  } catch (error) {
    console.error('Create chat session error:', error);
    res.status(500).json({ error: 'Failed to create chat session' });
  }
});

module.exports = router;