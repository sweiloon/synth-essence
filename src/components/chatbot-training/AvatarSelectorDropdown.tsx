
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { User, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Avatar {
  id: string;
  name: string;
  avatarImages: string[];
  primaryLanguage: string;
  secondaryLanguages: string[];
}

interface AvatarSelectorDropdownProps {
  selectedAvatarId: string | null;
  onSelectAvatar: (avatarId: string) => void;
}

export const AvatarSelectorDropdown: React.FC<AvatarSelectorDropdownProps> = ({
  selectedAvatarId,
  onSelectAvatar
}) => {
  const navigate = useNavigate();
  const savedAvatars = JSON.parse(localStorage.getItem('myAvatars') || '[]');

  const handleCreateNewAvatar = () => {
    navigate('/create-avatar');
  };

  const selectedAvatar = savedAvatars.find((avatar: Avatar) => avatar.id === selectedAvatarId);

  return (
    <Card className="card-modern mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Select Avatar to Train
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <Select value={selectedAvatarId || ""} onValueChange={onSelectAvatar}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose an avatar to train" />
              </SelectTrigger>
              <SelectContent>
                {savedAvatars.map((avatar: Avatar) => (
                  <SelectItem key={avatar.id} value={avatar.id}>
                    <div className="flex items-center gap-2">
                      {avatar.avatarImages && avatar.avatarImages.length > 0 ? (
                        <img
                          src={avatar.avatarImages[0]}
                          alt={avatar.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                          <User className="h-3 w-3 text-muted-foreground" />
                        </div>
                      )}
                      <span>{avatar.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleCreateNewAvatar} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Create New Avatar
          </Button>
        </div>
        
        {selectedAvatar && (
          <div className="mt-4 p-3 bg-muted/20 rounded-lg">
            <div className="flex items-center gap-3">
              {selectedAvatar.avatarImages && selectedAvatar.avatarImages.length > 0 ? (
                <img
                  src={selectedAvatar.avatarImages[0]}
                  alt={selectedAvatar.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <User className="h-5 w-5 text-muted-foreground" />
                </div>
              )}
              <div>
                <p className="font-medium">{selectedAvatar.name}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedAvatar.primaryLanguage}
                  {selectedAvatar.secondaryLanguages.length > 0 && ` +${selectedAvatar.secondaryLanguages.length} more`}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
