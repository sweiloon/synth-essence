
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Globe, X, Upload, Image as ImageIcon } from 'lucide-react';

interface AvatarDetailStepProps {
  data: any;
  onUpdate: (field: string, value: any) => void;
}

export const AvatarDetailStep: React.FC<AvatarDetailStepProps> = ({ data, onUpdate }) => {
  const countries = [
    'Malaysia', 'Singapore', 'United States', 'United Kingdom', 'Canada', 'Australia',
    'Germany', 'France', 'Japan', 'South Korea', 'China', 'India', 'Thailand',
    'Indonesia', 'Philippines', 'Vietnam', 'Taiwan', 'Hong Kong', 'Netherlands',
    'Sweden', 'Norway', 'Denmark', 'Finland', 'Switzerland', 'Austria', 'Belgium',
    'Italy', 'Spain', 'Portugal', 'Brazil', 'Mexico', 'Argentina', 'Chile',
    'Russia', 'Turkey', 'Saudi Arabia', 'United Arab Emirates', 'Egypt', 'South Africa',
    'New Zealand', 'Ireland', 'Israel', 'Poland', 'Czech Republic', 'Hungary'
  ];

  const languages = [
    'English', 'Chinese (Mandarin)', 'Malay', 'Spanish', 'French', 'German', 'Italian', 
    'Portuguese', 'Russian', 'Japanese', 'Korean', 'Arabic', 'Hindi', 'Thai',
    'Vietnamese', 'Indonesian', 'Dutch', 'Swedish', 'Norwegian', 'Danish',
    'Finnish', 'Polish', 'Czech', 'Hungarian', 'Romanian', 'Bulgarian',
    'Greek', 'Turkish', 'Hebrew', 'Urdu', 'Bengali', 'Tamil', 'Telugu',
    'Chinese (Cantonese)', 'Tagalog', 'Swahili', 'Punjabi', 'Marathi', 'Gujarati'
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => ({
        file,
        preview: URL.createObjectURL(file),
        name: file.name
      }));
      const updatedImages = [...(data.images || []), ...newImages];
      onUpdate('images', updatedImages);
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = (data.images || []).filter((_: any, i: number) => i !== index);
    onUpdate('images', updatedImages);
  };

  const handleSecondaryLanguageToggle = (language: string) => {
    const currentSecondaryLanguages = data.secondaryLanguages || [];
    const updatedSecondaryLanguages = currentSecondaryLanguages.includes(language)
      ? currentSecondaryLanguages.filter((lang: string) => lang !== language)
      : [...currentSecondaryLanguages, language];
    onUpdate('secondaryLanguages', updatedSecondaryLanguages);
  };

  return (
    <Card className="card-modern">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Avatar Detail
        </CardTitle>
        <CardDescription>
          Set up your avatar's basic information and upload images
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar Images Upload */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Avatar Images
          </Label>
          
          {/* Upload Button */}
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
            <input
              type="file"
              id="avatar-images"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <label htmlFor="avatar-images" className="cursor-pointer">
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">
                Click to upload avatar images
              </p>
              <Button type="button" variant="outline" size="sm">
                Choose Files
              </Button>
            </label>
          </div>

          {/* Image Previews */}
          {data.images && data.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {data.images.map((image: any, index: number) => (
                <div key={index} className="relative group">
                  <img
                    src={image.preview}
                    alt={`Avatar ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
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
          <Select value={data.originCountry || 'Malaysia'} onValueChange={(value) => onUpdate('originCountry', value)}>
            <SelectTrigger className="input-modern">
              <SelectValue placeholder="Select origin country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Primary Language */}
        <div className="space-y-2">
          <Label>Primary Language *</Label>
          <Select value={data.primaryLanguage || ''} onValueChange={(value) => onUpdate('primaryLanguage', value)}>
            <SelectTrigger className="input-modern">
              <SelectValue placeholder="Select primary language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((language) => (
                <SelectItem key={language} value={language}>
                  {language}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Secondary Languages */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Secondary Languages (Optional - Select multiple)
          </Label>
          
          {/* Selected Secondary Languages */}
          {data.secondaryLanguages && data.secondaryLanguages.length > 0 && (
            <div className="flex flex-wrap gap-2 p-3 bg-muted/20 rounded-lg">
              {data.secondaryLanguages.map((language: string) => (
                <Badge key={language} variant="secondary" className="flex items-center gap-1">
                  {language}
                  <Button
                    type="button"
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
              .filter(lang => lang !== data.primaryLanguage)
              .map((language) => {
                const isSelected = data.secondaryLanguages?.includes(language);
                return (
                  <Button
                    key={language}
                    type="button"
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    className="justify-start text-xs"
                    onClick={() => handleSecondaryLanguageToggle(language)}
                  >
                    {language}
                  </Button>
                );
              })}
          </div>

          <p className="text-xs text-muted-foreground">
            Selected {data.secondaryLanguages?.length || 0} secondary language(s).
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
