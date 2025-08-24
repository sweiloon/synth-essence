
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Upload, Brain, Paperclip, X, FileText, Image } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SimplifiedTrainingInterfaceProps {
  avatarName: string;
  isTraining: boolean;
  onTrainingStart: () => void;
  onTrainingComplete: () => void;
}

export const SimplifiedTrainingInterface: React.FC<SimplifiedTrainingInterfaceProps> = ({ 
  avatarName, 
  isTraining,
  onTrainingStart,
  onTrainingComplete
}) => {
  const [trainingMessage, setTrainingMessage] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const allowedTypes = ['image/', 'text/', 'application/pdf'];
    const validFiles = files.filter(file => 
      allowedTypes.some(type => file.type.startsWith(type))
    );

    if (validFiles.length !== files.length) {
      toast({
        title: "Invalid Files",
        description: "Please upload images, text files, or PDFs only.",
        variant: "destructive"
      });
      return;
    }

    setAttachedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleTraining = () => {
    if (!trainingMessage.trim() && attachedFiles.length === 0) {
      toast({
        title: "No Training Data",
        description: "Please provide training instructions or attach files.",
        variant: "destructive"
      });
      return;
    }

    onTrainingStart();
    
    // Simulate training process
    setTimeout(() => {
      onTrainingComplete();
      toast({
        title: "Training Complete",
        description: `${avatarName}'s model has been updated successfully.`,
      });
      
      // Clear form
      setTrainingMessage('');
      setAttachedFiles([]);
    }, 5000);
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (file.type === 'application/pdf') return <FileText className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleTraining();
    }
  };

  return (
    <Card className="card-modern">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Train Avatar: {avatarName}
        </CardTitle>
        <CardDescription>
          Provide training instructions or upload files to improve your avatar's responses
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* File Attachments Display */}
        {attachedFiles.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Attached Files:</p>
            <div className="flex flex-wrap gap-2">
              {attachedFiles.map((file, index) => (
                <div key={index} className="flex items-center gap-2 bg-muted/50 rounded-lg p-2 pr-3">
                  {getFileIcon(file)}
                  <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    disabled={isTraining}
                    className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chat-style Input */}
        <div className="relative">
          <Textarea
            placeholder="Describe how you want to improve your avatar...

Examples:
• Update the system prompt to be more professional
• Make responses shorter and more direct
• Add more personality and humor
• Learn from the attached conversation screenshots"
            value={trainingMessage}
            onChange={(e) => setTrainingMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            className="min-h-[120px] pr-20 resize-none"
            disabled={isTraining}
          />
          
          {/* Action Buttons */}
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isTraining}
              className="h-8 w-8 p-0"
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            
            <Button 
              onClick={handleTraining}
              disabled={isTraining || (!trainingMessage.trim() && attachedFiles.length === 0)}
              size="sm"
              className="h-8"
            >
              {isTraining ? (
                <Brain className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.txt,.pdf,.doc,.docx"
          multiple
          onChange={handleFileAttachment}
          className="hidden"
        />

        {/* Training Status */}
        {isTraining && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 animate-spin text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Training in Progress...</span>
            </div>
            <p className="text-sm text-blue-800 mt-1">
              Analyzing your instructions and updating the avatar's responses. This may take a few moments.
            </p>
          </div>
        )}

        {/* Training Examples */}
        <div className="bg-muted/30 rounded-lg p-4">
          <h4 className="font-medium text-sm mb-2">Training Tips</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Be specific about what you want to change</li>
            <li>• Upload conversation examples for better training</li>
            <li>• Use Cmd/Ctrl + Enter to send quickly</li>
            <li>• Test your changes in the Test Chat tab</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
