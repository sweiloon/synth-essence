
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { X, Search } from 'lucide-react';

const favoritesTags = {
  sports: ['Football', 'Basketball', 'Tennis', 'Swimming', 'Running', 'Yoga', 'Gym', 'Cycling', 'Hiking', 'Golf', 'Boxing', 'Martial Arts', 'Rock Climbing', 'Skiing', 'Surfing'],
  movies: ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance', 'Thriller', 'Documentary', 'Animation', 'Fantasy', 'Mystery', 'Adventure', 'Biography', 'Musical', 'War'],
  interests: ['Reading', 'Cooking', 'Traveling', 'Photography', 'Music', 'Art', 'Gaming', 'Gardening', 'Writing', 'Dancing', 'Singing', 'Painting', 'Crafting', 'Collecting', 'Fashion'],
  personality: ['Outgoing', 'Introverted', 'Creative', 'Analytical', 'Empathetic', 'Adventurous', 'Calm', 'Energetic', 'Optimistic', 'Realistic', 'Humorous', 'Serious', 'Spontaneous', 'Organized', 'Independent']
};

const mbtiTypes = [
  { type: 'INTJ', name: 'The Architect', description: 'Imaginative and strategic thinkers, with a plan for everything.' },
  { type: 'INTP', name: 'The Thinker', description: 'Innovative inventors with an unquenchable thirst for knowledge.' },
  { type: 'ENTJ', name: 'The Commander', description: 'Bold, imaginative and strong-willed leaders.' },
  { type: 'ENTP', name: 'The Debater', description: 'Smart and curious thinkers who cannot resist an intellectual challenge.' },
  { type: 'INFJ', name: 'The Advocate', description: 'Creative and insightful, inspired and independent.' },
  { type: 'INFP', name: 'The Mediator', description: 'Poetic, kind and altruistic people, always eager to help.' },
  { type: 'ENFJ', name: 'The Protagonist', description: 'Charismatic and inspiring leaders, able to mesmerize listeners.' },
  { type: 'ENFP', name: 'The Campaigner', description: 'Enthusiastic, creative and sociable free spirits.' },
  { type: 'ISTJ', name: 'The Logistician', description: 'Practical and fact-minded, reliable and responsible.' },
  { type: 'ISFJ', name: 'The Protector', description: 'Warm-hearted and dedicated, always ready to protect loved ones.' },
  { type: 'ESTJ', name: 'The Executive', description: 'Excellent administrators, unsurpassed at managing things or people.' },
  { type: 'ESFJ', name: 'The Consul', description: 'Extraordinarily caring, social and popular people.' },
  { type: 'ISTP', name: 'The Virtuoso', description: 'Bold and practical experimenters, masters of all kinds of tools.' },
  { type: 'ISFP', name: 'The Adventurer', description: 'Flexible and charming artists, always ready to explore new possibilities.' },
  { type: 'ESTP', name: 'The Entrepreneur', description: 'Smart, energetic and perceptive people, truly enjoy living on the edge.' },
  { type: 'ESFP', name: 'The Entertainer', description: 'Spontaneous, energetic and enthusiastic people - life is never boring.' }
];

interface AvatarPersonaStepProps {
  data: any;
  onUpdate: (data: any) => void;
}

const AvatarPersonaStep = ({ data, onUpdate }: AvatarPersonaStepProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const allTags = Object.values(favoritesTags).flat();
  const filteredTags = selectedCategory === 'all' 
    ? allTags.filter(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    : favoritesTags[selectedCategory as keyof typeof favoritesTags].filter(tag => 
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

  const handleTagSelect = (tag: string) => {
    if (!data.favorites.includes(tag) && data.favorites.length < 15) {
      onUpdate({ favorites: [...data.favorites, tag] });
    }
  };

  const removeTag = (tag: string) => {
    onUpdate({ favorites: data.favorites.filter((t: string) => t !== tag) });
  };

  const handleMBTISelect = (mbti: string) => {
    onUpdate({ mbti });
  };

  return (
    <div className="space-y-8">
      {/* Favorites Section */}
      <div className="space-y-4">
        <div>
          <Label className="text-lg font-semibold">Pick Favorites</Label>
          <p className="text-sm text-muted-foreground">
            Select 5-15 tags that represent your avatar's interests ({data.favorites.length}/15)
          </p>
        </div>

        {/* Search and Category Filter */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'sports', 'movies', 'interests', 'personality'].map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Selected Tags */}
        {data.favorites.length > 0 && (
          <div className="space-y-2">
            <Label>Selected Tags ({data.favorites.length})</Label>
            <div className="flex flex-wrap gap-2">
              {data.favorites.map((tag: string) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => removeTag(tag)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Available Tags */}
        <div className="space-y-2">
          <Label>Available Tags</Label>
          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-4 border rounded">
            {filteredTags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className={`cursor-pointer hover:bg-muted ${
                  data.favorites.includes(tag) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={() => handleTagSelect(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* MBTI Section */}
      <div className="space-y-4">
        <div>
          <Label className="text-lg font-semibold">Pick MBTI Type</Label>
          <p className="text-sm text-muted-foreground">
            Choose a personality type that best represents your avatar
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mbtiTypes.map((mbti) => (
            <Card
              key={mbti.type}
              className={`cursor-pointer transition-all hover:shadow-md ${
                data.mbti === mbti.type ? 'ring-2 ring-primary bg-primary/5' : ''
              }`}
              onClick={() => handleMBTISelect(mbti.type)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{mbti.type}</CardTitle>
                <CardDescription className="font-medium">{mbti.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{mbti.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AvatarPersonaStep;
