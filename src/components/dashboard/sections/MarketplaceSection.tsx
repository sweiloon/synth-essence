
import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Store, 
  Search, 
  Filter,
  Star,
  Users,
  Heart,
  ShoppingCart
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { avatarProfiles } from '@/data/avatarData';
import { useToast } from '@/hooks/use-toast';

const MarketplaceSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [selectedPersonality, setSelectedPersonality] = useState('all');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cart, setCart] = useState<string[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Load favorites and cart from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('avatarFavorites');
    const savedCart = localStorage.getItem('avatarCart');
    
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Error loading favorites from localStorage:', error);
      }
    }
    
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('avatarFavorites', JSON.stringify(favorites));
  }, [favorites]);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('avatarCart', JSON.stringify(cart));
  }, [cart]);

  const categories = ['all', ...new Set(avatarProfiles.map(avatar => avatar.category.toLowerCase()))];
  const personalities = ['all', ...new Set(avatarProfiles.flatMap(avatar => avatar.personality))];

  const filteredAvatars = useMemo(() => {
    return avatarProfiles.filter(avatar => {
      const matchesSearch = avatar.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          avatar.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || 
                            avatar.category.toLowerCase() === selectedCategory;
      
      const matchesPrice = priceRange === 'all' || 
                         (priceRange === 'under-100' && avatar.price < 100) ||
                         (priceRange === '100-150' && avatar.price >= 100 && avatar.price <= 150) ||
                         (priceRange === 'over-150' && avatar.price > 150);
      
      const matchesPersonality = selectedPersonality === 'all' ||
                               avatar.personality.includes(selectedPersonality);
      
      return matchesSearch && matchesCategory && matchesPrice && matchesPersonality;
    });
  }, [searchTerm, selectedCategory, priceRange, selectedPersonality]);

  const handleAvatarClick = (avatarId: string) => {
    navigate(`/avatar/${avatarId}`);
  };

  const toggleFavorite = (avatarId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => {
      const newFavorites = prev.includes(avatarId) 
        ? prev.filter(id => id !== avatarId)
        : [...prev, avatarId];
      
      toast({
        title: prev.includes(avatarId) ? "Removed from Favorites" : "Added to Favorites",
        description: prev.includes(avatarId) 
          ? "Avatar removed from your favorites" 
          : "Avatar added to your favorites",
      });
      
      return newFavorites;
    });
  };

  const addToCart = (avatarId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!cart.includes(avatarId)) {
      setCart(prev => [...prev, avatarId]);
      toast({
        title: "Added to Cart",
        description: "Avatar added to your cart successfully",
      });
    } else {
      toast({
        title: "Already in Cart",
        description: "This avatar is already in your cart",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <Store className="h-6 w-6" />
              Avatar Marketplace
            </h1>
            <p className="text-muted-foreground">
              Discover and purchase AI avatars from our community
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Heart className="mr-2 h-4 w-4" />
              Favorites ({favorites.length})
            </Button>
            <Button variant="outline" size="sm">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Cart ({cart.length})
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search avatars..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="under-100">Under $100</SelectItem>
                <SelectItem value="100-150">$100 - $150</SelectItem>
                <SelectItem value="over-150">Over $150</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedPersonality} onValueChange={setSelectedPersonality}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Personality" />
              </SelectTrigger>
              <SelectContent>
                {personalities.map((personality) => (
                  <SelectItem key={personality} value={personality}>
                    {personality === 'all' ? 'All Personalities' : personality}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" className="ml-2">
              <Filter className="mr-2 h-4 w-4" />
              Reset Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredAvatars.length} of {avatarProfiles.length} avatars
        </p>
      </div>

      {/* Avatar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAvatars.map((avatar) => (
          <Card 
            key={avatar.id} 
            className="card-modern cursor-pointer hover:shadow-lg transition-all duration-200 group"
            onClick={() => handleAvatarClick(avatar.id)}
          >
            <CardHeader className="pb-3">
              <div className="relative">
                <img
                  src={avatar.image}
                  alt={avatar.name}
                  className="w-full h-48 object-cover rounded-lg mb-3"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => toggleFavorite(avatar.id, e)}
                  >
                    <Heart className={`h-4 w-4 ${favorites.includes(avatar.id) ? 'fill-current text-red-500' : ''}`} />
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => addToCart(avatar.id, e)}
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <CardTitle className="text-lg font-semibold">{avatar.name}</CardTitle>
                <div className="flex items-center justify-between">
                  <p className="text-xl font-bold text-black">${avatar.price}</p>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{avatar.rating}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {avatar.description}
                </p>
                
                <div className="flex flex-wrap gap-1">
                  {avatar.personality.slice(0, 3).map((trait, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {trait}
                    </Badge>
                  ))}
                  {avatar.personality.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{avatar.personality.length - 3}
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>{avatar.totalSales} sales</span>
                  </div>
                  <span className="text-xs">by {avatar.creator}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAvatars.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No avatars found matching your criteria.</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setPriceRange('all');
              setSelectedPersonality('all');
            }}
          >
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default MarketplaceSection;
