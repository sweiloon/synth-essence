
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Image, 
  Sparkles, 
  Download, 
  Upload, 
  Grid3x3,
  Heart,
  Trash2,
  Plus,
  Loader2,
  FolderPlus
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface GeneratedImage {
  id: string;
  prompt: string;
  image_url: string;
  original_image_url?: string;
  generation_type: 'text-to-image' | 'image-to-image';
  is_favorite: boolean;
  created_at: string;
}

interface ImageCollection {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  image_collection_items?: { count: number }[];
}

const ImagesSection = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('realistic');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [quality, setQuality] = useState('high');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [isPromptExpanded, setIsPromptExpanded] = useState(false);
  
  // Data states
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [collections, setCollections] = useState<ImageCollection[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(true);
  const [isLoadingCollections, setIsLoadingCollections] = useState(true);
  
  // Collection dialog states
  const [isCreateCollectionOpen, setIsCreateCollectionOpen] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionDescription, setNewCollectionDescription] = useState('');
  const [selectedImageForCollection, setSelectedImageForCollection] = useState<string | null>(null);

  // Load images and collections on component mount
  useEffect(() => {
    if (user) {
      loadImages();
      loadCollections();
    }
  }, [user]);

  const loadImages = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('manage-images', {
        body: { action: 'get_images' }
      });

      if (error) throw error;
      setImages(data.images || []);
    } catch (error) {
      console.error('Error loading images:', error);
      toast({
        title: "Error",
        description: "Failed to load images",
        variant: "destructive",
      });
    } finally {
      setIsLoadingImages(false);
    }
  };

  const loadCollections = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('manage-collections', {
        body: { action: 'get_collections' }
      });

      if (error) throw error;
      setCollections(data.collections || []);
    } catch (error) {
      console.error('Error loading collections:', error);
      toast({
        title: "Error",
        description: "Failed to load collections",
        variant: "destructive",
      });
    } finally {
      setIsLoadingCollections(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "Error",
          description: "File size must be less than 10MB",
          variant: "destructive",
        });
        return;
      }
      
      setUploadedImage(file);
      const imageUrl = URL.createObjectURL(file);
      setUploadedImageUrl(imageUrl);
    }
  };

  const uploadImageToStorage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `ai-images/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      let originalImageUrl = null;
      const generationType = uploadedImage ? 'image-to-image' : 'text-to-image';
      
      // Upload the input image if provided
      if (uploadedImage) {
        originalImageUrl = await uploadImageToStorage(uploadedImage);
      }

      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: {
          prompt,
          imageUrls: originalImageUrl ? [originalImageUrl] : null,
          generationType
        }
      });

      if (error) throw error;

      setGeneratedImage(data.generatedUrl);
      await loadImages(); // Refresh the images list
      
      toast({
        title: "Success",
        description: "Image generated successfully!",
      });
      
    } catch (error) {
      console.error('Error generating image:', error);
      toast({
        title: "Error",
        description: "Failed to generate image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleFavorite = async (imageId: string, currentFavorite: boolean) => {
    try {
      const { error } = await supabase.functions.invoke('manage-images', {
        body: {
          action: 'toggle_favorite',
          imageId,
          isFavorite: !currentFavorite
        }
      });

      if (error) throw error;
      
      setImages(prev => prev.map(img => 
        img.id === imageId ? { ...img, is_favorite: !currentFavorite } : img
      ));
      
      toast({
        title: "Success",
        description: currentFavorite ? "Removed from favorites" : "Added to favorites",
      });
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Error",
        description: "Failed to update favorite status",
        variant: "destructive",
      });
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    try {
      const { error } = await supabase.functions.invoke('manage-images', {
        body: {
          action: 'delete_image',
          imageId
        }
      });

      if (error) throw error;
      
      setImages(prev => prev.filter(img => img.id !== imageId));
      
      toast({
        title: "Success",
        description: "Image deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting image:', error);
      toast({
        title: "Error",
        description: "Failed to delete image",
        variant: "destructive",
      });
    }
  };

  const handleCreateCollection = async () => {
    if (!newCollectionName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a collection name",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.functions.invoke('manage-collections', {
        body: {
          action: 'create_collection',
          name: newCollectionName,
          description: newCollectionDescription
        }
      });

      if (error) throw error;
      
      await loadCollections();
      setIsCreateCollectionOpen(false);
      setNewCollectionName('');
      setNewCollectionDescription('');
      
      toast({
        title: "Success",
        description: "Collection created successfully",
      });
    } catch (error) {
      console.error('Error creating collection:', error);
      toast({
        title: "Error",
        description: "Failed to create collection",
        variant: "destructive",
      });
    }
  };

  const handleAddToCollection = async (collectionId: string, imageId: string) => {
    try {
      const { error } = await supabase.functions.invoke('manage-collections', {
        body: {
          action: 'add_to_collection',
          collectionId,
          imageId
        }
      });

      if (error) throw error;
      
      await loadCollections();
      
      toast({
        title: "Success",
        description: "Image added to collection",
      });
    } catch (error) {
      console.error('Error adding to collection:', error);
      toast({
        title: "Error",
        description: "Failed to add image to collection",
        variant: "destructive",
      });
    }
  };

  const handleDownloadImage = (imageUrl: string, prompt: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `ai-generated-${prompt.slice(0, 20).replace(/[^a-z0-9]/gi, '_')}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
