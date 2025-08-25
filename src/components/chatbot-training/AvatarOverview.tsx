
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Globe, 
  MapPin, 
  Calendar, 
  BookOpen, 
  Shield, 
  Database,
  FileText,
  Brain
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface AvatarOverviewProps {
  avatarId: string;
}

interface AvatarData {
  id: string;
  name: string;
  avatar_images: string[];
  origin_country: string;
  age: number;
  gender: string;
  primary_language: string;
  secondary_languages: string[];
  personality_traits: string[];
  mbti_type: string;
  backstory: string;
  hidden_rules: string;
}

interface KnowledgeFile {
  id: string;
  file_name: string;
  file_size: number;
  content_type: string;
  uploaded_at: string;
  is_linked: boolean;
}

export const AvatarOverview: React.FC<AvatarOverviewProps> = ({ avatarId }) => {
  const { user } = useAuth();

  // Fetch avatar details
  const { data: avatar, isLoading: avatarLoading } = useQuery({
    queryKey: ['avatar-overview', avatarId],
    queryFn: async () => {
      if (!avatarId || !user?.id) return null;

      const { data, error } = await supabase
        .from('avatars')
        .select('*')
        .eq('id', avatarId)
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching avatar:', error);
        throw error;
      }

      return data as AvatarData;
    },
    enabled: !!avatarId && !!user?.id
  });

  // Fetch knowledge base files
  const { data: knowledgeFiles, isLoading: filesLoading } = useQuery({
    queryKey: ['avatar-knowledge-files', avatarId],
    queryFn: async () => {
      if (!avatarId || !user?.id) return [];

      const { data, error } = await supabase
        .from('avatar_knowledge_files')
        .select('*')
        .eq('avatar_id', avatarId)
        .eq('user_id', user.id)
        .eq('is_linked', true)
        .order('uploaded_at', { ascending: false });

      if (error) {
        console.error('Error fetching knowledge files:', error);
        return [];
      }

      return data as KnowledgeFile[];
    },
    enabled: !!avatarId && !!user?.id
  });

  if (avatarLoading || filesLoading) {
    return (
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-gray-200 h-16 w-16"></div>
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!avatar) {
    return (
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No avatar selected or avatar not found.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Avatar Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Avatar Overview: {avatar.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-6">
            {/* Avatar Image */}
            <div className="flex-shrink-0">
              <Avatar className="w-20 h-20">
                <AvatarImage 
                  src={avatar.avatar_images?.[0]} 
                  alt={avatar.name}
                />
                <AvatarFallback>
                  {avatar.name?.charAt(0)?.toUpperCase() || 'A'}
                </AvatarFallback>
              </Avatar>
              {avatar.avatar_images && avatar.avatar_images.length > 1 && (
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  +{avatar.avatar_images.length - 1} more photos
                </p>
              )}
            </div>

            {/* Basic Info */}
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{avatar.origin_country}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{avatar.age} years old</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm capitalize">{avatar.gender}</span>
                </div>
                {avatar.mbti_type && (
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-muted-foreground" />
                    <Badge variant="outline">{avatar.mbti_type}</Badge>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Languages */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Globe className="h-5 w-5" />
              Primary Language
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="default" className="text-sm">
              {avatar.primary_language}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Globe className="h-5 w-5" />
              Secondary Languages
            </CardTitle>
          </CardHeader>
          <CardContent>
            {avatar.secondary_languages && avatar.secondary_languages.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {avatar.secondary_languages.map((language, index) => (
                  <Badge key={index} variant="outline" className="text-sm">
                    {language}
                  </Badge>
                ))}
              </div>
            ) : (
              <span className="text-sm text-muted-foreground">None</span>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Personality Traits */}
      {avatar.personality_traits && avatar.personality_traits.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Brain className="h-5 w-5" />
              Personality Traits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {avatar.personality_traits.map((trait, index) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {trait}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Knowledge Base */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Database className="h-5 w-5" />
            Knowledge Base
          </CardTitle>
        </CardHeader>
        <CardContent>
          {knowledgeFiles && knowledgeFiles.length > 0 ? (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground mb-3">
                {knowledgeFiles.length} document(s) uploaded
              </p>
              {knowledgeFiles.slice(0, 5).map((file) => (
                <div key={file.id} className="flex items-center gap-3 p-2 border rounded">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium truncate">{file.file_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.file_size / 1024).toFixed(1)} KB • {file.content_type}
                    </p>
                  </div>
                </div>
              ))}
              {knowledgeFiles.length > 5 && (
                <p className="text-xs text-muted-foreground text-center pt-2">
                  And {knowledgeFiles.length - 5} more files...
                </p>
              )}
            </div>
          ) : (
            <span className="text-sm text-muted-foreground">0 documents</span>
          )}
        </CardContent>
      </Card>

      {/* Hidden Rules */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="h-5 w-5" />
            Hidden Rules
          </CardTitle>
        </CardHeader>
        <CardContent>
          {avatar.hidden_rules ? (
            <p className="text-sm whitespace-pre-wrap">{avatar.hidden_rules}</p>
          ) : (
            <span className="text-sm text-muted-foreground">Not set</span>
          )}
        </CardContent>
      </Card>

      {/* Backstory */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <BookOpen className="h-5 w-5" />
            Backstory
          </CardTitle>
        </CardHeader>
        <CardContent>
          {avatar.backstory ? (
            <p className="text-sm whitespace-pre-wrap">{avatar.backstory}</p>
          ) : (
            <span className="text-sm text-muted-foreground">No backstory provided</span>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
