
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Star, Users, Heart, Globe, MessageCircle } from 'lucide-react';
import { avatarProfiles } from '@/data/avatarData';

const AvatarDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const avatar = avatarProfiles.find(a => a.id === id);
  
  if (!avatar) {
    return (
      <div className="min-h-screen bg-background">
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
              <h1 className="text-2xl font-bold">Avatar Not Found</h1>
              <div className="w-32" />
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">
          <p>Avatar not found. Please go back to the marketplace.</p>
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
            <div className="w-32" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Avatar Image and Gallery */}
            <div className="space-y-6">
              <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                <img
                  src={avatar.image}
                  alt={avatar.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Gallery */}
              {avatar.galleryImages.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {avatar.galleryImages.map((img, index) => (
                    <div key={index} className="aspect-square rounded-md overflow-hidden bg-muted">
                      <img src={img} alt={`${avatar.name} ${index + 1}`} className="w-full h-full object-cover" />
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
                    <span>{avatar.totalSales} sales</span>
                  </div>
                  <Badge variant="secondary">{avatar.category}</Badge>
                </div>

                <div className="text-2xl font-bold text-primary mb-4">
                  ${avatar.price}
                </div>

                <div className="flex gap-3">
                  <Button className="flex-1">
                    <Heart className="mr-2 h-4 w-4" />
                    Add to Favorites
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Purchase Avatar
                  </Button>
                </div>
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
                    <p className="text-sm text-muted-foreground mb-2">MBTI Type</p>
                    <Badge variant="outline" className="text-lg px-3 py-1">{avatar.mbti}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Traits</p>
                    <div className="flex flex-wrap gap-2">
                      {avatar.personality.map((trait, index) => (
                        <Badge key={index} variant="secondary">{trait}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Languages */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Globe className="h-5 w-5" />
                    Languages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {avatar.languages.map((lang, index) => (
                      <Badge key={index} variant="outline">{lang}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Bottom Section - Extended Details */}
          <div className="mt-12 space-y-8">
            {/* Favorites */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Favorites & Interests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {avatar.favorites.map((favorite, index) => (
                    <Badge key={index} variant="secondary">{favorite}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Backstory */}
            <Card>
              <CardHeader>
                <CardTitle>Background Story</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed">{avatar.growUpStory}</p>
              </CardContent>
            </Card>

            {/* Voice & Communication */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Voice & Communication Style
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed">{avatar.voiceDescription}</p>
              </CardContent>
            </Card>

            {/* Lifestyle */}
            <Card>
              <CardHeader>
                <CardTitle>Lifestyle & Themes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {avatar.lifestyle.map((style, index) => (
                    <Badge key={index} variant="outline">{style}</Badge>
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
