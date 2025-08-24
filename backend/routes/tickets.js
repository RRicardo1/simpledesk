const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');
const { authenticateToken, requireRole } = require('../middleware/auth');
const automationEngine = require('../services/automation');

const router = express.Router();

// Get all tickets for organization
router.get('/', authenticateToken, async (req, res) => {
  const { 
    status, 
    priority, 
    assignee_id, 
    page = 1, 
    limit = 25, 
    sort = 'updated_at', 
    order = 'DESC',
    search 
  } = req.query;

  try {
    let whereConditions = ['t.organization_id = $1'];
    let queryParams = [req.user.organization_id];
    let paramCount = 1;

    // Add filters
    if (status) {
      paramCount++;
      whereConditions.push(`t.status = $${paramCount}`);
      queryParams.push(status);
    }

    if (priority) {
      paramCount++;
      whereConditions.push(`t.priority = $${paramCount}`);
      queryParams.push(priority);
    }

    if (assignee_id) {
      paramCount++;
      if (assignee_id === 'unassigned') {
        whereConditions.push('t.assignee_id IS NULL');
      } else {
        whereConditions.push(`t.assignee_id = $${paramCount}`);
        queryParams.push(assignee_id);
      }
    }

    if (search) {
      paramCount++;
      whereConditions.push(`(t.subject ILIKE $${paramCount} OR t.description ILIKE $${paramCount})`);
      queryParams.push(`%${search}%`);
    }

    const whereClause = whereConditions.join(' AND ');
    const offset = (page - 1) * limit;

    // Get tickets with related data
    const query = `
      SELECT 
        t.*,
        u_req.first_name as requester_first_name,
        u_req.last_name as requester_last_name,
        u_req.email as requester_email_verified,
        u_ass.first_name as assignee_first_name,
        u_ass.last_name as assignee_last_name,
        u_ass.email as assignee_email,
        (SELECT COUNT(*) FROM ticket_comments tc WHERE tc.ticket_id = t.id) as comment_count,
        (SELECT MAX(tc.created_at) FROM ticket_comments tc WHERE tc.ticket_id = t.id) as last_activity_at
      FROM tickets t
      LEFT JOIN users u_req ON t.requester_id = u_req.id
      LEFT JOIN users u_ass ON t.assignee_id = u_ass.id
      WHERE ${whereClause}
      ORDER BY t.${sort} ${order}
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `;

    queryParams.push(limit, offset);

    const result = await db.query(query, queryParams);

    // Get total count for pagination
    const countQuery = `SELECT COUNT(*) FROM tickets t WHERE ${whereClause}`;
    const countResult = await db.query(countQuery, queryParams.slice(0, paramCount));
    const totalCount = parseInt(countResult.rows[0].count);

    res.json({
      tickets: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    });

  } catch (error) {
    console.error('Get tickets error:', error);
    res.status(500).json({ error: 'Failed to get tickets' });
  }
});

