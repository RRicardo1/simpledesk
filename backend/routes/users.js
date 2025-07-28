const express = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const validator = require('validator');
const db = require('../config/database');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get all users in organization
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, email, first_name, last_name, role, avatar_url, 
              phone, timezone, status, last_login_at, created_at
       FROM users 
       WHERE organization_id = $1 
       ORDER BY created_at DESC`,
      [req.user.organization_id]
    );

    res.json({ users: result.rows });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

// Get user by ID
router.get('/:userId', authenticateToken, async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await db.query(
      `SELECT id, email, first_name, last_name, role, avatar_url, 
              phone, timezone, status, last_login_at, created_at
       FROM users 
       WHERE id = $1 AND organization_id = $2`,
      [userId, req.user.organization_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: result.rows[0] });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// Create new user (admin only)
router.post('/', authenticateToken, requireRole(['admin']), async (req, res) => {
  const { email, firstName, lastName, role, phone } = req.body;

  try {
    // Validation
    if (!email || !firstName || !lastName || !role) {
      return res.status(400).json({ error: 'Email, first name, last name, and role are required' });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    if (!['admin', 'agent'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Must be admin or agent' });
    }

    // Check if email already exists
    const existingUser = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Create user with invited status (they'll set password on first login)
    const userId = uuidv4();
    await db.query(
      `INSERT INTO users (id, organization_id, email, first_name, last_name, role, phone, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [userId, req.user.organization_id, email, firstName, lastName, role, phone, 'invited']
    );

    // Log activity
    await db.query(
      `INSERT INTO activity_logs (organization_id, user_id, action, details)
       VALUES ($1, $2, $3, $4)`,
      [req.user.organization_id, req.user.id, 'user_created', 
       JSON.stringify({ createdUserId: userId, email, role })]
    );

    // TODO: Send invitation email

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: userId,
        email,
        firstName,
        lastName,
        role,
        phone,
        status: 'invited'
      }
    });

  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Invite user (admin only) - alias for create user
router.post('/invite', authenticateToken, requireRole(['admin']), async (req, res) => {
  const { email, firstName, lastName, role, phone } = req.body;

  try {
    // Validation
    if (!email || !firstName || !lastName || !role) {
      return res.status(400).json({ error: 'Email, first name, last name, and role are required' });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    if (!['admin', 'agent'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Must be admin or agent' });
    }

    // Check if email already exists
    const existingUser = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Create user with invited status (they'll set password on first login)
    const userId = uuidv4();
    await db.query(
      `INSERT INTO users (id, organization_id, email, first_name, last_name, role, phone, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [userId, req.user.organization_id, email, firstName, lastName, role, phone, 'invited']
    );

    // Log activity
    await db.query(
      `INSERT INTO activity_logs (organization_id, user_id, action, details)
       VALUES ($1, $2, $3, $4)`,
      [req.user.organization_id, req.user.id, 'user_invited', 
       JSON.stringify({ invitedUserId: userId, email, role })]
    );

    // TODO: Send invitation email

    res.status(201).json({
      message: 'User invited successfully',
      user: {
        id: userId,
        email,
        first_name: firstName,
        last_name: lastName,
        role,
        phone,
        status: 'invited'
      }
    });

  } catch (error) {
    console.error('Invite user error:', error);
    res.status(500).json({ error: 'Failed to invite user' });
  }
});

// Update user (admin only)
router.put('/:userId', authenticateToken, requireRole(['admin']), async (req, res) => {
  const { userId } = req.params;
  const { firstName, lastName, role, phone, status } = req.body;

  try {
    // Check if user exists in same organization
    const existingUser = await db.query(
      'SELECT id, role FROM users WHERE id = $1 AND organization_id = $2',
      [userId, req.user.organization_id]
    );

    if (existingUser.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Prevent changing your own role
    if (userId === req.user.id && role && role !== existingUser.rows[0].role) {
      return res.status(400).json({ error: 'Cannot change your own role' });
    }

    // Update user
    const result = await db.query(
      `UPDATE users 
       SET first_name = COALESCE($1, first_name),
           last_name = COALESCE($2, last_name),
           role = COALESCE($3, role),
           phone = COALESCE($4, phone),
           status = COALESCE($5, status),
           updated_at = NOW()
       WHERE id = $6 AND organization_id = $7
       RETURNING id, email, first_name, last_name, role, phone, status`,
      [firstName, lastName, role, phone, status, userId, req.user.organization_id]
    );

    // Log activity
    await db.query(
      `INSERT INTO activity_logs (organization_id, user_id, action, details)
       VALUES ($1, $2, $3, $4)`,
      [req.user.organization_id, req.user.id, 'user_updated', 
       JSON.stringify({ updatedUserId: userId, changes: { firstName, lastName, role, phone, status } })]
    );

    res.json({
      message: 'User updated successfully',
      user: result.rows[0]
    });

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete user (admin only)
router.delete('/:userId', authenticateToken, requireRole(['admin']), async (req, res) => {
  const { userId } = req.params;

  try {
    // Prevent deleting yourself
    if (userId === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    // Check if user exists
    const existingUser = await db.query(
      'SELECT email FROM users WHERE id = $1 AND organization_id = $2',
      [userId, req.user.organization_id]
    );

    if (existingUser.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Soft delete by updating status
    await db.query(
      'UPDATE users SET status = $1, updated_at = NOW() WHERE id = $2',
      ['inactive', userId]
    );

    // Unassign all tickets from this user
    await db.query(
      'UPDATE tickets SET assignee_id = NULL WHERE assignee_id = $1',
      [userId]
    );

    // Log activity
    await db.query(
      `INSERT INTO activity_logs (organization_id, user_id, action, details)
       VALUES ($1, $2, $3, $4)`,
      [req.user.organization_id, req.user.id, 'user_deleted', 
       JSON.stringify({ deletedUserId: userId, email: existingUser.rows[0].email })]
    );

    res.json({ message: 'User deleted successfully' });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Get user statistics
router.get('/:userId/stats', authenticateToken, async (req, res) => {
  const { userId } = req.params;

  try {
    // Verify user belongs to same organization
    const userCheck = await db.query(
      'SELECT id FROM users WHERE id = $1 AND organization_id = $2',
      [userId, req.user.organization_id]
    );

    if (userCheck.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get ticket statistics
    const ticketStats = await db.query(
      `SELECT 
         COUNT(*) as total_tickets,
         COUNT(*) FILTER (WHERE status = 'open') as open_tickets,
         COUNT(*) FILTER (WHERE status = 'pending') as pending_tickets,
         COUNT(*) FILTER (WHERE status = 'solved') as solved_tickets,
         COUNT(*) FILTER (WHERE status = 'closed') as closed_tickets,
         AVG(EXTRACT(EPOCH FROM (solved_at - created_at))/3600) as avg_resolution_hours
       FROM tickets 
       WHERE assignee_id = $1`,
      [userId]
    );

    // Get recent activity
    const recentActivity = await db.query(
      `SELECT action, details, created_at
       FROM activity_logs 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT 10`,
      [userId]
    );

    res.json({
      stats: ticketStats.rows[0],
      recentActivity: recentActivity.rows
    });

  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ error: 'Failed to get user statistics' });
  }
});

module.exports = router;