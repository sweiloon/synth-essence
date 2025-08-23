
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Star, ShoppingCart, Users, Globe, Heart, Mic } from 'lucide-react';
import { avatarProfiles } from '@/data/avatarData';

const AvatarDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const avatar = avatarProfiles.find(profile => profile.id === id);
  
  if (!avatar) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Avatar not found</h1>
          <Button onClick={() => navigate('/dashboard', { state: { activeSection: 'marketplace' } })}>
            Back to Marketplace
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard', { state: { activeSection: 'marketplace' } })}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Marketplace
            </Button>
            <h1 className="text-2xl font-bold">Avatar Detail</h1>
            <div className="w-32" /> {/* Spacer */}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Avatar Image and Gallery */}
            <div className="space-y-6">
              <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                <img
                  src={avatar.image}
                  alt={avatar.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Gallery Images */}
              {avatar.galleryImages && avatar.galleryImages.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {avatar.galleryImages.map((img, index) => (
                    <div key={index} className="aspect-square bg-muted rounded overflow-hidden">
                      <img src={img} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column - Avatar Details */}
            <div className="space-y-6">
              {/* Basic Info */}
              <div>
                <h1 className="text-3xl font-bold mb-2">{avatar.name}</h1>
                <p className="text-muted-foreground mb-4">{avatar.description}</p>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{avatar.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">{avatar.totalSales} sales</span>
                  </div>
                  <Badge variant="secondary">{avatar.category}</Badge>
                </div>

                <div className="text-2xl font-bold text-primary mb-4">
                  ${avatar.price}
                </div>

                <Button className="w-full mb-4 btn-hero">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Purchase Avatar
                </Button>
              </div>

              {/* Creator Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Creator</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium">{avatar.creator}</p>
                </CardContent>
              </Card>

              {/* Personality & MBTI */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Personality</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-medium mb-2">MBTI Type</p>
                    <Badge variant="default">{avatar.mbti}</Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Traits</p>
                    <div className="flex flex-wrap gap-2">
                      {avatar.personality.map((trait, index) => (
                        <Badge key={index} variant="outline">{trait}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Languages */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Languages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {avatar.languages.map((lang, index) => (
                      <Badge key={index} variant="secondary">{lang}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Voice Description */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mic className="h-4 w-4" />
                    Voice
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{avatar.voiceDescription}</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Full-width sections */}
          <div className="mt-8 space-y-6">
            {/* Favorites */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Favorites
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {avatar.favorites.map((fav, index) => (
                    <Badge key={index} variant="outline">{fav}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Backstory */}
            <Card>
              <CardHeader>
                <CardTitle>Backstory</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{avatar.growUpStory}</p>
              </CardContent>
            </Card>

            {/* Lifestyle */}
            <Card>
              <CardHeader>
                <CardTitle>Lifestyle</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {avatar.lifestyle.map((style, index) => (
                    <Badge key={index} variant="secondary">{style}</Badge>
                  ))}
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
