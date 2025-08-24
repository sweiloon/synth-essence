
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Upload, Brain, Paperclip, X, FileText, Image, Check, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TrainingResult {
  type: 'success' | 'info' | 'warning';
  title: string;
  changes: string[];
}

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
  const [trainingResults, setTrainingResults] = useState<TrainingResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.max(120, textarea.scrollHeight) + 'px';
    }
  }, [trainingMessage]);

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

  const generateMockResults = (): TrainingResult[] => {
    const results: TrainingResult[] = [];
    
    if (trainingMessage.toLowerCase().includes('professional')) {
      results.push({
        type: 'success',
        title: 'System Prompt Updated',
        changes: [
          'Added professional tone guidelines',
          'Updated greeting responses to be more formal',
          'Modified conversation style parameters'
        ]
      });
    }
    
    if (trainingMessage.toLowerCase().includes('shorter')) {
      results.push({
        type: 'success',
        title: 'Response Length Optimized',
        changes: [
          'Set maximum response length to 150 words',
          'Prioritized concise communication',
          'Updated verbose response patterns'
        ]
      });
    }
    
    if (attachedFiles.length > 0) {
      results.push({
        type: 'info',
        title: 'Knowledge Base Enhanced',
        changes: [
          `Processed ${attachedFiles.length} uploaded file(s)`,
          'Updated conversation context understanding',
          'Enhanced domain-specific knowledge'
        ]
      });
    }
    
    if (results.length === 0) {
      results.push({
        type: 'success',
        title: 'General Training Update',
        changes: [
          'Improved response coherence',
          'Enhanced conversation flow',
          'Updated language model parameters'
        ]
      });
    }
    
    return results;
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
    setShowResults(false);
    
    // Simulate training process
    setTimeout(() => {
      const results = generateMockResults();
      setTrainingResults(results);
      setShowResults(true);
      onTrainingComplete();
      
      toast({
        title: "Training Complete",
        description: `${avatarName}'s model has been updated successfully.`,
      });
      
      // Clear form after showing results
      setTimeout(() => {
        setTrainingMessage('');
        setAttachedFiles([]);
      }, 1000);
    }, 5000);
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (file.type === 'application/pdf') return <FileText className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  const createImagePreview = (file: File): string => {
    return URL.createObjectURL(file);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleTraining();
    }
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'success': return <Check className="h-4 w-4 text-green-600" />;
      case 'info': return <AlertCircle className="h-4 w-4 text-blue-600" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default: return <Check className="h-4 w-4 text-green-600" />;
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
        {/* Training Results */}
        {showResults && trainingResults.length > 0 && (
          <div className="space-y-3 mb-6">
            <h4 className="font-medium text-sm">Training Results</h4>
            {trainingResults.map((result, index) => (
              <div key={index} className="border rounded-lg p-4 bg-muted/20">
                <div className="flex items-center gap-2 mb-2">
                  {getResultIcon(result.type)}
                  <span className="font-medium text-sm">{result.title}</span>
                </div>
                <div className="space-y-1">
                  {result.changes.map((change, changeIndex) => (
                    <div key={changeIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1 h-1 bg-current rounded-full flex-shrink-0" />
                      <span>{change}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* File Attachments Display with Image Preview */}
        {attachedFiles.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Attached Files:</p>
            <div className="grid grid-cols-1 gap-3">
              {attachedFiles.map((file, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="flex items-start gap-3">
                    {/* File Preview */}
                    <div className="flex-shrink-0">
                      {file.type.startsWith('image/') ? (
                        <img 
                          src={createImagePreview(file)}
                          alt={file.name}
                          className="w-16 h-16 object-cover rounded-lg border"
                        />
                      ) : (
                        <div className="w-16 h-16 border-2 border-dashed border-border rounded-lg flex items-center justify-center bg-muted/30">
                          {getFileIcon(file)}
                        </div>
                      )}
                    </div>
                    
                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {file.type.split('/')[1]?.toUpperCase() || 'FILE'}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                    </div>
                    
                    {/* Remove Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      disabled={isTraining}
                      className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chat-style Input */}
        <div className="relative">
          <Textarea
            ref={textareaRef}
            placeholder="Describe how you want to improve your avatar...

Examples:
• Update the system prompt to be more professional
• Make responses shorter and more direct
• Add more personality and humor
• Learn from the attached conversation screenshots"
            value={trainingMessage}
            onChange={(e) => setTrainingMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            className="min-h-[120px] max-h-[400px] pr-20 resize-none overflow-hidden"
            disabled={isTraining}
            style={{ height: 'auto' }}
          />
          
          {/* Action Buttons */}
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isTraining}
              className="h-8 w-8 p-0"
              title="Attach files"
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
