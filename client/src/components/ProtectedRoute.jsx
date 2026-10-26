import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  const currentUserStr = localStorage.getItem('currentUser');

  let isValidSession = false;

  try {
    if (currentUserStr) {
      const user = JSON.parse(currentUserStr);
      // Ensure the user session has genuine identifying properties
      if (user && (user.id || user._id || user.email)) {
        isValidSession = true;
      }
    }
  } catch (err) {
    isValidSession = false;
  }

  // If no valid session exists, completely wipe storage and redirect to login
  if (!isValidSession) {
    localStorage.clear(); // Clears any mock or stale storage items
    return <Navigate to="/login" replace />;
  }

  // Otherwise, allow access to the protected routes
  return <Outlet />;
}