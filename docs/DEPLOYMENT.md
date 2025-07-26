# SimpleDesk Deployment Guide

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 13+
- Redis 6+
- SMTP server (Gmail, SendGrid, etc.)
- Stripe account for billing
- Domain name for production

## Local Development Setup

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

### 2. Database Setup

```bash
# Create PostgreSQL database
createdb simpledesk

# Run migrations
psql -d simpledesk -f ../database/schema.sql
psql -d simpledesk -f ../database/seed.sql
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

## Production Deployment

### Option 1: DigitalOcean App Platform

1. Fork this repository
2. Connect to DigitalOcean App Platform
3. Configure environment variables
4. Deploy automatically

### Option 2: AWS/Heroku

1. Set up PostgreSQL database (RDS/Heroku Postgres)
2. Set up Redis instance (ElastiCache/Heroku Redis)
3. Configure environment variables
4. Deploy backend to Heroku/EC2
5. Deploy frontend to Vercel/Netlify

### Option 3: VPS (Recommended for cost)

```bash
# Server setup (Ubuntu 20.04+)
sudo apt update
sudo apt install nodejs npm postgresql redis-server nginx

# Clone repository
git clone [your-repo-url]
cd simpledesk

# Backend setup
cd backend
npm install --production
pm2 start server.js --name simpledesk-api

# Frontend build
cd ../frontend
npm install
npm run build

# Nginx configuration (see nginx.conf example)
sudo systemctl enable nginx
sudo systemctl start nginx
```

## Environment Variables

### Backend (.env)
```
PORT=3001
NODE_ENV=production
DB_HOST=localhost
DB_PORT=5432
DB_NAME=simpledesk
DB_USER=simpledesk_user
DB_PASSWORD=your_secure_password
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_super_secret_jwt_key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Frontend (.env)
```
REACT_APP_API_URL=https://api.yourdomain.com/api
```

## DNS & SSL Setup

1. Point your domain to your server
2. Use Let's Encrypt for SSL:
```bash
sudo certbot --nginx -d yourdomain.com -d api.yourdomain.com
```

## Monitoring & Backups

1. Set up automated PostgreSQL backups
2. Monitor server resources
3. Set up error tracking (Sentry)
4. Configure log rotation

## Scaling Considerations

- Use load balancer for multiple backend instances
- Implement database read replicas
- Use CDN for frontend assets
- Consider Redis Cluster for high availability

## Security Checklist

- [ ] Change all default passwords
- [ ] Enable firewall (only 22, 80, 443)
- [ ] Regular security updates
- [ ] Enable 2FA for all admin accounts
- [ ] Regular database backups
- [ ] SSL/TLS certificates
- [ ] Rate limiting enabled
- [ ] CORS properly configured