
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '@/components/dashboard/Sidebar';
import { DashboardOverview } from '@/components/dashboard/DashboardOverview';
import MarketplaceSection from '@/components/dashboard/sections/MarketplaceSection';
import ChatbotSection from '@/components/dashboard/sections/ChatbotSection';
import TTSSection from '@/components/dashboard/sections/TTSSection';
import ImagesSection from '@/components/dashboard/sections/ImagesSection';
import AvatarSection from '@/components/dashboard/sections/AvatarSection';
import LearningPathSection from '@/components/dashboard/sections/LearningPathSection';
import SettingsSection from '@/components/dashboard/sections/SettingsSection';
import MyAvatarSection from '@/components/dashboard/sections/MyAvatarSection';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard = ({ onLogout }: DashboardProps) => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const location = useLocation();
  const { toast } = useToast();
  const { signOut } = useAuth();

  // Handle navigation from avatar detail page
  useEffect(() => {
    if (location.state?.activeSection) {
      setActiveSection(location.state.activeSection);
    }
  }, [location.state]);

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      onLogout();
    } catch (error) {
      toast({
        title: "Logout Error",
        description: "An error occurred while logging out.",
        variant: "destructive"
      });
    }
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardOverview onSectionChange={setActiveSection} />;
      case 'marketplace':
        return <MarketplaceSection />;
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
      case 'my-avatar':
        return <MyAvatarSection />;
      case 'settings':
        return <SettingsSection />;
      default:
        return <DashboardOverview onSectionChange={setActiveSection} />;
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onLogout={handleLogout}
      />
      <main className="flex-1 overflow-auto">
        <div className="p-3 md:p-4 pt-16 md:pt-4">
          {renderActiveSection()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
