import React, { createContext, useState, useEffect, useContext } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const checkAuthStatus = async () => {
      try {
        const storedUser = localStorage.getItem('currentUser');
        
        if (storedUser) {
          // For development purposes, just use the stored user
          setCurrentUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Authentication error:', error);
        localStorage.removeItem('currentUser');
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    try {
      // In a real app, you would make an API call here
      // For development, just create a mock user
      const mockUser = {
        id: '1',
        name: 'Test User',
        email: email,
        role: 'user'
      };
      
      localStorage.setItem('currentUser', JSON.stringify(mockUser));
      setCurrentUser(mockUser);
      return mockUser;
    } catch (error) {
      throw new Error('Login failed');
    }
  };

  const signup = async (userData) => {
    try {
      // In a real app, you would make an API call here
      // For development, just create a mock user
      const mockUser = {
        id: '1',
        name: userData.name,
        email: userData.email,
        role: 'user'
      };
      
      localStorage.setItem('currentUser', JSON.stringify(mockUser));
      setCurrentUser(mockUser);
      return mockUser;
    } catch (error) {
      throw new Error('Signup failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    loading,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};