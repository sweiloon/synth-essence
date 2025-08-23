
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
import { PhoneInput } from '@/components/ui/phone-input';
import ReferralSection from './ReferralSection';

const UserProfile = () => {
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    countryCode: '+60',
    phoneNumber: '',
    avatarUrl: '',
    referralCode: '',
    referrerCode: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
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
        // Parse phone number into country code and number
        let countryCode = '+60';
        let phoneNumber = '';
        
        if (data.phone) {
          const phone = data.phone;
          // Find the country code (assuming it starts with +)
          const countryCodeMatch = phone.match(/^\+\d+/);
          if (countryCodeMatch) {
            countryCode = countryCodeMatch[0];
            phoneNumber = phone.replace(countryCode, '');
          } else {
            phoneNumber = phone;
          }
        }

        setProfileData({
          name: data.name || '',
          email: data.email || user.email || '',
          countryCode: countryCode,
          phoneNumber: phoneNumber,
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
      const fullPhoneNumber = profileData.phoneNumber ? 
        `${profileData.countryCode}${profileData.phoneNumber}` : '';

      const { error } = await supabase
        .from('profiles')
        .update({
          name: profileData.name,
          phone: fullPhoneNumber,
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

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 2MB.",
        variant: "destructive"
      });
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please select an image file.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    try {
      // Create a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const avatarUrl = urlData.publicUrl;

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: avatarUrl })
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }

      setProfileData(prev => ({ ...prev, avatarUrl }));
      toast({
        title: "Avatar Updated",
        description: "Your profile picture has been updated successfully.",
      });

    } catch (error: any) {
      console.error('Avatar upload error:', error);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload avatar. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
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
            <div className="space-y-2">
              <input
                type="file"
                id="avatar-upload"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => document.getElementById('avatar-upload')?.click()}
                disabled={isUploading}
              >
                <Camera className="h-4 w-4 mr-1" />
                {isUploading ? 'Uploading...' : 'Change Photo'}
              </Button>
            </div>
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
              <PhoneInput
                countryCode={profileData.countryCode}
                phoneNumber={profileData.phoneNumber}
                onCountryCodeChange={(value) => setProfileData({...profileData, countryCode: value})}
                onPhoneNumberChange={(value) => setProfileData({...profileData, phoneNumber: value})}
                disabled={!isEditing}
              />
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
