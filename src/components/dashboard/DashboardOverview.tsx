
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Mic, 
  Image, 
  User, 
  ShoppingBag,
  UserCircle,
  Plus,
  ArrowRight
} from 'lucide-react';

interface DashboardOverviewProps {
  onSectionChange: (section: string) => void;
}

const DashboardOverview = ({ onSectionChange }: DashboardOverviewProps) => {
  const quickActions = [
    {
      title: 'Create New Avatar',
      description: 'Build your personalized AI avatar from scratch',
      icon: UserCircle,
      action: () => onSectionChange('my-avatar'),
      color: 'bg-blue-500'
    },
    {
      title: 'Browse Marketplace',
      description: 'Discover pre-made avatars from the community',
      icon: ShoppingBag,
      action: () => onSectionChange('marketplace'),
      color: 'bg-green-500'
    },
    {
      title: 'Train Chatbot',
      description: 'Enhance your avatar\'s conversation abilities',
      icon: MessageSquare,
      action: () => onSectionChange('chatbot'),
      color: 'bg-purple-500'
    },
    {
      title: 'Generate Images',
      description: 'Create visual content with AI',
      icon: Image,
      action: () => onSectionChange('images'),
      color: 'bg-pink-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <LayoutDashboard className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Welcome to AvatarHub</h1>
        </div>
        <p className="text-blue-100">
          Create, customize, and deploy AI avatars for your projects
        </p>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={action.action}>
                <CardHeader className="pb-3">
                  <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mb-2`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-3">
                    {action.description}
                  </CardDescription>
                  <Button variant="outline" size="sm" className="w-full">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Getting Started Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>
            Follow these steps to create your first AI avatar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
              <div>
                <h4 className="font-medium">Create Your Avatar</h4>
                <p className="text-sm text-muted-foreground">Set up basic information and personality traits</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
              <div>
                <h4 className="font-medium">Train & Customize</h4>
                <p className="text-sm text-muted-foreground">Add knowledge, voice, and visual elements</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
              <div>
                <h4 className="font-medium">Deploy & Use</h4>
                <p className="text-sm text-muted-foreground">Start interacting with your AI avatar</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;
