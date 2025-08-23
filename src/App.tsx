import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import NotFound from '@/pages/NotFound';
import AvatarDetail from '@/pages/AvatarDetail';
import { Toaster } from "@/components/ui/toaster"
import { Toaster as SonnerToaster, toast } from "@/components/ui/sonner"
import CreateAvatar from '@/pages/CreateAvatar';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (token: string) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index isAuthenticated={isAuthenticated} onLogin={handleLogin} onLogout={handleLogout} />} />
        <Route path="/auth" element={<Auth onLogin={handleLogin} />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/auth" />} />
        <Route path="/create-avatar" element={isAuthenticated ? <CreateAvatar /> : <Navigate to="/auth" />} />
        <Route path="/avatar/:id" element={isAuthenticated ? <AvatarDetail /> : <Navigate to="/auth" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
      <SonnerToaster />
    </Router>
  );
}

export default App;
