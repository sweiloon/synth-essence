
import React, { useState } from 'react';
import Auth from './Auth';
import Dashboard from './Dashboard';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (isAuthenticated) {
    return <Dashboard onLogout={handleLogout} />;
  }

  return <Auth onAuthSuccess={handleAuthSuccess} />;
};

export default Index;
