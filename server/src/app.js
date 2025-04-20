// server/src/app.js

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const quizRoutes = require('./routes/quizRoutes');
const topicRoutes = require('./routes/topicRoutes');

// Initialize app
const app = express();

// Apply middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan('dev')); // HTTP request logger
app.use(express.json()); // Parse JSON body

// API routes
app.use('/api/topics', topicRoutes);
app.use('/api/quiz', quizRoutes);


// Root route
app.get('/', (req, res) => {
    res.json({ message: 'Math Practice API is running' });
});


// Not found middleware
app.use((req, res) => {
    res.status(404).json({ error: 'Resource not found' });
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;