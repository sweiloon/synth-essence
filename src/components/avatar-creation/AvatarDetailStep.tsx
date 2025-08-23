
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Globe, X, Upload, ImageIcon } from 'lucide-react';
import { ImageUpload } from '@/components/ui/image-upload';

interface AvatarDetailStepProps {
  data: any;
  onUpdate: (field: string, value: any) => void;
}

export const AvatarDetailStep: React.FC<AvatarDetailStepProps> = ({ data, onUpdate }) => {
  const countries = [
    'Malaysia', 'United States', 'United Kingdom', 'Canada', 'Australia', 'Singapore', 
    'China', 'Japan', 'South Korea', 'India', 'Indonesia', 'Thailand', 'Philippines',
    'Vietnam', 'Germany', 'France', 'Italy', 'Spain', 'Netherlands', 'Sweden',
    'Norway', 'Denmark', 'Finland', 'Brazil', 'Mexico', 'Argentina', 'Chile',
    'South Africa', 'Egypt', 'Nigeria', 'Kenya', 'Russia', 'Ukraine', 'Poland',
    'Czech Republic', 'Hungary', 'Romania', 'Greece', 'Turkey', 'Israel',
    'Saudi Arabia', 'UAE', 'Qatar', 'Kuwait', 'New Zealand', 'Ireland', 'Portugal'
  ];

  const languages = [
    'English', 'Chinese', 'Malay', 'Spanish', 'French', 'German', 'Italian', 
    'Portuguese', 'Russian', 'Japanese', 'Korean', 'Arabic', 'Hindi', 'Thai',
    'Vietnamese', 'Indonesian', 'Dutch', 'Swedish', 'Norwegian', 'Danish',
    'Finnish', 'Polish', 'Czech', 'Hungarian', 'Romanian', 'Bulgarian',
    'Greek', 'Turkish', 'Hebrew', 'Urdu', 'Bengali', 'Tamil', 'Telugu',
    'Cantonese', 'Mandarin', 'Tagalog', 'Swahili', 'Afrikaans', 'Zulu'
  ];

  const handleSecondaryLanguageToggle = (language: string) => {
    const currentLanguages = data.secondaryLanguages || [];
    const updatedLanguages = currentLanguages.includes(language)
      ? currentLanguages.filter((lang: string) => lang !== language)
      : [...currentLanguages, language];
    onUpdate('secondaryLanguages', updatedLanguages);
  };

  const handleImagesChange = (images: File[]) => {
    onUpdate('avatarImages', images);
  };

  return (
    <Card className="card-modern">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Avatar Detail
        </CardTitle>
        <CardDescription>
          Set up your avatar's basic information, images, and language preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar Images Upload */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Avatar Images *
          </Label>
          <ImageUpload
            onImagesChange={handleImagesChange}
            maxImages={10}
            label="Upload Avatar Images (up to 10)"
          />
          <p className="text-xs text-muted-foreground">
            Upload multiple images of your avatar for a rich visual profile
          </p>
        </div>

        {/* Avatar Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Avatar Name *</Label>
          <Input
            id="name"
            placeholder="Enter your avatar's name"
            value={data.name || ''}
            onChange={(e) => onUpdate('name', e.target.value)}
            className="input-modern"
          />
        </div>

        {/* Age */}
        <div className="space-y-2">
          <Label htmlFor="age">Age *</Label>
          <Input
            id="age"
            type="number"
            placeholder="Enter age"
            value={data.age || ''}
            onChange={(e) => onUpdate('age', e.target.value)}
            className="input-modern"
            min="1"
            max="120"
          />
        </div>

        {/* Gender */}
        <div className="space-y-2">
          <Label>Gender *</Label>
          <Select value={data.gender || ''} onValueChange={(value) => onUpdate('gender', value)}>
            <SelectTrigger className="input-modern">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Origin Country */}
        <div className="space-y-2">
          <Label>Origin Country *</Label>
          <Select 
            value={data.originCountry || 'Malaysia'} 
            onValueChange={(value) => onUpdate('originCountry', value)}
          >
            <SelectTrigger className="input-modern">
              <SelectValue placeholder="Select origin country" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {countries.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            This affects the avatar's cultural background and communication style
          </p>
        </div>

        {/* Primary Language */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Primary Language * (Select one)
          </Label>
          <Select 
            value={data.primaryLanguage || ''} 
            onValueChange={(value) => onUpdate('primaryLanguage', value)}
          >
            <SelectTrigger className="input-modern">
              <SelectValue placeholder="Select primary language" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {languages.map((language) => (
                <SelectItem key={language} value={language}>
                  {language}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            The main language your avatar will communicate in
          </p>
        </div>

        {/* Secondary Languages */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Secondary Languages (Select multiple)
          </Label>
          
          {/* Selected Secondary Languages */}
          {data.secondaryLanguages && data.secondaryLanguages.length > 0 && (
            <div className="flex flex-wrap gap-2 p-3 bg-muted/20 rounded-lg">
              {data.secondaryLanguages.map((language: string) => (
                <Badge key={language} variant="secondary" className="flex items-center gap-1">
                  {language}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 hover:bg-transparent"
                    onClick={() => handleSecondaryLanguageToggle(language)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}

          {/* Language Selection Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {languages
              .filter(lang => lang !== data.primaryLanguage) // Exclude primary language
              .map((language) => {
                const isSelected = data.secondaryLanguages?.includes(language);
                return (
                  <Button
                    key={language}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    className="justify-start"
                    onClick={() => handleSecondaryLanguageToggle(language)}
                  >
                    {language}
                  </Button>
                );
              })}
          </div>

          <p className="text-xs text-muted-foreground">
            Selected {data.secondaryLanguages?.length || 0} secondary language(s). Additional languages your avatar can understand and communicate in.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
