
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  UserCircle, 
  Plus, 
  MessageSquare, 
  Mic, 
  Image, 
  User,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const MyAvatarSection = ({ onSectionChange }: { onSectionChange: (section: string) => void }) => {
  const navigate = useNavigate();
  const [myAvatars, setMyAvatars] = useState<any[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [avatarToDelete, setAvatarToDelete] = useState<string | null>(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState<any>(null);
  const [comingSoonDialog, setComingSoonDialog] = useState(false);
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

  const handleCreateAvatar = () => {
    navigate('/create-avatar');
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
      case 'avatar':
        setComingSoonDialog(true);
        break;
      case 'images':
        onSectionChange('images');
        break;
    }
    
    if (type === 'chatbot' || type === 'images') {
      toast({
        title: "Training Started",
        description: `Redirecting to ${type} training section...`,
      });
    }
  };

  const handleDeleteClick = (avatarId: string) => {
    setAvatarToDelete(avatarId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (avatarToDelete) {
      setMyAvatars(myAvatars.filter(avatar => avatar.id !== avatarToDelete));
      toast({
        title: "Avatar Deleted",
        description: "Avatar has been deleted successfully.",
      });
    }
    setDeleteDialogOpen(false);
    setAvatarToDelete(null);
  };

  const handlePreview = (avatar: any) => {
    setPreviewAvatar(avatar);
    setPreviewDialogOpen(true);
  };

  const handleEdit = (avatarId: string) => {
    // Store avatar ID for editing
    localStorage.setItem('editingAvatarId', avatarId);
    navigate('/create-avatar');
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
        
        <Button className="btn-hero" onClick={handleCreateAvatar}>
          <Plus className="mr-2 h-4 w-4" />
          Create New Avatar
        </Button>
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
            <Button onClick={handleCreateAvatar} className="btn-hero">
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {avatar.avatarImages && avatar.avatarImages.length > 0 ? (
                      <img 
                        src={avatar.avatarImages[0]} 
                        alt={avatar.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <UserCircle className="h-5 w-5" />
                    )}
                    <CardTitle className="text-lg">{avatar.name}</CardTitle>
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handlePreview(avatar)}
                      title="Preview Avatar"
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEdit(avatar.id)}
                      title="Edit Avatar"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDeleteClick(avatar.id)}
                      title="Delete Avatar"
                    >
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
                      variant={avatar.progress?.chatbot ? "default" : "outline"}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => handleStartTraining(avatar.id, 'chatbot')}
                    >
                      <MessageSquare className="mr-2 h-3 w-3" />
                      Chatbot
                    </Button>
                    <Button
                      variant={avatar.progress?.tts ? "default" : "outline"}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => handleStartTraining(avatar.id, 'tts')}
                    >
                      <Mic className="mr-2 h-3 w-3" />
                      TTS Voice
                    </Button>
                    <Button
                      variant={avatar.progress?.images ? "default" : "outline"}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => handleStartTraining(avatar.id, 'images')}
                    >
                      <Image className="mr-2 h-3 w-3" />
                      AI Images
                    </Button>
                    <Button
                      variant={avatar.progress?.avatar ? "default" : "outline"}
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Avatar</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this avatar? This action cannot be undone and all training data will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Avatar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {previewAvatar?.avatarImages && previewAvatar.avatarImages.length > 0 ? (
                <img 
                  src={previewAvatar.avatarImages[0]} 
                  alt={previewAvatar.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <UserCircle className="h-8 w-8" />
              )}
              {previewAvatar?.name}
            </DialogTitle>
            <DialogDescription>
              Avatar Preview - All Details
            </DialogDescription>
          </DialogHeader>
          {previewAvatar && (
            <div className="space-y-4">
              {/* Avatar Images */}
              {previewAvatar.avatarImages && previewAvatar.avatarImages.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Avatar Images</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {previewAvatar.avatarImages.map((image: string, index: number) => (
                      <img 
                        key={index}
                        src={image} 
                        alt={`Avatar ${index + 1}`}
                        className="w-full aspect-square rounded-lg object-cover"
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium">Basic Information</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Age:</span> {previewAvatar.age} years</p>
                    <p><span className="font-medium">Gender:</span> {previewAvatar.gender}</p>
                    <p><span className="font-medium">Origin:</span> {previewAvatar.originCountry}</p>
                    <p><span className="font-medium">MBTI:</span> {previewAvatar.mbti}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium">Languages</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Primary:</span> {previewAvatar.primaryLanguage}</p>
                    {previewAvatar.secondaryLanguages && previewAvatar.secondaryLanguages.length > 0 && (
                      <p><span className="font-medium">Secondary:</span> {previewAvatar.secondaryLanguages.join(', ')}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Favorites */}
              {previewAvatar.favorites && previewAvatar.favorites.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Favorites</h4>
                  <div className="flex flex-wrap gap-1">
                    {previewAvatar.favorites.map((favorite: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {favorite}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Backstory */}
              {previewAvatar.backstory && (
                <div>
                  <h4 className="font-medium mb-2">Backstory</h4>
                  <p className="text-sm text-muted-foreground">{previewAvatar.backstory}</p>
                </div>
              )}

              {/* Hidden Rules */}
              {previewAvatar.hiddenRules && (
                <div>
                  <h4 className="font-medium mb-2">Hidden Rules</h4>
                  <p className="text-sm text-muted-foreground">{previewAvatar.hiddenRules}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Coming Soon Dialog */}
      <Dialog open={comingSoonDialog} onOpenChange={setComingSoonDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Coming Soon</DialogTitle>
            <DialogDescription>
              This feature is currently under development and will be available soon. Stay tuned for updates!
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={() => setComingSoonDialog(false)}>
              Got it
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyAvatarSection;
