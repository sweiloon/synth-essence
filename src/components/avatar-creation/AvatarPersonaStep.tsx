import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Brain, X } from 'lucide-react';

interface AvatarPersonaStepProps {
  data: any;
  onUpdate: (field: string, value: any) => void;
}

const tags = {
  "Hobbies": [
    "Reading", "Writing", "Painting", "Drawing", "Sculpting", "Gardening", "Cooking", "Baking",
    "Hiking", "Camping", "Fishing", "Hunting", "Swimming", "Yoga", "Meditation", "Traveling",
    "Photography", "Gaming", "Coding", "Singing", "Dancing", "Playing musical instruments",
    "Watching movies", "Listening to music", "Collecting", "Volunteering"
  ],
  "Interests": [
    "Science", "Technology", "Engineering", "Mathematics", "Arts", "History", "Politics",
    "Economics", "Philosophy", "Psychology", "Sociology", "Environmentalism", "Animal welfare",
    "Human rights", "Social justice", "Education", "Health", "Fitness", "Nutrition",
    "Fashion", "Beauty", "Sports", "Music", "Literature", "Film", "Theater"
  ],
  "Values": [
    "Honesty", "Integrity", "Kindness", "Compassion", "Empathy", "Respect", "Responsibility",
    "Accountability", "Courage", "Perseverance", "Resilience", "Optimism", "Gratitude",
    "Generosity", "Fairness", "Justice", "Equality", "Freedom", "Peace", "Love"
  ],
  "Aesthetics": [
    "Minimalism", "Maximalism", "Vintage", "Modern", "Rustic", "Bohemian", "Industrial",
    "Art Deco", "Mid-Century Modern", "Scandinavian", "Coastal", "Tropical", "Gothic",
    "Steampunk", "Cyberpunk", "Fantasy", "Sci-Fi", "Surrealism", "Abstract", "Realism",
    "Impressionism", "Expressionism", "Pop Art", "Street Art", "Anime", "Manga"
  ]
};

const mbtiTypes = [
  "ISTJ", "ISFJ", "INFJ", "INTJ", "ISTP", "ISFP", "INFP", "INTP",
  "ESTP", "ESFP", "ENFP", "ENTP", "ESTJ", "ESFJ", "ENFJ", "ENTJ"
];

export const AvatarPersonaStep: React.FC<AvatarPersonaStepProps> = ({ data, onUpdate }) => {

  const handleFavoriteToggle = (tag: string) => {
    const currentFavorites = data.favorites || [];
    let updatedFavorites;
    
    if (currentFavorites.includes(tag)) {
      updatedFavorites = currentFavorites.filter((fav: string) => fav !== tag);
    } else {
      if (currentFavorites.length >= 25) {
        return; // Don't add if already at max
      }
      updatedFavorites = [...currentFavorites, tag];
    }
    
    onUpdate('favorites', updatedFavorites);
  };

  return (
    <div className="space-y-6">
      {/* Pick Favorites */}
      <Card className="card-modern">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Pick Favorites
          </CardTitle>
          <CardDescription>
            Select 5-25 things your avatar loves and enjoys (helps define personality)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Selected Favorites Count */}
          <div className="bg-muted/20 rounded-lg p-3">
            <p className="text-sm font-medium">
              Selected: {data.favorites?.length || 0}/25 favorites 
              {(data.favorites?.length || 0) < 5 && (
                <span className="text-destructive ml-2">(Minimum 5 required)</span>
              )}
            </p>
          </div>

          {/* Selected Favorites Display */}
          {data.favorites && data.favorites.length > 0 && (
            <div className="flex flex-wrap gap-2 p-3 bg-muted/20 rounded-lg">
              {data.favorites.map((favorite: string) => (
                <Badge key={favorite} variant="default" className="flex items-center gap-1">
                  {favorite}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 hover:bg-transparent"
                    onClick={() => handleFavoriteToggle(favorite)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}

          {/* Category-wise Tag Selection */}
          {Object.entries(tags).map(([category, categoryTags]) => (
            <div key={category} className="space-y-3">
              <h4 className="font-medium text-sm uppercase tracking-wide text-muted-foreground">
                {category}
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {categoryTags.map((tag) => {
                  const isSelected = data.favorites?.includes(tag);
                  const isDisabled = !isSelected && (data.favorites?.length || 0) >= 25;
                  
                  return (
                    <Button
                      key={tag}
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      className="justify-start text-xs h-8"
                      onClick={() => handleFavoriteToggle(tag)}
                      disabled={isDisabled}
                    >
                      {tag}
                    </Button>
                  );
                })}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* MBTI Type */}
      <Card className="card-modern">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            MBTI Type
          </CardTitle>
          <CardDescription>
            Choose your avatar's Myers-Briggs personality type
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-4 gap-2">
            {mbtiTypes.map((type) => {
              const isSelected = data.mbti === type;
              return (
                <Button
                  key={type}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  className="justify-center"
                  onClick={() => onUpdate('mbti', type)}
                >
                  {type}
                </Button>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground">
            The Myers-Briggs Type Indicator (MBTI) is a popular personality assessment tool.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
