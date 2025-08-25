
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

interface TrainingPromptSummary {
  systemPrompt?: string;
  userPrompt?: string;
  instructions?: string;
  fileCount: number;
  totalContent: string;
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
  const { trainingData, updateTrainingData, clearCache, isLoaded } = useTrainingDataCache(avatarId);
  const [trainingResults, setTrainingResults] = useState<TrainingResult[]>([]);
  const [combinedInput, setCombinedInput] = useState('');
  const [promptSummary, setPromptSummary] = useState<TrainingPromptSummary | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  // Initialize combined input from cached data
  useEffect(() => {
    if (isLoaded) {
      const combined = [
        trainingData.systemPrompt,
        trainingData.userPrompt, 
        trainingData.trainingInstructions
      ].filter(Boolean).join('\n\n');
      setCombinedInput(combined);
      console.log('Loaded cached data for avatar:', avatarId, trainingData);
    }
  }, [isLoaded, trainingData, avatarId]);

  const handleInputChange = (value: string) => {
    setCombinedInput(value);
    // Save to cache immediately
    updateTrainingData({
      systemPrompt: value,
      userPrompt: '',
      trainingInstructions: ''
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const allowedTypes = ['image/', 'text/', 'application/pdf'];
    const validFiles = files.filter(file => 
      allowedTypes.some(type => file.type.startsWith(type)) || file.name.toLowerCase().endsWith('.pdf')
    );

    if (validFiles.length !== files.length) {
      toast({
        title: "Invalid Files",
        description: "Please upload images, text files, or PDFs only.",
        variant: "destructive"
      });
      return;
    }

    // Check file sizes (50MB limit)
    const oversizedFiles = validFiles.filter(file => file.size > 50 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast({
        title: "File Too Large",
        description: `Files must be under 50MB. ${oversizedFiles.map(f => f.name).join(', ')} exceeded the limit.`,
        variant: "destructive"
      });
      return;
    }

    updateTrainingData({
      uploadedFiles: [...trainingData.uploadedFiles, ...validFiles]
    });

    toast({
      title: "Files Added",
      description: `${validFiles.length} file(s) added to training data.`,
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

  const generateTrainingPrompt = () => {
    const hasContent = combinedInput.trim() || trainingData.uploadedFiles.length > 0;

    if (!hasContent) {
      toast({
        title: "No Training Data",
        description: "Please provide training data before generating prompt.",
        variant: "destructive"
      });
      return;
    }

    // Generate prompt summary
    const summary: TrainingPromptSummary = {
      totalContent: combinedInput.trim(),
      fileCount: trainingData.uploadedFiles.length
    };

    // Parse the input to categorize content
    const lines = combinedInput.split('\n').filter(line => line.trim());
    lines.forEach(line => {
      const lowerLine = line.toLowerCase();
      if (lowerLine.includes('system prompt:') || lowerLine.includes('system:')) {
        summary.systemPrompt = line.replace(/system prompt:|system:/i, '').trim();
      } else if (lowerLine.includes('user prompt:') || lowerLine.includes('user:')) {
        summary.userPrompt = line.replace(/user prompt:|user:/i, '').trim();
      } else if (lowerLine.includes('instruction') || lowerLine.includes('improve')) {
        summary.instructions = line.trim();
      }
    });

    setPromptSummary(summary);
  };

  const handleMergeTraining = () => {
    if (!promptSummary) return;

    onTrainingStart();
    
    // Simulate training process and generate results
    setTimeout(() => {
      const results: TrainingResult[] = [];
      
      if (promptSummary.totalContent) {
        results.push({
          id: Date.now().toString() + '_system',
          type: 'system',
          label: 'Training Content Updated',
          changes: [
            'Personality traits enhanced',
            'Response patterns improved',
            'Core behavior guidelines updated'
          ],
          timestamp: 'Just now'
        });
      }

      if (promptSummary.fileCount > 0) {
        results.push({
          id: Date.now().toString() + '_files',
          type: 'system',
          label: `${promptSummary.fileCount} Files Processed`,
          changes: [
            `Analyzed ${promptSummary.fileCount} training files`,
            'Knowledge base expanded',
            'Context understanding improved'
          ],
          timestamp: 'Just now'
        });
      }

      setTrainingResults(results);
      setPromptSummary(null);
      onTrainingComplete();
      
      toast({
        title: "Training Complete",
        description: `${avatarName}'s model has been updated successfully.`,
      });
      
      // Clear cached data after successful training
      clearCache();
      setCombinedInput('');
    }, 5000);
  };

  const handleCancelTraining = () => {
    setPromptSummary(null);
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) return <FileText className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  const getFilePreview = (file: File) => {
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file);
    }
    return null;
  };

  // Don't render until cache is loaded
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2 text-muted-foreground">Loading training data...</span>
      </div>
    );
  }

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
          {/* Chat-style Input Box with fixed height and manual resize */}
          <div className="border rounded-lg bg-background">
            <Textarea
              ref={textareaRef}
              placeholder="Enter your training instructions here...

Examples:
• System Prompt: You are a helpful assistant specialized in...
• User Prompt: When users ask about..., respond with...
• Training Instructions: Improve responses by focusing on..."
              value={combinedInput}
              onChange={(e) => handleInputChange(e.target.value)}
              className="min-h-[200px] max-h-[400px] border-0 focus-visible:ring-0 bg-transparent resize-y"
              disabled={isTraining}
              style={{ height: '200px' }}
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
                onClick={generateTrainingPrompt}
                disabled={isTraining || !!promptSummary}
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
                    Generate Training Prompt
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Training Prompt Summary */}
      {promptSummary && (
        <Card className="card-modern border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <Brain className="h-5 w-5" />
              Training Prompt Summary
            </CardTitle>
            <CardDescription className="text-orange-600">
              Review the training prompt before merging with your avatar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-white rounded-lg p-4 border border-orange-200">
              <div className="space-y-3">
                {promptSummary.systemPrompt && (
                  <div>
                    <p className="text-sm font-medium text-orange-700 mb-1">System Prompt:</p>
                    <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                      {promptSummary.systemPrompt}
                    </p>
                  </div>
                )}
                
                {promptSummary.userPrompt && (
                  <div>
                    <p className="text-sm font-medium text-orange-700 mb-1">User Prompt:</p>
                    <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                      {promptSummary.userPrompt}
                    </p>
                  </div>
                )}
                
                {promptSummary.instructions && (
                  <div>
                    <p className="text-sm font-medium text-orange-700 mb-1">Instructions:</p>
                    <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                      {promptSummary.instructions}
                    </p>
                  </div>
                )}
                
                {promptSummary.totalContent && !promptSummary.systemPrompt && !promptSummary.userPrompt && !promptSummary.instructions && (
                  <div>
                    <p className="text-sm font-medium text-orange-700 mb-1">Training Content:</p>
                    <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded max-h-32 overflow-y-auto">
                      {promptSummary.totalContent}
                    </p>
                  </div>
                )}
                
                {promptSummary.fileCount > 0 && (
                  <div>
                    <p className="text-sm font-medium text-orange-700 mb-1">Files:</p>
                    <p className="text-sm text-gray-700">
                      {promptSummary.fileCount} file(s) will be processed
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button 
                onClick={handleMergeTraining}
                disabled={isTraining}
                className="btn-hero flex-1"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Merge & Start Training
              </Button>
              <Button 
                onClick={handleCancelTraining}
                disabled={isTraining}
                variant="outline"
                className="flex-1"
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

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
