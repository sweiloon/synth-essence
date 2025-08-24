
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageSquare, 
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AvatarSelectorDropdown } from '@/components/chatbot-training/AvatarSelectorDropdown';
import { AvatarStatus } from '@/components/chatbot-training/AvatarStatus';
import { EnhancedTrainingInterface } from '@/components/chatbot-training/EnhancedTrainingInterface';
import { TestChat } from '@/components/chatbot-training/TestChat';
import { KnowledgeBase } from '@/components/chatbot-training/KnowledgeBase';
import { VersionControl } from '@/components/chatbot-training/VersionControl';
import { useSearchParams } from 'react-router-dom';

const ChatbotSection = () => {
  const [searchParams] = useSearchParams();
  const avatarFromUrl = searchParams.get('avatar');
  const [selectedAvatarId, setSelectedAvatarId] = useState<string | null>(avatarFromUrl);
  const [isTraining, setIsTraining] = useState(false);
  const [activeTab, setActiveTab] = useState('train');
  const { toast } = useToast();

  // Update selected avatar when URL param changes
  useEffect(() => {
    if (avatarFromUrl) {
      setSelectedAvatarId(avatarFromUrl);
    }
  }, [avatarFromUrl]);

  // Get avatar data from localStorage (matching existing pattern in codebase)
  const savedAvatars = JSON.parse(localStorage.getItem('myAvatars') || '[]');
  const selectedAvatar = savedAvatars.find((avatar: any) => avatar.id === selectedAvatarId);

  const handleAvatarSelection = (avatarId: string) => {
    if (isTraining) {
      toast({
        title: "Cannot Switch Avatar",
        description: "Please wait for current training to complete before switching avatars.",
        variant: "destructive"
      });
      return;
    }
    
    setSelectedAvatarId(avatarId);
    toast({
      title: "Avatar Selected",
      description: "You can now start training your avatar.",
    });
  };

  const handleTrainingStart = () => {
    setIsTraining(true);
    toast({
      title: "Training Started",
      description: "Avatar training is in progress. Please wait...",
    });
  };

  const handleTrainingComplete = () => {
    setIsTraining(false);
    
    // Create a new version entry
    if (selectedAvatarId) {
      const existingVersions = JSON.parse(localStorage.getItem(`avatar_${selectedAvatarId}_versions`) || '[]');
      const newVersion = {
        id: Date.now().toString(),
        version: `v2.1.${existingVersions.length + 4}`,
        status: 'Active',
        description: 'Latest training update with prompt improvements',
        accuracy: Math.floor(Math.random() * 10) + 90, // 90-99%
        improvements: ['System prompt optimization', 'Response quality enhancement', 'Context understanding'],
        timestamp: 'Just now',
        trainingType: 'language'
      };
      
      // Mark previous version as completed
      const updatedVersions = existingVersions.map((v: any) => ({ ...v, status: 'Completed' }));
      updatedVersions.unshift(newVersion);
      
      localStorage.setItem(`avatar_${selectedAvatarId}_versions`, JSON.stringify(updatedVersions));
    }
  };

  const handleTabChange = (value: string) => {
    if (isTraining && value !== activeTab) {
      toast({
        title: "Training in Progress",
        description: "Please wait for training to complete before switching tabs.",
        variant: "destructive"
      });
      return;
    }
    setActiveTab(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <MessageSquare className="h-8 w-8" />
            AI Chatbot Training
          </h1>
          <p className="text-muted-foreground">
            Train your avatar's language processing and conversation abilities
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="learning-path-gradient text-white">
            Language Model v2.1
          </Badge>
          {isTraining && (
            <Badge variant="destructive" className="animate-pulse">
              Training Active
            </Badge>
          )}
        </div>
      </div>

      {/* Avatar Selection */}
      <AvatarSelectorDropdown 
        selectedAvatarId={selectedAvatarId}
        onSelectAvatar={handleAvatarSelection}
      />

      {/* Avatar Status - Only show if avatar is selected */}
      {selectedAvatar && (
        <AvatarStatus avatar={selectedAvatar} />
      )}

      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="train" disabled={isTraining && activeTab !== 'train'}>
            Train Model
          </TabsTrigger>
          <TabsTrigger value="test" disabled={isTraining && activeTab !== 'test'}>
            Test Chat
          </TabsTrigger>
          <TabsTrigger value="knowledge" disabled={isTraining && activeTab !== 'knowledge'}>
            Knowledge Base
          </TabsTrigger>
          <TabsTrigger value="versions" disabled={isTraining && activeTab !== 'versions'}>
            Version Control
          </TabsTrigger>
        </TabsList>

        {/* Training Tab */}
        <TabsContent value="train" className="space-y-6">
          {selectedAvatar ? (
            <EnhancedTrainingInterface 
              avatarName={selectedAvatar.name}
              isTraining={isTraining}
              onTrainingStart={handleTrainingStart}
              onTrainingComplete={handleTrainingComplete}
            />
          ) : (
            <Card className="card-modern">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Avatar Selected</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Please select an avatar from the dropdown above to start training
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Test Chat Tab */}
        <TabsContent value="test" className="space-y-6">
          {selectedAvatar ? (
            <TestChat 
              avatarName={selectedAvatar.name}
              avatarImage={selectedAvatar.avatar_images?.[0]}
              isTraining={isTraining}
            />
          ) : (
            <Card className="card-modern">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Avatar Selected</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Please select an avatar to start testing conversations
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Knowledge Base Tab */}
        <TabsContent value="knowledge" className="space-y-6">
          {selectedAvatar ? (
            <KnowledgeBase 
              avatarId={selectedAvatar.id}
              isTraining={isTraining}
            />
          ) : (
            <Card className="card-modern">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Avatar Selected</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Please select an avatar to manage its knowledge base
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Version Control Tab */}
        <TabsContent value="versions" className="space-y-6">
          {selectedAvatar ? (
            <VersionControl 
              avatarId={selectedAvatar.id}
              isTraining={isTraining}
            />
          ) : (
            <Card className="card-modern">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Avatar Selected</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Please select an avatar to view its version history
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChatbotSection;
