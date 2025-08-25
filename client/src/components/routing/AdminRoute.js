import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { currentUser, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="container mt-5 text-center">Loading...</div>;
  }

  return isAuthenticated && currentUser.role === 'admin' ? children : <Navigate to="/" />;
};

export default AdminRoute;
