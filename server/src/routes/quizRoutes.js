// server/src/routes/quizRoutes.js - Completely remove authentication

const express = require('express');
const quizController = require('../controllers/quizController');
const router = express.Router();

// Get quiz questions (public) - no authentication needed
router.get('/questions', quizController.getQuizQuestions);

// Create question - no authentication
router.post('/questions', quizController.createQuizQuestion);

module.exports = router;