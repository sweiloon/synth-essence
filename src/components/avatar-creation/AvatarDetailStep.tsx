
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Globe, X } from 'lucide-react';

interface AvatarDetailStepProps {
  data: any;
  onUpdate: (field: string, value: any) => void;
}

export const AvatarDetailStep: React.FC<AvatarDetailStepProps> = ({ data, onUpdate }) => {
  const languages = [
    'English', 'Chinese', 'Malay', 'Spanish', 'French', 'German', 'Italian', 
    'Portuguese', 'Russian', 'Japanese', 'Korean', 'Arabic', 'Hindi', 'Thai',
    'Vietnamese', 'Indonesian', 'Dutch', 'Swedish', 'Norwegian', 'Danish',
    'Finnish', 'Polish', 'Czech', 'Hungarian', 'Romanian', 'Bulgarian',
    'Greek', 'Turkish', 'Hebrew', 'Urdu', 'Bengali', 'Tamil', 'Telugu'
  ];

  const handleLanguageToggle = (language: string) => {
    const currentLanguages = data.languages || [];
    const updatedLanguages = currentLanguages.includes(language)
      ? currentLanguages.filter((lang: string) => lang !== language)
      : [...currentLanguages, language];
    onUpdate('languages', updatedLanguages);
  };

  return (
    <Card className="card-modern">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Avatar Detail
        </CardTitle>
        <CardDescription>
          Set up your avatar's basic information and preferred languages
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
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

        {/* Preferred Languages */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Preferred Languages * (Select multiple)
          </Label>
          
          {/* Selected Languages */}
          {data.languages && data.languages.length > 0 && (
            <div className="flex flex-wrap gap-2 p-3 bg-muted/20 rounded-lg">
              {data.languages.map((language: string) => (
                <Badge key={language} variant="secondary" className="flex items-center gap-1">
                  {language}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 hover:bg-transparent"
                    onClick={() => handleLanguageToggle(language)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}

          {/* Language Selection Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {languages.map((language) => {
              const isSelected = data.languages?.includes(language);
              return (
                <Button
                  key={language}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  className="justify-start"
                  onClick={() => handleLanguageToggle(language)}
                >
                  {language}
                </Button>
              );
            })}
          </div>

          <p className="text-xs text-muted-foreground">
            Selected {data.languages?.length || 0} language(s). Choose at least 1 language.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
