
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
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import ReferralSection from './ReferralSection';

const UserProfile = () => {
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    avatarUrl: '',
    referralCode: '',
    referrerCode: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Error",
          description: "Failed to load profile data.",
          variant: "destructive"
        });
      } else if (data) {
        setProfileData({
          name: data.name || '',
          email: data.email || user.email || '',
          phone: data.phone || '',
          avatarUrl: data.avatar_url || '',
          referralCode: data.referral_code || '',
          referrerCode: data.referrer_code || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileSave = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: profileData.name,
          avatar_url: profileData.avatarUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        toast({
          title: "Update Failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        setIsEditing(false);
        toast({
          title: "Profile Updated",
          description: "Your profile has been successfully updated.",
        });
      }
    } catch (error) {
      toast({
        title: "Update Error",
        description: "An unexpected error occurred while updating your profile.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleReferralUpdate = (data: { referrerCode: string }) => {
    setProfileData(prev => ({ ...prev, referrerCode: data.referrerCode }));
  };

  if (isLoading && !profileData.name) {
    return (
      <div className="space-y-4">
        <Card className="card-modern">
          <CardContent className="p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Personal Information */}
      <Card className="card-modern">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
            <CardDescription>
              Update your personal details
            </CardDescription>
          </div>
          <Button
            variant={isEditing ? "default" : "outline"}
            size="sm"
            onClick={isEditing ? handleProfileSave : () => setIsEditing(true)}
            disabled={isLoading}
          >
            {isEditing ? (
              <>
                <Save className="h-4 w-4 mr-1" />
                {isLoading ? 'Saving...' : 'Save'}
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
              {profileData.avatarUrl ? (
                <AvatarImage src={profileData.avatarUrl} alt="Profile" />
              ) : (
                <AvatarFallback>{getInitials(profileData.name || 'User')}</AvatarFallback>
              )}
            </Avatar>
            {isEditing && (
              <Button variant="outline" size="sm">
                <Camera className="h-4 w-4 mr-1" />
                Change Photo
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4">
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
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                disabled={true}
                className="input-modern bg-muted"
              />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={profileData.phone}
                disabled={true}
                className="input-modern bg-muted"
              />
              <p className="text-xs text-muted-foreground">Phone number is set during registration</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Referral Section */}
      <ReferralSection 
        profileData={{
          referralCode: profileData.referralCode,
          referrerCode: profileData.referrerCode
        }}
        onUpdate={handleReferralUpdate}
      />
    </div>
  );
};

export default UserProfile;
