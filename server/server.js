require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose'); // Added for connection check
const connectDB = require('./src/config/db');
const errorHandler = require('./src/middleware/errorHandler');

// Route imports
const authRoutes = require('./src/routes/auth.routes');
const schoolRoutes = require('./src/routes/school.routes');
const studentRoutes = require('./src/routes/student.routes');
const staffRoutes = require('./src/routes/staff.routes');
const classRoutes = require('./src/routes/class.routes');
const subjectRoutes = require('./src/routes/subject.routes');
const timetableRoutes = require('./src/routes/timetable.routes');
const attendanceRoutes = require('./src/routes/attendance.routes');
const examRoutes = require('./src/routes/exam.routes');
const resultRoutes = require('./src/routes/result.routes');
const feeRoutes = require('./src/routes/fee.routes');
const salaryRoutes = require('./src/routes/salary.routes');
const libraryRoutes = require('./src/routes/library.routes');
const transportRoutes = require('./src/routes/transport.routes');
const notificationRoutes = require('./src/routes/notification.routes');
const chatRoutes = require('./src/routes/chat.routes');
const dashboardRoutes = require('./src/routes/dashboard.routes');

const app = express();

// Middleware
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const statusMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  res.json({
    status: dbStatus === 1 ? 'ok' : 'limited',
    database: statusMap[dbStatus] || 'unknown',
    timestamp: new Date().toISOString()
  });
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/schools', schoolRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/salary', salaryRoutes);
app.use('/api/library', libraryRoutes);
app.use('/api/transport', transportRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Serve Static Assets in Production
const path = require('path');
// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/dist')));

// The "catchall" handler: for any request that doesn't match an API route,
// send back the React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
  } catch (err) {
    console.error('⚠️ Database connection failed, starting server in limited mode:', err.message);
  }

  app.listen(PORT, () => {
    console.log(`🚀 EduSync server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV}`);
    if (mongoose.connection.readyState !== 1) {
      console.log('⚠️ Server running without Database connection (Landing Page Only)');
    }
  });
};

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

module.exports = app;
