
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Mic, 
  Image, 
  User, 
  GitBranch, 
  Settings, 
  LogOut,
  Bot
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onLogout: () => void;
}

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'chatbot', label: 'AI Chatbot', icon: MessageSquare },
  { id: 'tts', label: 'TTS Voice', icon: Mic },
  { id: 'images', label: 'AI Images', icon: Image },
  { id: 'avatar', label: 'AI Avatar', icon: User },
  { id: 'learning-path', label: 'Learning Path', icon: GitBranch },
];

const Sidebar = ({ activeSection, onSectionChange, onLogout }: SidebarProps) => {
  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
            <Bot className="w-4 h-4 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-sidebar-foreground">AI Avatar Lab</h1>
            <p className="text-xs text-sidebar-foreground/60">Scientific Reporting</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`nav-item w-full ${isActive ? 'nav-item-active' : ''}`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border space-y-2">
        <button
          onClick={() => onSectionChange('settings')}
          className={`nav-item w-full ${activeSection === 'settings' ? 'nav-item-active' : ''}`}
        >
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </button>
        
        <Button
          variant="ghost"
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={onLogout}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
