const jwt = require('jsonwebtoken');
const db = require('../config/database');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user details from database
    const userResult = await db.query(
      'SELECT u.*, o.name as organization_name FROM users u JOIN organizations o ON u.organization_id = o.id WHERE u.id = $1 AND u.status = $2',
      [decoded.userId, 'active']
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid token or user not found' });
    }

    req.user = userResult.rows[0];
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

const requireRole = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};

const requireOrganization = async (req, res, next) => {
  const organizationId = req.params.organizationId || req.body.organizationId;
  
  if (!organizationId) {
    return res.status(400).json({ error: 'Organization ID required' });
  }

  if (req.user.organization_id !== organizationId) {
    return res.status(403).json({ error: 'Access denied to this organization' });
  }

  next();
};

module.exports = {
  authenticateToken,
  requireRole,
  requireOrganization
};