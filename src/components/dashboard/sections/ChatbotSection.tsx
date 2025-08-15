
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageSquare, 
  Brain, 
  Upload, 
  Download, 
  Play, 
  Pause,
  Plus,
  Trash2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ChatbotSection = () => {
  const [trainingText, setTrainingText] = useState('');
  const [isTraining, setIsTraining] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([
    { id: 1, type: 'user', message: 'Hello, how are you today?' },
    { id: 2, type: 'avatar', message: 'Hello! I\'m doing well, thank you for asking. I\'m always excited to learn and chat with you.' },
  ]);
  const { toast } = useToast();

  const handleStartTraining = () => {
    setIsTraining(true);
    toast({
      title: "Training Started",
      description: "Your avatar is now learning from the provided data.",
    });
    
    setTimeout(() => {
      setIsTraining(false);
      toast({
        title: "Training Complete",
        description: "Your avatar has successfully learned from the new data.",
      });
    }, 3000);
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
        <Badge variant="outline" className="learning-path-gradient text-white">
          Language Model v2.1
        </Badge>
      </div>

      <Tabs defaultValue="train" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="train">Train Model</TabsTrigger>
          <TabsTrigger value="test">Test Chat</TabsTrigger>
          <TabsTrigger value="datasets">Datasets</TabsTrigger>
        </TabsList>

        {/* Training Tab */}
        <TabsContent value="train" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Text Training Data
                </CardTitle>
                <CardDescription>
                  Paste or type conversation examples to train your avatar
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="training-text">Training Content</Label>
                  <Textarea
                    id="training-text"
                    placeholder="Enter conversation examples, personality traits, or knowledge base content..."
                    value={trainingText}
                    onChange={(e) => setTrainingText(e.target.value)}
                    className="min-h-[200px] input-modern"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    className="btn-hero flex-1"
                    onClick={handleStartTraining}
                    disabled={isTraining || !trainingText.trim()}
                  >
                    {isTraining ? (
                      <>
                        <Pause className="mr-2 h-4 w-4" />
                        Training...
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        Start Training
                      </>
                    )}
                  </Button>
                  <Button variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload File
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="card-modern">
              <CardHeader>
                <CardTitle>Training Progress</CardTitle>
                <CardDescription>
                  Monitor your avatar's learning progress
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Vocabulary Size</span>
                    <span className="text-sm font-medium">12,847 words</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Training Sessions</span>
                    <span className="text-sm font-medium">24 completed</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Accuracy Score</span>
                    <span className="text-sm font-medium">87.3%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Response Quality</span>
                    <span className="text-sm font-medium">High</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Quick Training Options</h4>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Plus className="mr-2 h-4 w-4" />
                      Personality Traits
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Plus className="mr-2 h-4 w-4" />
                      Knowledge Base
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Plus className="mr-2 h-4 w-4" />
                      Conversation Style
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Test Chat Tab */}
        <TabsContent value="test" className="space-y-6">
          <Card className="card-modern">
            <CardHeader>
              <CardTitle>Chat with Your Avatar</CardTitle>
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
        </TabsContent>

        {/* Datasets Tab */}
        <TabsContent value="datasets" className="space-y-6">
          <Card className="card-modern">
            <CardHeader>
              <CardTitle>Training Datasets</CardTitle>
              <CardDescription>
                Manage your avatar's training data sources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Active Datasets</h4>
                  <Button variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Dataset
                  </Button>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Personality Base</p>
                      <p className="text-sm text-muted-foreground">2,847 entries</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Conversation Examples</p>
                      <p className="text-sm text-muted-foreground">1,523 entries</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChatbotSection;
