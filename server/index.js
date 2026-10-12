const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const seedData = require('./seeds/seedData');
const User = require('./models/User');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'AI Content Creator Marketplace API',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/creators', require('./routes/creatorRoutes'));
app.use('/api/briefs', require('./routes/briefRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/match', require('./routes/matchRoutes'));

// 404 handler for unknown routes
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Centralized error handler
app.use(errorHandler);

// Start server and initialize database
const startServer = async () => {
  try {
    await connectDB();

    // Auto-seed if database is freshly initialized or empty
    const usersCount = await User.countDocuments();
    if (usersCount === 0) {
      console.log('[Server] Database is empty. Auto-seeding initial development data...');
      await seedData();
      console.log('[Server] Auto-seed complete.');
    }

    const server = app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`🚀 AI Creator Marketplace API running on port ${PORT}`);
      console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`====================================================`);
    });

    return server;
  } catch (err) {
    console.error('[Server] Failed to start server:', err);
    process.exit(1);
  }
};

startServer();

module.exports = app;
