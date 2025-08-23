
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageSquare, 
  Upload, 
  Download, 
  Plus,
  Trash2,
  Link,
  Unlink,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AvatarSelectorDropdown } from '@/components/chatbot-training/AvatarSelectorDropdown';
import { AvatarStatus } from '@/components/chatbot-training/AvatarStatus';
import { TrainingInterface } from '@/components/chatbot-training/TrainingInterface';

const ChatbotSection = () => {
  const [selectedAvatarId, setSelectedAvatarId] = useState<string | null>(null);
  const [conversationHistory, setConversationHistory] = useState([
    { id: 1, type: 'user', message: 'Hello, how are you today?' },
    { id: 2, type: 'avatar', message: 'Hello! I\'m doing well, thank you for asking. I\'m always excited to learn and chat with you.' },
  ]);
  const { toast } = useToast();

  const savedAvatars = JSON.parse(localStorage.getItem('myAvatars') || '[]');
  const selectedAvatar = savedAvatars.find((avatar: any) => avatar.id === selectedAvatarId);

  const handleAvatarSelection = (avatarId: string) => {
    setSelectedAvatarId(avatarId);
    toast({
      title: "Avatar Selected",
      description: "You can now start training your avatar.",
    });
  };

  const handleActionWithoutAvatar = () => {
    toast({
      title: "No Avatar Selected",
      description: "Please select or create an avatar before training.",
      variant: "destructive"
    });
  };

  // Get real knowledge files from selected avatar with proper null checking
  const getKnowledgeFiles = () => {
    if (!selectedAvatar) return [];
    
    // Ensure knowledgeFiles exists and is an array
    const knowledgeFiles = selectedAvatar.knowledgeFiles || [];
    
    return knowledgeFiles.map((file: any, index: number) => ({
      id: file.id || `file-${index}`,
      name: file.name || `Document ${index + 1}.pdf`,
      size: file.size || 'Unknown size',
      linked: file.linked !== undefined ? file.linked : true,
      url: file.url || null
    }));
  };

  const toggleLinkStatus = (fileId: string) => {
    if (!selectedAvatar) return;
    
    // Update the avatar's knowledge files in localStorage
    const updatedAvatars = savedAvatars.map((avatar: any) => {
      if (avatar.id === selectedAvatarId) {
        const currentFiles = avatar.knowledgeFiles || [];
        const updatedFiles = currentFiles.map((file: any) => {
          if (file.id === fileId) {
            return { ...file, linked: !file.linked };
          }
          return file;
        });
        return { ...avatar, knowledgeFiles: updatedFiles };
      }
      return avatar;
    });
    
    localStorage.setItem('myAvatars', JSON.stringify(updatedAvatars));
    
    toast({
      title: "Knowledge Base Updated",
      description: "File link status has been updated successfully.",
    });
  };

  const removeFile = (fileId: string) => {
    if (!selectedAvatar) return;
    
    // Remove file from avatar's knowledge files in localStorage
    const updatedAvatars = savedAvatars.map((avatar: any) => {
      if (avatar.id === selectedAvatarId) {
        const currentFiles = avatar.knowledgeFiles || [];
        const updatedFiles = currentFiles.filter((file: any) => file.id !== fileId);
        return { ...avatar, knowledgeFiles: updatedFiles };
      }
      return avatar;
    });
    
    localStorage.setItem('myAvatars', JSON.stringify(updatedAvatars));
    
    toast({
      title: "File Removed",
      description: "The file has been removed from knowledge base.",
    });
  };

  const knowledgeFiles = getKnowledgeFiles();

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
        <Badge variant="outline" className="learning-path-gradient text-white">
          Language Model v2.1
        </Badge>
      </div>

      {/* Avatar Selection - Now using dropdown */}
      <AvatarSelectorDropdown 
        selectedAvatarId={selectedAvatarId}
        onSelectAvatar={handleAvatarSelection}
      />

      {/* Avatar Status - Only show if avatar is selected */}
      {selectedAvatar && (
        <AvatarStatus avatar={selectedAvatar} />
      )}

      <Tabs defaultValue="train" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="train">Train Model</TabsTrigger>
          <TabsTrigger value="test">Test Chat</TabsTrigger>
          <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
        </TabsList>

        {/* Training Tab */}
        <TabsContent value="train" className="space-y-6">
          {selectedAvatar ? (
            <TrainingInterface avatarName={selectedAvatar.name} />
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
            <Card className="card-modern">
              <CardHeader>
                <CardTitle>Chat with {selectedAvatar.name}</CardTitle>
                <CardDescription>
                  Test your avatar's conversation abilities in real-time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 h-96 overflow-y-auto bg-muted/20">
                    {conversationHistory.map((msg) => (
                      <div
                        key={msg.id}
                        className={`mb-4 flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            msg.type === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-background border'
                          }`}
                        >
                          <p className="text-sm">{msg.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type your message..."
                      className="input-modern"
                    />
                    <Button className="btn-hero">Send</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
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
            <Card className="card-modern">
              <CardHeader>
                <CardTitle>Knowledge Base for {selectedAvatar.name}</CardTitle>
                <CardDescription>
                  Manage PDF documents that your avatar can reference
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Uploaded Documents</h4>
                    <Button variant="outline" size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Upload PDF
                    </Button>
                  </div>
                  
                  {knowledgeFiles.length > 0 ? (
                    <div className="space-y-3">
                      {knowledgeFiles.map((file) => (
                        <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3 flex-1">
                            <div>
                              <p className="font-medium">{file.name}</p>
                              <p className="text-sm text-muted-foreground">{file.size}</p>
                            </div>
                            <Badge variant={file.linked ? "default" : "secondary"}>
                              {file.linked ? "Linked" : "Not Linked"}
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleLinkStatus(file.id)}
                            >
                              {file.linked ? (
                                <>
                                  <Unlink className="h-4 w-4" />
                                  <span className="hidden sm:inline ml-2">Unlink</span>
                                </>
                              ) : (
                                <>
                                  <Link className="h-4 w-4" />
                                  <span className="hidden sm:inline ml-2">Link to KB</span>
                                </>
                              )}
                            </Button>
                            {file.url && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => window.open(file.url, '_blank')}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            )}
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => removeFile(file.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No documents uploaded yet.</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Upload PDF files when creating or training your avatar.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
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
      </Tabs>
    </div>
  );
};

export default ChatbotSection;
