# SimpleDesk - Quick Start Guide

## What is SimpleDesk?

SimpleDesk is a complete help desk system that provides the same features as Zendesk but costs 50% less and takes only 5 minutes to set up. It's designed specifically for small to medium teams (1-15 people) who need professional customer support tools without the complexity and high costs of enterprise solutions.

## Key Features

- **Ticket Management** - Handle customer support requests with full conversation tracking
- **Live Chat** - Real-time messaging with customers
- **Knowledge Base** - Create and manage help articles for customers
- **Team Management** - Invite team members and manage roles (Admin/Agent)
- **Dashboard** - View statistics and monitor team performance
- **Settings** - Configure your organization and user preferences

## How It Works

### 1. Customer Support Flow
1. Customers create tickets or start live chats
2. Tickets are automatically assigned to available agents
3. Agents respond and update ticket status through the workflow:
   - **Open** → **Pending** → **Solved** → **Closed**
4. All conversations are tracked and searchable

### 2. Team Collaboration
- **Admins** can invite team members, manage settings, and access all features
- **Agents** can handle tickets, chat with customers, and create knowledge base articles
- Real-time updates keep everyone synchronized

### 3. Knowledge Base
- Create helpful articles organized by categories
- Articles can be public (visible to customers) or private (internal use)
- Track article views and performance

## Getting Started

### Quick Setup (5 minutes)
1. **Start the Backend**: `cd backend && npm install && npm start`
2. **Start the Frontend**: `cd frontend && npm install && npm start`
3. **Setup Database**: Run the SQL files in the `database/` folder
4. **Access the App**: Open http://localhost:3000 in your browser
5. **Create Account**: Register as an admin and start using the system

### First Steps
1. **Register** your organization and create an admin account
2. **Invite team members** through User Management
3. **Configure settings** with your company information
4. **Create knowledge base articles** for common questions
5. **Start handling tickets** and live chats

## System Requirements

- **Backend**: Node.js 16+, PostgreSQL 12+
- **Frontend**: Modern web browser
- **Optional**: Redis for caching, AWS S3 for file storage

## Pricing

- **Flat monthly fee** (no per-agent charges)
- **50% less than Zendesk** ($29/month vs $57/month for 3 agents)
- **No setup fees** or complex configuration required

## Support

All documentation and setup guides are included in the `docs/` folder. The system is designed to be self-explanatory with intuitive navigation and professional UI.

---

**SimpleDesk - Professional help desk made simple.**