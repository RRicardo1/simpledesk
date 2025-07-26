# Getting Started with SimpleDesk

## Quick Start (5 minutes)

### 1. Clone and Install
```bash
git clone [repository-url]
cd simpledesk

# Backend
cd backend
npm install
cp .env.example .env

# Frontend  
cd ../frontend
npm install
```

### 2. Database Setup
```bash
# Create PostgreSQL database
createdb simpledesk

# Run migrations
cd database
psql -d simpledesk -f schema.sql
psql -d simpledesk -f seed.sql
```

### 3. Configure Environment
Edit `backend/.env`:
- Set database credentials
- Add SMTP settings for email
- Add JWT secret key

### 4. Start Development
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm start
```

Visit http://localhost:3000 and create your organization!

## Core Features Overview

### ✅ What's Built (Phase 1)

1. **User Management**
   - Organization signup/login
   - Team member management
   - Role-based permissions (admin/agent)

2. **Ticket System**
   - Create, update, assign tickets
   - Comment system
   - Status and priority management
   - Email integration

3. **Dashboard**
   - Key metrics and statistics
   - Recent tickets overview
   - Quick actions

4. **Email Processing**
   - Parse incoming emails into tickets
   - Send automated replies
   - Ticket threading by email

5. **Billing Integration**
   - Stripe subscription management
   - Webhook handling
   - Plan management

### 🚧 What's Next (Phase 2)

1. **Live Chat Widget**
   - Embeddable JavaScript widget
   - Real-time messaging
   - Agent assignment

2. **Knowledge Base**
   - Article creation and management
   - Public customer portal
   - Search functionality

3. **Advanced Features**
   - Automation rules
   - SLA management
   - Reporting dashboard
   - API access

## Business Model

### Pricing Strategy
- **Starter**: $29/month - Up to 1,000 tickets
- **Growth**: $59/month - Up to 5,000 tickets + phone support
- **Business**: $99/month - Unlimited + advanced features

### Revenue Goals
- Month 1-2: $1,000/month (35 customers)
- Month 3-4: $5,000/month (85 customers)
- Month 5-6: $10,000/month (150 customers)
- Month 7-8: $14,000/month (200+ customers)

### Target Market
- Small service businesses (lawyers, accountants, consultants)
- Local businesses with customer service needs
- Startups currently using email for support
- Companies frustrated with Zendesk's complexity and pricing

## Customer Acquisition Strategy

### 1. SEO Content Marketing
- "Zendesk alternatives" targeting
- Industry-specific content
- Feature comparison pages
- Integration guides

### 2. Direct Sales
- Cold outreach to businesses using email support
- Referral program for existing customers
- Partner with business consultants and agencies

### 3. Free Trial Conversion
- 14-day free trial with full features
- Onboarding sequence and success tracking
- Proactive support during trial period

## Competitive Advantages

1. **50% Lower Cost**: Flat pricing vs per-agent pricing
2. **Faster Setup**: 5-minute setup vs hours of configuration  
3. **Small Business Focus**: No enterprise bloat
4. **Better Support**: Built by a small team who cares
5. **Modern Tech**: React/Node.js vs legacy systems

## Next Steps

1. **Complete Phase 1**: Finish any remaining core features
2. **Beta Testing**: Get 10-20 beta customers for feedback
3. **Marketing Launch**: Create content and start outreach
4. **Iterate**: Based on customer feedback
5. **Scale**: Hire support and sales team

## Support & Community

- Documentation: `/docs`
- Issues: GitHub Issues
- Feature Requests: GitHub Discussions
- Email: support@simpledesk.com

## Contributing

See `CONTRIBUTING.md` for development guidelines and how to contribute to the project.

---

**SimpleDesk - Making customer support simple and affordable for small businesses.**