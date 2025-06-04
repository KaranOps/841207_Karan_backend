require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const chapterRoutes = require('./src/routes/chapterRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB Connected!'))
  .catch((err) => console.error('MongoDB connection error:', err));

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