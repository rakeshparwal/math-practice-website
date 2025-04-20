// server/src/config/dynamoConfig.js - Updated for AWS SDK v3 with explicit credentials

// Import the required AWS SDK v3 modules
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand, GetCommand, PutCommand, UpdateCommand, DeleteCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb');

// Configure AWS SDK client with explicit credentials
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  },
  // Set timeouts to prevent hanging operations
  requestTimeout: 5000,  // 5-second timeout for operations
  connectTimeout: 3000,  // 3-second connection timeout
  maxAttempts: 3         // Retry failed requests 3 times
});

// Create Document Client with enhanced capabilities
const dynamoDB = DynamoDBDocumentClient.from(client, {
  marshallOptions: {
    convertEmptyValues: true,  // Convert empty strings to null
    removeUndefinedValues: true,
    convertClassInstanceToMap: true
  }
});

// Table names
const TABLES = {
  USERS: 'math_practice_users',
  PROBLEMS: 'math_practice_problems',
  TOPICS: 'math_practice_topics',
  SESSIONS: 'math_practice_sessions',
  ANSWERS: 'math_practice_answers',
  QUIZ_QUESTIONS: 'math_practice_quiz_questions',
};

// Helper function to execute DynamoDB operations with v3 SDK
const executeDbOperation = async (operation, params) => {
  try {
    console.log(`Executing DynamoDB ${operation} operation:`, params);

    let command;
    switch (operation) {
      case 'get':
        command = new GetCommand(params);
        break;
      case 'put':
        command = new PutCommand(params);
        break;
      case 'update':
        command = new UpdateCommand(params);
        break;
      case 'delete':
        command = new DeleteCommand(params);
        break;
      case 'query':
        command = new QueryCommand(params);
        break;
      case 'scan':
        command = new ScanCommand(params);
        break;
      default:
        throw new Error(`Unsupported operation: ${operation}`);
    }

    const result = await dynamoDB.send(command);
    return result;
  } catch (error) {
    console.error(`DynamoDB operation '${operation}' failed:`, error);
    throw error;
  }
};

// Helper function specifically for paginated operations (scan, query)
const executePaginatedOperation = async (operation, params, itemLimit = null) => {
  const allItems = [];
  let lastEvaluatedKey = null;
  let totalScannedCount = 0;

  do {
    // Add the ExclusiveStartKey if we have a LastEvaluatedKey from a previous operation
    if (lastEvaluatedKey) {
      params.ExclusiveStartKey = lastEvaluatedKey;
    }

    try {
      console.log(`Executing paginated DynamoDB ${operation} operation:`, params);

      let command;
      switch (operation) {
        case 'query':
          command = new QueryCommand(params);
          break;
        case 'scan':
          command = new ScanCommand(params);
          break;
        default:
          throw new Error(`Unsupported paginated operation: ${operation}`);
      }

      const result = await dynamoDB.send(command);

      // Add the items from this page to our collection
      if (result.Items && result.Items.length > 0) {
        allItems.push(...result.Items);
      }

      // Track total scanned count
      if (result.ScannedCount) {
        totalScannedCount += result.ScannedCount;
      }

      // Get the key for the next page
      lastEvaluatedKey = result.LastEvaluatedKey;

      // If we've hit the requested item limit, stop paginating
      if (itemLimit && allItems.length >= itemLimit) {
        break;
      }
    } catch (error) {
      console.error(`DynamoDB paginated operation '${operation}' failed:`, error);
      throw error;
    }
  } while (lastEvaluatedKey); // Continue until we've processed all pages

  return {
    Items: itemLimit ? allItems.slice(0, itemLimit) : allItems,
    Count: allItems.length,
    ScannedCount: totalScannedCount
  };
};

module.exports = {
  dynamoDB,
  TABLES,
  executeDbOperation,
  executePaginatedOperation
};