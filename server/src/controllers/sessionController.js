const SessionModel = require('../models/sessionModel');
const TopicModel = require('../models/topicModel');

// Create new practice session
exports.createSession = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { topicId } = req.body;
    
    // Validate input
    if (!topicId) {
      return res.status(400).json({ message: 'Topic ID is required' });
    }
    
    // Check if topic exists
    const topic = await TopicModel.getById(topicId);
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }
    
    // Create session
    const session = await SessionModel.create({
      userId,
      topicId
    });
    
    res.status(201).json({
      message: 'Practice session created successfully',
      id: session.id,
      topicId: session.topicId,
      startTime: session.startTime
    });
  } catch (error) {
    next(error);
  }
};

// Get session by ID
exports.getSessionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const session = await SessionModel.getById(id);
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    // Check if user has access to this session
    if (session.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized: Access denied' });
    }
    
    // Get topic information
    const topic = await TopicModel.getById(session.topicId);
    
    res.json({
      ...session,
      topicName: topic ? topic.name : null
    });
  } catch (error) {
    next(error);
  }
};

// Get user's recent sessions
exports.getUserSessions = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { limit = 10 } = req.query;
    
    const sessions = await SessionModel.getByUser(userId, parseInt(limit));
    
    // Get topic information for each session
    const sessionsWithTopics = await Promise.all(
      sessions.map(async (session) => {
        const topic = await TopicModel.getById(session.topicId);
        return {
          ...session,
          topicName: topic ? topic.name : null
        };
      })
    );
    
    res.json(sessionsWithTopics);
  } catch (error) {
    next(error);
  }
};

// Get user's sessions by topic
exports.getUserSessionsByTopic = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { topicId } = req.params;
    
    const sessions = await SessionModel.getByTopicAndUser(topicId, userId);
    
    res.json(sessions);
  } catch (error) {
    next(error);
  }
};

// Update session (complete or abandon)
exports.updateSession = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Validate input
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }
    
    if (!['active', 'completed', 'abandoned'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be active, completed, or abandoned' });
    }
    
    // Get current session
    const currentSession = await SessionModel.getById(id);
    
    if (!currentSession) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    // Check if user has access to this session
    if (currentSession.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized: Access denied' });
    }
    
    // Update session
    const session = await SessionModel.update(id, { status });
    
    res.json({
      message: `Session ${status === 'completed' ? 'completed' : status === 'abandoned' ? 'abandoned' : 'updated'} successfully`,
      session
    });
  } catch (error) {
    next(error);
  }
};