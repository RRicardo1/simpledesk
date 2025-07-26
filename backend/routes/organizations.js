const express = require('express');
const db = require('../config/database');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get organization details
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, name, domain, plan, status, settings, created_at FROM organizations WHERE id = $1',
      [req.user.organization_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    res.json({ organization: result.rows[0] });

  } catch (error) {
    console.error('Get organization error:', error);
    res.status(500).json({ error: 'Failed to get organization' });
  }
});

// Update organization settings (admin only)
router.put('/', authenticateToken, requireRole(['admin']), async (req, res) => {
  const { name, domain, settings } = req.body;

  try {
    const updateFields = [];
    const updateValues = [];
    let paramCount = 0;

    if (name !== undefined) {
      paramCount++;
      updateFields.push(`name = $${paramCount}`);
      updateValues.push(name);
    }

    if (domain !== undefined) {
      paramCount++;
      updateFields.push(`domain = $${paramCount}`);
      updateValues.push(domain);
    }

    if (settings !== undefined) {
      paramCount++;
      updateFields.push(`settings = $${paramCount}`);
      updateValues.push(JSON.stringify(settings));
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    paramCount++;
    updateFields.push(`updated_at = $${paramCount}`);
    updateValues.push(new Date());

    paramCount++;
    updateValues.push(req.user.organization_id);

    const result = await db.query(
      `UPDATE organizations SET ${updateFields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      updateValues
    );

    // Log activity
    await db.query(
      `INSERT INTO activity_logs (organization_id, user_id, action, details)
       VALUES ($1, $2, $3, $4)`,
      [req.user.organization_id, req.user.id, 'organization_updated', 
       JSON.stringify({ name, domain, settings })]
    );

    res.json({
      message: 'Organization updated successfully',
      organization: result.rows[0]
    });

  } catch (error) {
    console.error('Update organization error:', error);
    res.status(500).json({ error: 'Failed to update organization' });
  }
});

// Get organization statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    // Get basic stats
    const basicStats = await db.query(
      `SELECT 
        (SELECT COUNT(*) FROM users WHERE organization_id = $1 AND status = 'active') as active_users,
        (SELECT COUNT(*) FROM tickets WHERE organization_id = $1) as total_tickets,
        (SELECT COUNT(*) FROM tickets WHERE organization_id = $1 AND status IN ('open', 'pending')) as open_tickets,
        (SELECT COUNT(*) FROM kb_articles WHERE organization_id = $1 AND status = 'published') as published_articles,
        (SELECT COUNT(*) FROM chat_sessions WHERE organization_id = $1 AND started_at >= NOW() - INTERVAL '30 days') as chat_sessions_30d`,
      [req.user.organization_id]
    );

    // Get ticket trends (last 30 days)
    const ticketTrends = await db.query(
      `SELECT 
        DATE(created_at) as date,
        COUNT(*) as tickets_created,
        COUNT(*) FILTER (WHERE status IN ('solved', 'closed')) as tickets_solved
      FROM tickets 
      WHERE organization_id = $1 AND created_at >= NOW() - INTERVAL '30 days'
      GROUP BY DATE(created_at)
      ORDER BY date`,
      [req.user.organization_id]
    );

    // Get agent performance
    const agentStats = await db.query(
      `SELECT 
        u.id,
        u.first_name,
        u.last_name,
        u.email,
        COUNT(t.id) as assigned_tickets,
        COUNT(t.id) FILTER (WHERE t.status IN ('solved', 'closed')) as solved_tickets,
        AVG(EXTRACT(EPOCH FROM (t.solved_at - t.created_at))/3600) as avg_resolution_hours
      FROM users u
      LEFT JOIN tickets t ON u.id = t.assignee_id
      WHERE u.organization_id = $1 AND u.role IN ('admin', 'agent') AND u.status = 'active'
      GROUP BY u.id, u.first_name, u.last_name, u.email
      ORDER BY solved_tickets DESC`,
      [req.user.organization_id]
    );

    res.json({
      basicStats: basicStats.rows[0],
      ticketTrends: ticketTrends.rows,
      agentStats: agentStats.rows
    });

  } catch (error) {
    console.error('Get organization stats error:', error);
    res.status(500).json({ error: 'Failed to get organization statistics' });
  }
});

module.exports = router;