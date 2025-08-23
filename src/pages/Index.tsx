
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Auth from './Auth';
import Dashboard from './Dashboard';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  // Check if we're on an avatar detail route
  if (location.pathname.startsWith('/avatar/')) {
    // This will be handled by the AvatarDetail component
    return null;
  }

  // Always render either Auth or Dashboard - never a blank state
  if (isAuthenticated) {
    return <Dashboard onLogout={handleLogout} />;
  }

  return <Auth onAuthSuccess={handleAuthSuccess} />;
};

export default Index;
