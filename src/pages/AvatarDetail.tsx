import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AvatarStatus } from '@/components/chatbot-training/AvatarStatus';

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
  knowledge_files: any[];
  hidden_rules: string;
  created_at: string;
}

const AvatarDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [avatar, setAvatar] = useState<Avatar | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user && id) {
      fetchAvatar();
    }
  }, [user, id]);

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
          navigate('/dashboard');
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
        knowledge_files: Array.isArray(data.knowledge_files) ? data.knowledge_files : [],
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
      navigate('/dashboard');
    } finally {
      setIsLoading(false);
    }
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
            <Button onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Transform avatar data to match the expected format for AvatarStatus component
  const avatarStatusData = {
    id: avatar.id,
    name: avatar.name,
    primaryLanguage: avatar.primary_language,
    secondaryLanguages: avatar.secondary_languages || [],
    backstory: avatar.backstory || '',
    knowledgeFiles: avatar.knowledge_files || [],
    hiddenRules: avatar.hidden_rules || ''
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{avatar.name}</h1>
            <p className="text-muted-foreground">
              {avatar.age} years old • {avatar.gender} • {avatar.origin_country}
            </p>
          </div>
        </div>

        {/* Avatar Status Component */}
        <AvatarStatus avatar={avatarStatusData} />
      </div>
    </div>
  );
};

export default AvatarDetail;
