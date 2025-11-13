const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const validator = require('validator');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Register new organization and admin user
router.post('/register', async (req, res) => {
  const { organizationName, email, password, firstName, lastName } = req.body;

  try {
    // Validation
    if (!organizationName || !email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Strong password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ 
        error: 'Password must be at least 12 characters with uppercase, lowercase, number, and special character (@$!%*?&)' 
      });
    }

    // Check if email already exists
    const existingUser = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create organization with 30-day trial
    const organizationId = uuidv4();
    const trialStartDate = new Date();
    const trialEndDate = new Date();
    trialEndDate.setDate(trialStartDate.getDate() + 30); // 30-day trial
    
    await db.query(
      `INSERT INTO organizations (id, name, plan, status, is_trial, trial_start_date, trial_end_date, trial_status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [organizationId, organizationName, 'starter', 'active', true, trialStartDate, trialEndDate, 'active']
    );

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create admin user
    const userId = uuidv4();
    await db.query(
      `INSERT INTO users (id, organization_id, email, password_hash, first_name, last_name, role, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [userId, organizationId, email, passwordHash, firstName, lastName, 'admin', 'active']
    );

    // Generate JWT token with shorter expiration for better security
    const token = jwt.sign(
      { userId, organizationId, role: 'admin', jti: uuidv4() },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '1h' } // Reduced from 7d to 1h
    );

    res.status(201).json({
      message: 'Organization and admin user created successfully',
      token,
      user: {
        id: userId,
        email,
        firstName,
        lastName,
        role: 'admin',
        organizationId,
        organizationName
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to create account' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Get user with organization info
    const result = await db.query(
      `SELECT u.*, o.name as organization_name 
       FROM users u 
       JOIN organizations o ON u.organization_id = o.id 
       WHERE u.email = $1 AND u.status = $2`,
      [email, 'active']
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Update last login
    await db.query(
      'UPDATE users SET last_login_at = NOW() WHERE id = $1',
      [user.id]
    );

    // Generate JWT token with shorter expiration for better security
    const token = jwt.sign(
      { userId: user.id, organizationId: user.organization_id, role: user.role, jti: uuidv4() },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '1h' } // Reduced from 7d to 1h
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        organizationId: user.organization_id,
        organizationName: user.organization_name,
        avatarUrl: user.avatar_url
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
});

// Get current user profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user.id,
        email: req.user.email,
        firstName: req.user.first_name,
        lastName: req.user.last_name,
        role: req.user.role,
        organizationId: req.user.organization_id,
        organizationName: req.user.organization_name,
        avatarUrl: req.user.avatar_url,
        timezone: req.user.timezone,
        lastLoginAt: req.user.last_login_at
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get user profile' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  const { firstName, lastName, timezone, avatarUrl } = req.body;

  try {
    const result = await db.query(
      `UPDATE users 
       SET first_name = COALESCE($1, first_name),
           last_name = COALESCE($2, last_name),
           timezone = COALESCE($3, timezone),
           avatar_url = COALESCE($4, avatar_url),
           updated_at = NOW()
       WHERE id = $5
       RETURNING first_name, last_name, timezone, avatar_url`,
      [firstName, lastName, timezone, avatarUrl, req.user.id]
    );

    res.json({
      message: 'Profile updated successfully',
      user: result.rows[0]
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Change password
router.post('/change-password', authenticateToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new passwords are required' });
    }

    // Strong password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({ 
        error: 'New password must be at least 12 characters with uppercase, lowercase, number, and special character (@$!%*?&)' 
      });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, req.user.password_hash);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    // Update password
    await db.query(
      'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
      [newPasswordHash, req.user.id]
    );

    res.json({ message: 'Password changed successfully' });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// Logout (client-side token removal, but we can log the action)
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    // Log the logout activity
    await db.query(
      `INSERT INTO activity_logs (organization_id, user_id, action, details)
       VALUES ($1, $2, $3, $4)`,
      [req.user.organization_id, req.user.id, 'user_logout', '{}']
    );

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
});

module.exports = router;