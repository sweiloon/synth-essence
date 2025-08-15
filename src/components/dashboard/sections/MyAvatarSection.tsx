
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  UserCircle, 
  Plus, 
  MessageSquare, 
  Mic, 
  Image, 
  User,
  Edit,
  Trash2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AvatarCreationDialog } from './AvatarCreationDialog';

const MyAvatarSection = ({ onSectionChange }: { onSectionChange: (section: string) => void }) => {
  const [myAvatars, setMyAvatars] = useState<any[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  // Load avatars from localStorage on component mount
  useEffect(() => {
    const savedAvatars = localStorage.getItem('myAvatars');
    if (savedAvatars) {
      try {
        setMyAvatars(JSON.parse(savedAvatars));
      } catch (error) {
        console.error('Error loading avatars from localStorage:', error);
      }
    }
  }, []);

  // Save avatars to localStorage whenever myAvatars changes
  useEffect(() => {
    localStorage.setItem('myAvatars', JSON.stringify(myAvatars));
  }, [myAvatars]);

  const handleCreateAvatar = (avatar: any) => {
    setMyAvatars([...myAvatars, avatar]);
  };

  const handleStartTraining = (avatarId: string, type: string) => {
    // Store selected avatar in localStorage for other components to use
    localStorage.setItem('selectedAvatarId', avatarId);
    
    // Navigate to appropriate training section
    switch (type) {
      case 'chatbot':
        onSectionChange('chatbot');
        break;
      case 'tts':
        onSectionChange('tts');
        break;
      case 'images':
        onSectionChange('images');
        break;
      case 'avatar':
        onSectionChange('avatar');
        break;
    }
    
    toast({
      title: "Training Started",
      description: `Redirecting to ${type} training section...`,
    });
  };

  const handleDeleteAvatar = (avatarId: string) => {
    setMyAvatars(myAvatars.filter(avatar => avatar.id !== avatarId));
    toast({
      title: "Avatar Deleted",
      description: "Avatar has been deleted successfully.",
    });
  };

  const getAvatarImage = (avatar: any) => {
    if (avatar.images && avatar.images.length > 0) {
      return avatar.images[0];
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <UserCircle className="h-6 w-6" />
            My Avatar
          </h1>
          <p className="text-muted-foreground">
            Create and manage your AI avatars
          </p>
        </div>
        
        <Button 
          onClick={() => setIsCreateDialogOpen(true)} 
          className="btn-hero"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create New Avatar
        </Button>
      </div>

      {/* Avatar Creation Dialog */}
      <AvatarCreationDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onCreateAvatar={handleCreateAvatar}
      />

      {/* Avatar List */}
      {myAvatars.length === 0 ? (
        <Card className="card-modern">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <UserCircle className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Avatars Yet</h3>
            <p className="text-muted-foreground text-center mb-6">
              Create your first AI avatar to get started with training and customization.
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)} className="btn-hero">
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Avatar
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myAvatars.map((avatar) => (
            <Card key={avatar.id} className="card-modern">
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  {getAvatarImage(avatar) ? (
                    <img
                      src={getAvatarImage(avatar)}
                      alt={avatar.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-border"
                    />
                  ) : (
                    <UserCircle className="h-12 w-12 text-muted-foreground" />
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg truncate">{avatar.name}</CardTitle>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteAvatar(avatar.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap mt-2">
                      <Badge variant="outline">{avatar.gender}</Badge>
                      <Badge variant="outline">{avatar.age} years</Badge>
                      <Badge variant="secondary">{avatar.mbti}</Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Training Progress</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={avatar.progress.chatbot ? "default" : "outline"}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => handleStartTraining(avatar.id, 'chatbot')}
                    >
                      <MessageSquare className="mr-2 h-3 w-3" />
                      Chatbot
                    </Button>
                    <Button
                      variant={avatar.progress.tts ? "default" : "outline"}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => handleStartTraining(avatar.id, 'tts')}
                    >
                      <Mic className="mr-2 h-3 w-3" />
                      TTS Voice
                    </Button>
                    <Button
                      variant={avatar.progress.images ? "default" : "outline"}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => handleStartTraining(avatar.id, 'images')}
                    >
                      <Image className="mr-2 h-3 w-3" />
                      AI Images
                    </Button>
                    <Button
                      variant={avatar.progress.avatar ? "default" : "outline"}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => handleStartTraining(avatar.id, 'avatar')}
                    >
                      <User className="mr-2 h-3 w-3" />
                      AI Avatar
                    </Button>
                  </div>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  Created: {new Date(avatar.createdAt).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAvatarSection;
