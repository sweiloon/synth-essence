
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus, User, MessageCircle, Edit, Trash2, ArrowLeft, Globe, BookOpen, Shield, FileText, QrCode, Grid3X3, Heart, Share, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DeleteConfirmationDialog } from '@/components/ui/delete-confirmation-dialog';
import AvatarAssignSection from '@/components/dashboard/sections/AvatarAssignSection';

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
  const [assigningAvatar, setAssigningAvatar] = useState<Avatar | null>(null);
  const [knowledgeFiles, setKnowledgeFiles] = useState<KnowledgeFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [activeTab, setActiveTab] = useState('media');
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
    setAssigningAvatar(null);
    setKnowledgeFiles([]);
  };

  const handleEditAvatar = (avatarId: string) => {
    navigate(`/create-avatar/${avatarId}`);
  };

  const handleChatWithAvatar = (avatarId: string) => {
    // Navigate to dashboard with chatbot section and pre-selected avatar
    navigate(`/dashboard?section=chatbot&avatar=${avatarId}`);
  };

  const handleAssignAvatar = (avatar: Avatar) => {
    setAssigningAvatar(avatar);
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
      
      // If the deleted avatar was currently selected or being assigned, go back to list
      if ((selectedAvatar && selectedAvatar.id === deleteDialog.avatarId) || 
          (assigningAvatar && assigningAvatar.id === deleteDialog.avatarId)) {
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

  // Show avatar assign view
  if (assigningAvatar) {
    return (
      <AvatarAssignSection 
        avatar={assigningAvatar} 
        onBack={handleBackToList}
      />
    );
  }

  // Show avatar details view - INSTAGRAM STYLE UI
  if (selectedAvatar) {
    return (
      <div className="max-w-4xl mx-auto">
        {/* Very visible indicator */}
        <div className="w-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white text-center py-3 text-sm font-bold mb-6 rounded-lg">
          🚀 INSTAGRAM-STYLE AVATAR DETAIL UI LOADED! 🚀
        </div>

        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-8 border-b border-border pb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToList}
            className="p-2 hover:bg-muted/50 rounded-full"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-bold">{selectedAvatar.name}</h1>
          <div className="ml-auto">
            <span className="text-xs bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-1 rounded-full font-bold">
              NEW UI ✨
            </span>
          </div>
        </div>

        {isLoadingDetails ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
            <p className="text-lg text-muted-foreground">Loading Instagram-style avatar details...</p>
          </div>
        ) : (
          <>
            {/* Instagram-Style Profile Header */}
            <div className="mb-10">
              <div className="flex items-start gap-8 mb-8">
                {/* Large Profile Avatar with Instagram-style gradient border */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="w-40 h-40 p-1 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 rounded-full">
                      <Avatar className="w-full h-full border-4 border-background">
                        <AvatarImage 
                          src={selectedAvatar.avatar_images?.[0]} 
                          alt={selectedAvatar.name}
                          className="object-cover"
                        />
                        <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-primary/20 to-secondary/20">
                          {selectedAvatar.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                </div>

                {/* Profile Info Section */}
                <div className="flex-1 min-w-0 pt-4">
                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    <h2 className="text-3xl font-light tracking-wide">{selectedAvatar.name}</h2>
                    <Button 
                      onClick={() => handleEditAvatar(selectedAvatar.id)} 
                      variant="outline" 
                      size="sm" 
                      className="px-6 font-semibold border-2 hover:bg-primary hover:text-primary-foreground transition-all"
                    >
                      Edit Profile
                    </Button>
                    <Button variant="outline" size="sm" className="p-2">
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* Instagram-style Stats Row */}
                  <div className="flex gap-10 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{selectedAvatar.avatar_images?.length || 0}</div>
                      <div className="text-sm text-muted-foreground font-medium tracking-wide">posts</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{knowledgeFiles.length}</div>
                      <div className="text-sm text-muted-foreground font-medium tracking-wide">files</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{selectedAvatar.personality_traits?.length || 0}</div>
                      <div className="text-sm text-muted-foreground font-medium tracking-wide">traits</div>
                    </div>
                  </div>

                  {/* Bio Section with Instagram styling */}
                  <div className="space-y-3 max-w-lg">
                    <div className="font-bold text-base">
                      {selectedAvatar.age} • {selectedAvatar.gender} • {selectedAvatar.origin_country}
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold text-blue-600">🌐 {selectedAvatar.primary_language}</span>
                      {selectedAvatar.secondary_languages && selectedAvatar.secondary_languages.length > 0 && (
                        <span className="text-muted-foreground ml-2">
                          +{selectedAvatar.secondary_languages.length} more languages
                        </span>
                      )}
                    </div>
                    {selectedAvatar.backstory && (
                      <div className="text-sm leading-relaxed">
                        {selectedAvatar.backstory.length > 120 
                          ? `${selectedAvatar.backstory.slice(0, 120)}...` 
                          : selectedAvatar.backstory
                        }
                      </div>
                    )}
                    {selectedAvatar.personality_traits && selectedAvatar.personality_traits.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {selectedAvatar.personality_traits.slice(0, 4).map((trait: string, index: number) => (
                          <span key={index} className="text-xs px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                            #{trait.toLowerCase().replace(/\s+/g, '')}
                          </span>
                        ))}
                        {selectedAvatar.personality_traits.length > 4 && (
                          <span className="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-full font-medium">
                            +{selectedAvatar.personality_traits.length - 4} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons - Instagram Style */}
              <div className="flex gap-3">
                <Button 
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg" 
                  onClick={() => handleChatWithAvatar(selectedAvatar.id)}
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Message
                </Button>
                <Button className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-lg">
                  <Share className="h-5 w-5 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Instagram-Style Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 h-12 bg-muted/30">
                <TabsTrigger value="media" className="flex items-center gap-2 text-base font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Grid3X3 className="h-5 w-5" />
                  POSTS
                </TabsTrigger>
                <TabsTrigger value="about" className="flex items-center gap-2 text-base font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <User className="h-5 w-5" />
                  ABOUT
                </TabsTrigger>
              </TabsList>

              {/* POSTS Tab - Instagram Grid */}
              <TabsContent value="media" className="mt-0">
                {selectedAvatar.avatar_images && selectedAvatar.avatar_images.length > 0 ? (
                  <div className="grid grid-cols-3 gap-px">
                    {selectedAvatar.avatar_images.map((image: string, index: number) => (
                      <div key={index} className="aspect-square relative group cursor-pointer overflow-hidden bg-muted">
                        <img
                          src={image}
                          alt={`${selectedAvatar.name} ${index + 1}`}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 flex gap-8 text-white">
                            <div className="flex items-center gap-2 text-lg font-bold">
                              <Heart className="h-6 w-6" />
                              <span>Like</span>
                            </div>
                            <div className="flex items-center gap-2 text-lg font-bold">
                              <MessageCircle className="h-6 w-6" />
                              <span>View</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Fill remaining grid spots */}
                    {selectedAvatar.avatar_images.length % 3 !== 0 && (
                      Array.from({ length: 3 - (selectedAvatar.avatar_images.length % 3) }).map((_, index) => (
                        <div key={`placeholder-${index}`} className="aspect-square bg-transparent"></div>
                      ))
                    )}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-muted/50 mb-6">
                      <Grid3X3 className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">No posts yet</h3>
                    <p className="text-muted-foreground text-lg mb-6">When you share photos, they'll appear on your profile.</p>
                    <Button 
                      onClick={() => handleEditAvatar(selectedAvatar.id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-8 py-3 rounded-lg text-lg"
                    >
                      <Edit className="h-5 w-5 mr-2" />
                      Add Your First Photo
                    </Button>
                  </div>
                )}
              </TabsContent>

              {/* ABOUT Tab */}
              <TabsContent value="about" className="mt-0">
                <div className="space-y-8 max-w-2xl">
                  {/* Full Bio */}
                  {selectedAvatar.backstory && (
                    <div className="space-y-3">
                      <h3 className="text-xl font-bold flex items-center gap-2">
                        <BookOpen className="h-6 w-6 text-blue-500" />
                        About {selectedAvatar.name}
                      </h3>
                      <p className="text-base leading-relaxed whitespace-pre-wrap bg-muted/30 p-4 rounded-lg">
                        {selectedAvatar.backstory}
                      </p>
                    </div>
                  )}

                  {/* Languages Section */}
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <Globe className="h-6 w-6 text-green-500" />
                      Languages
                    </h3>
                    <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                      <div>
                        <p className="text-sm font-semibold text-muted-foreground mb-2">Primary Language</p>
                        <Badge variant="default" className="text-base px-4 py-2">{selectedAvatar.primary_language}</Badge>
                      </div>
                      {selectedAvatar.secondary_languages && selectedAvatar.secondary_languages.length > 0 && (
                        <div>
                          <p className="text-sm font-semibold text-muted-foreground mb-2">Also speaks</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedAvatar.secondary_languages.map((lang: string, index: number) => (
                              <Badge key={index} variant="outline" className="text-sm px-3 py-1">{lang}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Personality Traits */}
                  {selectedAvatar.personality_traits && selectedAvatar.personality_traits.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-xl font-bold flex items-center gap-2">
                        <User className="h-6 w-6 text-purple-500" />
                        Personality Traits
                      </h3>
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <div className="flex flex-wrap gap-3">
                          {selectedAvatar.personality_traits.map((trait: string, index: number) => (
                            <Badge key={index} variant="secondary" className="text-sm px-4 py-2 font-medium">{trait}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* MBTI Type */}
                  {selectedAvatar.mbti_type && (
                    <div className="space-y-3">
                      <h3 className="text-xl font-bold">MBTI Personality Type</h3>
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <Badge variant="default" className="text-2xl px-6 py-3 font-bold">{selectedAvatar.mbti_type}</Badge>
                      </div>
                    </div>
                  )}

                  {/* Knowledge Base */}
                  {knowledgeFiles && knowledgeFiles.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-xl font-bold flex items-center gap-2">
                        <FileText className="h-6 w-6 text-orange-500" />
                        Knowledge Base ({knowledgeFiles.length} files)
                      </h3>
                      <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                        {knowledgeFiles.map((file: KnowledgeFile) => (
                          <div key={file.id} className="flex items-center gap-4 p-3 bg-background rounded-lg border">
                            <div className="bg-blue-100 p-2 rounded-lg">
                              <FileText className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold truncate">{file.file_name}</p>
                              <div className="flex items-center gap-3 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {file.content_type === 'application/pdf' ? 'PDF' : 'FILE'}
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                  {formatFileSize(file.file_size)}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  {new Date(file.uploaded_at).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Hidden Rules */}
                  {selectedAvatar.hidden_rules && (
                    <div className="space-y-3">
                      <h3 className="text-xl font-bold flex items-center gap-2">
                        <Shield className="h-6 w-6 text-red-500" />
                        Special Instructions
                      </h3>
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {selectedAvatar.hidden_rules}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Basic Info Summary */}
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold">Basic Information</h3>
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-semibold text-muted-foreground">Age</p>
                          <p className="text-lg font-medium">{selectedAvatar.age} years old</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-muted-foreground">Gender</p>
                          <p className="text-lg font-medium capitalize">{selectedAvatar.gender}</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-muted-foreground">Origin</p>
                          <p className="text-lg font-medium">{selectedAvatar.origin_country}</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-muted-foreground">Created</p>
                          <p className="text-lg font-medium">
                            {new Date(selectedAvatar.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </>
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
                    onClick={() => handleAssignAvatar(avatar)}
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
