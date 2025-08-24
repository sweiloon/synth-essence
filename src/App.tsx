
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { useAuth } from '@/hooks/useAuth';
import Index from './pages/Index';
import CreateAvatar from './pages/CreateAvatar';
import AvatarDetail from './pages/AvatarDetail';
import './App.css';

const queryClient = new QueryClient();

function App() {
  const { user, loading } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!!user);
  }, [user]);

  const handleLogin = (token: string) => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (loading) {
    return (
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
        <Toaster />
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route 
              path="/" 
              element={
                <Index 
                  isAuthenticated={isAuthenticated}
                  onLogin={handleLogin}
                  onLogout={handleLogout}
                />
              } 
            />
            <Route 
              path="/create-avatar" 
              element={
                isAuthenticated ? (
                  <CreateAvatar />
                ) : (
                  <Navigate to="/" replace />
                )
              } 
            />
            <Route 
              path="/avatar/:avatarId" 
              element={
                isAuthenticated ? (
                  <AvatarDetail />
                ) : (
                  <Navigate to="/" replace />
                )
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                isAuthenticated ? (
                  <Navigate to="/" replace />
                ) : (
                  <Navigate to="/" replace />
                )
              } 
            />
          </Routes>
        </div>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
