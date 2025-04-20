import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import '../styles/Topics.css';

const Topics = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setLoading(true);
        // Comment out the API call for now
        // const data = await api.get('/topics');
        // setTopics(data);
        
        // Use mock data instead
        const mockTopics = [
          {
            id: 'algebra',
            name: 'Algebra',
            description: 'Practice solving equations, working with expressions, and understanding functions.',
            problemCount: 50,
            difficulty: 'Intermediate'
          },
          {
            id: 'calculus',
            name: 'Calculus',
            description: 'Master derivatives, integrals, and limits with interactive problems.',
            problemCount: 35,
            difficulty: 'Advanced'
          },
          {
            id: 'geometry',
            name: 'Geometry',
            description: 'Explore shapes, areas, and spatial relationships through practice problems.',
            problemCount: 40,
            difficulty: 'Intermediate'
          },
          {
            id: 'arithmetic',
            name: 'Arithmetic',
            description: 'Build a strong foundation with basic operations and number sense.',
            problemCount: 60,
            difficulty: 'Beginner'
          }
        ];
        
        setTopics(mockTopics);
        setError(null);
      } catch (err) {
        console.error('Error fetching topics:', err);
        setError('Failed to load topics. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTopics();
  }, []);
  
  if (loading) {
    return <div className="loading">Loading topics...</div>;
  }
  
  if (error) {
    return <div className="error-message">{error}</div>;
  }
  
  return (
    <div className="topics-container">
      <h1>Math Topics</h1>
      <p className="topics-intro">
        Choose a topic to start practicing. Each topic contains problems of various difficulty levels.
      </p>
      
      <div className="topics-grid">
        {topics.map((topic) => (
          <div key={topic.id} className="topic-card">
            <h2>{topic.name}</h2>
            <p className="topic-description">{topic.description}</p>
            
            <div className="topic-details">
              <span className="problem-count">{topic.problemCount} problems</span>
              <span className="difficulty-level">
                Difficulty: {topic.difficulty}
              </span>
            </div>
            
            <Link to={`/practice/${topic.id}`} className="start-practice-btn">
              Start Practice
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Topics;