import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  Users, 
  MessageSquare, 
  Settings,
  TrendingUp,
  Star,
  Plus,
  ArrowRight,
  Mic,
  Image,
  BookOpen
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DashboardOverviewProps {
  onSectionChange: (section: string) => void;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ onSectionChange }) => {
  const navigate = useNavigate();

  const handleCreateAvatar = () => {
    navigate('/create-avatar');
  };

  const stats = [
    {
      title: 'Total Avatars',
      value: '12',
      icon: Users,
      color: 'text-blue-500',
    },
    {
      title: 'Chatbot Interactions',
      value: '456',
      icon: MessageSquare,
      color: 'text-green-500',
    },
    {
      title: 'TTS Usage',
      value: '789',
      icon: Mic,
      color: 'text-orange-500',
    },
    {
      title: 'Images Generated',
      value: '101',
      icon: Image,
      color: 'text-red-500',
    },
  ];

  const quickActions = [
    {
      title: 'Manage Chatbots',
      description: 'Configure and train your AI chatbots',
      icon: Bot,
      onClick: () => onSectionChange('chatbot'),
    },
    {
      title: 'Adjust Settings',
      description: 'Customize your profile and preferences',
      icon: Settings,
      onClick: () => onSectionChange('settings'),
    },
    {
      title: 'Explore Marketplace',
      description: 'Discover new avatars and integrations',
      icon: Star,
      onClick: () => onSectionChange('marketplace'),
    },
    {
      title: 'View Learning Path',
      description: 'Access tutorials and guides',
      icon: BookOpen,
      onClick: () => onSectionChange('learning-path'),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Welcome to AI Avatar Studio</h1>
        <p className="text-muted-foreground">
          Create, train, and manage your AI avatars in one place
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card-modern cursor-pointer hover:shadow-lg transition-all duration-200" onClick={handleCreateAvatar}>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
              <Plus className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold mb-2">Create Avatar</h3>
            <p className="text-sm text-muted-foreground">Build a new AI avatar</p>
          </CardContent>
        </Card>
        
        {quickActions.map((action, index) => (
          <Card
            key={index}
            className="card-modern cursor-pointer hover:shadow-lg transition-all duration-200"
            onClick={action.onClick}
          >
            <CardContent className="p-6">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${action.color}`}>
                <action.icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-2">{action.title}</h3>
              <p className="text-sm text-muted-foreground">{action.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="card-modern">
            <CardHeader>
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stat.color} bg-opacity-20`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card className="card-modern">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest interactions and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <p className="text-sm font-medium">New avatar created</p>
              </div>
              <Badge variant="secondary">1 hour ago</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4 text-blue-500" />
                <p className="text-sm font-medium">Chatbot training completed</p>
              </div>
              <Badge variant="secondary">3 hours ago</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Image className="h-4 w-4 text-orange-500" />
                <p className="text-sm font-medium">Image generated successfully</p>
              </div>
              <Badge variant="secondary">5 hours ago</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;
