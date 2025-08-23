
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Star, 
  DollarSign,
  MessageSquare,
  Mic,
  Image as ImageIcon,
  User,
  Globe,
  Heart,
  Share2
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Avatar Not Found</h1>
          <Button onClick={() => navigate('/dashboard', { state: { activeSection: 'marketplace' } })}>
            Back to Marketplace
          </Button>
        </div>
      </div>
    );
  }

  const handlePurchase = () => {
    // Get existing purchased avatars
    const existingPurchased = JSON.parse(localStorage.getItem('purchasedAvatars') || '[]');
    
    if (!existingPurchased.includes(avatar.id)) {
      const updatedPurchased = [...existingPurchased, avatar.id];
      localStorage.setItem('purchasedAvatars', JSON.stringify(updatedPurchased));
      
      toast({
        title: "Avatar Purchased!",
        description: `${avatar.name} has been added to your collection.`,
      });
    } else {
      toast({
        title: "Already Owned",
        description: "You already own this avatar.",
      });
    }
  };

  const handleBackToMarketplace = () => {
    navigate('/dashboard', { state: { activeSection: 'marketplace' } });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={handleBackToMarketplace}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Marketplace
          </Button>
          <div className="flex gap-2 ml-auto">
            <Button variant="outline" size="sm">
              <Heart className="h-4 w-4 mr-2" />
              Favorite
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Avatar Image and Gallery */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="p-0">
                <div className="aspect-[3/4] overflow-hidden rounded-t-lg">
                  <img
                    src={avatar.image}
                    alt={avatar.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-medium">{avatar.rating}</span>
                      <span className="text-muted-foreground">({avatar.totalSales} sales)</span>
                    </div>
                    <Badge variant="secondary">{avatar.category}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-5 w-5" />
                      <span className="text-2xl font-bold">${avatar.price}</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4" onClick={handlePurchase}>
                    Purchase Avatar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Avatar Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-3xl mb-2">{avatar.name}</CardTitle>
                    <CardDescription className="text-base">
                      Created by {avatar.creator}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="text-lg px-3 py-1">
                    {avatar.mbti}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{avatar.description}</p>
                
                {/* Personality Traits */}
                <div className="space-y-2 mb-4">
                  <h4 className="font-medium">Personality Traits</h4>
                  <div className="flex flex-wrap gap-2">
                    {avatar.personality.map((trait) => (
                      <Badge key={trait} variant="secondary">
                        {trait}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Languages */}
                <div className="space-y-2 mb-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Languages
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {avatar.languages.map((language) => (
                      <Badge key={language} variant="outline">
                        {language}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Favorites */}
                <div className="space-y-2">
                  <h4 className="font-medium">Favorites</h4>
                  <div className="flex flex-wrap gap-2">
                    {avatar.favorites.slice(0, 6).map((favorite) => (
                      <Badge key={favorite} variant="outline">
                        {favorite}
                      </Badge>
                    ))}
                    {avatar.favorites.length > 6 && (
                      <Badge variant="outline">
                        +{avatar.favorites.length - 6} more
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Backstory */}
            <Card>
              <CardHeader>
                <CardTitle>Backstory</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {avatar.growUpStory}
                </p>
              </CardContent>
            </Card>

            {/* Voice Description */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="h-5 w-5" />
                  Voice Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {avatar.voiceDescription}
                </p>
              </CardContent>
            </Card>

            {/* Lifestyle */}
            <Card>
              <CardHeader>
                <CardTitle>Lifestyle</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {avatar.lifestyle.map((item) => (
                    <Badge key={item} variant="secondary">
                      {item}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Capabilities */}
            <Card>
              <CardHeader>
                <CardTitle>Capabilities</CardTitle>
                <CardDescription>
                  What this avatar can do for you
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    <span className="font-medium">Conversational AI</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <Mic className="h-5 w-5 text-primary" />
                    <span className="font-medium">Voice Synthesis</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <ImageIcon className="h-5 w-5 text-primary" />
                    <span className="font-medium">Image Generation</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <User className="h-5 w-5 text-primary" />
                    <span className="font-medium">Avatar Animation</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarDetail;
