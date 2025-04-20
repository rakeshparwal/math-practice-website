// server/src/controllers/answerController.js

const AnswerModel = require('../models/answerModel');
const SessionModel = require('../models/sessionModel');

// Submit an answer
exports.submitAnswer = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { sessionId, problemId, userAnswer, isCorrect, timeSpent } = req.body;
    
    // Validate input
    if (!sessionId || !problemId || !userAnswer) {
      return res.status(400).json({ message: 'Session ID, problem ID, and user answer are required' });
    }
    
    // Check if session exists and belongs to user
    const session = await SessionModel.getById(sessionId);
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    if (session.userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized: Access denied' });
    }
    
    // Check if user has already answered this problem in this session
    const existingAnswers = await AnswerModel.getByUserAndProblem(userId, problemId);
    const existingSessionAnswer = existingAnswers.find(a => a.sessionId === sessionId);
    
    let answer;
    
    if (existingSessionAnswer) {
      // Update existing answer
      answer = await AnswerModel.update(existingSessionAnswer.id, {
        userAnswer,
        isCorrect,
        timeSpent: (existingSessionAnswer.timeSpent || 0) + (timeSpent || 0)
      });
    } else {
      // Create new answer
      answer = await AnswerModel.create({
        sessionId,
        problemId,
        userId,
        userAnswer,
        isCorrect,
        timeSpent
      });
    }
    
    // Update session stats
    const sessionAnswers = await AnswerModel.getBySession(sessionId);
    const correctAnswers = sessionAnswers.filter(a => a.isCorrect).length;
    
    await SessionModel.updateStats(sessionId, correctAnswers, sessionAnswers.length);
    
    res.status(201).json({
      message: 'Answer submitted successfully',
      answer
    });
  } catch (error) {
    next(error);
  }
};

// Get answers by session
exports.getAnswersBySession = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { sessionId } = req.params;
    
    // Check if session exists and belongs to user
    const session = await SessionModel.getById(sessionId);
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    if (session.userId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized: Access denied' });
    }
    
    const answers = await AnswerModel.getBySession(sessionId);
    
    res.json(answers);
  } catch (error) {
    next(error);
  }
};

// Get all answers for a user (admin only)
exports.getUserAnswers = async (req, res, next) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized: Admin access required' });
    }
    
    const { userId } = req.params;
    
    // This would need a custom query or scan operation
    // For simplicity, we'll return an empty array
    
    res.json([]);
  } catch (error) {
    next(error);
  }
};
