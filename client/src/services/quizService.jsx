import { api } from './api';

export const quizService = {
  // Get random quiz questions
  async getQuizQuestions(count = 3, difficulty = null, topicId = null) {
    let endpoint = `/quiz/questions?count=${count}`;

    if (difficulty) {
      endpoint += `&difficulty=${difficulty}`;
    }

    if (topicId) {
      endpoint += `&topicId=${topicId}`;
    }

    return api.get(endpoint);
  }
};