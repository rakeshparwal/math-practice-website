const { dynamoDB, TABLES, executeDbOperation } = require('../config/dynamoConfig');
const { v4: uuidv4 } = require('uuid');

class TopicModel {
  // Create a new topic
  static async create(topicData) {
    const topicId = uuidv4();
    const timestamp = new Date().toISOString();
    
    const params = {
      TableName: TABLES.TOPICS,
      Item: {
        id: topicId,
        name: topicData.name,
        description: topicData.description || '',
        difficulty: topicData.difficulty || 'intermediate',
        order: topicData.order || 0,
        problemCount: 0, // Will be updated when problems are added
        createdAt: timestamp,
        updatedAt: timestamp
      }
    };
    
    await executeDbOperation('put', params);
    return { id: topicId, ...topicData };
  }
  
  // Get topic by ID
  static async getById(topicId) {
    const params = {
      TableName: TABLES.TOPICS,
      Key: {
        id: topicId
      }
    };
    
    const result = await executeDbOperation('get', params);
    return result.Item;
  }
  
  // Get all topics
  static async getAll() {
    const params = {
      TableName: TABLES.TOPICS,
      // For better performance, consider using a global secondary index
      // on 'order' if you want topics ordered in a specific way
    };
    
    const result = await executeDbOperation('scan', params);
    return result.Items.sort((a, b) => a.order - b.order);
  }
  
  // Update topic
  static async update(topicId, updateData) {
    const timestamp = new Date().toISOString();
    
    // Build update expression
    let updateExpression = 'SET updatedAt = :updatedAt';
    const expressionAttributeValues = {
      ':updatedAt': timestamp
    };
    const expressionAttributeNames = {};
    
    // Add fields to update
    Object.entries(updateData).forEach(([key, value]) => {
      if (key !== 'id') {
        updateExpression += `, #${key} = :${key}`;
        expressionAttributeValues[`:${key}`] = value;
        expressionAttributeNames[`#${key}`] = key;
      }
    });
    
    const params = {
      TableName: TABLES.TOPICS,
      Key: {
        id: topicId
      },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      ExpressionAttributeNames: expressionAttributeNames,
      ReturnValues: 'ALL_NEW'
    };
    
    const result = await executeDbOperation('update', params);
    return result.Attributes;
  }
  
  // Increment problem count for a topic
  static async incrementProblemCount(topicId) {
    const params = {
      TableName: TABLES.TOPICS,
      Key: {
        id: topicId
      },
      UpdateExpression: 'SET problemCount = problemCount + :inc, updatedAt = :timestamp',
      ExpressionAttributeValues: {
        ':inc': 1,
        ':timestamp': new Date().toISOString()
      },
      ReturnValues: 'ALL_NEW'
    };
    
    const result = await executeDbOperation('update', params);
    return result.Attributes;
  }
  
  // Delete topic
  static async delete(topicId) {
    const params = {
      TableName: TABLES.TOPICS,
      Key: {
        id: topicId
      },
      ReturnValues: 'ALL_OLD'
    };
    
    const result = await executeDbOperation('delete', params);
    return result.Attributes;
  }
}

module.exports = TopicModel;