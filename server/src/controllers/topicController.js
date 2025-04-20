const TopicModel = require('../models/topicModel');

// Get all topics
exports.getTopics = async (req, res, next) => {
  try {
    const topics = await TopicModel.getAll();
    res.json(topics);
  } catch (error) {
    next(error);
  }
};

// Get topic by ID
exports.getTopicById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const topic = await TopicModel.getById(id);
    
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }
    
    res.json(topic);
  } catch (error) {
    next(error);
  }
};

// Create new topic (admin only)
exports.createTopic = async (req, res, next) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized: Admin access required' });
    }
    
    const { name, description, difficulty, order } = req.body;
    
    // Validate input
    if (!name) {
      return res.status(400).json({ message: 'Topic name is required' });
    }
    
    // Create topic
    const topic = await TopicModel.create({
      name,
      description,
      difficulty,
      order
    });
    
    res.status(201).json({
      message: 'Topic created successfully',
      topic
    });
  } catch (error) {
    next(error);
  }
};

// Update topic (admin only)
exports.updateTopic = async (req, res, next) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized: Admin access required' });
    }
    
    const { id } = req.params;
    const updateData = req.body;
    
    // Update topic
    const topic = await TopicModel.update(id, updateData);
    
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }
    
    res.json({
      message: 'Topic updated successfully',
      topic
    });
  } catch (error) {
    next(error);
  }
};

// Delete topic (admin only)
exports.deleteTopic = async (req, res, next) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized: Admin access required' });
    }
    
    const { id } = req.params;
    
    // Delete topic
    const topic = await TopicModel.delete(id);
    
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }
    
    res.json({
      message: 'Topic deleted successfully',
      topic
    });
  } catch (error) {
    next(error);
  }
};