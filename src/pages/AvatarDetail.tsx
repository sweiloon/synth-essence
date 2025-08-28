import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ArrowLeft, 
  Grid3X3, 
  User, 
  Globe, 
  FileText, 
  BookOpen, 
  Shield, 
  Edit, 
  Heart,
  MessageCircle,
  Share,
  MoreHorizontal
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useBackNavigation } from '@/hooks/useBackNavigation';

interface AvatarData {
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
  const [avatar, setAvatar] = useState<AvatarData | null>(null);
  const [knowledgeFiles, setKnowledgeFiles] = useState<KnowledgeFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('media');

  useEffect(() => {
    console.log('AvatarDetail: Component loaded with Instagram-style UI');
    console.log('AvatarDetail: Avatar ID from params:', id);
    console.log('AvatarDetail: User authenticated:', !!user);
    
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
    
    console.log('🔥 AvatarDetail: Loading NEW Instagram-Style UI v2.0 for avatar:', id);
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
      const avatarData: AvatarData = {
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
        mbti_type: data.mbti_type || '',
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
            <div className="h-8 bg-muted rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              <div className="h-64 bg-muted rounded-lg"></div>
              <div className="h-32 bg-muted rounded-lg"></div>
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

  console.log('AvatarDetail: Component rendering, activeTab:', activeTab);
  
  console.log('🎨 Rendering Instagram-Style Avatar Detail UI v3.0');
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={goBack}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">{avatar.name}</h1>
        </div>

        {/* Profile Header - Instagram Style */}
        <div className="mb-8">
          <div className="flex items-start gap-6 mb-6">
            {/* Profile Avatar */}
            <div className="flex-shrink-0">
              <Avatar className="w-20 h-20 md:w-32 md:h-32 border-2 border-border">
                <AvatarImage 
                  src={avatar.avatar_images?.[0]} 
                  alt={avatar.name}
                  className="object-cover"
                />
                <AvatarFallback className="text-xl md:text-2xl">
                  {avatar.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Profile Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-4">
                <h2 className="text-lg md:text-xl font-light">{avatar.name}</h2>
                <div className="flex gap-2">
                  <Button onClick={handleEditAvatar} variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-6 md:gap-8 mb-4">
                <div className="text-center">
                  <div className="font-semibold text-sm md:text-base">{avatar.avatar_images?.length || 0}</div>
                  <div className="text-xs md:text-sm text-muted-foreground">Images</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-sm md:text-base">{knowledgeFiles.length}</div>
                  <div className="text-xs md:text-sm text-muted-foreground">Files</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-sm md:text-base">{avatar.personality_traits?.length || 0}</div>
                  <div className="text-xs md:text-sm text-muted-foreground">Traits</div>
                </div>
              </div>

              {/* Bio Preview */}
              <div className="space-y-1">
                <div className="text-sm font-semibold">{avatar.name}</div>
                <div className="text-sm text-muted-foreground">
                  {avatar.age} years old • {avatar.gender} • {avatar.origin_country}
                </div>
                {avatar.backstory && (
                  <div className="text-sm text-muted-foreground line-clamp-3 mt-2">
                    {avatar.backstory.length > 100 ? `${avatar.backstory.substring(0, 100)}...` : avatar.backstory}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button className="flex-1" variant="default">
              <MessageCircle className="h-4 w-4 mr-2" />
              Chat
            </Button>
            <Button className="flex-1" variant="outline">
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-0">
            <TabsTrigger value="media" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none pb-3">
              <Grid3X3 className="h-4 w-4" />
              Images
            </TabsTrigger>
            <TabsTrigger value="about" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none pb-3">
              <User className="h-4 w-4" />
              About
            </TabsTrigger>
          </TabsList>

          {/* Media Tab */}
          <TabsContent value="media" className="mt-6">
            {avatar.avatar_images && avatar.avatar_images.length > 0 ? (
              <div className="grid grid-cols-3 gap-1">
                {avatar.avatar_images.map((image: string, index: number) => (
                  <div key={index} className="aspect-square relative group cursor-pointer">
                    <img
                      src={image}
                      alt={`${avatar.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-4 text-white">
                        <Heart className="h-5 w-5" />
                        <MessageCircle className="h-5 w-5" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Grid3X3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No images yet</h3>
                <p className="text-muted-foreground">Upload some images to see them here</p>
                <Button 
                  onClick={handleEditAvatar} 
                  variant="outline" 
                  size="sm" 
                  className="mt-4"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Add Images
                </Button>
              </div>
            )}
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about" className="mt-6">
            <div className="space-y-6">
              {/* About Section */}
              {avatar.backstory && (
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      About
                    </h3>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {avatar.backstory}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Languages */}
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Languages
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Primary</p>
                      <Badge variant="default">{avatar.primary_language}</Badge>
                    </div>
                    {avatar.secondary_languages && avatar.secondary_languages.length > 0 && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Secondary</p>
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
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Personality
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {avatar.personality_traits.map((trait: string, index: number) => (
                        <Badge key={index} variant="secondary">{trait}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* MBTI Type */}
              {avatar.mbti_type && (
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold mb-3">MBTI Type</h3>
                    <Badge variant="default" className="text-lg px-4 py-2">{avatar.mbti_type}</Badge>
                  </CardContent>
                </Card>
              )}

              {/* Knowledge Base */}
              {knowledgeFiles && knowledgeFiles.length > 0 && (
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Knowledge Base ({knowledgeFiles.length} files)
                    </h3>
                    <div className="space-y-2">
                      {knowledgeFiles.map((file: KnowledgeFile) => (
                        <div key={file.id} className="flex items-center gap-3 p-3 border rounded-lg">
                          <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{file.file_name}</p>
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
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Hidden Rules */}
              {avatar.hidden_rules && (
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Hidden Rules & Instructions
                    </h3>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {avatar.hidden_rules}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Basic Info */}
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-3">Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Age</p>
                      <p className="font-medium">{avatar.age} years old</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Gender</p>
                      <p className="font-medium capitalize">{avatar.gender}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Origin</p>
                      <p className="font-medium">{avatar.origin_country}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Created</p>
                      <p className="font-medium">
                        {new Date(avatar.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AvatarDetail;