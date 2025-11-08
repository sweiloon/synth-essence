
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
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [isPromptExpanded, setIsPromptExpanded] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  
  // Data states
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [collections, setCollections] = useState<ImageCollection[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(true);
  const [isLoadingCollections, setIsLoadingCollections] = useState(true);
  const [collectionDialogOpen, setCollectionDialogOpen] = useState(false);
  const [collectionSelection, setCollectionSelection] = useState('');
  
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
    if (!user) {
      setIsLoadingImages(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('generated_images')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setImages(data || []);
    } catch (error: any) {
      console.error('Error loading images:', error);
      toast({
        title: "Error",
        description: `Failed to load images: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoadingImages(false);
    }
  };

  const loadCollections = async () => {
    if (!user) {
      setIsLoadingCollections(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('image_collections')
        .select(`
          *,
          image_collection_items(count)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCollections(data || []);
    } catch (error: any) {
      console.error('Error loading collections:', error);
      toast({
        title: "Error",
        description: `Failed to load collections: ${error.message}`,
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
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processUploadedFile(files[0]);
    }
  };

  const handleClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/png,image/webp';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        processUploadedFile(file);
      }
    };
    input.click();
  };

  const uploadImageToStorage = async (file: File, folder: string = 'ai-images'): Promise<string> => {
    if (!user) throw new Error('Please log in to upload images');
    const fileExt = file.name.split('.').pop() || 'png';
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
    const filePath = `${user.id}/${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: false });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const requestKieGeneration = async ({
    apiKey,
    prompt,
    referenceImageUrl,
    generationType,
  }: {
    apiKey: string;
    prompt: string;
    referenceImageUrl?: string | null;
    generationType: 'text-to-image' | 'image-to-image';
  }): Promise<string> => {
    setGenerationProgress(35);
    const requestBody: Record<string, any> = {
      prompt,
      aspectRatio: '1:1',
      model: 'flux-kontext-pro',
    };

    if (generationType === 'image-to-image' && referenceImageUrl) {
      requestBody.inputImage = referenceImageUrl;
    }

    const requestResponse = await fetch('https://api.kie.ai/api/v1/flux/kontext/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!requestResponse.ok) {
      const errorText = await requestResponse.text();
      throw new Error(`Generation request failed: ${errorText}`);
    }

    const requestJson = await requestResponse.json();
    if (requestJson.code !== 200 || !requestJson.data?.taskId) {
      throw new Error(requestJson.msg || 'Failed to start generation task.');
    }

    const taskId = requestJson.data.taskId as string;
    let attempts = 0;

    while (attempts < 40) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const statusResponse = await fetch(`https://api.kie.ai/api/v1/flux/kontext/${taskId}`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });

      if (!statusResponse.ok) {
        attempts++;
        continue;
      }

      const statusJson = await statusResponse.json();
      const status = statusJson.data?.status?.toLowerCase();
      const progress = statusJson.data?.progress ?? Math.min(90, 45 + attempts * 2);
      setGenerationProgress(progress);

      if (status === 'completed' && statusJson.data?.images?.length) {
        return statusJson.data.images[0];
      }

      if (status === 'failed') {
        throw new Error(statusJson.data?.message || 'Generation failed, please try again.');
      }

      attempts++;
    }

    throw new Error('Generation timed out. Please try again.');
  };

  const persistGeneratedImage = async ({
    remoteUrl,
    prompt,
    originalImageUrl,
    generationType
  }: {
    remoteUrl: string;
    prompt: string;
    originalImageUrl: string | null;
    generationType: 'text-to-image' | 'image-to-image';
  }): Promise<GeneratedImage> => {
    if (!user) throw new Error('Please log in to save images');

    const downloadResponse = await fetch(remoteUrl);
    if (!downloadResponse.ok) {
      throw new Error('Failed to download generated image.');
    }

    const blob = await downloadResponse.blob();
    const fileExt = blob.type.split('/')[1] || 'png';
    const filePath = `${user.id}/generated/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, blob, {
        contentType: blob.type || 'image/png',
        upsert: false
      });

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    const { data: publicData } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    const { data, error } = await supabase
      .from('generated_images')
      .insert({
        user_id: user.id,
        prompt,
        image_url: publicData.publicUrl,
        original_image_url: originalImageUrl,
        generation_type: generationType,
        is_favorite: false
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as GeneratedImage;
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

    if (!user) {
      toast({
        title: "Error",
        description: "Please log in to generate images",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(10);
    setGeneratedImage(null);

    const apiKey = import.meta.env.VITE_KIE_AI_API_KEY;
    if (!apiKey) {
      toast({
        title: "Missing API key",
        description: "Set VITE_KIE_AI_API_KEY in your environment to enable KIE AI generation.",
        variant: "destructive",
      });
      setIsGenerating(false);
      setGenerationProgress(0);
      return;
    }

    try {
      if (!user) throw new Error('Please log in to generate images');

      let originalImageUrl: string | null = null;
      const generationType: 'text-to-image' | 'image-to-image' = uploadedImage ? 'image-to-image' : 'text-to-image';
      
      if (uploadedImage) {
        setGenerationProgress(20);
        originalImageUrl = await uploadImageToStorage(uploadedImage, 'image-inputs');
      }

      const generatedUrl = await requestKieGeneration({
        apiKey,
        prompt,
        referenceImageUrl: originalImageUrl,
        generationType,
      });

      setGenerationProgress(85);
      const savedImage = await persistGeneratedImage({
        remoteUrl: generatedUrl,
        prompt,
        originalImageUrl,
        generationType,
      });

      setGeneratedImage(savedImage);
      setImages(prev => [savedImage, ...prev]);
      setGenerationProgress(100);

      toast({
        title: "Success",
        description: "Image generated successfully!",
      });
    } catch (error: any) {
      console.error('Error generating image:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  const handleReset = () => {
    setPrompt('');
    setUploadedImage(null);
    setUploadedImageUrl(null);
    setGeneratedImage(null);
    setGenerationProgress(0);
  };

  const handleToggleFavorite = async (imageId: string, currentFavorite: boolean) => {
    try {
      if (!user) throw new Error('Please log in to manage favorites');

      const { data, error } = await supabase
        .from('generated_images')
        .update({ is_favorite: !currentFavorite })
        .eq('id', imageId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      const updatedFavorite = data?.is_favorite ?? !currentFavorite;
      setImages(prev => prev.map(img => 
        img.id === imageId ? { ...img, is_favorite: updatedFavorite } : img
      ));
      setGeneratedImage(prev => prev && prev.id === imageId ? { ...prev, is_favorite: updatedFavorite } : prev);
      
      toast({
        title: "Success",
        description: currentFavorite ? "Removed from favorites" : "Added to favorites",
      });
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update favorite status",
        variant: "destructive",
      });
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    try {
      if (!user) throw new Error('Please log in to delete images');

      await supabase
        .from('image_collection_items')
        .delete()
        .eq('image_id', imageId)
        .eq('user_id', user.id);

      const { error } = await supabase
        .from('generated_images')
        .delete()
        .eq('id', imageId)
        .eq('user_id', user.id);

      if (error) throw error;
      
      setImages(prev => prev.filter(img => img.id !== imageId));
      setGeneratedImage(prev => (prev?.id === imageId ? null : prev));
      
      toast({
        title: "Success",
        description: "Image deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting image:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete image",
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
      if (!user) throw new Error('Please log in to create collections');

      const { error } = await supabase
        .from('image_collections')
        .insert({
          user_id: user.id,
          name: newCollectionName.trim(),
          description: newCollectionDescription.trim() || null
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
        description: error.message || "Failed to create collection",
        variant: "destructive",
      });
    }
  };

  const handleAddToCollection = async (collectionId: string, imageId: string) => {
    try {
      if (!user) throw new Error('Please log in to manage collections');

      const { error } = await supabase
        .from('image_collection_items')
        .insert({
          user_id: user.id,
          collection_id: collectionId,
          image_id: imageId
        });

      if (error) throw error;
      
      await loadCollections();
      setCollectionDialogOpen(false);
      setCollectionSelection('');
      
      toast({
        title: "Success",
        description: "Image added to collection",
      });
    } catch (error) {
      console.error('Error adding to collection:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add image to collection",
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
          KIE AI Flux Powered
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
                    className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 transition-colors hover:border-muted-foreground/50 cursor-pointer relative"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => {
                      if (!uploadedImageUrl) {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0];
                          if (file) processUploadedFile(file);
                        };
                        input.click();
                      }
                    }}
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
                          onClick={(e) => {
                            e.stopPropagation();
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
                      src={generatedImage.image_url} 
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
                    onClick={() => generatedImage && handleDownloadImage(generatedImage.image_url, generatedImage.prompt)}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Image
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    disabled={!generatedImage || isGenerating}
                    onClick={() => generatedImage && handleToggleFavorite(generatedImage.id, generatedImage.is_favorite)}
                  >
                    <Heart className={`mr-2 h-4 w-4 ${generatedImage?.is_favorite ? 'fill-primary text-primary' : ''}`} />
                    {generatedImage?.is_favorite ? 'Remove from Favorites' : 'Add to Favorites'}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    disabled={!generatedImage || isGenerating || collections.length === 0}
                    onClick={() => setCollectionDialogOpen(true)}
                  >
                    <FolderPlus className="mr-2 h-4 w-4" />
                    Save to Collection
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
      <Dialog open={collectionDialogOpen} onOpenChange={(open) => {
        setCollectionDialogOpen(open);
        if (!open) setCollectionSelection('');
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save to Collection</DialogTitle>
          </DialogHeader>
          {collections.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              You don&apos;t have any collections yet. Create one from the Collections tab.
            </p>
          ) : (
            <div className="space-y-4">
              <Select value={collectionSelection} onValueChange={setCollectionSelection}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a collection" />
                </SelectTrigger>
                <SelectContent>
                  {collections.map((collection) => (
                    <SelectItem key={collection.id} value={collection.id}>
                      {collection.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                className="w-full"
                disabled={!collectionSelection || !generatedImage}
                onClick={() => generatedImage && collectionSelection && handleAddToCollection(collectionSelection, generatedImage.id)}
              >
                Save
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImagesSection;
