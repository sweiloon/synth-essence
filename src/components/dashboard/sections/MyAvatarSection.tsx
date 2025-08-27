
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, User, MessageCircle, Edit, Trash2, ArrowLeft, Globe, BookOpen, Shield, FileText, QrCode } from 'lucide-react';
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
  origin_country: string;
  age: number;
  gender: string;
  backstory: string;
  personality_traits: string[];
  hidden_rules: string;
  mbti_type: string;
  created_at: string;
}

interface KnowledgeFile {
  id: string;
  file_name: string;
  file_size: number;
  uploaded_at: string;
  content_type: string;
}

const MyAvatarSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(null);
  const [knowledgeFiles, setKnowledgeFiles] = useState<KnowledgeFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
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
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
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

  const fetchKnowledgeFiles = async (avatarId: string) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('avatar_knowledge_files')
        .select('id, file_name, file_size, uploaded_at, content_type')
        .eq('avatar_id', avatarId)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .eq('is_linked', true)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;

      setKnowledgeFiles(data || []);
    } catch (error: any) {
      console.error('Error fetching knowledge files:', error);
      toast({
        title: "Error",
        description: "Failed to load knowledge files.",
        variant: "destructive"
      });
    }
  };

  const handleCreateNewAvatar = () => {
    navigate('/create-avatar');
  };

  const handleViewAvatar = async (avatar: Avatar) => {
    setIsLoadingDetails(true);
    setSelectedAvatar(avatar);
    await fetchKnowledgeFiles(avatar.id);
    setIsLoadingDetails(false);
  };

  const handleBackToList = () => {
    setSelectedAvatar(null);
    setKnowledgeFiles([]);
  };

  const handleEditAvatar = (avatarId: string) => {
    navigate(`/create-avatar/${avatarId}`);
  };

  const handleChatWithAvatar = (avatarId: string) => {
    // Navigate to dashboard with chatbot section and pre-selected avatar
    navigate(`/dashboard?section=chatbot&avatar=${avatarId}`);
  };

  const handleAssignAvatar = (avatarId: string) => {
    navigate(`/assign-avatar/${avatarId}`);
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
      // Use the soft delete function instead of direct delete
      const { error } = await supabase.rpc('soft_delete_avatar', {
        avatar_id_param: deleteDialog.avatarId,
        deletion_reason_param: 'User requested deletion via dashboard'
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Avatar Moved to Trash",
        description: `${deleteDialog.avatarName} has been moved to trash. It will be permanently deleted after 90 days.`,
      });

      // Refresh the avatars list
      fetchAvatars();
      
      // If the deleted avatar was currently selected, go back to list
      if (selectedAvatar && selectedAvatar.id === deleteDialog.avatarId) {
        handleBackToList();
      }
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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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

  // Show avatar details view
  if (selectedAvatar) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBackToList}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{selectedAvatar.name}</h1>
              <p className="text-muted-foreground">
                {selectedAvatar.age} years old • {selectedAvatar.gender} • {selectedAvatar.origin_country}
              </p>
            </div>
          </div>
          <Button onClick={() => handleEditAvatar(selectedAvatar.id)} className="btn-hero">
            <Edit className="h-4 w-4 mr-2" />
            Edit Avatar
          </Button>
        </div>

        {isLoadingDetails ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-4">Loading avatar details...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Avatar Images and Basic Info */}
            <div className="space-y-6">
              {/* Avatar Images */}
              <Card className="card-modern">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Avatar Images
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedAvatar.avatar_images && selectedAvatar.avatar_images.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3">
                      {selectedAvatar.avatar_images.map((image: string, index: number) => (
                        <div key={index} className="aspect-square rounded-lg overflow-hidden bg-muted">
                          <img
                            src={image}
                            alt={`${selectedAvatar.name} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="aspect-square rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                      <User className="h-16 w-16 text-muted-foreground" />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Basic Information */}
              <Card className="card-modern">
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Age</p>
                      <p className="font-medium">{selectedAvatar.age} years old</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Gender</p>
                      <p className="font-medium capitalize">{selectedAvatar.gender}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Origin Country</p>
                    <p className="font-medium">{selectedAvatar.origin_country}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Created</p>
                    <p className="font-medium">
                      {new Date(selectedAvatar.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Detailed Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Languages */}
              <Card className="card-modern">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Languages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Primary Language</p>
                      <Badge variant="default">{selectedAvatar.primary_language}</Badge>
                    </div>
                    {selectedAvatar.secondary_languages && selectedAvatar.secondary_languages.length > 0 && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Secondary Languages</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedAvatar.secondary_languages.map((lang: string, index: number) => (
                            <Badge key={index} variant="outline">{lang}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Personality Traits */}
              {selectedAvatar.personality_traits && selectedAvatar.personality_traits.length > 0 && (
                <Card className="card-modern">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Personality Traits
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {selectedAvatar.personality_traits.map((trait: string, index: number) => (
                        <Badge key={index} variant="secondary">{trait}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* MBTI Type */}
              {selectedAvatar.mbti_type && (
                <Card className="card-modern">
                  <CardHeader>
                    <CardTitle>MBTI Type</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="default" className="text-lg px-4 py-2">{selectedAvatar.mbti_type}</Badge>
                  </CardContent>
                </Card>
              )}

              {/* Backstory */}
              {selectedAvatar.backstory && (
                <Card className="card-modern">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Backstory
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {selectedAvatar.backstory}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Knowledge Base */}
              {knowledgeFiles && knowledgeFiles.length > 0 && (
                <Card className="card-modern">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Knowledge Base ({knowledgeFiles.length} files)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {knowledgeFiles.map((file: KnowledgeFile) => (
                        <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-primary" />
                            <div>
                              <p className="text-sm font-medium">{file.file_name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {file.content_type === 'application/pdf' ? 'PDF' : 'FILE'}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {formatFileSize(file.file_size)}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(file.uploaded_at).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Hidden Rules */}
              {selectedAvatar.hidden_rules && (
                <Card className="card-modern">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Hidden Rules & Instructions
                    </CardTitle>
                    <CardDescription>
                      Special instructions and constraints for this avatar
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {selectedAvatar.hidden_rules}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Show avatars list view
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
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewAvatar(avatar)}
                    className="flex-1"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAssignAvatar(avatar.id)}
                    className="flex-1"
                  >
                    <QrCode className="h-3 w-3 mr-1" />
                    Assign
                  </Button>
                </div>
                <div className="flex items-center gap-2">
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
