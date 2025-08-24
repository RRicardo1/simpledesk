const db = require('../config/database');
const emailService = require('./email');

class AutomationEngine {
  constructor() {
    this.isProcessing = false;
  }

  // Main entry point for automation execution
  async executeAutomations(triggerEvent, data, organizationId) {
    if (this.isProcessing) return;

    try {
      console.log(`🤖 Automation trigger: ${triggerEvent}`, { organizationId, data: data.id || data });
      
      // Get active automation rules for this organization
      const rulesResult = await db.query(
        'SELECT * FROM automation_rules WHERE organization_id = $1 AND is_active = true ORDER BY position ASC',
        [organizationId]
      );

      const rules = rulesResult.rows;
      if (rules.length === 0) {
        console.log('No active automation rules found');
        return;
      }

      // Process each rule
      for (const rule of rules) {
        await this.processRule(rule, triggerEvent, data);
      }
    } catch (error) {
      console.error('Automation execution error:', error);
    }
  }

  // Process individual automation rule
  async processRule(rule, triggerEvent, data) {
    try {
      const conditions = JSON.parse(rule.trigger_conditions);
      const actions = JSON.parse(rule.actions);

      // Check if this rule should trigger
      if (!this.shouldTrigger(conditions, triggerEvent, data)) {
        return;
      }

      console.log(`✅ Rule "${rule.name}" triggered for ${triggerEvent}`);

      // Execute all actions in the rule
      for (const action of actions) {
        await this.executeAction(action, data, rule.organization_id);
      }

      // Log automation execution
      await this.logExecution(rule.id, data, 'success');

    } catch (error) {
      console.error(`Error processing rule ${rule.name}:`, error);
      await this.logExecution(rule.id, data, 'error', error.message);
    }
  }

  // Check if automation conditions are met
  shouldTrigger(conditions, triggerEvent, data) {
    // Check event type matches
    if (conditions.event !== triggerEvent) {
      return false;
    }

    // Check all conditions
    if (conditions.conditions && conditions.conditions.length > 0) {
      return this.evaluateConditions(conditions.conditions, data);
    }

    return true;
  }

  // Evaluate condition logic
  evaluateConditions(conditions, data) {
    for (const condition of conditions) {
      const fieldValue = this.getFieldValue(data, condition.field);
      
      if (!this.evaluateCondition(fieldValue, condition.operator, condition.value)) {
        return false;
      }
    }
    return true;
  }

  // Evaluate individual condition
  evaluateCondition(fieldValue, operator, expectedValue) {
    switch (operator) {
      case 'equals':
        return fieldValue === expectedValue;
      case 'not_equals':
        return fieldValue !== expectedValue;
      case 'contains':
        return String(fieldValue).toLowerCase().includes(String(expectedValue).toLowerCase());
      case 'not_contains':
        return !String(fieldValue).toLowerCase().includes(String(expectedValue).toLowerCase());
      case 'greater_than':
        return Number(fieldValue) > Number(expectedValue);
      case 'less_than':
        return Number(fieldValue) < Number(expectedValue);
      case 'is_empty':
        return !fieldValue || fieldValue === '';
      case 'is_not_empty':
        return fieldValue && fieldValue !== '';
      default:
        return false;
    }
  }

  // Get field value from data object
  getFieldValue(data, field) {
    const fieldMap = {
      'ticket.status': data.status,
      'ticket.priority': data.priority,
      'ticket.subject': data.subject,
      'ticket.description': data.description,
      'ticket.assignee_id': data.assignee_id,
      'ticket.requester_email': data.requester_email,
      'ticket.tags': data.tags,
      'ticket.source': data.source,
      'ticket.created_at': data.created_at,
      'ticket.updated_at': data.updated_at
    };

    return fieldMap[field] || null;
  }

  // Execute automation action
  async executeAction(action, data, organizationId) {
    try {
      console.log(`🎯 Executing action: ${action.type}`);

      switch (action.type) {
        case 'assign_ticket':
          await this.assignTicket(data.id, action.assignee_id, organizationId);
          break;
        case 'change_status':
          await this.changeTicketStatus(data.id, action.status, organizationId);
          break;
        case 'change_priority':
          await this.changeTicketPriority(data.id, action.priority, organizationId);
          break;
        case 'add_tags':
          await this.addTicketTags(data.id, action.tags, organizationId);
          break;
        case 'send_email':
          await this.sendEmail(action.template, data, organizationId);
          break;
        case 'add_comment':
          await this.addComment(data.id, action.comment, organizationId);
          break;
        case 'escalate':
          await this.escalateTicket(data.id, action.escalate_to, organizationId);
          break;
        default:
          console.log(`Unknown action type: ${action.type}`);
      }
    } catch (error) {
      console.error(`Action execution failed: ${action.type}`, error);
      throw error;
    }
  }

  // Action implementations
  async assignTicket(ticketId, assigneeId, organizationId) {
    await db.query(
      'UPDATE tickets SET assignee_id = $1, updated_at = NOW() WHERE id = $2 AND organization_id = $3',
      [assigneeId, ticketId, organizationId]
    );
    console.log(`✅ Assigned ticket ${ticketId} to ${assigneeId}`);
  }

