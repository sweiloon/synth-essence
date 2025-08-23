
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, User, MessageCircle, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DeleteConfirmationDialog } from '@/components/ui/delete-confirmation-dialog';

interface Avatar {
  id: string;
  name: string;
  avatar_images: string[];
  primary_language: string;
  secondary_languages: string[];
  created_at: string;
}

const MyAvatarSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    avatarId: string;
    avatarName: string;
  }>({
    open: false,
    avatarId: '',
    avatarName: ''
  });

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
        .select('id, name, avatar_images, primary_language, secondary_languages, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

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
      setIsLoading(false);
    }
  };

  const handleCreateNewAvatar = () => {
    navigate('/create-avatar');
  };

  const handleViewAvatar = (avatarId: string) => {
    navigate(`/avatar/${avatarId}`);
  };

  const handleChatWithAvatar = (avatarId: string) => {
    // Navigate to dashboard with chatbot section and pre-selected avatar
    navigate(`/dashboard?section=chatbot&avatar=${avatarId}`);
  };

  const openDeleteDialog = (avatarId: string, avatarName: string) => {
    setDeleteDialog({
      open: true,
      avatarId,
      avatarName
    });
  };

  const handleDeleteAvatar = async () => {
    try {
      const { error } = await supabase
        .from('avatars')
        .delete()
        .eq('id', deleteDialog.avatarId);

      if (error) {
        throw error;
      }

      toast({
        title: "Avatar Deleted",
        description: `${deleteDialog.avatarName} has been successfully deleted.`,
      });

      // Refresh the avatars list
      fetchAvatars();
    } catch (error: any) {
      console.error('Error deleting avatar:', error);
      toast({
        title: "Deletion Failed",
        description: error.message || "Failed to delete avatar. Please try again.",
        variant: "destructive"
      });
    } finally {
      setDeleteDialog({ open: false, avatarId: '', avatarName: '' });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <User className="h-6 w-6" />
            My Avatars
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your AI avatars and their configurations
          </p>
        </div>
        
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <User className="h-6 w-6" />
            My Avatars
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your AI avatars and their configurations
          </p>
        </div>
        <Button onClick={handleCreateNewAvatar} className="btn-hero">
          <Plus className="h-4 w-4 mr-2" />
          Create New Avatar
        </Button>
      </div>

      {/* Avatars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {avatars.length === 0 ? (
          <div className="col-span-full">
            <Card className="card-modern text-center py-12">
              <CardContent>
                <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <CardTitle className="mb-2">No Avatars Yet</CardTitle>
                <CardDescription className="mb-4">
                  Create your first AI avatar to get started with personalized AI interactions.
                </CardDescription>
                <Button onClick={handleCreateNewAvatar} className="btn-hero">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Avatar
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          avatars.map((avatar) => (
            <Card key={avatar.id} className="card-modern hover:shadow-lg transition-shadow group">
              <CardHeader className="pb-3">
                <div className="aspect-square rounded-lg overflow-hidden mb-3 bg-muted">
                  {avatar.avatar_images && avatar.avatar_images.length > 0 ? (
                    <img
                      src={avatar.avatar_images[0]}
                      alt={avatar.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <CardTitle className="text-lg truncate">{avatar.name}</CardTitle>
                <div className="space-y-2">
                  <Badge variant="outline" className="text-xs">
                    {avatar.primary_language}
                  </Badge>
                  {avatar.secondary_languages && avatar.secondary_languages.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      +{avatar.secondary_languages.length} more languages
                    </p>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewAvatar(avatar.id)}
                    className="flex-1"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleChatWithAvatar(avatar.id)}
                    className="flex-1"
                  >
                    <MessageCircle className="h-3 w-3 mr-1" />
                    Chat
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openDeleteDialog(avatar.id, avatar.name)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog(prev => ({ ...prev, open }))}
        onConfirm={handleDeleteAvatar}
        title="Delete Avatar"
        description="Are you sure you want to delete"
        itemName={deleteDialog.avatarName}
      />
    </div>
  );
};

export default MyAvatarSection;
