
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const languages = [
  'English', 'Chinese', 'Malay',
  'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian',
  'Japanese', 'Korean', 'Arabic', 'Hindi', 'Thai', 'Vietnamese',
  'Dutch', 'Swedish', 'Norwegian', 'Danish', 'Finnish',
  'Polish', 'Czech', 'Hungarian', 'Romanian', 'Bulgarian',
  'Greek', 'Turkish', 'Hebrew', 'Indonesian', 'Filipino'
];

interface AvatarDetailStepProps {
  data: any;
  onUpdate: (data: any) => void;
}

const AvatarDetailStep = ({ data, onUpdate }: AvatarDetailStepProps) => {
  const handleLanguageSelect = (language: string) => {
    if (!data.languages.includes(language)) {
      onUpdate({ languages: [...data.languages, language] });
    }
  };

  const removeLanguage = (language: string) => {
    onUpdate({ languages: data.languages.filter((l: string) => l !== language) });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Avatar Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Avatar Name *</Label>
          <Input
            id="name"
            placeholder="Enter avatar name"
            value={data.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
          />
        </div>

        {/* Age */}
        <div className="space-y-2">
          <Label htmlFor="age">Age *</Label>
          <Input
            id="age"
            type="number"
            placeholder="Enter age"
            value={data.age}
            onChange={(e) => onUpdate({ age: e.target.value })}
          />
        </div>

        {/* Gender */}
        <div className="space-y-2">
          <Label htmlFor="gender">Gender *</Label>
          <Select onValueChange={(value) => onUpdate({ gender: value })} value={data.gender}>
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Language Selection */}
        <div className="space-y-2">
          <Label>Preferred Languages *</Label>
          <Select onValueChange={handleLanguageSelect}>
            <SelectTrigger>
              <SelectValue placeholder="Select languages" />
            </SelectTrigger>
            <SelectContent className="max-h-48">
              {languages.filter(lang => !data.languages.includes(lang)).map((language) => (
                <SelectItem key={language} value={language}>
                  {language}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Selected Languages */}
      {data.languages.length > 0 && (
        <div className="space-y-2">
          <Label>Selected Languages ({data.languages.length})</Label>
          <div className="flex flex-wrap gap-2">
            {data.languages.map((language: string) => (
              <Badge key={language} variant="secondary" className="flex items-center gap-1">
                {language}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => removeLanguage(language)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AvatarDetailStep;
