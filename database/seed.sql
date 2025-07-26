-- SimpleDesk Database Seed Data
-- Sample data for development and testing

-- Sample Organization
INSERT INTO organizations (id, name, domain, plan, status) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440000',
    'Acme Corp',
    'acme.com',
    'growth',
    'active'
);

-- Sample Users
INSERT INTO users (id, organization_id, email, password_hash, first_name, last_name, role, status) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440000',
    'admin@acme.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password
    'John',
    'Admin',
    'admin',
    'active'
),
(
    '550e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440000',
    'agent@acme.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password
    'Sarah',
    'Smith',
    'agent',
    'active'
),
(
    '550e8400-e29b-41d4-a716-446655440003',
    '550e8400-e29b-41d4-a716-446655440000',
    'customer@example.com',
    NULL,
    'Mike',
    'Johnson',
    'customer',
    'active'
);

-- Sample Tickets
INSERT INTO tickets (id, organization_id, subject, description, status, priority, source, requester_id, assignee_id, tags) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440010',
    '550e8400-e29b-41d4-a716-446655440000',
    'Login issues with mobile app',
    'I cannot login to the mobile app. The password field seems to be not working properly.',
    'open',
    'high',
    'email',
    '550e8400-e29b-41d4-a716-446655440003',
    '550e8400-e29b-41d4-a716-446655440002',
    ARRAY['mobile', 'login', 'bug']
),
(
    '550e8400-e29b-41d4-a716-446655440011',
    '550e8400-e29b-41d4-a716-446655440000',
    'Feature request: Dark mode',
    'It would be great to have a dark mode option for the dashboard.',
    'open',
    'normal',
    'web',
    '550e8400-e29b-41d4-a716-446655440003',
    '550e8400-e29b-41d4-a716-446655440002',
    ARRAY['feature-request', 'ui']
),
(
    '550e8400-e29b-41d4-a716-446655440012',
    '550e8400-e29b-41d4-a716-446655440000',
    'Billing question about upgrade',
    'I want to upgrade to the business plan. What are the differences?',
    'solved',
    'normal',
    'chat',
    '550e8400-e29b-41d4-a716-446655440003',
    '550e8400-e29b-41d4-a716-446655440001',
    ARRAY['billing', 'upgrade']
);

-- Sample Ticket Comments
INSERT INTO ticket_comments (ticket_id, user_id, author_name, author_email, body, is_public) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440010',
    '550e8400-e29b-41d4-a716-446655440003',
    'Mike Johnson',
    'customer@example.com',
    'I cannot login to the mobile app. The password field seems to be not working properly.',
    true
),
(
    '550e8400-e29b-41d4-a716-446655440010',
    '550e8400-e29b-41d4-a716-446655440002',
    'Sarah Smith',
    'agent@acme.com',
    'Hi Mike, thank you for reporting this issue. I''ll investigate the mobile app login problem and get back to you within 24 hours.',
    true
),
(
    '550e8400-e29b-41d4-a716-446655440011',
    '550e8400-e29b-41d4-a716-446655440003',
    'Mike Johnson',
    'customer@example.com',
    'It would be great to have a dark mode option for the dashboard.',
    true
),
(
    '550e8400-e29b-41d4-a716-446655440012',
    '550e8400-e29b-41d4-a716-446655440001',
    'John Admin',
    'admin@acme.com',
    'The business plan includes unlimited users, advanced reporting, API access, and priority support. The upgrade would be $40/month additional. Would you like me to process the upgrade?',
    true
);

-- Sample Knowledge Base Articles
INSERT INTO kb_articles (organization_id, title, slug, body, html_body, author_id, category, tags, status, published_at) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440000',
    'How to reset your password',
    'how-to-reset-password',
    'To reset your password: 1. Go to the login page 2. Click "Forgot Password" 3. Enter your email 4. Check your email for reset link 5. Create a new password',
    '<p>To reset your password:</p><ol><li>Go to the login page</li><li>Click "Forgot Password"</li><li>Enter your email</li><li>Check your email for reset link</li><li>Create a new password</li></ol>',
    '550e8400-e29b-41d4-a716-446655440001',
    'Getting Started',
    ARRAY['password', 'login', 'account'],
    'published',
    NOW()
),
(
    '550e8400-e29b-41d4-a716-446655440000',
    'Billing and subscription FAQ',
    'billing-faq',
    'Common questions about billing, upgrades, and subscription management.',
    '<h2>Billing FAQ</h2><p>Common questions about billing, upgrades, and subscription management.</p>',
    '550e8400-e29b-41d4-a716-446655440001',
    'Billing',
    ARRAY['billing', 'subscription', 'faq'],
    'published',
    NOW()
);

-- Sample Automation Rules
INSERT INTO automation_rules (organization_id, name, description, trigger_conditions, actions, is_active, created_by) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440000',
    'Auto-assign high priority tickets',
    'Automatically assign high priority tickets to senior agents',
    '{"conditions": [{"field": "priority", "operator": "equals", "value": "high"}]}',
    '{"actions": [{"type": "assign", "value": "550e8400-e29b-41d4-a716-446655440001"}]}',
    true,
    '550e8400-e29b-41d4-a716-446655440001'
),
(
    '550e8400-e29b-41d4-a716-446655440000',
    'Send welcome email to new customers',
    'Send a welcome email when a customer creates their first ticket',
    '{"conditions": [{"field": "requester_tickets_count", "operator": "equals", "value": 1}]}',
    '{"actions": [{"type": "email", "template": "welcome_customer"}]}',
    true,
    '550e8400-e29b-41d4-a716-446655440001'
);

-- Sample SLA Policies
INSERT INTO sla_policies (organization_id, name, description, conditions, first_response_time, resolution_time, is_active) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440000',
    'Standard SLA',
    'Default service level agreement for all tickets',
    '{"conditions": []}',
    240, -- 4 hours
    2880, -- 48 hours
    true
),
(
    '550e8400-e29b-41d4-a716-446655440000',
    'High Priority SLA',
    'Faster response times for high priority tickets',
    '{"conditions": [{"field": "priority", "operator": "equals", "value": "high"}]}',
    60, -- 1 hour
    480, -- 8 hours
    true
);

-- Sample Activity Logs
INSERT INTO activity_logs (organization_id, ticket_id, user_id, action, details) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440010',
    '550e8400-e29b-41d4-a716-446655440002',
    'ticket_assigned',
    '{"assigned_to": "Sarah Smith", "assigned_by": "System"}'
),
(
    '550e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440012',
    '550e8400-e29b-41d4-a716-446655440001',
    'ticket_solved',
    '{"solved_by": "John Admin"}'
);