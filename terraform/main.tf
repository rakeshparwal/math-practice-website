# DynamoDB Table for Quiz Questions
resource "aws_dynamodb_table" "math_practice_quiz_questions" {
  name         = "math_practice_quiz_questions"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "difficulty"
    type = "S"
  }

  attribute {
    name = "topicId"
    type = "S"
  }

  global_secondary_index {
    name            = "DifficultyIndex"
    hash_key        = "difficulty"
    projection_type = "ALL"
  }

  global_secondary_index {
    name            = "TopicIndex"
    hash_key        = "topicId"
    projection_type = "ALL"
  }

  tags = {
    Name        = "MathPracticeQuizQuestions"
    Environment = var.environment
  }
}