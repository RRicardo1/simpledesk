# How MySimpleDesk Works - Simple Guide

*The fastest helpdesk setup on the planet - exactly as promised!*

---

## 🚀 Getting Started (5 Minutes Total)

### Step 1: Create Your Organization (1 minute)
1. Go to **http://localhost:3000** (or your domain)
2. Click **"Get Set Up in 5 Minutes"**
3. Fill in your organization details:
   - Organization name
   - Your email address
   - Create password
4. Click **"Create Organization"**

✅ **You're now the admin of your helpdesk!**

### Step 2: Add Your Team (1 minute)
1. Go to **Settings > Users**
2. Click **"Invite Team Member"**
3. Enter their email address
4. Choose their role:
   - **Admin**: Can do everything
   - **Agent**: Can handle tickets and chat
   - **Customer**: Can only submit tickets
5. Click **"Send Invitation"**

✅ **Your team can now help customers!**

### Step 3: Set Up Email (2 minutes)
1. Go to **Settings > Email**
2. Enter your support email (like support@yourbusiness.com)
3. Copy the forwarding address we provide
4. In your email provider, forward support emails to that address
5. Test by sending an email to your support address

✅ **Emails now become tickets automatically!**

### Step 4: Customize & Go Live (1 minute)
1. Go to **Settings > Organization**
2. Upload your logo
3. Set your business hours
4. Add a welcome message
5. Click **"Save Settings"**

✅ **You're officially live and helping customers!**

---

## 💬 How Live Chat Works

### For You (The Business):
1. **Customer visits your website** → Chat widget appears
2. **Customer asks question** → You get notified instantly  
3. **AI tries to help first** → Handles simple questions automatically
4. **You jump in when needed** → For complex questions
5. **Everything becomes a ticket** → Nothing gets lost

### Setting Up Chat Widget:
1. Go to **Chat > Widget Settings**
2. Copy the JavaScript code
3. Paste it before `</body>` tag on your website
4. Customize colors and position
5. Test it on your site

**That's it! Live chat is working.**

---

## 🎫 How Tickets Work

### Tickets Are Created From:
- **Emails** sent to your support address
- **Live chat** conversations  
- **Customer portal** submissions
- **Phone calls** (you create manually)
- **Walk-ins** (you create manually)

### Ticket Lifecycle:
```
New → Assigned → In Progress → Solved → Closed
```

