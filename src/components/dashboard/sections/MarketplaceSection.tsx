
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  ShoppingBag, 
  Play, 
  Star, 
  DollarSign,
  MessageSquare,
  Mic,
  Image as ImageIcon,
  User,
  Heart
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AvatarListing {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  totalSales: number;
  creator: string;
  avatar: string;
  language: string[];
  voicePreview: string;
  lifestyle: string[];
  images: string[];
  categories: string[];
}

const MarketplaceSection = () => {
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarListing | null>(null);
  const [filter, setFilter] = useState('all');
  const { toast } = useToast();

  const avatarListings: AvatarListing[] = [
    {
      id: '1',
      name: 'Aria Professional',
      description: 'Professional business avatar with corporate communication style',
      price: 49.99,
      rating: 4.8,
      totalSales: 234,
      creator: 'TechCorp Studios',
      avatar: '/lovable-uploads/1fab5331-8802-41ed-b1c5-5d8aab9b3268.png',
      language: ['English', 'Spanish', 'French'],
      voicePreview: 'Professional, clear, confident tone',
      lifestyle: ['Business', 'Corporate', 'Professional'],
      images: ['/lovable-uploads/1fab5331-8802-41ed-b1c5-5d8aab9b3268.png'],
      categories: ['Business', 'Professional']
    },
    {
      id: '2',
      name: 'Luna Creative',
      description: 'Artistic and creative avatar perfect for content creation',
      price: 39.99,
      rating: 4.9,
      totalSales: 187,
      creator: 'Creative Minds',
      avatar: '/lovable-uploads/1fab5331-8802-41ed-b1c5-5d8aab9b3268.png',
      language: ['English', 'Japanese'],
      voicePreview: 'Warm, creative, inspiring tone',
      lifestyle: ['Creative', 'Artistic', 'Inspiring'],
      images: ['/lovable-uploads/1fab5331-8802-41ed-b1c5-5d8aab9b3268.png'],
      categories: ['Creative', 'Content']
    },
    {
      id: '3',
      name: 'Max Fitness',
      description: 'Energetic fitness coach avatar for health and wellness',
      price: 34.99,
      rating: 4.7,
      totalSales: 156,
      creator: 'FitLife Studio',
      avatar: '/lovable-uploads/1fab5331-8802-41ed-b1c5-5d8aab9b3268.png',
      language: ['English'],
      voicePreview: 'Energetic, motivational, upbeat tone',
      lifestyle: ['Fitness', 'Health', 'Motivation'],
      images: ['/lovable-uploads/1fab5331-8802-41ed-b1c5-5d8aab9b3268.png'],
      categories: ['Fitness', 'Health']
    }
  ];

  const handlePurchase = (avatar: AvatarListing) => {
    toast({
      title: "Purchase Successful!",
      description: `You've successfully purchased ${avatar.name} for $${avatar.price}. Check your avatar library.`,
    });
  };

  const handlePlayVoice = (avatarName: string) => {
    toast({
      title: "Playing Voice Preview",
      description: `Playing voice sample for ${avatarName}`,
    });
  };

  const categories = ['all', 'Business', 'Creative', 'Fitness', 'Entertainment'];

  const filteredAvatars = filter === 'all' 
    ? avatarListings 
    : avatarListings.filter(avatar => avatar.categories.includes(filter));

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ShoppingBag className="h-6 w-6" />
            Avatar Marketplace
          </h1>
          <p className="text-sm text-muted-foreground">
            Discover and purchase AI avatars created by the community
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((category) => (
          <Button
            key={category}
            variant={filter === category ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(category)}
          >
            {category === 'all' ? 'All Categories' : category}
          </Button>
        ))}
      </div>

      {/* Avatar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAvatars.map((avatar) => (
          <Card key={avatar.id} className="card-modern">
            <CardHeader className="p-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={avatar.avatar} alt={avatar.name} />
                  <AvatarFallback>{avatar.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-base">{avatar.name}</CardTitle>
                  <p className="text-xs text-muted-foreground">by {avatar.creator}</p>
                </div>
                <Button variant="ghost" size="sm">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="p-4 pt-0 space-y-3">
              <CardDescription className="text-sm">{avatar.description}</CardDescription>
              
              <div className="flex items-center gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-yellow-500 fill-current" />
                  <span>{avatar.rating}</span>
                </div>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">{avatar.totalSales} sales</span>
              </div>

              <div className="flex flex-wrap gap-1">
                {avatar.categories.map((cat) => (
                  <Badge key={cat} variant="outline" className="text-xs px-2 py-0">
                    {cat}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="font-bold text-green-600">${avatar.price}</span>
                </div>
                
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePlayVoice(avatar.name)}
                  >
                    <Play className="h-3 w-3" />
                  </Button>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSelectedAvatar(avatar)}>
                        View
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={avatar.avatar} alt={avatar.name} />
                            <AvatarFallback>{avatar.name[0]}</AvatarFallback>
                          </Avatar>
                          {avatar.name}
                        </DialogTitle>
                        <DialogDescription>by {avatar.creator}</DialogDescription>
                      </DialogHeader>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div>
                            <h4 className="text-sm font-medium flex items-center gap-1">
                              <MessageSquare className="h-3 w-3" />
                              Languages
                            </h4>
                            <p className="text-sm text-muted-foreground">{avatar.language.join(', ')}</p>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium flex items-center gap-1">
                              <Mic className="h-3 w-3" />
                              Voice Style
                            </h4>
                            <p className="text-sm text-muted-foreground">{avatar.voicePreview}</p>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium flex items-center gap-1">
                              <User className="h-3 w-3" />
                              Lifestyle
                            </h4>
                            <p className="text-sm text-muted-foreground">{avatar.lifestyle.join(', ')}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <h4 className="text-sm font-medium flex items-center gap-1">
                              <ImageIcon className="h-3 w-3" />
                              Sample Images
                            </h4>
                            <div className="grid grid-cols-2 gap-2">
                              {avatar.images.map((img, idx) => (
                                <img
                                  key={idx}
                                  src={img}
                                  alt={`${avatar.name} sample ${idx + 1}`}
                                  className="w-full h-16 object-cover rounded border"
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-5 w-5 text-green-600" />
                          <span className="text-xl font-bold text-green-600">${avatar.price}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            onClick={() => handlePlayVoice(avatar.name)}
                          >
                            <Play className="h-4 w-4 mr-1" />
                            Test Voice
                          </Button>
                          <Button onClick={() => handlePurchase(avatar)}>
                            Purchase Avatar
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MarketplaceSection;
