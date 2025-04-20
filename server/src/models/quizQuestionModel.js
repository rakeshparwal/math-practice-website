// server/src/models/quizQuestionModel.js - Updated for AWS SDK v3 with pagination

const { dynamoDB, TABLES, executeDbOperation, executePaginatedOperation } = require('../config/dynamoConfig');
const { v4: uuidv4 } = require('uuid');

class QuizQuestionModel {
  // Create a new quiz question
  static async create(questionData) {
    const questionId = uuidv4();
    const timestamp = new Date().toISOString();

    const params = {
      TableName: TABLES.QUIZ_QUESTIONS,
      Item: {
        id: questionId,
        text: questionData.text,
        answer: questionData.answer,
        solution: questionData.solution,
        difficulty: questionData.difficulty || 'medium',
        topicId: questionData.topicId || 'general',
        createdAt: timestamp,
        updatedAt: timestamp
      }
    };

    await executeDbOperation('put', params);
    return { id: questionId, ...questionData };
  }

  // Get question by ID
  static async getById(questionId) {
    const params = {
      TableName: TABLES.QUIZ_QUESTIONS,
      Key: {
        id: questionId
      }
    };

    const result = await executeDbOperation('get', params);
    return result.Item;
  }

  // Get random questions (for quiz) - using pagination for better performance
  static async getRandomQuestions(count = 3, difficulty = null, topicId = null) {
    let params = {
      TableName: TABLES.QUIZ_QUESTIONS,
      Limit: 50 // Process in smaller chunks for better performance
    };

    // Add filters if provided
    if (difficulty || topicId) {
      let filterExpression = '';
      const expressionAttributeValues = {};

      if (difficulty) {
        filterExpression = 'difficulty = :difficulty';
        expressionAttributeValues[':difficulty'] = difficulty;
      }

      if (topicId) {
        if (filterExpression) filterExpression += ' AND ';
        filterExpression += 'topicId = :topicId';
        expressionAttributeValues[':topicId'] = topicId;
      }

      params.FilterExpression = filterExpression;
      params.ExpressionAttributeValues = expressionAttributeValues;
    }

    // Use the paginated operation helper - get enough items for randomization
    // We'll fetch at least 3 times the required count to ensure good randomization
    const result = await executePaginatedOperation('scan', params, count * 3);

    // Randomize and limit to requested count
    const randomizedQuestions = result.Items.sort(() => 0.5 - Math.random()).slice(0, count);

    return randomizedQuestions;
  }
}

module.exports = QuizQuestionModel;