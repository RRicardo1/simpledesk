const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get automation rules
router.get('/rules', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT ar.*, u.first_name as created_by_name, u.last_name as created_by_last_name
       FROM automation_rules ar
       LEFT JOIN users u ON ar.created_by = u.id
       WHERE ar.organization_id = $1
       ORDER BY ar.position ASC`,
      [req.user.organization_id]
    );

    res.json({ rules: result.rows });
  } catch (error) {
    console.error('Get automation rules error:', error);
    res.status(500).json({ error: 'Failed to get automation rules' });
  }
});

// Create automation rule
router.post('/rules', authenticateToken, requireRole(['admin']), async (req, res) => {
  const { name, description, triggerConditions, actions, isActive = true } = req.body;

  try {
    if (!name || !triggerConditions || !actions) {
      return res.status(400).json({ error: 'Name, trigger conditions, and actions are required' });
    }

    const ruleId = uuidv4();
    
    const result = await db.query(
      `INSERT INTO automation_rules (
        id, organization_id, name, description, trigger_conditions, 
        actions, is_active, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [
        ruleId, req.user.organization_id, name, description,
        JSON.stringify(triggerConditions), JSON.stringify(actions),
        isActive, req.user.id
      ]
    );

    res.status(201).json({
      message: 'Automation rule created successfully',
      rule: result.rows[0]
    });
  } catch (error) {
    console.error('Create automation rule error:', error);
    res.status(500).json({ error: 'Failed to create automation rule' });
  }
});

// Update automation rule
router.put('/rules/:ruleId', authenticateToken, requireRole(['admin']), async (req, res) => {
  const { ruleId } = req.params;
  const { name, description, triggerConditions, actions, isActive } = req.body;

  try {
    const updateFields = [];
    const updateValues = [];
    let paramCount = 0;

    if (name !== undefined) {
      paramCount++;
      updateFields.push(`name = $${paramCount}`);
      updateValues.push(name);
    }

    if (description !== undefined) {
      paramCount++;
      updateFields.push(`description = $${paramCount}`);
      updateValues.push(description);
    }

    if (triggerConditions !== undefined) {
      paramCount++;
      updateFields.push(`trigger_conditions = $${paramCount}`);
      updateValues.push(JSON.stringify(triggerConditions));
    }

    if (actions !== undefined) {
      paramCount++;
      updateFields.push(`actions = $${paramCount}`);
      updateValues.push(JSON.stringify(actions));
    }

    if (isActive !== undefined) {
      paramCount++;
      updateFields.push(`is_active = $${paramCount}`);
      updateValues.push(isActive);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    paramCount++;
    updateFields.push(`updated_at = $${paramCount}`);
    updateValues.push(new Date());

    paramCount++;
    updateValues.push(ruleId);
    paramCount++;
    updateValues.push(req.user.organization_id);

    const result = await db.query(
      `UPDATE automation_rules 
       SET ${updateFields.join(', ')}
       WHERE id = $${paramCount - 1} AND organization_id = $${paramCount}
       RETURNING *`,
      updateValues
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Automation rule not found' });
    }

    res.json({
      message: 'Automation rule updated successfully',
      rule: result.rows[0]
    });
  } catch (error) {
    console.error('Update automation rule error:', error);
    res.status(500).json({ error: 'Failed to update automation rule' });
  }
});

// Delete automation rule
router.delete('/rules/:ruleId', authenticateToken, requireRole(['admin']), async (req, res) => {
  const { ruleId } = req.params;

  try {
    const result = await db.query(
      'DELETE FROM automation_rules WHERE id = $1 AND organization_id = $2 RETURNING name',
      [ruleId, req.user.organization_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Automation rule not found' });
    }

    res.json({ message: 'Automation rule deleted successfully' });
  } catch (error) {
    console.error('Delete automation rule error:', error);
    res.status(500).json({ error: 'Failed to delete automation rule' });
  }
});

// Get SLA policies
router.get('/sla', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM sla_policies WHERE organization_id = $1 ORDER BY created_at DESC',
      [req.user.organization_id]
    );

    res.json({ policies: result.rows });
  } catch (error) {
    console.error('Get SLA policies error:', error);
    res.status(500).json({ error: 'Failed to get SLA policies' });
  }
});

module.exports = router;