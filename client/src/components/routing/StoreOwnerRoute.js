import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const StoreOwnerRoute = ({ children }) => {
  const { currentUser, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="container mt-5 text-center">Loading...</div>;
  }

  // Debug the user role in console
  console.log('Current user role:', currentUser?.role);
  
  return isAuthenticated && currentUser?.role === 'store_owner' ? children : <Navigate to="/" />;
};

export default StoreOwnerRoute;
