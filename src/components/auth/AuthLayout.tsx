
import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 neural-bg relative overflow-hidden">
        <div className="flex flex-col justify-center px-12 text-white relative z-10">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">AI Avatar Lab</h1>
            <p className="text-lg opacity-90">Scientific Reporting Platform</p>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-5xl font-bold leading-tight">
              One Station<br />
              AI Avatar Platform
            </h2>
            <p className="text-xl opacity-80 max-w-md">
              Build your perfect AI avatar with advanced language, voice, and personality training. 
              Create your digital twin with unprecedented control.
            </p>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 rounded-full bg-white/10 backdrop-blur-sm avatar-glow"></div>
        <div className="absolute bottom-32 right-32 w-24 h-24 rounded-full bg-white/5 backdrop-blur-sm"></div>
      </div>
      
      {/* Right Side - Auth Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-background">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