  async changeTicketStatus(ticketId, status, organizationId) {
    const updateData = { updated_at: new Date() };
    if (status === 'solved') {
      updateData.solved_at = new Date();
    }

    await db.query(
      'UPDATE tickets SET status = $1, solved_at = $2, updated_at = $3 WHERE id = $4 AND organization_id = $5',
      [status, updateData.solved_at || null, updateData.updated_at, ticketId, organizationId]
    );
    console.log(`✅ Changed ticket ${ticketId} status to ${status}`);
  }

  async changeTicketPriority(ticketId, priority, organizationId) {
    await db.query(
      'UPDATE tickets SET priority = $1, updated_at = NOW() WHERE id = $2 AND organization_id = $3',
      [priority, ticketId, organizationId]
    );
    console.log(`✅ Changed ticket ${ticketId} priority to ${priority}`);
  }

  async addTicketTags(ticketId, newTags, organizationId) {
    // Get existing tags
    const result = await db.query(
      'SELECT tags FROM tickets WHERE id = $1 AND organization_id = $2',
      [ticketId, organizationId]
    );
    
    if (result.rows.length > 0) {
      const existingTags = result.rows[0].tags || [];
      const combinedTags = [...new Set([...existingTags, ...newTags])];
      
      await db.query(
        'UPDATE tickets SET tags = $1, updated_at = NOW() WHERE id = $2 AND organization_id = $3',
        [combinedTags, ticketId, organizationId]
      );
      console.log(`✅ Added tags to ticket ${ticketId}:`, newTags);
    }
  }

  async sendEmail(template, data, organizationId) {
    try {
      const emailData = {
        to: data.requester_email,
        subject: this.processTemplate(template.subject, data),
        body: this.processTemplate(template.body, data),
        ticketId: data.id,
        organizationId
      };

      await emailService.sendTicketEmail(emailData);
      console.log(`✅ Sent automated email to ${data.requester_email}`);
    } catch (error) {
      console.error('Failed to send automated email:', error);
    }
  }

  async addComment(ticketId, commentTemplate, organizationId) {
    const comment = this.processTemplate(commentTemplate, { ticket_id: ticketId });
    
    const { v4: uuidv4 } = require('uuid');
    await db.query(
      `INSERT INTO ticket_comments (id, ticket_id, author_name, body, is_public, is_automated, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
      [uuidv4(), ticketId, 'System', comment, false, true]
    );
    console.log(`✅ Added automated comment to ticket ${ticketId}`);
  }

  async escalateTicket(ticketId, escalateTo, organizationId) {
    // Find agent to escalate to or use organization admin
    let assigneeId = escalateTo;
    if (!assigneeId) {
      const adminResult = await db.query(
        'SELECT id FROM users WHERE organization_id = $1 AND role = $2 LIMIT 1',
        [organizationId, 'admin']
      );
      if (adminResult.rows.length > 0) {
        assigneeId = adminResult.rows[0].id;
      }
    }

    if (assigneeId) {
      await this.assignTicket(ticketId, assigneeId, organizationId);
      await this.changeTicketPriority(ticketId, 'high', organizationId);
      console.log(`✅ Escalated ticket ${ticketId} to ${assigneeId}`);
    }
  }

  // Template processing for dynamic content
  processTemplate(template, data) {
    let processed = template;
    
    // Replace placeholders
    const placeholders = {
      '{{ticket.id}}': data.id,
      '{{ticket.subject}}': data.subject,
      '{{ticket.status}}': data.status,
      '{{ticket.priority}}': data.priority,
      '{{ticket.requester_name}}': data.requester_name,
      '{{ticket.requester_email}}': data.requester_email,
      '{{ticket.description}}': data.description,
      '{{ticket.created_at}}': data.created_at
    };

    for (const [placeholder, value] of Object.entries(placeholders)) {
      processed = processed.replace(new RegExp(placeholder, 'g'), value || '');
    }

    return processed;
  }

  // Log automation execution for debugging
  async logExecution(ruleId, data, status, errorMessage = null) {
    try {
      const { v4: uuidv4 } = require('uuid');
      await db.query(
        `INSERT INTO automation_logs (id, rule_id, trigger_data, status, error_message, executed_at)
         VALUES ($1, $2, $3, $4, $5, NOW())`,
        [uuidv4(), ruleId, JSON.stringify(data), status, errorMessage]
      );
    } catch (error) {
      console.error('Failed to log automation execution:', error);
    }
  }

  // Trigger specific automation events
  async onTicketCreated(ticket) {
    await this.executeAutomations('ticket_created', ticket, ticket.organization_id);
  }

  async onTicketUpdated(ticket, changes) {
    await this.executeAutomations('ticket_updated', { ...ticket, changes }, ticket.organization_id);
  }

  async onTicketStatusChanged(ticket, oldStatus, newStatus) {
    await this.executeAutomations('ticket_status_changed', 
      { ...ticket, old_status: oldStatus, new_status: newStatus }, 
      ticket.organization_id
    );
  }

  async onTicketAssigned(ticket, oldAssignee, newAssignee) {
    await this.executeAutomations('ticket_assigned', 
      { ...ticket, old_assignee: oldAssignee, new_assignee: newAssignee }, 
      ticket.organization_id
    );
  }

  async onCommentAdded(ticket, comment) {
    await this.executeAutomations('comment_added', 
      { ...ticket, comment }, 
      ticket.organization_id
    );
  }
}

module.exports = new AutomationEngine();