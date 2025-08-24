
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User, Globe, Calendar, FileText, BookOpen, Shield, Edit } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
        created_at: data.created_at
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
    navigate(`/create-avatar?edit=${id}`);
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
            <Button onClick={() => navigate('/dashboard?section=my-avatars')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to My Avatars
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/dashboard?section=my-avatars')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to My Avatars
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{avatar.name}</h1>
              <p className="text-muted-foreground">
                {avatar.age} years old • {avatar.gender} • {avatar.origin_country}
              </p>
            </div>
          </div>
          <Button onClick={handleEditAvatar} className="btn-hero">
            <Edit className="h-4 w-4 mr-2" />
            Edit Avatar
          </Button>
        </div>

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
                {avatar.avatar_images && avatar.avatar_images.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {avatar.avatar_images.map((image: string, index: number) => (
                      <div key={index} className="aspect-square rounded-lg overflow-hidden bg-muted">
                        <img
                          src={image}
                          alt={`${avatar.name} ${index + 1}`}
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

            {/* Backstory */}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarDetail;
