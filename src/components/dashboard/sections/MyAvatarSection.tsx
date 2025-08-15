
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  UserCircle, 
  Plus, 
  MessageSquare, 
  Mic, 
  Image, 
  User,
  Edit,
  Trash2,
  Settings
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageUpload } from '@/components/ui/image-upload';

const MyAvatarSection = ({ onSectionChange }: { onSectionChange: (section: string) => void }) => {
  const [myAvatars, setMyAvatars] = useState<any[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newAvatar, setNewAvatar] = useState({
    name: '',
    gender: '',
    age: '',
    mbti: '',
    images: [] as File[]
  });
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

  const mbtiTypes = [
    'INTJ', 'INTP', 'ENTJ', 'ENTP',
    'INFJ', 'INFP', 'ENFJ', 'ENFP',
    'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
    'ISTP', 'ISFP', 'ESTP', 'ESFP'
  ];

  const handleCreateAvatar = () => {
    if (!newAvatar.name || !newAvatar.gender || !newAvatar.age || !newAvatar.mbti) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Convert images to base64 URLs for storage
    const imagePromises = newAvatar.images.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises).then(imageUrls => {
      const avatar = {
        id: Date.now().toString(),
        name: newAvatar.name,
        gender: newAvatar.gender,
        age: newAvatar.age,
        mbti: newAvatar.mbti,
        images: imageUrls,
        progress: {
          chatbot: false,
          tts: false,
          images: false,
          avatar: false
        },
        createdAt: new Date().toISOString()
      };

      setMyAvatars([...myAvatars, avatar]);
      setNewAvatar({ name: '', gender: '', age: '', mbti: '', images: [] });
      setIsCreateDialogOpen(false);
      
      toast({
        title: "Avatar Created!",
        description: `${avatar.name} has been created successfully. Start training now!`,
      });
    });
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
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-hero">
              <Plus className="mr-2 h-4 w-4" />
              Create New Avatar
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Avatar</DialogTitle>
              <DialogDescription>
                Set up your avatar's basic information and upload profile images to get started.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Avatar Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter avatar name"
                  value={newAvatar.name}
                  onChange={(e) => setNewAvatar({...newAvatar, name: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <Select onValueChange={(value) => setNewAvatar({...newAvatar, gender: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="non-binary">Non-binary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="age">Starting Age *</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Enter age"
                  value={newAvatar.age}
                  onChange={(e) => setNewAvatar({...newAvatar, age: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="mbti">Preferred MBTI *</Label>
                <Select onValueChange={(value) => setNewAvatar({...newAvatar, mbti: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select MBTI type" />
                  </SelectTrigger>
                  <SelectContent>
                    {mbtiTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <ImageUpload
                onImagesChange={(images) => setNewAvatar({...newAvatar, images})}
                maxImages={5}
                label="Profile Images (optional)"
              />
              
              <div className="flex gap-2 pt-4">
                <Button onClick={handleCreateAvatar} className="flex-1">
                  Create Avatar
                </Button>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

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
                {/* Avatar Image Display */}
                {avatar.images && avatar.images.length > 0 && (
                  <div className="relative aspect-square mb-3 overflow-hidden rounded-lg">
                    <img
                      src={avatar.images[0]}
                      alt={avatar.name}
                      className="w-full h-full object-cover"
                    />
                    {avatar.images.length > 1 && (
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        +{avatar.images.length - 1} more
                      </div>
                    )}
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserCircle className="h-5 w-5" />
                    <CardTitle className="text-lg">{avatar.name}</CardTitle>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteAvatar(avatar.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline">{avatar.gender}</Badge>
                  <Badge variant="outline">{avatar.age} years</Badge>
                  <Badge variant="secondary">{avatar.mbti}</Badge>
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
