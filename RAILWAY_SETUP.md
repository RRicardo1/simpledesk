# 🚂 Railway Deployment Guide for SimpleDesk

## Quick Setup (5 minutes)

### 1. **Create Railway Account**
- Go to [railway.app](https://railway.app)
- Sign up with GitHub (recommended)

### 2. **Create New Project**
- Click "New Project"
- Select "Deploy from GitHub repo"
- Connect your SimpleDesk repository

### 3. **Add PostgreSQL Database**
- In your project dashboard, click "New Service" 
- Select "Database" → "PostgreSQL"
- Railway will automatically create DATABASE_URL

### 4. **Configure Environment Variables**

Copy these variables in Railway's Variables tab:

#### Required Variables:
```env
NODE_ENV=production
JWT_SECRET=573bf14fd604e34a8b5914af26896cd519da8374e0041f4a449a44a77141cd1c
JWT_EXPIRE=7d
```

#### Email Settings (Required for notifications):
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=support@yourdomain.com
FROM_NAME=SimpleDesk Support
```

#### Security Settings:
```env
CORS_ORIGIN=https://your-domain.railway.app
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=15
```

#### Stripe (for billing - use test keys initially):
```env
STRIPE_SECRET_KEY=sk_test_your_test_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

#### Optional (for file uploads):
```env
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=simpledesk-uploads
```

### 5. **Deploy**
- Railway automatically detects Node.js and deploys
- Wait for deployment (usually 2-3 minutes)
- Your API will be available at: `https://your-project.railway.app`

### 6. **Set Up Database**
Once deployed, run database migrations:

1. Go to Railway project dashboard
2. Click on your service → "Connect"
3. Use the provided DATABASE_URL to run:

```sql
-- Copy and paste your database/schema.sql content
-- Then run database/seed.sql for sample data
```

## Frontend Deployment

### Option 1: Vercel (Recommended)
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repo
3. Set build command: `cd frontend && npm run build`
4. Set output directory: `frontend/build`
5. Add environment variable:
   ```
   REACT_APP_API_URL=https://your-backend.railway.app/api
   ```

### Option 2: Netlify
1. Go to [netlify.com](https://netlify.com)
2. Connect GitHub repo
3. Set build command: `cd frontend && npm run build`
4. Set publish directory: `frontend/build`
5. Add environment variable:
   ```
   REACT_APP_API_URL=https://your-backend.railway.app/api
   ```

## Testing Your Deployment

1. **Health Check**: Visit `https://your-backend.railway.app/api/health`
2. **Frontend**: Visit your frontend URL
3. **Create Account**: Test user registration
4. **Create Ticket**: Test core functionality

## Security Checklist for Production

- [ ] Change JWT_SECRET to a secure random string
- [ ] Use production Stripe keys (not test keys)
- [ ] Configure proper CORS_ORIGIN
- [ ] Set up SSL certificates (automatic with Railway/Vercel)
- [ ] Enable rate limiting
- [ ] Set up monitoring and logging

## Estimated Costs

- **Railway**: $5-20/month (backend + database)
- **Vercel/Netlify**: Free tier available
- **Domain**: $10-15/year
- **Email Service**: Free tier available (Gmail)

**Total**: ~$5-25/month to start

## Next Steps After Deployment

1. **Custom Domain**: Connect your domain name
2. **SSL Certificate**: Automatically provided
3. **Monitoring**: Set up error tracking
4. **Backups**: Configure database backups
5. **Analytics**: Add user analytics
6. **Email Templates**: Customize notification emails

## Troubleshooting

### Common Issues:

**Build Fails:**
- Check Node.js version (use 18.x)
- Verify all dependencies are in package.json

**Database Connection:**
- Ensure DATABASE_URL is set
- Check if database service is running

**CORS Errors:**
- Update CORS_ORIGIN to match frontend URL
- Ensure both HTTP and HTTPS are handled

**Email Not Working:**
- Verify SMTP credentials
- Check if "Less secure app access" is enabled (Gmail)
- Use App Passwords for Gmail

## Support

If you encounter issues:
1. Check Railway logs in the dashboard
2. Verify all environment variables are set
3. Test health endpoint first
4. Check database connectivity

Your SimpleDesk app should now be live! 🎉