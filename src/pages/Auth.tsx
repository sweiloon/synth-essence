
import React, { useState } from 'react';
import AuthLayout from '@/components/auth/AuthLayout';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';

interface AuthProps {
  onAuthSuccess: () => void;
}

type AuthMode = 'login' | 'signup' | 'forgot-password';

const Auth = ({ onAuthSuccess }: AuthProps) => {
  const [authMode, setAuthMode] = useState<AuthMode>('login');

  const renderAuthForm = () => {
    switch (authMode) {
      case 'login':
        return (
          <LoginForm
            onSwitchToSignup={() => setAuthMode('signup')}
            onSwitchToForgotPassword={() => setAuthMode('forgot-password')}
            onLoginSuccess={onAuthSuccess}
          />
        );
      case 'signup':
        return (
          <SignupForm
            onSwitchToLogin={() => setAuthMode('login')}
            onSignupSuccess={onAuthSuccess}
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
