
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, Play, Upload, Settings, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TTSSection = () => {
  const { toast } = useToast();

  const handleComingSoon = () => {
    toast({
      title: "Coming Soon!",
      description: "This feature is currently under development and will be available soon.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <Mic className="h-6 w-6" />
          TTS Voice Training
        </h1>
        <p className="text-muted-foreground">
          Train your avatar's voice using text-to-speech technology
        </p>
      </div>

      {/* Voice Upload Section */}
      <Card className="card-modern">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Voice Sample Upload
          </CardTitle>
          <CardDescription>
            Upload voice samples to train your avatar's unique voice
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Upload Voice Samples</h3>
            <p className="text-muted-foreground mb-4">
              Drag and drop audio files or click to browse
            </p>
            <Button onClick={handleComingSoon}>
              Choose Audio Files
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Voice Settings */}
      <Card className="card-modern">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Voice Configuration
          </CardTitle>
          <CardDescription>
            Customize voice parameters and settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Voice Speed</label>
              <Button variant="outline" className="w-full justify-start" onClick={handleComingSoon}>
                Adjust Speed
              </Button>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Voice Pitch</label>
              <Button variant="outline" className="w-full justify-start" onClick={handleComingSoon}>
                Adjust Pitch
              </Button>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Voice Tone</label>
              <Button variant="outline" className="w-full justify-start" onClick={handleComingSoon}>
                Select Tone
              </Button>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Language Accent</label>
              <Button variant="outline" className="w-full justify-start" onClick={handleComingSoon}>
                Choose Accent
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Voice Preview */}
      <Card className="card-modern">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            Voice Preview
          </CardTitle>
          <CardDescription>
            Test and preview your avatar's voice
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Sample Text</label>
            <textarea
              className="w-full p-3 border rounded-md"
              rows={3}
              placeholder="Enter text to test voice synthesis..."
              disabled
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleComingSoon}>
              <Play className="mr-2 h-4 w-4" />
              Preview Voice
            </Button>
            <Button variant="outline" onClick={handleComingSoon}>
              Generate Sample
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Training Progress */}
      <Card className="card-modern">
        <CardHeader>
          <CardTitle>Training Progress</CardTitle>
          <CardDescription>
            Track your voice training progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Voice Samples</span>
              <span>0/10</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: '0%' }}></div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleComingSoon}>
                Start Training
              </Button>
              <Button variant="outline" onClick={handleComingSoon}>
                View Training History
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TTSSection;
