
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, MessageCircle, Save, X, User } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

import { AvatarDetailStep } from '@/components/avatar-creation/AvatarDetailStep';
import { AvatarPersonaStep } from '@/components/avatar-creation/AvatarPersonaStep';
import { BackstoryStep } from '@/components/avatar-creation/BackstoryStep';
import { HiddenRulesStep } from '@/components/avatar-creation/HiddenRulesStep';
import { KnowledgeBaseStep } from '@/components/avatar-creation/KnowledgeBaseStep';

interface Avatar {
  id: string;
  name: string;
  age: number | null;
  gender: string | null;
  origin_country: string;
  primary_language: string;
  secondary_languages: string[];
  avatar_images: string[];
  personality_traits: string[];
  mbti_type: string;
  backstory: string;
  hidden_rules: string;
  created_at: string;
}

const AvatarDetail = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { avatarId } = useParams();
  const { toast } = useToast();

  const [avatar, setAvatar] = useState<Avatar | null>(null);
  const [knowledgeFiles, setKnowledgeFiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    age: null,
    gender: '',
    originCountry: 'Malaysia',
    primaryLanguage: 'English',
    secondaryLanguages: [],
    avatarImages: [],
    personalityTraits: [],
    mbtiType: '',
    backstory: '',
    hiddenRules: '',
  });

  useEffect(() => {
    if (avatarId && user) {
      fetchAvatar();
      fetchKnowledgeFiles();
    }
  }, [avatarId, user]);

  const fetchAvatar = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('avatars')
        .select('*')
        .eq('id', avatarId)
        .single();

      if (error) {
        throw error;
      }

      setAvatar(data);
    } catch (error: any) {
      console.error('Error fetching avatar:', error);
      setError(error.message || 'Failed to load avatar details.');
      toast({
        title: "Error",
        description: "Failed to load avatar details.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchKnowledgeFiles = async () => {
    try {
      const { data, error } = await supabase
        .from('avatar_knowledge_files')
        .select('*')
        .eq('avatar_id', avatarId);

      if (error) {
        throw error;
      }

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

  useEffect(() => {
    if (!avatarId || !user) return;

    const setupRealtimeUpdates = async () => {
      const backstoryChannel = supabase
        .channel(`backstory-changes-${avatarId}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'avatars',
            filter: `id=eq.${avatarId}`
          },
          (payload) => {
            console.log('Backstory updated (realtime):', payload);
            if (payload.new) {
              setAvatar(prevAvatar => prevAvatar ? {
                ...prevAvatar,
                backstory: (payload.new as any).backstory || ''
              } : null);
            }
          }
        )
        .subscribe();

      const hiddenRulesChannel = supabase
        .channel(`hidden-rules-changes-${avatarId}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'avatars',
            filter: `id=eq.${avatarId}`
          },
          (payload) => {
            console.log('Hidden rules updated (realtime):', payload);
            if (payload.new) {
              setAvatar(prevAvatar => prevAvatar ? {
                ...prevAvatar,
                hidden_rules: (payload.new as any).hidden_rules || ''
              } : null);
            }
          }
        )
        .subscribe();
    };

    setupRealtimeUpdates();

    return () => {
      supabase.removeAllChannels();
    };
  }, [avatarId, user]);

  useEffect(() => {
    if (avatar) {
      // Populate edit form with existing avatar data
      setEditData({
        name: avatar.name || '',
        age: avatar.age || null,
        gender: avatar.gender || '',
        originCountry: avatar.origin_country || 'Malaysia',
        primaryLanguage: avatar.primary_language || 'English',
        secondaryLanguages: avatar.secondary_languages || [],
        avatarImages: avatar.avatar_images || [],
        personalityTraits: avatar.personality_traits || [],
        mbtiType: avatar.mbti_type || '',
        backstory: avatar.backstory || '',
        hiddenRules: avatar.hidden_rules || '',
      });
    }
  }, [avatar]);

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset edit data to current avatar data when canceling
      if (avatar) {
        setEditData({
          name: avatar.name || '',
          age: avatar.age || null,
          gender: avatar.gender || '',
          originCountry: avatar.origin_country || 'Malaysia',
          primaryLanguage: avatar.primary_language || 'English',
          secondaryLanguages: avatar.secondary_languages || [],
          avatarImages: avatar.avatar_images || [],
          personalityTraits: avatar.personality_traits || [],
          mbtiType: avatar.mbti_type || '',
          backstory: avatar.backstory || '',
          hiddenRules: avatar.hidden_rules || '',
        });
      }
    }
    setIsEditing(!isEditing);
  };

  const updateEditData = (field: string, value: any) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!avatar || !user) return;

    try {
      const { error } = await supabase
        .from('avatars')
        .update({
          name: editData.name,
          age: editData.age,
          gender: editData.gender,
          origin_country: editData.originCountry,
          primary_language: editData.primaryLanguage,
          secondary_languages: editData.secondaryLanguages,
          avatar_images: editData.avatarImages,
          personality_traits: editData.personalityTraits,
          mbti_type: editData.mbtiType,
          backstory: editData.backstory,
          hidden_rules: editData.hiddenRules,
          updated_at: new Date().toISOString(),
        })
        .eq('id', avatar.id);

      if (error) {
        throw error;
      }

      setIsEditing(false);
      
      toast({
        title: "Avatar Updated",
        description: "Your avatar has been successfully updated.",
      });

      // Refresh avatar data
      fetchAvatar();
    } catch (error: any) {
      console.error('Error updating avatar:', error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update avatar. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <div className="container mx-auto max-w-4xl py-8">
          <Card className="card-modern">
            <CardContent className="p-8">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="animate-pulse p-4 rounded-full bg-muted/20">
                  <User className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-muted-foreground">
                  Loading avatar details...
                </h3>
                <p className="text-sm text-muted-foreground">
                  Please wait while we fetch the avatar information.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <div className="container mx-auto max-w-4xl py-8">
          <Card className="card-modern">
            <CardContent className="p-8">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 rounded-full bg-red-100">
                  <X className="h-12 w-12 text-red-500" />
                </div>
                <h3 className="text-lg font-semibold text-red-600">
                  Error loading avatar
                </h3>
                <p className="text-sm text-muted-foreground">
                  {error}
                </p>
                <Button
                  onClick={() => navigate('/?section=my-avatar')}
                  variant="outline"
                >
                  Back to My Avatars
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!avatar) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="container mx-auto max-w-4xl py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/?section=my-avatar')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to My Avatars
          </Button>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={() => navigate(`/?section=chatbot&avatar=${avatar.id}`)}
              className="btn-hero"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Chat with {avatar.name}
            </Button>
            
            {isEditing ? (
              <>
                <Button onClick={handleSave} className="btn-hero">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button onClick={handleEditToggle} variant="outline">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={handleEditToggle} variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit Avatar
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Avatar Details */}
          <AvatarDetailStep
            data={isEditing ? editData : {
              name: avatar.name,
              age: avatar.age,
              gender: avatar.gender,
              originCountry: avatar.origin_country,
              primaryLanguage: avatar.primary_language,
              secondaryLanguages: avatar.secondary_languages,
              avatarImages: avatar.avatar_images,
            }}
            onUpdate={isEditing ? updateEditData : () => {}}
            avatarId={avatar.id}
          />

          {/* Personality */}
          <AvatarPersonaStep
            data={isEditing ? editData : {
              personalityTraits: avatar.personality_traits,
              mbtiType: avatar.mbti_type,
            }}
            onUpdate={isEditing ? updateEditData : () => {}}
            avatarId={avatar.id}
          />

          {/* Backstory */}
          <BackstoryStep
            data={isEditing ? editData : {
              backstory: avatar.backstory,
            }}
            onUpdate={isEditing ? updateEditData : () => {}}
            avatarId={avatar.id}
          />

          {/* Hidden Rules */}
          <HiddenRulesStep
            data={isEditing ? editData : {
              hiddenRules: avatar.hidden_rules,
            }}
            onUpdate={isEditing ? updateEditData : () => {}}
            avatarId={avatar.id}
          />

          {/* Knowledge Base */}
          <KnowledgeBaseStep
            data={{ knowledgeFiles }}
            onUpdate={() => {}}
            avatarId={avatar.id}
          />
        </div>
      </div>
    </div>
  );
};

export default AvatarDetail;
