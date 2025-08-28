import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, User, Globe, Calendar, FileText, BookOpen, Shield, Edit, Grid3X3, Info } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useBackNavigation } from '@/hooks/useBackNavigation';

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
  created_at: string;
  status?: string;
}

interface KnowledgeFile {
  id: string;
  file_name: string;
  file_size: number;
  uploaded_at: string;
  content_type: string;
}

const AvatarDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { goBack } = useBackNavigation();
  const [avatar, setAvatar] = useState<Avatar | null>(null);
  const [knowledgeFiles, setKnowledgeFiles] = useState<KnowledgeFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user && id) {
      fetchAvatar();
      fetchKnowledgeFiles();
    }
  }, [user, id]);

  // Set up real-time updates for avatar changes
  useEffect(() => {
    if (!id || !user) return;

    const channel = supabase
      .channel('avatar-detail-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'avatars',
          filter: `id=eq.${id}`
        },
        (payload) => {
          console.log('Avatar updated:', payload);
          if (payload.new) {
            fetchAvatar();
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'avatar_knowledge_files',
          filter: `avatar_id=eq.${id}`
        },
        (payload) => {
          console.log('Knowledge files updated:', payload);
          fetchKnowledgeFiles();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, user]);

  const fetchAvatar = async () => {
    if (!user || !id) return;
    
    try {
      const { data, error } = await supabase
        .from('avatars')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          toast({
            title: "Avatar Not Found",
            description: "The avatar you're looking for doesn't exist or you don't have permission to view it.",
            variant: "destructive"
          });
          navigate('/dashboard?section=my-avatars');
          return;
        }
        throw error;
      }

      // Transform the data to match our Avatar interface
      const avatarData: Avatar = {
        id: data.id,
        name: data.name,
        avatar_images: data.avatar_images || [],
        primary_language: data.primary_language,
        secondary_languages: data.secondary_languages || [],
        origin_country: data.origin_country,
        age: data.age,
        gender: data.gender,
        backstory: data.backstory || '',
        personality_traits: data.personality_traits || [],
        hidden_rules: data.hidden_rules || '',
        created_at: data.created_at,
        status: data.status
      };

      setAvatar(avatarData);
    } catch (error: any) {
      console.error('Error fetching avatar:', error);
      toast({
        title: "Error",
        description: "Failed to load avatar details.",
        variant: "destructive"
      });
      navigate('/dashboard?section=my-avatars');
    }
  };

  const fetchKnowledgeFiles = async () => {
    if (!user || !id) return;
    
    try {
      const { data, error } = await supabase
        .from('avatar_knowledge_files')
        .select('id, file_name, file_size, uploaded_at, content_type')
        .eq('avatar_id', id)
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditAvatar = () => {
    navigate(`/create-avatar/${id}`);
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
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              <div className="h-64 bg-gray-200 rounded-lg"></div>
              <div className="h-32 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!avatar) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Avatar Not Found</h1>
            <Button onClick={goBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header with Back Button */}
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={goBack}
            className="mr-4"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">{avatar.name}</h1>
        </div>

        {/* Profile Header Section - Instagram Style */}
        <div className="flex flex-col sm:flex-row gap-6 mb-8">
          {/* Profile Avatar */}
          <div className="flex-shrink-0">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden bg-muted border-4 border-border">
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
          </div>

          {/* Profile Info */}
          <div className="flex-1 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <h2 className="text-2xl font-normal">{avatar.name}</h2>
              <Button onClick={handleEditAvatar} variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>

            {/* Stats */}
            <div className="flex gap-8">
              <div className="text-center">
                <div className="font-semibold">{avatar.avatar_images?.length || 0}</div>
                <div className="text-sm text-muted-foreground">media</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">{knowledgeFiles.length}</div>
                <div className="text-sm text-muted-foreground">files</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">{avatar.personality_traits?.length || 0}</div>
                <div className="text-sm text-muted-foreground">traits</div>
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <div className="font-semibold">{avatar.age} years old • {avatar.gender} • {avatar.origin_country}</div>
              {avatar.backstory && (
                <div className="text-sm leading-relaxed max-w-md">
                  {avatar.backstory.length > 100 
                    ? `${avatar.backstory.substring(0, 100)}...` 
                    : avatar.backstory}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="media" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="media" className="flex items-center gap-2">
              <Grid3X3 className="h-4 w-4" />
              Media
            </TabsTrigger>
            <TabsTrigger value="about" className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              About
            </TabsTrigger>
          </TabsList>

          {/* Media Tab */}
          <TabsContent value="media" className="space-y-6">
            {avatar.avatar_images && avatar.avatar_images.length > 0 ? (
              <div className="grid grid-cols-3 gap-1 sm:gap-2">
                {avatar.avatar_images.map((image: string, index: number) => (
                  <div key={index} className="aspect-square bg-muted rounded-lg overflow-hidden">
                    <img
                      src={image}
                      alt={`${avatar.name} ${index + 1}`}
                      className="w-full h-full object-cover hover:opacity-90 transition-opacity cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No media files yet</p>
              </div>
            )}
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about" className="space-y-6">
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
                    <Badge variant="default">{avatar.primary_language}</Badge>
                  </div>
                  {avatar.secondary_languages && avatar.secondary_languages.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Secondary Languages</p>
                      <div className="flex flex-wrap gap-2">
                        {avatar.secondary_languages.map((lang: string, index: number) => (
                          <Badge key={index} variant="outline">{lang}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Personality Traits */}
            {avatar.personality_traits && avatar.personality_traits.length > 0 && (
              <Card className="card-modern">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personality Traits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {avatar.personality_traits.map((trait: string, index: number) => (
                      <Badge key={index} variant="secondary">{trait}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Full Backstory */}
            {avatar.backstory && (
              <Card className="card-modern">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Backstory
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {avatar.backstory}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Basic Information */}
            <Card className="card-modern">
              <CardHeader>
                <CardTitle>Profile Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Age</p>
                    <p className="font-medium">{avatar.age} years old</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Gender</p>
                    <p className="font-medium capitalize">{avatar.gender}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Origin Country</p>
                  <p className="font-medium">{avatar.origin_country}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-medium">
                    {new Date(avatar.created_at).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>

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
            {avatar.hidden_rules && (
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
                    {avatar.hidden_rules}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AvatarDetail;
