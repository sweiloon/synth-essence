
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Mic, 
  Play, 
  Pause, 
  Upload, 
  Download, 
  Volume2,
  Settings,
  Waveform
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TTSSection = () => {
  const [selectedVoice, setSelectedVoice] = useState('aria');
  const [pitch, setPitch] = useState([1.0]);
  const [speed, setSpeed] = useState([1.0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [testText, setTestText] = useState('Hello, this is your AI avatar speaking. How do you like my voice?');
  const { toast } = useToast();

  const voiceOptions = [
    { id: 'aria', name: 'Aria', description: 'Natural, professional female voice', accent: 'American' },
    { id: 'roger', name: 'Roger', description: 'Clear, confident male voice', accent: 'British' },
    { id: 'sarah', name: 'Sarah', description: 'Warm, friendly female voice', accent: 'Australian' },
    { id: 'liam', name: 'Liam', description: 'Casual, energetic male voice', accent: 'Irish' },
  ];

  const handlePlayTest = () => {
    setIsPlaying(true);
    toast({
      title: "Playing Voice Sample",
      description: "Testing your avatar's voice with the current settings.",
    });
    
    setTimeout(() => {
      setIsPlaying(false);
    }, 3000);
  };

  const handleVoiceCloning = () => {
    toast({
      title: "Voice Cloning",
      description: "Voice cloning feature will be available with full backend integration.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Mic className="h-8 w-8" />
            TTS Voice Configuration
          </h1>
          <p className="text-muted-foreground">
            Configure and train your avatar's voice characteristics
          </p>
        </div>
        <Badge variant="outline" className="learning-path-gradient text-white">
          Voice Model v3.2
        </Badge>
      </div>

      <Tabs defaultValue="configure" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="configure">Configure Voice</TabsTrigger>
          <TabsTrigger value="clone">Clone Voice</TabsTrigger>
          <TabsTrigger value="library">Voice Library</TabsTrigger>
        </TabsList>

        {/* Configure Tab */}
        <TabsContent value="configure" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Voice Settings
                </CardTitle>
                <CardDescription>
                  Customize your avatar's voice parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Voice Selection</Label>
                  <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                    <SelectTrigger className="input-modern">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {voiceOptions.map((voice) => (
                        <SelectItem key={voice.id} value={voice.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{voice.name}</span>
                            <span className="text-sm text-muted-foreground">{voice.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>Pitch: {pitch[0].toFixed(1)}</Label>
                  <Slider
                    value={pitch}
                    onValueChange={setPitch}
                    max={2}
                    min={0.5}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-3">
                  <Label>Speed: {speed[0].toFixed(1)}x</Label>
                  <Slider
                    value={speed}
                    onValueChange={setSpeed}
                    max={2}
                    min={0.5}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="test-text">Test Text</Label>
                  <Input
                    id="test-text"
                    value={testText}
                    onChange={(e) => setTestText(e.target.value)}
                    className="input-modern"
                    placeholder="Enter text to test voice..."
                  />
                </div>

                <Button 
                  className="w-full btn-hero"
                  onClick={handlePlayTest}
                  disabled={isPlaying}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="mr-2 h-4 w-4" />
                      Playing...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Test Voice
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Waveform className="h-5 w-5" />
                  Voice Preview
                </CardTitle>
                <CardDescription>
                  Real-time voice visualization and analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-32 bg-muted/20 rounded-lg flex items-center justify-center">
                  <div className="text-muted-foreground text-center">
                    <Volume2 className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">Voice waveform will appear here</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Current Voice</span>
                    <span className="text-sm font-medium capitalize">{selectedVoice}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Quality</span>
                    <Badge variant="outline">High Definition</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Language</span>
                    <span className="text-sm font-medium">English (US)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Sample Rate</span>
                    <span className="text-sm font-medium">48kHz</span>
                  </div>
                </div>

                <div className="pt-4 border-t space-y-2">
                  <Button variant="outline" className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Export Voice Sample
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Audio Reference
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Clone Voice Tab */}
        <TabsContent value="clone" className="space-y-6">
          <Card className="card-modern">
            <CardHeader>
              <CardTitle>Voice Cloning</CardTitle>
              <CardDescription>
                Create a custom voice model based on your voice samples
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center p-8 border-2 border-dashed border-border rounded-lg">
                <Mic className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Upload Voice Samples</h3>
                <p className="text-muted-foreground mb-4">
                  Upload high-quality audio recordings (minimum 10 minutes recommended)
                </p>
                <Button className="btn-hero" onClick={handleVoiceCloning}>
                  <Upload className="mr-2 h-4 w-4" />
                  Choose Audio Files
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted/20 rounded-lg">
                  <h4 className="font-medium mb-1">Recording Quality</h4>
                  <p className="text-sm text-muted-foreground">Clear, noise-free audio</p>
                </div>
                <div className="text-center p-4 bg-muted/20 rounded-lg">
                  <h4 className="font-medium mb-1">Duration</h4>
                  <p className="text-sm text-muted-foreground">10+ minutes recommended</p>
                </div>
                <div className="text-center p-4 bg-muted/20 rounded-lg">
                  <h4 className="font-medium mb-1">Format</h4>
                  <p className="text-sm text-muted-foreground">WAV, MP3, or FLAC</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Voice Library Tab */}
        <TabsContent value="library" className="space-y-6">
          <Card className="card-modern">
            <CardHeader>
              <CardTitle>Voice Library</CardTitle>
              <CardDescription>
                Browse and manage your custom voice models
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {voiceOptions.map((voice) => (
                  <div key={voice.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{voice.name}</h4>
                      <Badge variant="outline">{voice.accent}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{voice.description}</p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Play className="mr-1 h-3 w-3" />
                        Preview
                      </Button>
                      <Button 
                        variant={selectedVoice === voice.id ? "default" : "outline"} 
                        size="sm" 
                        className="flex-1"
                        onClick={() => setSelectedVoice(voice.id)}
                      >
                        {selectedVoice === voice.id ? 'Selected' : 'Select'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TTSSection;
