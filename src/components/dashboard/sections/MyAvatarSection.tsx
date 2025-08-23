import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, User, Globe, Eye, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface Avatar {
  id: string;
  name: string;
  avatar_images: string[];
  primary_language: string;
  secondary_languages: string[];
  origin_country: string;
  age: number;
  gender: string;
  created_at: string;
}

const MyAvatarSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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
        .select('*')
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

  const handleDeleteAvatar = async (avatarId: string) => {
    setDeletingId(avatarId);
    try {
      const { error } = await supabase
        .from('avatars')
        .delete()
        .eq('id', avatarId)
        .eq('user_id', user?.id);

      if (error) {
        throw error;
      }

      setAvatars(prev => prev.filter(avatar => avatar.id !== avatarId));
      toast({
        title: "Avatar Deleted",
        description: "Avatar has been successfully deleted.",
      });
    } catch (error: any) {
      console.error('Error deleting avatar:', error);
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete avatar.",
        variant: "destructive"
      });
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <Card className="card-modern">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">My Avatars</h2>
          <p className="text-muted-foreground">Manage your AI avatars</p>
        </div>
        <Button onClick={() => navigate('/create-avatar')}>
          <Plus className="h-4 w-4 mr-2" />
          Create New Avatar
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Create New Avatar Card */}
        <Card 
          className="border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer group"
          onClick={() => navigate('/create-avatar')}
        >
          <CardContent className="flex flex-col items-center justify-center h-64 text-center p-6">
            <Plus className="h-12 w-12 text-muted-foreground group-hover:text-primary transition-colors mb-4" />
            <h3 className="font-medium text-lg mb-2">Create New Avatar</h3>
            <p className="text-sm text-muted-foreground">
              Build a custom AI avatar with your own personality and knowledge
            </p>
          </CardContent>
        </Card>

        {/* Existing Avatars */}
        {avatars.map((avatar) => (
          <Card key={avatar.id} className="card-modern overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-square bg-muted relative overflow-hidden">
              {avatar.avatar_images && avatar.avatar_images.length > 0 ? (
                <img
                  src={avatar.avatar_images[0]}
                  alt={avatar.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="h-16 w-16 text-muted-foreground" />
                </div>
              )}
            </div>
            
            <CardContent className="p-4 space-y-3">
              <div>
                <h3 className="font-semibold text-lg truncate">{avatar.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {avatar.age} years old • {avatar.gender} • {avatar.origin_country}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <Badge variant="outline" className="text-xs">
                    {avatar.primary_language}
                  </Badge>
                </div>
                
                {avatar.secondary_languages && avatar.secondary_languages.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    +{avatar.secondary_languages.length} more languages
                  </p>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate(`/avatar/${avatar.id}`)}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-destructive hover:text-destructive"
                      disabled={deletingId === avatar.id}
                    >
                      {deletingId === avatar.id ? (
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-destructive" />
                      ) : (
                        <Trash2 className="h-3 w-3" />
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Avatar</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{avatar.name}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteAvatar(avatar.id)}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {avatars.length === 0 && (
        <Card className="card-modern">
          <CardContent className="text-center py-12">
            <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Avatars Yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first AI avatar to get started with personalized AI interactions.
            </p>
            <Button onClick={() => navigate('/create-avatar')}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Avatar
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MyAvatarSection;
