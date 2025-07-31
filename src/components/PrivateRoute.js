// src/components/PrivateRoute.js

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

/**
 * A component that protects routes from unauthenticated or unauthorized access.
 *
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The component to render if the user is authorized.
 * @param {string[]} [props.allowedRoles] - An optional array of roles that are allowed to access the route.
 */
function PrivateRoute({ children, allowedRoles }) {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // 1. Show a loading indicator while the authentication status is being checked.
  // This prevents redirecting the user before their session is verified on app load.
  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Verifying authentication...</div>;
  }

  // 2. If the user is not authenticated, redirect them to the login page.
  if (!isAuthenticated) {
    toast.error("Please log in to access this page.");
    // The 'state' property remembers the page the user was trying to access,
    // so they can be redirected back after a successful login.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. If the route requires specific roles, check if the user has one of them.
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    toast.error("You are not authorized to view this page.");
    // Redirect unauthorized users to the home page.
    return <Navigate to="/" replace />;
  }

  // 4. If the user is authenticated and authorized, render the requested component.
  return children;
}

export default PrivateRoute;
