const QuizQuestionModel = require('../models/quizQuestionModel');

// Get random quiz questions
exports.getQuizQuestions = async (req, res, next) => {
  try {
    const { count = 3, difficulty, topicId } = req.query;
    
    const questions = await QuizQuestionModel.getRandomQuestions(
      parseInt(count),
      difficulty,
      topicId
    );
    
    res.json(questions);
  } catch (error) {
    next(error);
  }
};

// Admin: Create quiz question
exports.createQuizQuestion = async (req, res, next) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized: Admin access required' });
    }
    
    const { text, answer, solution, difficulty, topicId } = req.body;
    
    // Validate input
    if (!text || !answer) {
      return res.status(400).json({ message: 'Question text and answer are required' });
    }
    
    // Create question
    const question = await QuizQuestionModel.create({
      text,
      answer,
      solution,
      difficulty,
      topicId
    });
    
    res.status(201).json({
      message: 'Quiz question created successfully',
      question
    });
  } catch (error) {
    next(error);
  }
};