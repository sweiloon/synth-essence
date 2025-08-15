
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Image, 
  Sparkles, 
  Download, 
  Upload, 
  Grid3x3,
  Heart,
  Trash2,
  Plus
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ImagesSection = () => {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('realistic');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerateImage = () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt Required",
        description: "Please enter a description for the image you want to generate.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    toast({
      title: "Generating Image",
      description: "Creating your AI-generated image...",
    });
    
    setTimeout(() => {
      setIsGenerating(false);
      toast({
        title: "Image Generated!",
        description: "Your new image has been added to the gallery.",
      });
    }, 3000);
  };

  const generatedImages = [
    { id: 1, url: '/placeholder.svg', prompt: 'Professional headshot of a friendly AI avatar', liked: true },
    { id: 2, url: '/placeholder.svg', prompt: 'Casual lifestyle photo in a modern office', liked: false },
    { id: 3, url: '/placeholder.svg', prompt: 'Avatar in a natural outdoor setting', liked: true },
    { id: 4, url: '/placeholder.svg', prompt: 'Artistic portrait with soft lighting', liked: false },
    { id: 5, url: '/placeholder.svg', prompt: 'Avatar in business attire for professional use', liked: true },
    { id: 6, url: '/placeholder.svg', prompt: 'Creative lifestyle shot with vibrant colors', liked: false },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Image className="h-8 w-8" />
            AI Image Generator
          </h1>
          <p className="text-muted-foreground">
            Generate lifestyle and portrait images for your AI avatar
          </p>
        </div>
        <Badge variant="outline" className="learning-path-gradient text-white">
          DALL-E 3 Powered
        </Badge>
      </div>

      <Tabs defaultValue="generate" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generate">Generate Images</TabsTrigger>
          <TabsTrigger value="gallery">Image Gallery</TabsTrigger>
          <TabsTrigger value="collections">Collections</TabsTrigger>
        </TabsList>

        {/* Generate Tab */}
        <TabsContent value="generate" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Image Generation
                </CardTitle>
                <CardDescription>
                  Create custom images for your AI avatar
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="prompt">Image Description</Label>
                  <Input
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe the image you want to generate..."
                    className="input-modern"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Style</Label>
                  <Select value={style} onValueChange={setStyle}>
                    <SelectTrigger className="input-modern">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realistic">Photorealistic</SelectItem>
                      <SelectItem value="artistic">Artistic</SelectItem>
                      <SelectItem value="cartoon">Cartoon</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="casual">Casual Lifestyle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Aspect Ratio</Label>
                    <Select defaultValue="1:1">
                      <SelectTrigger className="input-modern">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1:1">Square (1:1)</SelectItem>
                        <SelectItem value="4:3">Landscape (4:3)</SelectItem>
                        <SelectItem value="16:9">Widescreen (16:9)</SelectItem>
                        <SelectItem value="3:4">Portrait (3:4)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Quality</Label>
                    <Select defaultValue="high">
                      <SelectTrigger className="input-modern">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="high">High Quality</SelectItem>
                        <SelectItem value="hd">HD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  className="w-full btn-hero"
                  onClick={handleGenerateImage}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Image
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card className="card-modern">
              <CardHeader>
                <CardTitle>Generation Preview</CardTitle>
                <CardDescription>
                  Your generated image will appear here
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-muted/20 rounded-lg flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <Image className="h-12 w-12 mx-auto mb-4" />
                    <p className="text-sm">Generated image preview</p>
                  </div>
                </div>
                
                <div className="mt-4 space-y-2">
                  <Button variant="outline" className="w-full" disabled>
                    <Download className="mr-2 h-4 w-4" />
                    Download Image
                  </Button>
                  <Button variant="outline" className="w-full" disabled>
                    <Heart className="mr-2 h-4 w-4" />
                    Add to Favorites
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Gallery Tab */}
        <TabsContent value="gallery" className="space-y-6">
          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Grid3x3 className="h-5 w-5" />
                Generated Images
              </CardTitle>
              <CardDescription>
                Browse and manage your AI-generated images
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {generatedImages.map((image) => (
                  <div key={image.id} className="group relative">
                    <div className="aspect-square bg-muted/20 rounded-lg overflow-hidden">
                      <img 
                        src={image.url} 
                        alt={image.prompt}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <div className="flex gap-2">
                        <Button size="sm" variant="secondary">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="secondary">
                          <Heart className={`h-4 w-4 ${image.liked ? 'fill-red-500 text-red-500' : ''}`} />
                        </Button>
                        <Button size="sm" variant="destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                      {image.prompt}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Collections Tab */}
        <TabsContent value="collections" className="space-y-6">
          <Card className="card-modern">
            <CardHeader>
              <CardTitle>Image Collections</CardTitle>
              <CardDescription>
                Organize your images into themed collections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button className="btn-hero w-full md:w-auto">
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Collection
                </Button>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Professional Headshots</h4>
                      <Badge variant="outline">12 images</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Business and professional portrait images
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      View Collection
                    </Button>
                  </div>
                  
                  <div className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Lifestyle Photos</h4>
                      <Badge variant="outline">8 images</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Casual and lifestyle photography
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      View Collection
                    </Button>
                  </div>
                  
                  <div className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Artistic Portraits</h4>
                      <Badge variant="outline">5 images</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Creative and artistic image variations
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      View Collection
                    </Button>
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

export default ImagesSection;
