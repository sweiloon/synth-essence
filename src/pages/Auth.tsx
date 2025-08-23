
import React, { useState } from 'react';
import AuthLayout from '@/components/auth/AuthLayout';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';

interface AuthProps {
  onLogin: (token: string) => void;
}

type AuthMode = 'login' | 'signup' | 'forgot-password';

const Auth = ({ onLogin }: AuthProps) => {
  const [authMode, setAuthMode] = useState<AuthMode>('login');

  const handleAuthSuccess = (token?: string) => {
    if (token) {
      onLogin(token);
    } else {
      // For cases where token isn't provided, use a placeholder
      onLogin('placeholder-token');
    }
  };

  const renderAuthForm = () => {
    switch (authMode) {
      case 'login':
        return (
          <LoginForm
            onSwitchToSignup={() => setAuthMode('signup')}
            onSwitchToForgotPassword={() => setAuthMode('forgot-password')}
            onLoginSuccess={handleAuthSuccess}
          />
        );
      case 'signup':
        return (
          <SignupForm
            onSwitchToLogin={() => setAuthMode('login')}
            onSignupSuccess={() => handleAuthSuccess()}
          />
        );
      case 'forgot-password':
        return (
          <ForgotPasswordForm
            onBackToLogin={() => setAuthMode('login')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <AuthLayout>
      {renderAuthForm()}
    </AuthLayout>
  );
};

export default Auth;
