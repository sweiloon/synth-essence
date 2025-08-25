import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Send, Bot, User as UserIcon, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  type: 'user' | 'avatar';
  content: string;
  timestamp: Date;
}

interface TestChatProps {
  avatarName: string;
  avatarImage?: string;
  isTraining: boolean;
}

export const TestChat: React.FC<TestChatProps> = ({ avatarName, avatarImage, isTraining }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'avatar',
      content: `Hello! I'm ${avatarName}. I'm ready to chat with you using my latest training. How can I help you today?`,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim() || isTraining) {
      if (isTraining) {
        toast({
          title: "Training in Progress",
          description: "Please wait for training to complete before testing.",
          variant: "destructive"
        });
      }
      return;
    }

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate avatar response
    setTimeout(() => {
      const responses = [
        "That's an interesting question! Based on my training, I think...",
        "I understand what you're asking. Let me help you with that.",
        "Thanks for sharing that with me. Here's my perspective...",
        "I've processed your input and here's what I can tell you...",
        "That's a great point! My understanding is that..."
      ];

      const avatarMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'avatar',
        content: responses[Math.floor(Math.random() * responses.length)] + " This is a simulated response based on my current training data.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, avatarMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([{
      id: '1',
      type: 'avatar',
      content: `Hello! I'm ${avatarName}. I'm ready to chat with you using my latest training. How can I help you today?`,
      timestamp: new Date()
    }]);
    toast({
      title: "Chat Cleared",
      description: "Conversation history has been reset.",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="card-modern">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Chat with {avatarName}
            </CardTitle>
            <CardDescription>
              Test your avatar's conversation abilities with the latest training
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={clearChat}>
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Chat
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Chat Area */}
          <div className="border rounded-lg h-96 overflow-y-auto bg-muted/20 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-background border'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {message.type === 'avatar' ? (
                        <div className="flex items-center gap-1">
                          {avatarImage ? (
                            <img 
                              src={avatarImage} 
                              alt={avatarName}
                              className="w-5 h-5 rounded-full object-cover"
                            />
                          ) : (
                            <Bot className="h-4 w-4" />
                          )}
                          <span className="text-xs font-medium">{avatarName}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <UserIcon className="h-4 w-4" />
                          <span className="text-xs font-medium">You</span>
                        </div>
                      )}
                      <span className="text-xs opacity-70">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-background border px-4 py-2 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Bot className="h-4 w-4" />
                      <span className="text-sm text-muted-foreground">
                        {avatarName} is typing...
                      </span>
                      <div className="flex gap-1">
                        <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          {/* Input Area */}
          <div className="flex gap-2">
            <Input
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isTraining || isTyping}
              className="input-modern"
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTraining || isTyping}
              className="btn-hero"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Status */}
          <div className="flex items-center gap-2">
            <Badge variant={isTraining ? "destructive" : "default"}>
              {isTraining ? "Training in Progress" : "Ready to Chat"}
            </Badge>
            {isTraining && (
              <span className="text-xs text-muted-foreground">
                Training must complete before testing
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
