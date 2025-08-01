const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { initializeDatabase } = require('./config/init-db');

dotenv.config();

// Configure CORS to handle multiple origins
const corsOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : ["http://localhost:3000"];

console.log('🔧 CORS Origins configured:', corsOrigins);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: corsOrigins,
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: function (origin, callback) {
    console.log('🌐 CORS Origin request:', origin);
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (corsOrigins.indexOf(origin) !== -1) {
      console.log('✅ CORS Origin allowed:', origin);
      callback(null, true);
    } else {
      console.log('❌ CORS Origin blocked:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
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
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

server.listen(PORT, async () => {
  console.log(`SimpleDesk server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  
  // Initialize database tables
  await initializeDatabase();
});