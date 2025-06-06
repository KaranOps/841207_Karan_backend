require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const chapterRoutes = require('./src/routes/chapterRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const errorHandler = require('./src/middleware/errorHandler');
const rateLimiter = require('./src/middleware/rateLimiter');
const {dbconnect} = require('./src/config/db.config')

const app = express();

// Middleware to parse JSON
app.use(express.json());
app.use(rateLimiter);

// Connect to MongoDB
dbconnect();

// Routes
app.use('/api/v1/chapters', chapterRoutes);
app.use('/api/v1/admin', adminRoutes);

// Error handling middleware 
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});