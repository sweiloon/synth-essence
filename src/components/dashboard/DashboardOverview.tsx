
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  MessageSquare, 
  Bot, 
  Settings,
  Plus,
  Sparkles,
  BookOpen,
  Image,
  Volume2,
  Store,
  GraduationCap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DashboardOverviewProps {
  userProfile?: any;
  onSectionChange: (section: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ 
  userProfile, 
  onSectionChange 
}) => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'Create Avatar',
      description: 'Design a new AI avatar',
      icon: Plus,
      onClick: () => navigate('/create-avatar')
    },
    {
      title: 'My Avatars',
      description: 'View and manage avatars',
      icon: Users,
      onClick: () => onSectionChange('avatars')
    },
    {
      title: 'Chatbot Training',
      description: 'Train and test your bots',
      icon: Bot,
      onClick: () => onSectionChange('chatbot')
    },
    {
      title: 'Settings',
      description: 'Account and preferences',
      icon: Settings,
      onClick: () => onSectionChange('settings')
    }
  ];

  const features = [
    {
      title: 'AI Images',
      description: 'Generate custom images',
      icon: Image,
      onClick: () => onSectionChange('images')
    },
    {
      title: 'Text-to-Speech',
      description: 'Voice synthesis tools',
      icon: Volume2,
      onClick: () => onSectionChange('tts')
    },
    {
      title: 'Marketplace',
      description: 'Browse avatar templates',
      icon: Store,
      onClick: () => onSectionChange('marketplace')
    },
    {
      title: 'Learning Path',
      description: 'Tutorials and guides',
      icon: GraduationCap,
      onClick: () => onSectionChange('learning')
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center space-y-4 py-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Welcome to AI Avatar Creator</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Create, customize, and deploy intelligent AI avatars with unique personalities, 
          backstories, and conversational abilities.
        </p>
        {userProfile?.name && (
          <Badge variant="secondary" className="text-base px-4 py-2">
            Hello, {userProfile.name}! 👋
          </Badge>
        )}
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Card 
              key={index} 
              className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
              onClick={action.onClick}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <action.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-base">{action.title}</CardTitle>
                </div>
                <CardDescription className="text-sm">
                  {action.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Platform Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
              onClick={feature.onClick}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-secondary/50 rounded-lg">
                    <feature.icon className="h-5 w-5 text-secondary-foreground" />
                  </div>
                  <CardTitle className="text-base">{feature.title}</CardTitle>
                </div>
                <CardDescription className="text-sm">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      {/* Getting Started */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <BookOpen className="h-5 w-5" />
            Getting Started
          </CardTitle>
          <CardDescription className="text-blue-700">
            New to AI Avatar Creator? Follow these steps to create your first avatar.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center space-y-2">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto font-semibold">
                1
              </div>
              <h4 className="font-medium text-blue-900">Create Avatar</h4>
              <p className="text-sm text-blue-700">Design your AI persona with unique traits</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto font-semibold">
                2
              </div>
              <h4 className="font-medium text-blue-900">Train & Test</h4>
              <p className="text-sm text-blue-700">Customize behavior and responses</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto font-semibold">
                3
              </div>
              <h4 className="font-medium text-blue-900">Deploy</h4>
              <p className="text-sm text-blue-700">Share your avatar with the world</p>
            </div>
          </div>
          <div className="flex justify-center">
            <Button onClick={() => navigate('/create-avatar')} className="bg-blue-600 hover:bg-blue-700">
              Create Your First Avatar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
