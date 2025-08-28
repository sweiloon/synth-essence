
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
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [isPromptExpanded, setIsPromptExpanded] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  
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
      processUploadedFile(file);
    }
  };

  const processUploadedFile = (file: File) => {
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
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processUploadedFile(files[0]);
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

  const checkProgress = async (taskId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: {
          checkProgress: true,
          taskId
        }
      });

      if (error) throw error;

      setGenerationProgress(data.progress || 0);

      if (data.status === 'completed' && data.imageUrl) {
        // Save the generated image
        let originalImageUrl = null;
        if (uploadedImage) {
          originalImageUrl = await uploadImageToStorage(uploadedImage);
        }

        const { error: saveError } = await supabase.functions.invoke('save-generated-image', {
          body: {
            prompt,
            imageUrl: data.imageUrl,
            originalImageUrl,
            generationType: uploadedImage ? 'image-to-image' : 'text-to-image'
          }
        });

        if (saveError) throw saveError;

        setGeneratedImage(data.imageUrl);
        setIsGenerating(false);
        setCurrentTaskId(null);
        setGenerationProgress(0);
        await loadImages();

        toast({
          title: "Success",
          description: "Image generated successfully!",
        });

        return true;
      } else if (data.status === 'failed') {
        throw new Error('Image generation failed');
      }

      return false;
    } catch (error) {
      console.error('Error checking progress:', error);
      setIsGenerating(false);
      setCurrentTaskId(null);
      setGenerationProgress(0);
      return true; // Stop polling on error
    }
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
    setGenerationProgress(0);
    setGeneratedImage(null);

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

      if (data.taskId) {
        setCurrentTaskId(data.taskId);
        
        // Start polling for progress
        const pollProgress = async () => {
          const completed = await checkProgress(data.taskId);
          if (!completed) {
            setTimeout(pollProgress, 2000); // Check every 2 seconds
          }
        };
        
        setTimeout(pollProgress, 1000); // Start after 1 second
      }
      
    } catch (error) {
      console.error('Error generating image:', error);
      toast({
        title: "Error",
        description: "Failed to generate image. Please try again.",
        variant: "destructive",
      });
      setIsGenerating(false);
      setCurrentTaskId(null);
      setGenerationProgress(0);
    }
  };

  const handleReset = () => {
    setPrompt('');
    setUploadedImage(null);
    setUploadedImageUrl(null);
    setGeneratedImage(null);
    setGenerationProgress(0);
    setCurrentTaskId(null);
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
                  <Textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe the image you want to generate..."
                    className={`resize-none transition-all duration-200 ${
                      isPromptExpanded ? 'min-h-[120px]' : 'min-h-[80px]'
                    }`}
                    onFocus={() => setIsPromptExpanded(true)}
                    onBlur={() => setIsPromptExpanded(false)}
                  />
                </div>

                {/* Upload Image Section */}
                <div className="space-y-2">
                  <Label>Upload Image (Optional)</Label>
                  <div 
                    className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 transition-colors hover:border-muted-foreground/50"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    {uploadedImageUrl ? (
                      <div className="relative">
                        <img 
                          src={uploadedImageUrl} 
                          alt="Uploaded" 
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <Button
                          size="sm"
                          variant="destructive"
                          className="absolute top-2 right-2"
                          onClick={() => {
                            setUploadedImage(null);
                            setUploadedImageUrl(null);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Supported formats: JPEG, PNG, WEBP • Maximum file size: 10MB
                        </p>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="mt-2"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button 
                    className="flex-1 btn-hero"
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
                  <Button 
                    variant="outline"
                    onClick={handleReset}
                    disabled={isGenerating}
                  >
                    Reset
                  </Button>
                </div>
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
                <div className="aspect-square bg-muted/20 rounded-lg flex items-center justify-center overflow-hidden">
                  {isGenerating ? (
                    <div className="text-center text-muted-foreground p-4">
                      <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin" />
                      <p className="text-sm mb-2">Generating image...</p>
                      <div className="w-full bg-muted rounded-full h-2 mb-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.max(10, generationProgress)}%` }}
                        />
                      </div>
                      <p className="text-xs">{Math.round(generationProgress)}% complete</p>
                    </div>
                  ) : generatedImage ? (
                    <img 
                      src={generatedImage} 
                      alt="Generated image" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <Image className="h-12 w-12 mx-auto mb-4" />
                      <p className="text-sm">Generated image preview</p>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    disabled={!generatedImage || isGenerating}
                    onClick={() => generatedImage && handleDownloadImage(generatedImage, prompt)}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Image
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    disabled={!generatedImage || isGenerating}
                    onClick={() => {
                      if (generatedImage) {
                        toast({
                          title: "Tip",
                          description: "Image saved to your gallery. You can favorite it from there!",
                        });
                      }
                    }}
                  >
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
              {isLoadingImages ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : images.length === 0 ? (
                <div className="text-center py-8">
                  <Image className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No images generated yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {images.map((image) => (
                    <div key={image.id} className="group relative">
                      <div className="aspect-square bg-muted/20 rounded-lg overflow-hidden">
                        <img 
                          src={image.image_url} 
                          alt={image.prompt}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="secondary"
                            onClick={() => handleDownloadImage(image.image_url, image.prompt)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant={image.is_favorite ? "default" : "secondary"}
                            onClick={() => handleToggleFavorite(image.id, image.is_favorite)}
                          >
                            <Heart className={`h-4 w-4 ${image.is_favorite ? 'fill-current' : ''}`} />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleDeleteImage(image.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="secondary"
                                onClick={() => setSelectedImageForCollection(image.id)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Add to Collection</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                {collections.map((collection) => (
                                  <Button
                                    key={collection.id}
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={() => {
                                      if (selectedImageForCollection) {
                                        handleAddToCollection(collection.id, selectedImageForCollection);
                                      }
                                    }}
                                  >
                                    {collection.name}
                                  </Button>
                                ))}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                      
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {image.prompt}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <Badge variant="outline" className="text-xs">
                            {image.generation_type === 'text-to-image' ? 'Text → Image' : 'Image → Image'}
                          </Badge>
                          {image.is_favorite && (
                            <Heart className="h-4 w-4 fill-current text-red-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
                <Dialog open={isCreateCollectionOpen} onOpenChange={setIsCreateCollectionOpen}>
                  <DialogTrigger asChild>
                    <Button className="btn-hero w-full md:w-auto">
                      <Plus className="mr-2 h-4 w-4" />
                      Create New Collection
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Collection</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="collection-name">Collection Name</Label>
                        <Input
                          id="collection-name"
                          value={newCollectionName}
                          onChange={(e) => setNewCollectionName(e.target.value)}
                          placeholder="Enter collection name..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="collection-description">Description (Optional)</Label>
                        <Textarea
                          id="collection-description"
                          value={newCollectionDescription}
                          onChange={(e) => setNewCollectionDescription(e.target.value)}
                          placeholder="Enter collection description..."
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsCreateCollectionOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleCreateCollection}>
                          Create Collection
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                {isLoadingCollections ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : collections.length === 0 ? (
                  <div className="text-center py-8">
                    <FolderPlus className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No collections created yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {collections.map((collection) => (
                      <Card key={collection.id} className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <h3 className="font-semibold">{collection.name}</h3>
                              {collection.description && (
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {collection.description}
                                </p>
                              )}
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Image className="h-3 w-3" />
                                <span>
                                  {collection.image_collection_items?.[0]?.count || 0} images
                                </span>
                              </div>
                            </div>
                            <Button size="sm" variant="ghost">
                              View Collection
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ImagesSection;
