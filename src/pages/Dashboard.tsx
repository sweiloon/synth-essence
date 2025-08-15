
import React, { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import ChatbotSection from '@/components/dashboard/sections/ChatbotSection';
import TTSSection from '@/components/dashboard/sections/TTSSection';
import ImagesSection from '@/components/dashboard/sections/ImagesSection';
import AvatarSection from '@/components/dashboard/sections/AvatarSection';
import LearningPathSection from '@/components/dashboard/sections/LearningPathSection';
import { useToast } from '@/hooks/use-toast';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard = ({ onLogout }: DashboardProps) => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const { toast } = useToast();

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    onLogout();
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardOverview onSectionChange={setActiveSection} />;
      case 'chatbot':
        return <ChatbotSection />;
      case 'tts':
        return <TTSSection />;
      case 'images':
        return <ImagesSection />;
      case 'avatar':
        return <AvatarSection />;
      case 'learning-path':
        return <LearningPathSection />;
      case 'settings':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Settings panel will be implemented.</p>
          </div>
        );
      default:
        return <DashboardOverview onSectionChange={setActiveSection} />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onLogout={handleLogout}
      />
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {renderActiveSection()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
