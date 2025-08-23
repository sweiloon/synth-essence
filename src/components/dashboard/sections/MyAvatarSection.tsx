
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Trash2,
  Eye
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

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
        setComingSoonDialog(true);
        break;
      case 'images':
        onSectionChange('images');
        break;
      case 'avatar':
        setComingSoonDialog(true);
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

  const handleConfirmDelete = () => {
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

  const handleEditAvatar = (avatarId: string) => {
    // Store the avatar ID for editing and navigate to create page
    localStorage.setItem('editingAvatarId', avatarId);
    navigate('/create-avatar');
  };

  const handlePreviewAvatar = (avatar: any) => {
    setPreviewAvatar(avatar);
    setPreviewDialogOpen(true);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <UserCircle className="h-5 w-5" />
            My Avatar
          </h1>
          <p className="text-sm text-muted-foreground">
            Create and manage your AI avatars
          </p>
        </div>
        
        <Button className="btn-hero text-sm h-9 px-6" onClick={handleCreateAvatar}>
          <Plus className="mr-2 h-3 w-3" />
          Create New Avatar
        </Button>
      </div>

      {/* Avatar List */}
      {myAvatars.length === 0 ? (
        <Card className="card-modern">
          <CardContent className="flex flex-col items-center justify-center py-10">
            <UserCircle className="h-14 w-14 text-muted-foreground mb-3" />
            <h3 className="text-base font-semibold mb-2">No Avatars Yet</h3>
            <p className="text-sm text-muted-foreground text-center mb-5">
              Create your first AI avatar to get started with training and customization.
            </p>
            <Button onClick={handleCreateAvatar} className="btn-hero text-sm h-9 px-6">
              <Plus className="mr-2 h-3 w-3" />
              Create Your First Avatar
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {myAvatars.map((avatar) => (
            <Card key={avatar.id} className="card-modern">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserCircle className="h-4 w-4" />
                    <CardTitle className="text-base">{avatar.name}</CardTitle>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => handlePreviewAvatar(avatar)}>
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => handleEditAvatar(avatar.id)}>
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => handleDeleteClick(avatar.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                {/* Avatar Image */}
                {avatar.avatarImages && avatar.avatarImages.length > 0 && (
                  <div className="mt-2 mb-2">
                    <div className="aspect-square w-full max-w-32 mx-auto rounded-lg overflow-hidden bg-muted">
                      <img
                        src={avatar.avatarImages[0]}
                        alt={avatar.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
                
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline" className="text-xs">{avatar.gender}</Badge>
                  <Badge variant="outline" className="text-xs">{avatar.age} years</Badge>
                  <Badge variant="secondary" className="text-xs">{avatar.mbti}</Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-medium mb-2 text-sm">Training Progress</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={avatar.progress.chatbot ? "default" : "outline"}
                      size="sm"
                      className="w-full justify-start text-xs h-8"
                      onClick={() => handleStartTraining(avatar.id, 'chatbot')}
                    >
                      <MessageSquare className="mr-1 h-3 w-3" />
                      Chatbot
                    </Button>
                    <Button
                      variant={avatar.progress.tts ? "default" : "outline"}
                      size="sm"
                      className="w-full justify-start text-xs h-8"
                      onClick={() => handleStartTraining(avatar.id, 'tts')}
                    >
                      <Mic className="mr-1 h-3 w-3" />
                      TTS Voice
                    </Button>
                    <Button
                      variant={avatar.progress.images ? "default" : "outline"}
                      size="sm"
                      className="w-full justify-start text-xs h-8"
                      onClick={() => handleStartTraining(avatar.id, 'images')}
                    >
                      <Image className="mr-1 h-3 w-3" />
                      AI Images
                    </Button>
                    <Button
                      variant={avatar.progress.avatar ? "default" : "outline"}
                      size="sm"
                      className="w-full justify-start text-xs h-8"
                      onClick={() => handleStartTraining(avatar.id, 'avatar')}
                    >
                      <User className="mr-1 h-3 w-3" />
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
            <AlertDialogTitle className="text-base">Delete Avatar</AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              Are you sure you want to delete this avatar? This action cannot be undone and all training data will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-sm h-9">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 text-sm h-9"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Coming Soon Dialog */}
      <Dialog open={comingSoonDialog} onOpenChange={setComingSoonDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-base">Coming Soon</DialogTitle>
            <DialogDescription className="text-sm">
              This feature is currently under development and will be available soon!
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={() => setComingSoonDialog(false)} className="text-sm h-9">
              Got it
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-base">Avatar Preview</DialogTitle>
          </DialogHeader>
          {previewAvatar && (
            <div className="space-y-4">
              {/* Avatar Images */}
              {previewAvatar.avatarImages && previewAvatar.avatarImages.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 text-sm">Avatar Images</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {previewAvatar.avatarImages.map((image: string, index: number) => (
                      <div key={index} className="aspect-square rounded-lg overflow-hidden bg-muted">
                        <img src={image} alt={`Avatar ${index + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm">Name</h4>
                  <p className="text-sm text-muted-foreground">{previewAvatar.name}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm">Age</h4>
                  <p className="text-sm text-muted-foreground">{previewAvatar.age}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm">Gender</h4>
                  <p className="text-sm text-muted-foreground">{previewAvatar.gender}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm">Origin Country</h4>
                  <p className="text-sm text-muted-foreground">{previewAvatar.originCountry}</p>
                </div>
              </div>

              {/* Languages */}
              <div>
                <h4 className="font-medium mb-2 text-sm">Primary Language</h4>
                <Badge variant="default" className="text-xs">{previewAvatar.primaryLanguage}</Badge>
              </div>

              {previewAvatar.secondaryLanguages && previewAvatar.secondaryLanguages.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 text-sm">Secondary Languages</h4>
                  <div className="flex flex-wrap gap-1">
                    {previewAvatar.secondaryLanguages.map((lang: string) => (
                      <Badge key={lang} variant="secondary" className="text-xs">{lang}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Favorites */}
              {previewAvatar.favorites && previewAvatar.favorites.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 text-sm">Favorites</h4>
                  <div className="flex flex-wrap gap-1">
                    {previewAvatar.favorites.map((fav: string) => (
                      <Badge key={fav} variant="outline" className="text-xs">{fav}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* MBTI */}
              {previewAvatar.mbti && (
                <div>
                  <h4 className="font-medium mb-2 text-sm">MBTI</h4>
                  <Badge variant="secondary" className="text-xs">{previewAvatar.mbti}</Badge>
                </div>
              )}

              {/* Backstory */}
              {previewAvatar.backstory && (
                <div>
                  <h4 className="font-medium mb-2 text-sm">Backstory</h4>
                  <p className="text-sm text-muted-foreground">{previewAvatar.backstory}</p>
                </div>
              )}

              {/* Hidden Rules */}
              {previewAvatar.hiddenRules && (
                <div>
                  <h4 className="font-medium mb-2 text-sm">Hidden Rules</h4>
                  <p className="text-sm text-muted-foreground">{previewAvatar.hiddenRules}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyAvatarSection;
