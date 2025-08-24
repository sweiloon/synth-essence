
import React from 'react';
import { useLocation } from 'react-router-dom';
import Auth from './Auth';
import Dashboard from './Dashboard';

interface IndexProps {
  isAuthenticated: boolean;
  onLogin: (token: string) => void;
  onLogout: () => void;
}

const Index = ({ isAuthenticated, onLogin, onLogout }: IndexProps) => {
  const location = useLocation();

  // Parse URL search params to get section
  const searchParams = new URLSearchParams(location.search);
  const section = searchParams.get('section');

  // Handle avatar detail routes
  if (location.pathname.startsWith('/avatar/')) {
    return null; // This will be handled by the AvatarDetail component
  }

  // Always render either Auth or Dashboard - never a blank state
  if (isAuthenticated) {
    return <Dashboard onLogout={onLogout} />;
  }

  return <Auth onLogin={onLogin} />;
};

export default Index;
