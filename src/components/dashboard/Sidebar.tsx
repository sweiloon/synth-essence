
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
  Bot,
  ShoppingBag
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onLogout: () => void;
}

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'marketplace', label: 'Avatar Marketplace', icon: ShoppingBag },
  { id: 'chatbot', label: 'AI Chatbot', icon: MessageSquare },
  { id: 'tts', label: 'TTS Voice', icon: Mic },
  { id: 'images', label: 'AI Images', icon: Image },
  { id: 'avatar', label: 'AI Avatar', icon: User },
  { id: 'learning-path', label: 'Learning Path', icon: GitBranch },
];

const Sidebar = ({ activeSection, onSectionChange, onLogout }: SidebarProps) => {
  return (
    <div className="w-56 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-sidebar-primary rounded-md flex items-center justify-center">
            <Bot className="w-3 h-3 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-sidebar-foreground">AvatarHub</h1>
            <p className="text-xs text-sidebar-foreground/60">Your AI Avatar Station</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`nav-item w-full text-sm ${isActive ? 'nav-item-active' : ''}`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border space-y-1">
        <button
          onClick={() => onSectionChange('settings')}
          className={`nav-item w-full text-sm ${activeSection === 'settings' ? 'nav-item-active' : ''}`}
        >
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </button>
        
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={onLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
