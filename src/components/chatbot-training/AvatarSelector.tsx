import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Avatar {
  id: string;
  name: string;
  avatarImages: string[];
  primaryLanguage: string;
  secondaryLanguages: string[];
}

interface AvatarSelectorProps {
  selectedAvatarId: string | null;
  onSelectAvatar: (avatarId: string) => void;
}

export const AvatarSelector: React.FC<AvatarSelectorProps> = ({
  selectedAvatarId,
  onSelectAvatar
}) => {
  const navigate = useNavigate();
  const savedAvatars = JSON.parse(localStorage.getItem('myAvatars') || '[]');

  const handleCreateNewAvatar = () => {
    navigate('/create-avatar');
  };

  return (
    <Card className="card-modern mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Select Avatar to Train
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* Create New Avatar Card */}
          <div
            onClick={handleCreateNewAvatar}
            className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
          >
            <Plus className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm font-medium">Create New Avatar</p>
          </div>

          {/* Existing Avatars */}
          {savedAvatars.map((avatar: Avatar) => (
            <div
              key={avatar.id}
              onClick={() => onSelectAvatar(avatar.id)}
              className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                selectedAvatarId === avatar.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="aspect-square rounded-lg overflow-hidden mb-3 bg-muted">
                {avatar.avatarImages && avatar.avatarImages.length > 0 ? (
                  <img
                    src={avatar.avatarImages[0]}
                    alt={avatar.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
              </div>
              <h3 className="font-medium text-sm truncate mb-2">{avatar.name}</h3>
              <div className="space-y-1">
                <Badge variant="outline" className="text-xs">
                  {avatar.primaryLanguage}
                </Badge>
                {avatar.secondaryLanguages && avatar.secondaryLanguages.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    +{avatar.secondaryLanguages.length} more
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