### Managing Tickets:
1. **Dashboard** shows all new tickets
2. **Click a ticket** to open it
3. **Reply to customer** (they get email automatically)
4. **Add internal notes** (customer doesn't see these)
5. **Change status** when resolved
6. **Close ticket** when customer is happy

---

## 🤖 How AI Helps You

### What AI Does Automatically:
- **Answers simple questions** (pricing, hours, policies)
- **Routes tickets** to right person
- **Suggests responses** to help you reply faster
- **Detects urgent issues** and priorities them
- **Escalates to humans** when confused

### What You Control:
- **Turn AI on/off** anytime
- **Train AI** with your knowledge base
- **Set escalation rules** (when AI should get help)
- **Review AI responses** before they go out (optional)

### AI Never:
- Makes decisions about refunds/cancellations
- Accesses sensitive customer data without permission  
- Replaces humans for complex problems

---

## 📚 Knowledge Base Setup

### Why You Need It:
- **Customers find answers faster** (less tickets for you)
- **AI gives better responses** (trained on your content)
- **Looks professional** (shows you care)

### Quick Setup:
1. Go to **Knowledge Base > Articles**
2. Click **"New Article"**
3. Common articles to create:
   - "How to contact us"
   - "Business hours and policies"  
   - "Frequently asked questions"
   - "How to use our product/service"
   - "Billing and payment info"
4. Make articles public
5. Share knowledge base link with customers

---

## 📊 Understanding Your Dashboard

### Key Numbers:
- **Open Tickets**: Need your attention now
- **Response Time**: How fast you reply (customers love speed!)
- **Resolution Time**: How fast you solve problems  
- **Customer Satisfaction**: Happy face ratings

### Daily Workflow:
1. **Check dashboard** first thing in morning
2. **Reply to overnight tickets** 
3. **Monitor live chat** throughout day
4. **Close resolved tickets**
5. **Review satisfaction scores** weekly

---

## 💰 Billing & Plans

### Your Plan Includes:
- **Starter ($29/month)**: Up to 3 agents, 1,000 tickets/month
- **Growth ($59/month)**: Up to 10 agents, 5,000 tickets/month  
- **Business ($99/month)**: Unlimited agents & tickets

### What Counts as a Ticket:
- Each email conversation = 1 ticket
- Each chat conversation = 1 ticket  
- Each phone call you log = 1 ticket

### What's Always Free:
- Knowledge base articles (unlimited)
- Customer portal access
- Basic reporting
- Email notifications

---

## 🔧 Quick Troubleshooting

### "I'm not getting email notifications"
1. Check **Settings > Email Notifications**
2. Verify your email address is correct
3. Check spam/junk folder
4. Test with a sample ticket

### "Live chat isn't showing on my website"  
1. Verify chat widget code is installed correctly
2. Check if chat is enabled in **Chat > Settings**
3. Clear your browser cache
4. Try different browser/device

### "AI is giving wrong answers"
1. Go to **Knowledge Base** and add correct information
2. Review **AI Settings** and adjust confidence levels
3. Turn on **human approval** for AI responses temporarily
4. Contact support if issues persist

### "Tickets aren't being created from emails"
1. Check **Settings > Email** for correct forwarding address
2. Send test email and wait 2-3 minutes
3. Check spam filtering in your email provider
4. Verify domain/DNS settings if using custom domain

---

## 🎯 Pro Tips for Success

### Day 1:
- Set up email forwarding FIRST (most important!)
- Create 3-5 knowledge base articles
- Test everything with a friend/colleague
- Send yourself test tickets and chats

### First Week:
- Add your team members
- Customize colors and branding
- Set up automated responses
- Create ticket templates for common issues

### First Month:
- Review reports and optimize response times
- Train AI with more knowledge base content
- Set up customer satisfaction surveys
- Create workflows for different ticket types

### Ongoing:
- Check dashboard daily
- Reply to tickets within 2 hours (customers expect speed!)
- Update knowledge base monthly
- Review AI performance weekly

---

## 🤖 AI Assistant Troubleshooting

### AI Not Responding?
If the AI chat seems disconnected, here's what to check:

1. **Check Servers Are Running:**
   ```bash
   # Check backend (port 3001)
   curl http://localhost:3001/api/health
   
   # Check frontend (port 3000) 
   curl http://localhost:3000
   ```

2. **Test AI Directly:**
   ```bash
   # Test AI service endpoint
   curl -X POST http://localhost:3001/api/chat/test-ai \
     -H "Content-Type: application/json" \
     -d '{"message": "hello"}'
   ```

3. **Visit AI Test Page:**
   - Go to: **http://localhost:3000/ai-test**
   - Try the quick test buttons
   - AI works **offline** - no internet required!

4. **Restart If Needed:**
   ```bash
   # Backend
   cd backend && npm run dev
   
   # Frontend  
   cd frontend && npm start
   ```

### ✅ AI Status Indicators
- **Working**: Responses appear instantly with confidence scores
- **Demo Mode**: Responses work but show "[Demo Mode]" 
- **Offline**: AI works without internet connection
- **Fallback**: Connects you to human support if AI can't help

### 🔧 Advanced Troubleshooting
- **Multiple servers**: Kill all node processes and restart
- **Port conflicts**: Check ports 3000 and 3001 are available
- **Database**: PostgreSQL must be running for chat history
- **CORS**: Frontend at localhost:3000 can access backend at localhost:3001

**Remember:** The AI is rule-based and works locally - no API keys or internet needed!

---

## 🆘 Getting Help

### Built-in Help:
- **Knowledge Base**: Searchable help articles
- **AI Assistant**: Ask questions in live chat
- **Tooltips**: Hover over ? icons throughout the system

### Human Support:
- **Live Chat**: Click chat widget on any page
- **Email**: support@mysimpledesk.com  
- **Response Time**: Within 2 hours during business hours

### Community:
- **GitHub Issues**: Report bugs and request features
- **User Forum**: Share tips with other users

---

## 🎉 You're Ready to Go!

**Congratulations!** You now have a professional helpdesk system that:
- ✅ Handles emails, chat, and tickets automatically
- ✅ Makes you look bigger than you are
- ✅ Helps customers 24/7 with AI
- ✅ Saves you 50% vs traditional platforms
- ✅ Actually works (no complex configuration!)

**Questions?** Just use the live chat - our AI will help instantly, or connect you with a human if needed.

---

*MySimpleDesk - Skip the complex setup nightmare. Get helping customers in 5 minutes, not 5 weeks.*