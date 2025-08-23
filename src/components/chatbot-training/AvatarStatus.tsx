
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
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Avatar {
  id: string;
  name: string;
  primaryLanguage: string;
  secondaryLanguages: string[];
  backstory: string;
  knowledgeFiles: any[];
  hiddenRules: string;
}

interface AvatarStatusProps {
  avatar: Avatar;
}

export const AvatarStatus: React.FC<AvatarStatusProps> = ({ avatar }) => {
  const [isEditingSystemPrompt, setIsEditingSystemPrompt] = useState(false);
  const [isEditingUserPrompt, setIsEditingUserPrompt] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState('');
  const [userPrompt, setUserPrompt] = useState('');
  const { toast } = useToast();

  // Generate dummy system and user prompts based on avatar data with proper null checking
  const generateSystemPrompt = () => {
    const secondaryLanguages = avatar.secondaryLanguages || [];
    const knowledgeFiles = avatar.knowledgeFiles || [];
    
    return `You are ${avatar.name}, an AI avatar with the following characteristics:

PRIMARY LANGUAGE: ${avatar.primaryLanguage || 'Not specified'}
SECONDARY LANGUAGES: ${secondaryLanguages.join(', ') || 'None'}

BACKSTORY: ${avatar.backstory || 'No backstory provided'}

PERSONALITY GUIDELINES:
- Maintain a consistent personality throughout conversations
- Respond in your primary language unless specifically asked to use another language
- Reference your backstory when relevant to the conversation

KNOWLEDGE BASE: ${knowledgeFiles.length} documents available for reference

${avatar.hiddenRules ? `SPECIAL INSTRUCTIONS: ${avatar.hiddenRules}` : ''}

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
    setIsEditingSystemPrompt(false);
    toast({
      title: "System Prompt Updated",
      description: "The system prompt has been saved successfully.",
    });
  };

  const handleSaveUserPrompt = () => {
    setIsEditingUserPrompt(false);
    toast({
      title: "User Prompt Updated", 
      description: "The user prompt has been saved successfully.",
    });
  };

  const handleCancelEdit = (type: 'system' | 'user') => {
    if (type === 'system') {
      setIsEditingSystemPrompt(false);
      setSystemPrompt(generateSystemPrompt());
    } else {
      setIsEditingUserPrompt(false);
      setUserPrompt(generateUserPrompt());
    }
  };

  // Safely access avatar properties with fallbacks
  const secondaryLanguages = avatar.secondaryLanguages || [];
  const knowledgeFiles = avatar.knowledgeFiles || [];

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span className="text-sm font-medium">Primary Language</span>
              </div>
              <Badge variant="outline">{avatar.primaryLanguage || 'Not specified'}</Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span className="text-sm font-medium">Secondary Languages</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {secondaryLanguages.length > 0 ? (
                  secondaryLanguages.map((lang, index) => (
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
                {knowledgeFiles.length} documents
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4" />
                <span className="text-sm font-medium">Hidden Rules</span>
              </div>
              <Badge variant={avatar.hiddenRules ? "outline" : "secondary"}>
                {avatar.hiddenRules ? "Configured" : "Not set"}
              </Badge>
            </div>
          </div>

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
                {isEditingSystemPrompt ? (
                  <>
                    <Button size="sm" onClick={handleSaveSystemPrompt}>
                      <Save className="h-3 w-3 mr-1" />
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleCancelEdit('system')}>
                      <X className="h-3 w-3 mr-1" />
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => setIsEditingSystemPrompt(true)}>
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                )}
              </div>
            </div>
            <Textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              readOnly={!isEditingSystemPrompt}
              className={`min-h-[200px] text-sm ${!isEditingSystemPrompt ? 'bg-muted/20' : ''}`}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="text-sm font-medium">User Prompt</span>
              </div>
              <div className="flex gap-2">
                {isEditingUserPrompt ? (
                  <>
                    <Button size="sm" onClick={handleSaveUserPrompt}>
                      <Save className="h-3 w-3 mr-1" />
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleCancelEdit('user')}>
                      <X className="h-3 w-3 mr-1" />
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => setIsEditingUserPrompt(true)}>
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                )}
              </div>
            </div>
            <Textarea
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              readOnly={!isEditingUserPrompt}
              className={`min-h-[100px] text-sm ${!isEditingUserPrompt ? 'bg-muted/20' : ''}`}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
