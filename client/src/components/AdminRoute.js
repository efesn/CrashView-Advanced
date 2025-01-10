import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const userRole = localStorage.getItem('role');
  
  // If user is not admin, redirect to home page
  if (userRole !== 'Admin') {
    return <Navigate to="/" replace />;
  }

  // If user is admin, render the protected component
  return children;
};

export default AdminRoute;