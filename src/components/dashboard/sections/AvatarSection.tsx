
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { 
  User, 
  Palette, 
  Brain, 
  Sparkles, 
  Save,
  Upload,
  Download,
  Eye
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PersonalityTrait {
  name: string;
  value: number[];
}

const AvatarSection = () => {
  const [avatarName, setAvatarName] = useState('');
  const [personalityDescription, setPersonalityDescription] = useState('');
  const [personalityTraits, setPersonalityTraits] = useState<PersonalityTrait[]>([
    { name: 'Friendliness', value: [75] },
    { name: 'Professionalism', value: [85] },
    { name: 'Creativity', value: [60] },
    { name: 'Humor', value: [45] },
    { name: 'Empathy', value: [80] },
    { name: 'Assertiveness', value: [65] },
  ]);
  const { toast } = useToast();

  const handleTraitChange = (index: number, value: number[]) => {
    const updatedTraits = [...personalityTraits];
    updatedTraits[index].value = value;
    setPersonalityTraits(updatedTraits);
  };

  const handleSaveAvatar = () => {
    toast({
      title: "Avatar Saved",
      description: "Your AI avatar configuration has been saved successfully.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <User className="h-8 w-8" />
            AI Avatar Designer
          </h1>
          <p className="text-muted-foreground">
            Design your avatar's appearance and personality
          </p>
        </div>
        <Badge variant="outline" className="learning-path-gradient text-white">
          Avatar v1.0
        </Badge>
      </div>

      <Tabs defaultValue="appearance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="personality">Personality</TabsTrigger>
          <TabsTrigger value="behavior">Behavior</TabsTrigger>
        </TabsList>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Visual Design
                </CardTitle>
                <CardDescription>
                  Customize your avatar's visual appearance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="avatar-name">Avatar Name</Label>
                  <Input
                    id="avatar-name"
                    value={avatarName}
                    onChange={(e) => setAvatarName(e.target.value)}
                    placeholder="Enter your avatar's name..."
                    className="input-modern"
                  />
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Facial Features</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Face Shape</Label>
                      <Button variant="outline" className="w-full justify-start">
                        Select Face Shape
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Label>Eye Color</Label>
                      <Button variant="outline" className="w-full justify-start">
                        Choose Eye Color
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Label>Hair Style</Label>
                      <Button variant="outline" className="w-full justify-start">
                        Select Hair Style
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Label>Hair Color</Label>
                      <Button variant="outline" className="w-full justify-start">
                        Choose Hair Color
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Style & Accessories</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="w-full">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Reference
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Random
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Avatar Preview
                </CardTitle>
                <CardDescription>
                  Real-time preview of your avatar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-muted/20 rounded-lg flex items-center justify-center avatar-glow">
                  <div className="text-center text-muted-foreground">
                    <User className="h-16 w-16 mx-auto mb-4" />
                    <p className="text-sm">Avatar preview will appear here</p>
                    <p className="text-xs mt-2">
                      {avatarName || 'Unnamed Avatar'}
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 space-y-2">
                  <Button className="w-full btn-hero">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Avatar
                  </Button>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                    <Button variant="outline" size="sm">
                      <Save className="mr-2 h-4 w-4" />
                      Save
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Personality Tab */}
        <TabsContent value="personality" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Personality Traits
                </CardTitle>
                <CardDescription>
                  Define your avatar's personality characteristics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {personalityTraits.map((trait, index) => (
                  <div key={trait.name} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label className="font-medium">{trait.name}</Label>
                      <span className="text-sm text-muted-foreground">
                        {trait.value[0]}%
                      </span>
                    </div>
                    <Slider
                      value={trait.value}
                      onValueChange={(value) => handleTraitChange(index, value)}
                      max={100}
                      min={0}
                      step={5}
                      className="w-full"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="card-modern">
              <CardHeader>
                <CardTitle>Personality Description</CardTitle>
                <CardDescription>
                  Describe your avatar's personality in detail
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="personality-desc">Personality Overview</Label>
                  <Textarea
                    id="personality-desc"
                    value={personalityDescription}
                    onChange={(e) => setPersonalityDescription(e.target.value)}
                    placeholder="Describe your avatar's personality, quirks, and characteristics..."
                    className="min-h-[200px] input-modern"
                  />
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Personality Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-muted/20 rounded">
                      <span className="text-sm">Dominant Trait</span>
                      <Badge variant="outline">
                        {personalityTraits.reduce((max, trait) => 
                          trait.value[0] > max.value[0] ? trait : max
                        ).name}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-muted/20 rounded">
                      <span className="text-sm">Communication Style</span>
                      <Badge variant="outline">
                        {personalityTraits.find(t => t.name === 'Professionalism')?.value[0]! > 70 
                          ? 'Professional' : 'Casual'}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-muted/20 rounded">
                      <span className="text-sm">Interaction Level</span>
                      <Badge variant="outline">
                        {personalityTraits.find(t => t.name === 'Friendliness')?.value[0]! > 70 
                          ? 'High' : 'Moderate'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Behavior Tab */}
        <TabsContent value="behavior" className="space-y-6">
          <Card className="card-modern">
            <CardHeader>
              <CardTitle>Behavioral Settings</CardTitle>
              <CardDescription>
                Configure how your avatar behaves and responds
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Response Style</h4>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label>Response Length</Label>
                      <Slider defaultValue={[60]} max={100} min={0} step={10} />
                    </div>
                    <div className="space-y-2">
                      <Label>Formality Level</Label>
                      <Slider defaultValue={[70]} max={100} min={0} step={10} />
                    </div>
                    <div className="space-y-2">
                      <Label>Emotional Expression</Label>
                      <Slider defaultValue={[80]} max={100} min={0} step={10} />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Interaction Preferences</h4>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label>Proactivity</Label>
                      <Slider defaultValue={[55]} max={100} min={0} step={10} />
                    </div>
                    <div className="space-y-2">
                      <Label>Question Asking</Label>
                      <Slider defaultValue={[65]} max={100} min={0} step={10} />
                    </div>
                    <div className="space-y-2">
                      <Label>Topic Switching</Label>
                      <Slider defaultValue={[40]} max={100} min={0} step={10} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t">
                <Button className="w-full btn-hero" onClick={handleSaveAvatar}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Avatar Configuration
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AvatarSection;
