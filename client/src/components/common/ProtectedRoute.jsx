import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  // If still loading auth status, show nothing
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  // If not authenticated, redirect to home page
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }
  
  // If authenticated, render the children
  return children;
};

export default ProtectedRoute;