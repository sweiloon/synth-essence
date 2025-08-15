
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingBag, 
  Play, 
  Star, 
  DollarSign,
  Eye
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { avatarProfiles } from '@/data/avatarData';
import { useNavigate } from 'react-router-dom';

const MarketplaceSection = () => {
  const [filter, setFilter] = useState('all');
  const { toast } = useToast();
  const navigate = useNavigate();

  const handlePlayVoice = (avatarName: string) => {
    toast({
      title: "Playing Voice Preview",
      description: `Playing voice sample for ${avatarName}`,
    });
  };

  const handleViewAvatar = (avatarId: string) => {
    navigate(`/avatar/${avatarId}`);
  };

  const categories = ['all', 'Business', 'Kids', 'Lifestyle', 'Entertainment', 'Luxury', 'Wellness', 'Alternative', 'Casual', 'Cultural'];

  const filteredAvatars = filter === 'all' 
    ? avatarProfiles 
    : avatarProfiles.filter(avatar => avatar.category === filter);

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Avatar Marketplace
          </h1>
          <p className="text-xs text-muted-foreground">
            Discover and purchase AI avatars created by the community
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-1 flex-wrap">
        {categories.map((category) => (
          <Button
            key={category}
            variant={filter === category ? "default" : "outline"}
            size="sm"
            className="text-xs px-2 py-1 h-7"
            onClick={() => setFilter(category)}
          >
            {category === 'all' ? 'All Categories' : category}
          </Button>
        ))}
      </div>

      {/* Avatar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {filteredAvatars.map((avatar) => (
          <Card key={avatar.id} className="card-modern overflow-hidden">
            {/* Large Avatar Image */}
            <div className="relative aspect-[3/4] overflow-hidden">
              <img
                src={avatar.image}
                alt={avatar.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2 right-2">
                <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                  {avatar.category}
                </Badge>
              </div>
              <div className="absolute bottom-2 left-2 right-2 bg-black/50 backdrop-blur-sm rounded-md p-2">
                <h3 className="text-white font-semibold text-sm">{avatar.name}</h3>
                <div className="flex items-center gap-1 text-xs text-white/80">
                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                  <span>{avatar.rating}</span>
                  <span>•</span>
                  <span>{avatar.totalSales} sales</span>
                </div>
              </div>
            </div>
            
            <CardContent className="p-3 space-y-2">
              <p className="text-xs text-muted-foreground line-clamp-2">
                {avatar.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3 text-green-600" />
                  <span className="font-bold text-green-600 text-sm">${avatar.price}</span>
                </div>
                
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs px-2 py-1 h-6"
                    onClick={() => handlePlayVoice(avatar.name)}
                  >
                    <Play className="h-2.5 w-2.5" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-xs px-2 py-1 h-6"
                    onClick={() => handleViewAvatar(avatar.id)}
                  >
                    <Eye className="h-2.5 w-2.5" />
                  </Button>
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
