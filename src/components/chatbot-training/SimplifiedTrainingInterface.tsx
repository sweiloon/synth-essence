
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Image, 
  X, 
  Brain, 
  FileText, 
  Paperclip,
  Send,
  CheckCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTrainingDataCache } from '@/hooks/useTrainingDataCache';

interface SimplifiedTrainingInterfaceProps {
  avatarName: string;
  avatarId: string;
  isTraining: boolean;
  onTrainingStart: () => void;
  onTrainingComplete: () => void;
}

interface TrainingResult {
  id: string;
  type: 'system' | 'user' | 'instructions';
  label: string;
  changes: string[];
  timestamp: string;
}

export const SimplifiedTrainingInterface: React.FC<SimplifiedTrainingInterfaceProps> = ({ 
  avatarName,
  avatarId,
  isTraining,
  onTrainingStart,
  onTrainingComplete
}) => {
  const { trainingData, updateTrainingData, clearCache } = useTrainingDataCache(avatarId);
  const [trainingResults, setTrainingResults] = useState<TrainingResult[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  // Auto-resize textarea
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.max(120, textarea.scrollHeight)}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [trainingData.systemPrompt, trainingData.userPrompt, trainingData.trainingInstructions]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    updateTrainingData({
      uploadedFiles: [...trainingData.uploadedFiles, ...validFiles]
    });

    // Clear input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    const newFiles = trainingData.uploadedFiles.filter((_, i) => i !== index);
    updateTrainingData({ uploadedFiles: newFiles });
  };

  const handleTraining = () => {
    const hasContent = trainingData.systemPrompt.trim() || 
                     trainingData.userPrompt.trim() || 
                     trainingData.trainingInstructions.trim() || 
                     trainingData.uploadedFiles.length > 0;

    if (!hasContent) {
      toast({
        title: "No Training Data",
        description: "Please provide training data before starting.",
        variant: "destructive"
      });
      return;
    }

    onTrainingStart();
    
    // Simulate training process and generate results
    setTimeout(() => {
      const results: TrainingResult[] = [];
      
      if (trainingData.systemPrompt.trim()) {
        results.push({
          id: Date.now().toString() + '_system',
          type: 'system',
          label: 'System Prompt Updated',
          changes: [
            'Personality traits enhanced',
            'Response patterns improved',
            'Core behavior guidelines updated'
          ],
          timestamp: 'Just now'
        });
      }

      if (trainingData.userPrompt.trim()) {
        results.push({
          id: Date.now().toString() + '_user',
          type: 'user',
          label: 'User Interaction Model Updated',
          changes: [
            'Input processing enhanced',
            'Context understanding improved',
            'Response generation optimized'
          ],
          timestamp: 'Just now'
        });
      }

      if (trainingData.trainingInstructions.trim()) {
        results.push({
          id: Date.now().toString() + '_instructions',
          type: 'instructions',
          label: 'Training Instructions Applied',
          changes: [
            'Custom behavior rules added',
            'Response quality enhanced',
            'Domain-specific knowledge updated'
          ],
          timestamp: 'Just now'
        });
      }

      if (trainingData.uploadedFiles.length > 0) {
        results.push({
          id: Date.now().toString() + '_files',
          type: 'system',
          label: `${trainingData.uploadedFiles.length} Files Processed`,
          changes: [
            `Analyzed ${trainingData.uploadedFiles.length} training files`,
            'Knowledge base expanded',
            'Context understanding improved'
          ],
          timestamp: 'Just now'
        });
      }

      setTrainingResults(results);
      onTrainingComplete();
      
      toast({
        title: "Training Complete",
        description: `${avatarName}'s model has been updated successfully.`,
      });
      
      // Clear cached data after successful training
      clearCache();
    }, 5000);
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (file.type === 'application/pdf') return <FileText className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  const getFilePreview = (file: File) => {
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file);
    }
    return null;
  };

  const allContent = `${trainingData.systemPrompt}\n\n${trainingData.userPrompt}\n\n${trainingData.trainingInstructions}`.trim();

  return (
    <div className="space-y-6">
      <Card className="card-modern">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Train {avatarName}
          </CardTitle>
          <CardDescription>
            Provide training instructions, prompts, and files to improve your avatar's responses
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Chat-style Input Box */}
          <div className="border rounded-lg bg-background">
            <Textarea
              ref={textareaRef}
              placeholder="Enter your training instructions here...

Examples:
• System Prompt: You are a helpful assistant specialized in...
• User Prompt: When users ask about..., respond with...
• Training Instructions: Improve responses by focusing on..."
              value={allContent}
              onChange={(e) => {
                const lines = e.target.value.split('\n');
                // For simplicity, we'll store all content in systemPrompt
                // In a real implementation, you might want to parse different sections
                updateTrainingData({
                  systemPrompt: e.target.value,
                  userPrompt: '',
                  trainingInstructions: ''
                });
                adjustTextareaHeight();
              }}
              className="min-h-[120px] border-0 resize-none focus-visible:ring-0 bg-transparent"
              disabled={isTraining}
            />
            
            {/* File Attachments */}
            {trainingData.uploadedFiles.length > 0 && (
              <div className="px-3 pb-3">
                <div className="flex flex-wrap gap-2">
                  {trainingData.uploadedFiles.map((file, index) => {
                    const preview = getFilePreview(file);
                    return (
                      <div key={index} className="flex items-center gap-2 bg-muted rounded p-2 text-sm">
                        {preview ? (
                          <img src={preview} alt={file.name} className="w-8 h-8 rounded object-cover" />
                        ) : (
                          getFileIcon(file)
                        )}
                        <span className="truncate max-w-[100px]">{file.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          disabled={isTraining}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* Action Bar */}
            <div className="flex items-center justify-between p-3 border-t bg-muted/20">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isTraining}
                  className="h-8"
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.txt,.pdf,.doc,.docx"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
                
                {trainingData.uploadedFiles.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {trainingData.uploadedFiles.length} file(s)
                  </Badge>
                )}
              </div>
              
              <Button 
                onClick={handleTraining}
                disabled={isTraining}
                className="btn-hero h-8"
              >
                {isTraining ? (
                  <>
                    <Brain className="mr-2 h-4 w-4 animate-spin" />
                    Training...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Start Training
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Training Results */}
      {trainingResults.length > 0 && (
        <Card className="card-modern">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              Training Results
            </CardTitle>
            <CardDescription>
              Here's what was updated in your avatar's model
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trainingResults.map((result) => (
                <div key={result.id} className="border rounded-lg p-4 bg-green-50 border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <h4 className="font-medium text-green-900">{result.label}</h4>
                    <Badge variant="outline" className="text-xs text-green-700 border-green-300">
                      {result.timestamp}
                    </Badge>
                  </div>
                  <ul className="text-sm text-green-800 space-y-1 ml-6">
                    {result.changes.map((change, index) => (
                      <li key={index}>• {change}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Training Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Training Tips</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Be specific about the behavior you want to improve</li>
          <li>• Upload conversation examples or reference materials</li>
          <li>• Use clear instructions for consistent results</li>
          <li>• Test changes in the Test Chat tab after training</li>
        </ul>
      </div>
    </div>
  );
};
