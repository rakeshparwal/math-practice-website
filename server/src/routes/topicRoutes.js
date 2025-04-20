// server/src/routes/topicRoutes.js - Completely remove authentication

const express = require('express');
const topicController = require('../controllers/topicController');
const router = express.Router();

// Get all topics (public)
router.get('/', topicController.getTopics);

// Get topic by ID (public)
router.get('/:id', topicController.getTopicById);

// Admin routes - no authentication
router.post('/', topicController.createTopic);
router.put('/:id', topicController.updateTopic);
router.delete('/:id', topicController.deleteTopic);

module.exports = router;