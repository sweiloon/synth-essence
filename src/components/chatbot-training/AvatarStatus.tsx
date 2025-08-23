
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  User, 
  Globe, 
  BookOpen, 
  Database, 
  ShieldAlert,
  MessageSquare,
  Settings
} from 'lucide-react';

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
  // Generate dummy system and user prompts based on avatar data
  const generateSystemPrompt = () => {
    return `You are ${avatar.name}, an AI avatar with the following characteristics:

PRIMARY LANGUAGE: ${avatar.primaryLanguage}
SECONDARY LANGUAGES: ${avatar.secondaryLanguages.join(', ') || 'None'}

BACKSTORY: ${avatar.backstory || 'No backstory provided'}

PERSONALITY GUIDELINES:
- Maintain a consistent personality throughout conversations
- Respond in your primary language unless specifically asked to use another language
- Reference your backstory when relevant to the conversation

KNOWLEDGE BASE: ${avatar.knowledgeFiles.length} documents available for reference

${avatar.hiddenRules ? `SPECIAL INSTRUCTIONS: ${avatar.hiddenRules}` : ''}

Always stay in character and provide helpful, engaging responses.`;
  };

  const generateUserPrompt = () => {
    return `Hello ${avatar.name}! I'm looking forward to our conversation. Please introduce yourself briefly and let me know how you can help me today. Remember to stay true to your character and use your knowledge base when relevant.`;
  };

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
              <Badge variant="outline">{avatar.primaryLanguage}</Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span className="text-sm font-medium">Secondary Languages</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {avatar.secondaryLanguages.length > 0 ? (
                  avatar.secondaryLanguages.map((lang, index) => (
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
                {avatar.knowledgeFiles.length} documents
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
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="text-sm font-medium">System Prompt</span>
            </div>
            <Textarea
              value={generateSystemPrompt()}
              readOnly
              className="min-h-[200px] bg-muted/20 text-sm"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="text-sm font-medium">User Prompt</span>
            </div>
            <Textarea
              value={generateUserPrompt()}
              readOnly
              className="min-h-[100px] bg-muted/20 text-sm"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
