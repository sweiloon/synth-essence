
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Star, ShoppingCart, User, Globe, Heart, Brain, Mic } from 'lucide-react';
import { avatarProfiles } from '@/data/avatarData';

const AvatarDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const avatar = avatarProfiles.find(profile => profile.id === id);

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
          <p>Avatar not found.</p>
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
            {/* Left Column - Avatar Image and Basic Info */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="aspect-square w-full mb-4">
                    <img
                      src={avatar.image}
                      alt={avatar.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="text-center space-y-2">
                    <h2 className="text-3xl font-bold">{avatar.name}</h2>
                    <p className="text-muted-foreground">{avatar.description}</p>
                    <div className="flex items-center justify-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{avatar.rating}</span>
                      </div>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground">{avatar.totalSales} sales</span>
                    </div>
                    <div className="text-2xl font-bold text-primary">${avatar.price}</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Purchase
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full" size="lg">
                    Buy Now - ${avatar.price}
                  </Button>
                  <p className="text-sm text-muted-foreground text-center">
                    Created by {avatar.creator}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Detailed Information */}
            <div className="space-y-6">
              {/* Personality & MBTI */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Personality
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">MBTI Type</h4>
                    <Badge variant="secondary" className="text-lg px-3 py-1">
                      {avatar.mbti}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Personality Traits</h4>
                    <div className="flex flex-wrap gap-2">
                      {avatar.personality.map((trait, index) => (
                        <Badge key={index} variant="outline">
                          {trait}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Favorites & Interests */}
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
                      <Badge key={index} variant="secondary">
                        {favorite}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Languages & Voice */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Languages & Voice
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Supported Languages</h4>
                    <div className="flex flex-wrap gap-2">
                      {avatar.languages.map((language, index) => (
                        <Badge key={index} variant="outline">
                          {language}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Voice Description</h4>
                    <p className="text-muted-foreground">{avatar.voiceDescription}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Background Story */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Background Story
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {avatar.growUpStory}
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
                    {avatar.lifestyle.map((item, index) => (
                      <Badge key={index} variant="secondary">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarDetail;
