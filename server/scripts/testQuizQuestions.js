// server/scripts/testQuizQuestions.js
const AWS = require('aws-sdk');
require('dotenv').config();

// Configure AWS
AWS.config.update({
  region: process.env.AWS_REGION || 'us-east-1'
});

const docClient = new AWS.DynamoDB.DocumentClient();

const getQuizQuestions = async () => {
  const params = {
    TableName: 'math_practice_quiz_questions'
  };
  
  try {
    const data = await docClient.scan(params).promise();
    console.log('Questions retrieved successfully:');
    console.log(JSON.stringify(data.Items, null, 2));
    return data.Items;
  } catch (err) {
    console.error('Error retrieving questions:', err);
    throw err;
  }
};

getQuizQuestions().then(() => {
  console.log('Test completed!');
}).catch(err => {
  console.error('Test failed:', err);
});