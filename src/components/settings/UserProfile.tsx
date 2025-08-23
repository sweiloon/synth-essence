
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Edit,
  Save,
  Camera
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const UserProfile = () => {
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    bio: '',
    company: '',
    website: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Fetch user data from localStorage (where signup data is stored)
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsedData = JSON.parse(userData);
      setProfileData({
        name: parsedData.name || parsedData.firstName + ' ' + parsedData.lastName || '',
        email: parsedData.email || '',
        bio: parsedData.bio || 'AI Avatar enthusiast and creator',
        company: parsedData.company || '',
        website: parsedData.website || ''
      });
    } else {
      // Fallback - try to get from any other stored user info
      const storedEmail = localStorage.getItem('userEmail');
      const storedName = localStorage.getItem('userName');
      if (storedEmail || storedName) {
        setProfileData(prev => ({
          ...prev,
          email: storedEmail || prev.email,
          name: storedName || prev.name
        }));
      }
    }
  }, []);

  const handleProfileSave = () => {
    // Save updated profile data
    const existingData = JSON.parse(localStorage.getItem('userData') || '{}');
    const updatedData = { ...existingData, ...profileData };
    localStorage.setItem('userData', JSON.stringify(updatedData));
    
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="card-modern">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
          <CardDescription>
            Update your personal details and preferences
          </CardDescription>
        </div>
        <Button
          variant={isEditing ? "default" : "outline"}
          size="sm"
          onClick={isEditing ? handleProfileSave : () => setIsEditing(true)}
        >
          {isEditing ? (
            <>
              <Save className="h-4 w-4 mr-1" />
              Save
            </>
          ) : (
            <>
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src="/lovable-uploads/1fab5331-8802-41ed-b1c5-5d8aab9b3268.png" alt="Profile" />
            <AvatarFallback>{getInitials(profileData.name || 'User')}</AvatarFallback>
          </Avatar>
          {isEditing && (
            <Button variant="outline" size="sm">
              <Camera className="h-4 w-4 mr-1" />
              Change Photo
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={profileData.name}
              onChange={(e) => setProfileData({...profileData, name: e.target.value})}
              disabled={!isEditing}
              className="input-modern"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData({...profileData, email: e.target.value})}
              disabled={!isEditing}
              className="input-modern"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              value={profileData.company}
              onChange={(e) => setProfileData({...profileData, company: e.target.value})}
              disabled={!isEditing}
              className="input-modern"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={profileData.website}
              onChange={(e) => setProfileData({...profileData, website: e.target.value})}
              disabled={!isEditing}
              className="input-modern"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Input
            id="bio"
            value={profileData.bio}
            onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
            disabled={!isEditing}
            className="input-modern"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
