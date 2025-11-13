const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { initializeDatabase } = require('./config/init-db');

dotenv.config();

// Configure CORS to handle multiple origins
const corsOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : ["http://localhost:3000"];

// Fallback: Add required domains if not present
const requiredOrigins = [
  "https://simpledesk-ib3s.vercel.app",
  "https://mysimpledesk.com", 
  "https://www.mysimpledesk.com"
];

const allOrigins = [...new Set([...corsOrigins, ...requiredOrigins])];

console.log('🔧 CORS Origins from env:', corsOrigins);
console.log('🔧 All CORS Origins configured:', allOrigins);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: allOrigins,
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3001;

// Rate limiting configuration
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    error: 'Too many authentication attempts, please try again later',
    retryAfter: Math.ceil(15 * 60) // seconds
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting in development for localhost
    return process.env.NODE_ENV === 'development' && 
           (req.ip === '::1' || req.ip === '127.0.0.1' || req.ip === '::ffff:127.0.0.1');
  }
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests, please try again later',
    retryAfter: Math.ceil(15 * 60)
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    return process.env.NODE_ENV === 'development' && 
           (req.ip === '::1' || req.ip === '127.0.0.1' || req.ip === '::ffff:127.0.0.1');
  }
});

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "wss:", "ws:"],
    },
  },
  hsts: process.env.NODE_ENV === 'production' ? {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  } : false
}));
app.use(cors({
  origin: function (origin, callback) {
    // Only log in development mode
    if (process.env.NODE_ENV === 'development') {
      console.log('🌐 CORS Origin request:', origin);
    }
    
    // Allow requests with no origin only in development
    if (!origin && process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    
    if (!origin) {
      return callback(new Error('Origin required'));
    }
    
    if (allOrigins.indexOf(origin) !== -1) {
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ CORS Origin allowed:', origin);
      }
      callback(null, true);
    } else {
      if (process.env.NODE_ENV === 'development') {
        console.log('❌ CORS Origin blocked:', origin);
      }
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Apply rate limiting
app.use('/api', generalLimiter);
app.use('/api/auth', authLimiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tickets', require('./routes/tickets'));
app.use('/api/users', require('./routes/users'));
app.use('/api/organizations', require('./routes/organizations'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/kb', require('./routes/knowledge-base'));
app.use('/api/automation', require('./routes/automation'));
app.use('/api/billing', require('./routes/billing'));
app.use('/api/trial', require('./routes/trial'));
app.use('/api/customer-portal', require('./routes/customer-portal'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Home route to show the backend is working
app.get('/', (req, res) => {
  res.json({
    message: 'SimpleDesk Backend API is running!',
    status: 'success',
    endpoints: [
      'GET /api/health - Health check',
      'POST /api/auth/register - Register user',
      'POST /api/auth/login - Login user',
      'GET /api/tickets - Get tickets',
      'POST /api/tickets - Create ticket'
    ],
    timestamp: new Date().toISOString()
  });
});

// Socket.io for real-time features
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join organization room for real-time updates
  socket.on('join_organization', (organizationId) => {
    socket.join(`org_${organizationId}`);
  });

  // Chat functionality
  socket.on('join_chat', (sessionId) => {
    socket.join(`chat_${sessionId}`);
  });

  socket.on('send_message', (data) => {
    socket.to(`chat_${data.sessionId}`).emit('new_message', data);
  });

  // Ticket updates
  socket.on('ticket_update', (data) => {
    socket.to(`org_${data.organizationId}`).emit('ticket_updated', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  // Log error for debugging (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', err.message);
  } else {
    // In production, log without exposing stack trace
    console.error('Error occurred:', new Date().toISOString());
  }
  
  res.status(500).json({
    error: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { message: err.message })
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

server.listen(PORT, async () => {
  console.log(`SimpleDesk server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`Stripe Secret Key loaded: ${!!process.env.STRIPE_SECRET_KEY}`);
    console.log('🔗 Health check: http://localhost:' + PORT + '/api/health');
    console.log('🤖 AI Test: http://localhost:3000/ai-test');
  }
  
  // Initialize database tables
  await initializeDatabase();
  
  console.log('🎉 SimpleDesk backend server is ready and running!');
});