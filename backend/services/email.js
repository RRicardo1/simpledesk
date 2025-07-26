const nodemailer = require('nodemailer');
const { simpleParser } = require('mailparser');
const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT == 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  // Parse incoming email and create ticket
  async parseIncomingEmail(rawEmail, organizationId) {
    try {
      const parsed = await simpleParser(rawEmail);
      
      // Extract sender information
      const senderEmail = parsed.from.value[0].address;
      const senderName = parsed.from.value[0].name || senderEmail.split('@')[0];
      
      // Check if this is a reply to existing ticket
      let ticketId = null;
      let isReply = false;
      
      // Look for ticket ID in subject line
      const subjectMatch = parsed.subject.match(/\[#(\d+)\]/);
      if (subjectMatch) {
        const ticketNumber = parseInt(subjectMatch[1]);
        const ticketResult = await db.query(
          'SELECT id FROM tickets WHERE ticket_number = $1 AND organization_id = $2',
          [ticketNumber, organizationId]
        );
        
        if (ticketResult.rows.length > 0) {
          ticketId = ticketResult.rows[0].id;
          isReply = true;
        }
      }

      // If not a reply, create new ticket
      if (!isReply) {
        ticketId = await this.createTicketFromEmail(
          organizationId,
          parsed.subject,
          parsed.text || parsed.html,
          senderEmail,
          senderName,
          parsed.attachments
        );
      } else {
        // Add comment to existing ticket
        await this.addCommentFromEmail(
          ticketId,
          parsed.text || parsed.html,
          senderEmail,
          senderName,
          parsed.attachments
        );
      }

      return { ticketId, isReply };

    } catch (error) {
      console.error('Email parsing error:', error);
      throw error;
    }
  }

  // Create new ticket from email
  async createTicketFromEmail(organizationId, subject, body, senderEmail, senderName, attachments = []) {
    try {
      // Check if sender is existing user
      let requesterId = null;
      const userResult = await db.query(
        'SELECT id FROM users WHERE email = $1 AND organization_id = $2',
        [senderEmail, organizationId]
      );
      
      if (userResult.rows.length > 0) {
        requesterId = userResult.rows[0].id;
      }

      const ticketId = uuidv4();
      
      // Create ticket
      await db.query(
        `INSERT INTO tickets (
          id, organization_id, subject, description, 
          requester_id, requester_email, requester_name, 
          source, status, priority
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          ticketId, organizationId, subject, body,
          requesterId, senderEmail, senderName,
          'email', 'open', 'normal'
        ]
      );

      // Add initial comment
      await db.query(
        `INSERT INTO ticket_comments (
          ticket_id, user_id, author_email, author_name, 
          body, is_public, attachments
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          ticketId, requesterId, senderEmail, senderName,
          body, true, JSON.stringify(attachments || [])
        ]
      );

      // Log activity
      await db.query(
        `INSERT INTO activity_logs (organization_id, ticket_id, action, details)
         VALUES ($1, $2, $3, $4)`,
        [organizationId, ticketId, 'ticket_created_email', 
         JSON.stringify({ senderEmail, subject })]
      );

      // Send auto-reply confirmation
      await this.sendAutoReply(organizationId, ticketId, senderEmail, senderName, subject);

      return ticketId;

    } catch (error) {
      console.error('Create ticket from email error:', error);
      throw error;
    }
  }

  // Add comment from email
  async addCommentFromEmail(ticketId, body, senderEmail, senderName, attachments = []) {
    try {
      // Get ticket info
      const ticketResult = await db.query(
        'SELECT organization_id, requester_email FROM tickets WHERE id = $1',
        [ticketId]
      );

      if (ticketResult.rows.length === 0) {
        throw new Error('Ticket not found');
      }

      const ticket = ticketResult.rows[0];
      
      // Check if sender is requester or team member
      let userId = null;
      const userResult = await db.query(
        'SELECT id, role FROM users WHERE email = $1 AND organization_id = $2',
        [senderEmail, ticket.organization_id]
      );
      
      if (userResult.rows.length > 0) {
        userId = userResult.rows[0].id;
      }

      // Determine if comment should be public
      const isPublic = !userResult.rows.length || userResult.rows[0].role !== 'agent';

      // Add comment
      await db.query(
        `INSERT INTO ticket_comments (
          ticket_id, user_id, author_email, author_name, 
          body, is_public, attachments
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          ticketId, userId, senderEmail, senderName,
          body, isPublic, JSON.stringify(attachments || [])
        ]
      );

      // Update ticket timestamp
      await db.query(
        'UPDATE tickets SET updated_at = NOW() WHERE id = $1',
        [ticketId]
      );

      // Log activity
      await db.query(
        `INSERT INTO activity_logs (organization_id, ticket_id, user_id, action, details)
         VALUES ($1, $2, $3, $4, $5)`,
        [ticket.organization_id, ticketId, userId, 'comment_added_email',
         JSON.stringify({ senderEmail })]
      );

    } catch (error) {
      console.error('Add comment from email error:', error);
      throw error;
    }
  }

  // Send auto-reply confirmation
  async sendAutoReply(organizationId, ticketId, recipientEmail, recipientName, originalSubject) {
    try {
      // Get organization settings
      const orgResult = await db.query(
        'SELECT name, settings FROM organizations WHERE id = $1',
        [organizationId]
      );

      if (orgResult.rows.length === 0) return;

      const org = orgResult.rows[0];
      const settings = org.settings || {};

      // Check if auto-reply is enabled
      if (settings.autoReplyEnabled === false) return;

      // Get ticket number
      const ticketResult = await db.query(
        'SELECT ticket_number FROM tickets WHERE id = $1',
        [ticketId]
      );

      const ticketNumber = ticketResult.rows[0].ticket_number;

      const subject = `Re: ${originalSubject} [#${ticketNumber}]`;
      const autoReplyTemplate = settings.autoReplyTemplate || `
Hi ${recipientName},

Thank you for contacting ${org.name}. We have received your message and created ticket #${ticketNumber}.

Our team will review your request and respond as soon as possible. You can track the status of your ticket by replying to this email.

Best regards,
${org.name} Support Team
      `.trim();

      await this.sendEmail({
        to: recipientEmail,
        subject,
        text: autoReplyTemplate,
        organizationId
      });

    } catch (error) {
      console.error('Send auto-reply error:', error);
      // Don't throw - auto-reply failure shouldn't break ticket creation
    }
  }

  // Send email notification
  async sendEmail({ to, subject, text, html, organizationId, ticketId }) {
    try {
      // Get organization settings for from address
      const orgResult = await db.query(
        'SELECT name, settings FROM organizations WHERE id = $1',
        [organizationId]
      );

      const org = orgResult.rows[0];
      const fromEmail = process.env.FROM_EMAIL || 'support@simpledesk.com';
      const fromName = org?.name ? `${org.name} Support` : 'SimpleDesk Support';

      const mailOptions = {
        from: `${fromName} <${fromEmail}>`,
        to,
        subject,
        text,
        html
      };

      const result = await this.transporter.sendMail(mailOptions);

      // Log the sent email
      if (ticketId) {
        await db.query(
          `INSERT INTO activity_logs (organization_id, ticket_id, action, details)
           VALUES ($1, $2, $3, $4)`,
          [organizationId, ticketId, 'email_sent', 
           JSON.stringify({ to, subject, messageId: result.messageId })]
        );
      }

      return result;

    } catch (error) {
      console.error('Send email error:', error);
      throw error;
    }
  }

  // Send ticket notification to team
  async sendTicketNotification(ticketId, type, additionalData = {}) {
    try {
      // Get ticket and organization info
      const ticketResult = await db.query(
        `SELECT t.*, o.name as org_name, o.settings,
                u_req.email as requester_email,
                u_ass.email as assignee_email, u_ass.first_name as assignee_name
         FROM tickets t
         JOIN organizations o ON t.organization_id = o.id
         LEFT JOIN users u_req ON t.requester_id = u_req.id  
         LEFT JOIN users u_ass ON t.assignee_id = u_ass.id
         WHERE t.id = $1`,
        [ticketId]
      );

      if (ticketResult.rows.length === 0) return;

      const ticket = ticketResult.rows[0];
      const settings = ticket.settings || {};

      // Get team members to notify
      const teamResult = await db.query(
        `SELECT email, first_name FROM users 
         WHERE organization_id = $1 AND role IN ('admin', 'agent') AND status = 'active'`,
        [ticket.organization_id]
      );

      const notifications = {
        new_ticket: {
          subject: `New Ticket: ${ticket.subject} [#${ticket.ticket_number}]`,
          template: `A new support ticket has been created:\n\nTicket #${ticket.ticket_number}\nFrom: ${ticket.requester_email}\nSubject: ${ticket.subject}\nPriority: ${ticket.priority}\n\nDescription:\n${ticket.description}`
        },
        ticket_assigned: {
          subject: `Ticket Assigned: ${ticket.subject} [#${ticket.ticket_number}]`,
          template: `Ticket #${ticket.ticket_number} has been assigned to ${ticket.assignee_name}.\n\nSubject: ${ticket.subject}\nPriority: ${ticket.priority}`
        },
        ticket_updated: {
          subject: `Ticket Updated: ${ticket.subject} [#${ticket.ticket_number}]`,
          template: `Ticket #${ticket.ticket_number} has been updated.\n\nChanges: ${JSON.stringify(additionalData.changes || {})}`
        }
      };

      const notification = notifications[type];
      if (!notification) return;

      // Send to team members (except the one who made the change)
      for (const member of teamResult.rows) {
        if (member.email !== additionalData.excludeEmail) {
          await this.sendEmail({
            to: member.email,
            subject: notification.subject,
            text: notification.template,
            organizationId: ticket.organization_id,
            ticketId
          });
        }
      }

    } catch (error) {
      console.error('Send ticket notification error:', error);
      // Don't throw - notification failure shouldn't break main operations
    }
  }

  // Send ticket reply to customer
  async sendTicketReply(ticketId, replyBody, agentName) {
    try {
      // Get ticket info
      const ticketResult = await db.query(
        `SELECT t.*, o.name as org_name
         FROM tickets t
         JOIN organizations o ON t.organization_id = o.id
         WHERE t.id = $1`,
        [ticketId]
      );

      if (ticketResult.rows.length === 0) {
        throw new Error('Ticket not found');
      }

      const ticket = ticketResult.rows[0];

      if (!ticket.requester_email) {
        throw new Error('No requester email found');
      }

      const subject = `Re: ${ticket.subject} [#${ticket.ticket_number}]`;
      
      const emailBody = `
${replyBody}

---
${agentName}
${ticket.org_name} Support Team

Ticket #${ticket.ticket_number}
      `.trim();

      await this.sendEmail({
        to: ticket.requester_email,
        subject,
        text: emailBody,
        organizationId: ticket.organization_id,
        ticketId
      });

    } catch (error) {
      console.error('Send ticket reply error:', error);
      throw error;
    }
  }
}

module.exports = new EmailService();