
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Star, 
  DollarSign, 
  Play, 
  Heart, 
  Share2,
  User,
  MessageSquare,
  Mic,
  Globe,
  Camera,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { avatarProfiles } from '@/data/avatarData';
import { useToast } from '@/hooks/use-toast';

const AvatarDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const avatar = avatarProfiles.find(a => a.id === id);
  
  if (!avatar) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-lg font-bold mb-2">Avatar Not Found</h1>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="h-3 w-3 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const handlePurchase = () => {
    toast({
      title: "Purchase Successful!",
      description: `You've successfully purchased ${avatar.name} for $${avatar.price}. Check your avatar library.`,
    });
  };

  const handlePlayVoice = () => {
    toast({
      title: "Playing Voice Preview",
      description: `Playing voice sample for ${avatar.name}`,
    });
  };

  const handleShare = () => {
    toast({
      title: "Link Copied!",
      description: "Avatar profile link copied to clipboard.",
    });
  };

  const handleBackToDashboard = () => {
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-3 py-2">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleBackToDashboard}
              className="text-xs"
            >
              <ArrowLeft className="h-3 w-3 mr-1" />
              Back to Dashboard
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-3 w-3 mr-1" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Heart className="h-3 w-3 mr-1" />
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-3 py-3">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left Column - Images */}
          <div className="space-y-3">
            {/* Main Avatar Image */}
            <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
              <img
                src={avatar.image}
                alt={avatar.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2">
                <Badge variant="secondary" className="text-xs">
                  {avatar.category}
                </Badge>
              </div>
            </div>
            
            {/* Gallery */}
            <div className="grid grid-cols-4 gap-2">
              {avatar.galleryImages.map((img, idx) => (
                <div key={idx} className="aspect-square rounded-md overflow-hidden">
                  <img
                    src={img}
                    alt={`${avatar.name} gallery ${idx + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-3">
            {/* Basic Info */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold">{avatar.name}</h1>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-yellow-500 fill-current" />
                  <span className="font-medium text-sm">{avatar.rating}</span>
                  <span className="text-xs text-muted-foreground">({avatar.totalSales} sales)</span>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground">{avatar.description}</p>
              <p className="text-xs text-muted-foreground">Created by {avatar.creator}</p>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="text-xl font-bold text-black">${avatar.price}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  MBTI: {avatar.mbti}
                </Badge>
              </div>
            </div>

            <Separator />

            {/* Personality & Traits */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Sparkles className="h-3 w-3" />
                  Personality
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex flex-wrap gap-1">
                  {avatar.personality.map((trait) => (
                    <Badge key={trait} variant="secondary" className="text-xs">
                      {trait}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Favorites */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Heart className="h-3 w-3" />
                  Favorites
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1">
                  {avatar.favorites.map((fav) => (
                    <Badge key={fav} variant="outline" className="text-xs">
                      {fav}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Voice & Languages */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Mic className="h-3 w-3" />
                  Voice & Languages
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Voice Description</p>
                  <p className="text-sm">{avatar.voiceDescription}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Languages</p>
                  <div className="flex flex-wrap gap-1">
                    {avatar.languages.map((lang) => (
                      <Badge key={lang} variant="outline" className="text-xs">
                        <Globe className="h-2 w-2 mr-1" />
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handlePlayVoice}
                  className="w-full"
                >
                  <Play className="h-3 w-3 mr-2" />
                  Test Voice
                </Button>
              </CardContent>
            </Card>

            {/* Lifestyle */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Camera className="h-3 w-3" />
                  Lifestyle
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1">
                  {avatar.lifestyle.map((style) => (
                    <Badge key={style} variant="secondary" className="text-xs">
                      {style}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Grow Up Story */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <BookOpen className="h-3 w-3" />
                  Background Story
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {avatar.growUpStory}
                </p>
              </CardContent>
            </Card>

            {/* Purchase Button */}
            <div className="sticky bottom-3 bg-white/80 backdrop-blur-sm rounded-lg p-3 border">
              <Button 
                onClick={handlePurchase}
                className="w-full"
                size="lg"
              >
                Purchase Avatar - ${avatar.price}
              </Button>
              <p className="text-xs text-center text-muted-foreground mt-2">
                Commercial license included • Instant download
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarDetail;
