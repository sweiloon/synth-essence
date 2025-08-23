
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Bot, 
  MessageSquare, 
  Mic, 
  Image, 
  User, 
  TrendingUp, 
  Clock, 
  Zap,
  UserCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface DashboardOverviewProps {
  onSectionChange: (section: string) => void;
}

interface Avatar {
  id: string;
  name: string;
  avatar_images: string[];
  age: number;
  gender: string;
  created_at: string;
}

const DashboardOverview = ({ onSectionChange }: DashboardOverviewProps) => {
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [isLoadingAvatars, setIsLoadingAvatars] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  // Load avatars from Supabase
  useEffect(() => {
    if (user) {
      fetchAvatars();
    }
  }, [user]);

  const fetchAvatars = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('avatars')
        .select('id, name, avatar_images, age, gender, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) {
        console.error('Error fetching avatars:', error);
        toast({
          title: "Error",
          description: "Failed to load your avatars.",
          variant: "destructive"
        });
      } else {
        setAvatars(data || []);
      }
    } catch (error) {
      console.error('Error fetching avatars:', error);
    } finally {
      setIsLoadingAvatars(false);
    }
  };

  const handleComingSoon = () => {
    toast({
      title: "Coming Soon",
      description: "This feature is currently under development and will be available soon!",
      duration: 4000,
    });
  };

  const handleAvatarClick = (avatarId: string) => {
    // Navigate to avatar detail page
    window.location.href = `/avatar/${avatarId}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage and train your AI Avatar
          </p>
        </div>
        <Button className="btn-hero" onClick={() => onSectionChange('my-avatar')}>
          <Bot className="mr-2 h-4 w-4" />
          Create New Avatar
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-modern">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Training Sessions
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              No training sessions yet
            </p>
          </CardContent>
        </Card>

        <Card className="card-modern">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Voice Models
            </CardTitle>
            <Mic className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              No voice models created
            </p>
          </CardContent>
        </Card>

        <Card className="card-modern">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Generated Images
            </CardTitle>
            <Image className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              No images generated
            </p>
          </CardContent>
        </Card>

        <Card className="card-modern">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avatar Completeness
            </CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avatars.length > 0 ? '25%' : '0%'}</div>
            <p className="text-xs text-muted-foreground">
              {avatars.length > 0 ? 'Avatar created' : 'Create your first avatar'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="card-modern">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Get started with your AI avatar journey
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => onSectionChange('my-avatar')}
            >
              <Bot className="mr-2 h-4 w-4" />
              Create Your First Avatar
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => onSectionChange('chatbot')}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Train Language Model
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={handleComingSoon}
            >
              <Mic className="mr-2 h-4 w-4" />
              Configure Voice
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => onSectionChange('images')}
            >
              <Image className="mr-2 h-4 w-4" />
              Generate Images
            </Button>
          </CardContent>
        </Card>

        <Card className="card-modern">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              My Avatar
            </CardTitle>
            <CardDescription>
              Your created avatars
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoadingAvatars ? (
              <div className="animate-pulse space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : avatars.length === 0 ? (
              <div className="text-center py-8">
                <Bot className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Avatars Yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Create your first avatar to see it here
                </p>
                <Button onClick={() => onSectionChange('my-avatar')} className="btn-hero">
                  Create New Avatar
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {avatars.map((avatar) => (
                  <div 
                    key={avatar.id}
                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => handleAvatarClick(avatar.id)}
                  >
                    {avatar.avatar_images && avatar.avatar_images.length > 0 ? (
                      <img 
                        src={avatar.avatar_images[0]} 
                        alt={avatar.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <UserCircle className="h-10 w-10 text-muted-foreground" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">{avatar.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {avatar.gender} • {avatar.age} years • Created {new Date(avatar.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
                <Button 
                  variant="ghost" 
                  className="w-full"
                  onClick={() => onSectionChange('my-avatar')}
                >
                  View All Avatars
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="card-modern">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>
            Your latest avatar activities will appear here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">
              No recent activity yet. Start by creating your first avatar!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;
