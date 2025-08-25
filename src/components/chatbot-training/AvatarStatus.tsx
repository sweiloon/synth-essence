
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Globe, 
  BookOpen, 
  Database, 
  ShieldAlert,
  MessageSquare,
  Settings,
  Edit,
  Save,
  X,
  Image as ImageIcon
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface Avatar {
  id: string;
  name: string;
  primary_language: string;
  secondary_languages: string[];
  backstory: string;
  hidden_rules: string;
  avatar_images: string[];
  personality_traits: string[];
}

interface AvatarStatusProps {
  avatar: Avatar;
}

export const AvatarStatus: React.FC<AvatarStatusProps> = ({ avatar: initialAvatar }) => {
  const [isEditingSystem, setIsEditingSystem] = useState(false);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState('');
  const [userPrompt, setUserPrompt] = useState('');
  const { user } = useAuth();

  // Fetch full avatar data with knowledge files
  const { data: avatar = initialAvatar, isLoading } = useQuery({
    queryKey: ['avatar-full', initialAvatar.id],
    queryFn: async () => {
      if (!user?.id) return initialAvatar;

      // Fetch avatar details
      const { data: avatarData, error: avatarError } = await supabase
        .from('avatars')
        .select('*')
        .eq('id', initialAvatar.id)
        .eq('user_id', user.id)
        .single();

      if (avatarError) {
        console.error('Error fetching avatar:', avatarError);
        return initialAvatar;
      }

      // Fetch knowledge files count
      const { data: knowledgeFiles, error: knowledgeError } = await supabase
        .from('avatar_knowledge_files')
        .select('id')
        .eq('avatar_id', initialAvatar.id)
        .eq('user_id', user.id);

      if (knowledgeError) {
        console.error('Error fetching knowledge files:', knowledgeError);
      }

      return {
        ...avatarData,
        knowledgeFiles: knowledgeFiles || []
      };
    },
    enabled: !!user?.id && !!initialAvatar.id
  });

  // Generate dummy system and user prompts based on avatar data
  const generateSystemPrompt = () => {
    return `You are ${avatar.name}, an AI avatar with the following characteristics:

PRIMARY LANGUAGE: ${avatar.primary_language}
SECONDARY LANGUAGES: ${(avatar.secondary_languages || []).join(', ') || 'None'}

BACKSTORY: ${avatar.backstory || 'No backstory provided'}

PERSONALITY TRAITS: ${(avatar.personality_traits || []).join(', ') || 'None specified'}

PERSONALITY GUIDELINES:
- Maintain a consistent personality throughout conversations
- Respond in your primary language unless specifically asked to use another language
- Reference your backstory when relevant to the conversation

KNOWLEDGE BASE: ${(avatar.knowledgeFiles || []).length} documents available for reference

${avatar.hidden_rules ? `SPECIAL INSTRUCTIONS: ${avatar.hidden_rules}` : ''}

Always stay in character and provide helpful, engaging responses.`;
  };

  const generateUserPrompt = () => {
    return `Hello ${avatar.name}! I'm looking forward to our conversation. Please introduce yourself briefly and let me know how you can help me today. Remember to stay true to your character and use your knowledge base when relevant.`;
  };

  React.useEffect(() => {
    setSystemPrompt(generateSystemPrompt());
    setUserPrompt(generateUserPrompt());
  }, [avatar]);

  const handleSaveSystemPrompt = () => {
    setIsEditingSystem(false);
    // Here you would typically save to backend or localStorage
  };

  const handleSaveUserPrompt = () => {
    setIsEditingUser(false);
    // Here you would typically save to backend or localStorage
  };

  const handleCancelSystemEdit = () => {
    setSystemPrompt(generateSystemPrompt());
    setIsEditingSystem(false);
  };

  const handleCancelUserEdit = () => {
    setUserPrompt(generateUserPrompt());
    setIsEditingUser(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="card-modern">
          <CardContent className="p-6 text-center">
            Loading avatar details...
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Avatar Overview */}
      <Card className="card-modern">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Avatar Overview: {avatar.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Avatar Images */}
          {avatar.avatar_images && avatar.avatar_images.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                <span className="text-sm font-medium">Avatar Images</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {avatar.avatar_images.slice(0, 3).map((imageUrl, index) => (
                  <img
                    key={index}
                    src={imageUrl}
                    alt={`Avatar ${index + 1}`}
                    className="w-full h-20 object-cover rounded border"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                ))}
              </div>
              {avatar.avatar_images.length > 3 && (
                <p className="text-xs text-muted-foreground">
                  +{avatar.avatar_images.length - 3} more images
                </p>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span className="text-sm font-medium">Primary Language</span>
              </div>
              <Badge variant="outline">{avatar.primary_language}</Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span className="text-sm font-medium">Secondary Languages</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {(avatar.secondary_languages || []).length > 0 ? (
                  (avatar.secondary_languages || []).map((lang, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {lang}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">None</span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                <span className="text-sm font-medium">Knowledge Base</span>
              </div>
              <Badge variant="outline">
                {(avatar.knowledgeFiles || []).length} documents
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4" />
                <span className="text-sm font-medium">Hidden Rules</span>
              </div>
              <Badge variant={avatar.hidden_rules ? "outline" : "secondary"}>
                {avatar.hidden_rules ? "Configured" : "Not set"}
              </Badge>
            </div>
          </div>

          {/* Personality Traits */}
          {avatar.personality_traits && avatar.personality_traits.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="text-sm font-medium">Personality Traits</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {avatar.personality_traits.map((trait, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {trait}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {avatar.backstory && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span className="text-sm font-medium">Backstory</span>
              </div>
              <p className="text-sm text-muted-foreground bg-muted/20 p-3 rounded-lg">
                {avatar.backstory}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Avatar Prompts */}
      <Card className="card-modern">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Avatar Prompts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span className="text-sm font-medium">System Prompt</span>
              </div>
              <div className="flex gap-2">
                {isEditingSystem ? (
                  <>
                    <Button size="sm" onClick={handleSaveSystemPrompt}>
                      <Save className="h-3 w-3 mr-1" />
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCancelSystemEdit}>
                      <X className="h-3 w-3 mr-1" />
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => setIsEditingSystem(true)}>
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                )}
              </div>
            </div>
            <Textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              readOnly={!isEditingSystem}
              className={`min-h-[200px] text-sm ${!isEditingSystem ? 'bg-muted/20' : ''}`}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="text-sm font-medium">User Prompt</span>
              </div>
              <div className="flex gap-2">
                {isEditingUser ? (
                  <>
                    <Button size="sm" onClick={handleSaveUserPrompt}>
                      <Save className="h-3 w-3 mr-1" />
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCancelUserEdit}>
                      <X className="h-3 w-3 mr-1" />
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => setIsEditingUser(true)}>
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                )}
              </div>
            </div>
            <Textarea
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              readOnly={!isEditingUser}
              className={`min-h-[100px] text-sm ${!isEditingUser ? 'bg-muted/20' : ''}`}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
