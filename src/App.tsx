
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import AvatarDetail from '@/pages/AvatarDetail';
import CreateAvatar from '@/pages/CreateAvatar';
import NotFound from '@/pages/NotFound';
import './App.css';

const queryClient = new QueryClient();

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated (from localStorage)
    const authStatus = localStorage.getItem('isAuthenticated');
    setIsAuthenticated(authStatus === 'true');
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
  };

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
              path="/dashboard" 
              element={<Dashboard onLogout={handleLogout} />} 
            />
            <Route 
              path="/avatar/:id" 
              element={<AvatarDetail />} 
            />
            <Route 
              path="/create-avatar" 
              element={<CreateAvatar />} 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