// Get ticket by ID
router.get('/:ticketId', authenticateToken, async (req, res) => {
  const { ticketId } = req.params;

  try {
    // Get ticket with related data
    const ticketResult = await db.query(
      `SELECT 
        t.*,
        u_req.first_name as requester_first_name,
        u_req.last_name as requester_last_name,
        u_req.email as requester_email_verified,
        u_ass.first_name as assignee_first_name,
        u_ass.last_name as assignee_last_name,
        u_ass.email as assignee_email
      FROM tickets t
      LEFT JOIN users u_req ON t.requester_id = u_req.id
      LEFT JOIN users u_ass ON t.assignee_id = u_ass.id
      WHERE t.id = $1 AND t.organization_id = $2`,
      [ticketId, req.user.organization_id]
    );

    if (ticketResult.rows.length === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Get ticket comments
    const commentsResult = await db.query(
      `SELECT 
        tc.*,
        u.first_name,
        u.last_name,
        u.role,
        u.avatar_url
      FROM ticket_comments tc
      LEFT JOIN users u ON tc.user_id = u.id
      WHERE tc.ticket_id = $1
      ORDER BY tc.created_at ASC`,
      [ticketId]
    );

    const ticket = ticketResult.rows[0];
    ticket.comments = commentsResult.rows;

    res.json({ ticket });

  } catch (error) {
    console.error('Get ticket error:', error);
    res.status(500).json({ error: 'Failed to get ticket' });
  }
});

// Create new ticket
router.post('/', authenticateToken, async (req, res) => {
  const { 
    subject, 
    description, 
    priority = 'normal', 
    requester_email, 
    requester_name,
    assignee_id,
    tags = [],
    custom_fields = {},
    source = 'web'
  } = req.body;

  try {
    if (!subject) {
      return res.status(400).json({ error: 'Subject is required' });
    }

    let requester_id = null;

    // If requester_email is provided, try to find existing user
    if (requester_email) {
      const userResult = await db.query(
        'SELECT id FROM users WHERE email = $1 AND organization_id = $2',
        [requester_email, req.user.organization_id]
      );
      
      if (userResult.rows.length > 0) {
        requester_id = userResult.rows[0].id;
      }
    }

    const ticketId = uuidv4();

    // Create ticket
    const result = await db.query(
      `INSERT INTO tickets (
        id, organization_id, subject, description, priority, 
        requester_id, requester_email, requester_name, 
        assignee_id, tags, custom_fields, source
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *`,
      [
        ticketId, req.user.organization_id, subject, description, priority,
        requester_id, requester_email, requester_name,
        assignee_id, tags, JSON.stringify(custom_fields), source
      ]
    );

    // Add initial comment if description provided
    if (description) {
      await db.query(
        `INSERT INTO ticket_comments (
          ticket_id, user_id, author_email, author_name, body, is_public
        ) VALUES ($1, $2, $3, $4, $5, $6)`,
        [ticketId, requester_id, requester_email, requester_name, description, true]
      );
    }

    // Log activity
    await db.query(
      `INSERT INTO activity_logs (organization_id, ticket_id, user_id, action, details)
       VALUES ($1, $2, $3, $4, $5)`,
      [req.user.organization_id, ticketId, req.user.id, 'ticket_created',
       JSON.stringify({ subject, priority, source })]
    );

    // Trigger automation rules for new ticket
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
    console.error('Create ticket error:', error);
    res.status(500).json({ error: 'Failed to create ticket' });
  }
});

// Update ticket
router.put('/:ticketId', authenticateToken, async (req, res) => {
  const { ticketId } = req.params;
  const { 
    subject, 
    description, 
    status, 
    priority, 
    assignee_id, 
    tags, 
    custom_fields 
  } = req.body;

  try {
    // Check if ticket exists and belongs to organization
    const existingTicket = await db.query(
      'SELECT * FROM tickets WHERE id = $1 AND organization_id = $2',
      [ticketId, req.user.organization_id]
    );

    if (existingTicket.rows.length === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const oldTicket = existingTicket.rows[0];
    const changes = {};

    // Build update query dynamically
    const updateFields = [];
    const updateValues = [];
    let paramCount = 0;

    if (subject !== undefined) {
      paramCount++;
      updateFields.push(`subject = $${paramCount}`);
      updateValues.push(subject);
      if (subject !== oldTicket.subject) changes.subject = { from: oldTicket.subject, to: subject };
    }

    if (description !== undefined) {
      paramCount++;
      updateFields.push(`description = $${paramCount}`);
      updateValues.push(description);
      if (description !== oldTicket.description) changes.description = { from: oldTicket.description, to: description };
    }

    if (status !== undefined) {
      paramCount++;
      updateFields.push(`status = $${paramCount}`);
      updateValues.push(status);
      if (status !== oldTicket.status) {
        changes.status = { from: oldTicket.status, to: status };
        if (status === 'solved') {
          paramCount++;
          updateFields.push(`solved_at = $${paramCount}`);
          updateValues.push(new Date());
        }
      }
    }

    if (priority !== undefined) {
      paramCount++;
      updateFields.push(`priority = $${paramCount}`);
      updateValues.push(priority);
      if (priority !== oldTicket.priority) changes.priority = { from: oldTicket.priority, to: priority };
    }

    if (assignee_id !== undefined) {
      paramCount++;
      updateFields.push(`assignee_id = $${paramCount}`);
      updateValues.push(assignee_id || null);
      if (assignee_id !== oldTicket.assignee_id) changes.assignee_id = { from: oldTicket.assignee_id, to: assignee_id };
    }

    if (tags !== undefined) {
      paramCount++;
      updateFields.push(`tags = $${paramCount}`);
      updateValues.push(tags);
      if (JSON.stringify(tags) !== JSON.stringify(oldTicket.tags)) changes.tags = { from: oldTicket.tags, to: tags };
    }

    if (custom_fields !== undefined) {
      paramCount++;
      updateFields.push(`custom_fields = $${paramCount}`);
      updateValues.push(JSON.stringify(custom_fields));
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    // Add updated_at
    paramCount++;
    updateFields.push(`updated_at = $${paramCount}`);
    updateValues.push(new Date());

    // Add WHERE conditions
    paramCount++;
    updateValues.push(ticketId);
    paramCount++;
    updateValues.push(req.user.organization_id);

    const updateQuery = `
      UPDATE tickets 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCount - 1} AND organization_id = $${paramCount}
      RETURNING *
    `;

    const result = await db.query(updateQuery, updateValues);

    // Log activity for significant changes
    if (Object.keys(changes).length > 0) {
      await db.query(
        `INSERT INTO activity_logs (organization_id, ticket_id, user_id, action, details)
         VALUES ($1, $2, $3, $4, $5)`,
        [req.user.organization_id, ticketId, req.user.id, 'ticket_updated', JSON.stringify(changes)]
      );
    }

    // Trigger automation rules for ticket updates
    const updatedTicket = result.rows[0];
    try {
      // General ticket update automation
      await automationEngine.onTicketUpdated(updatedTicket, changes);
      
      // Specific status change automation
      if (changes.status) {
        await automationEngine.onTicketStatusChanged(updatedTicket, changes.status.from, changes.status.to);
      }
      
      // Specific assignment change automation
      if (changes.assignee_id) {
        await automationEngine.onTicketAssigned(updatedTicket, changes.assignee_id.from, changes.assignee_id.to);
      }
    } catch (automationError) {
      console.error('Automation trigger failed:', automationError);
    }

    res.json({
      message: 'Ticket updated successfully',
      ticket: updatedTicket,
      changes
    });

  } catch (error) {
    console.error('Update ticket error:', error);
    res.status(500).json({ error: 'Failed to update ticket' });
  }
});

// Add comment to ticket
router.post('/:ticketId/comments', authenticateToken, async (req, res) => {
  const { ticketId } = req.params;
  const { body, is_public = true, attachments = [] } = req.body;

  try {
    if (!body || body.trim().length === 0) {
      return res.status(400).json({ error: 'Comment body is required' });
    }

    // Check if ticket exists
    const ticketResult = await db.query(
      'SELECT id FROM tickets WHERE id = $1 AND organization_id = $2',
      [ticketId, req.user.organization_id]
    );

    if (ticketResult.rows.length === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Create comment
    const commentId = uuidv4();
    const result = await db.query(
      `INSERT INTO ticket_comments (
        id, ticket_id, user_id, author_email, author_name, 
        body, is_public, attachments
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [
        commentId, ticketId, req.user.id, req.user.email,
        `${req.user.first_name} ${req.user.last_name}`,
        body, is_public, JSON.stringify(attachments)
      ]
    );

    // Update ticket's updated_at timestamp
    await db.query(
      'UPDATE tickets SET updated_at = NOW() WHERE id = $1',
      [ticketId]
    );

    // Log activity
    await db.query(
      `INSERT INTO activity_logs (organization_id, ticket_id, user_id, action, details)
       VALUES ($1, $2, $3, $4, $5)`,
      [req.user.organization_id, ticketId, req.user.id, 'comment_added',
       JSON.stringify({ is_public, has_attachments: attachments.length > 0 })]
    );

    // Trigger automation rules for comment addition
    try {
      const ticket = await db.query(
        'SELECT * FROM tickets WHERE id = $1 AND organization_id = $2',
        [ticketId, req.user.organization_id]
      );
      
      if (ticket.rows.length > 0) {
        await automationEngine.onCommentAdded(ticket.rows[0], result.rows[0]);
      }
    } catch (automationError) {
      console.error('Automation trigger failed:', automationError);
    }

    res.status(201).json({
      message: 'Comment added successfully',
      comment: result.rows[0]
    });

  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

// Delete ticket (admin only)
router.delete('/:ticketId', authenticateToken, requireRole(['admin']), async (req, res) => {
  const { ticketId } = req.params;

  try {
    // Check if ticket exists
    const ticketResult = await db.query(
      'SELECT subject FROM tickets WHERE id = $1 AND organization_id = $2',
      [ticketId, req.user.organization_id]
    );

    if (ticketResult.rows.length === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Delete ticket and related data (CASCADE will handle comments)
    await db.query('DELETE FROM tickets WHERE id = $1', [ticketId]);

    // Log activity
    await db.query(
      `INSERT INTO activity_logs (organization_id, user_id, action, details)
       VALUES ($1, $2, $3, $4)`,
      [req.user.organization_id, req.user.id, 'ticket_deleted',
       JSON.stringify({ ticketId, subject: ticketResult.rows[0].subject })]
    );

    res.json({ message: 'Ticket deleted successfully' });

  } catch (error) {
    console.error('Delete ticket error:', error);
    res.status(500).json({ error: 'Failed to delete ticket' });
  }
});

// Get ticket statistics
router.get('/stats/overview', authenticateToken, async (req, res) => {
  try {
    const stats = await db.query(
      `SELECT 
        COUNT(*) as total_tickets,
        COUNT(*) FILTER (WHERE status = 'open') as open_tickets,
        COUNT(*) FILTER (WHERE status = 'pending') as pending_tickets,
        COUNT(*) FILTER (WHERE status = 'solved') as solved_tickets,
        COUNT(*) FILTER (WHERE status = 'closed') as closed_tickets,
        COUNT(*) FILTER (WHERE assignee_id IS NULL) as unassigned_tickets,
        COUNT(*) FILTER (WHERE priority = 'urgent') as urgent_tickets,
        COUNT(*) FILTER (WHERE priority = 'high') as high_priority_tickets,
        AVG(EXTRACT(EPOCH FROM (solved_at - created_at))/3600) as avg_resolution_hours,
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '24 hours') as tickets_today,
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days') as tickets_this_week
      FROM tickets 
      WHERE organization_id = $1`,
      [req.user.organization_id]
    );

    res.json({ stats: stats.rows[0] });

  } catch (error) {
    console.error('Get ticket stats error:', error);
    res.status(500).json({ error: 'Failed to get ticket statistics' });
  }
});

module.exports = router;