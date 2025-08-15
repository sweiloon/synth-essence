
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageUpload } from '@/components/ui/image-upload';
import { useToast } from '@/hooks/use-toast';

interface AvatarCreationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateAvatar: (avatar: any) => void;
}

const mbtiTypes = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP'
];

export const AvatarCreationDialog: React.FC<AvatarCreationDialogProps> = ({
  isOpen,
  onClose,
  onCreateAvatar
}) => {
  const [newAvatar, setNewAvatar] = useState({
    name: '',
    gender: '',
    age: '',
    mbti: '',
    images: [] as string[]
  });
  const { toast } = useToast();

  const handleCreateAvatar = () => {
    if (!newAvatar.name || !newAvatar.gender || !newAvatar.age || !newAvatar.mbti) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const avatar = {
      id: Date.now().toString(),
      ...newAvatar,
      progress: {
        chatbot: false,
        tts: false,
        images: false,
        avatar: false
      },
      createdAt: new Date().toISOString()
    };

    onCreateAvatar(avatar);
    setNewAvatar({ name: '', gender: '', age: '', mbti: '', images: [] });
    onClose();
    
    toast({
      title: "Avatar Created!",
      description: `${avatar.name} has been created successfully. Start training now!`,
    });
  };

  const handleClose = () => {
    setNewAvatar({ name: '', gender: '', age: '', mbti: '', images: [] });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Avatar</DialogTitle>
          <DialogDescription>
            Set up your avatar's basic information and upload profile images to get started.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Avatar Name *</Label>
            <Input
              id="name"
              placeholder="Enter avatar name"
              value={newAvatar.name}
              onChange={(e) => setNewAvatar({...newAvatar, name: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="gender">Gender *</Label>
            <Select onValueChange={(value) => setNewAvatar({...newAvatar, gender: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="non-binary">Non-binary</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="age">Starting Age *</Label>
            <Input
              id="age"
              type="number"
              placeholder="Enter age"
              value={newAvatar.age}
              onChange={(e) => setNewAvatar({...newAvatar, age: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="mbti">Preferred MBTI *</Label>
            <Select onValueChange={(value) => setNewAvatar({...newAvatar, mbti: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select MBTI type" />
              </SelectTrigger>
              <SelectContent>
                {mbtiTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Profile Images</Label>
            <ImageUpload 
              onImagesChange={(images) => setNewAvatar({...newAvatar, images})}
              maxImages={5}
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button onClick={handleCreateAvatar} className="flex-1">
              Create Avatar
            </Button>
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
