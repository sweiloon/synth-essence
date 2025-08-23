
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, Save, Upload, Copy, Check, Edit, X, Gift } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserData {
  name: string;
  email: string;
  phone: string;
  avatar_url: string;
  referral_code: string;
  referrer_code: string;
}

const UserProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userData, setUserData] = useState<UserData>({
    name: '',
    email: '',
    phone: '',
    avatar_url: '',
    referral_code: '',
    referrer_code: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [referrerCodeInput, setReferrerCodeInput] = useState('');

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;
    
    try {
      // Get profile data
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      // Get phone from auth.users metadata or profile
      const phoneFromAuth = user.phone || user.user_metadata?.phone || '';
      const phoneFromProfile = profile?.phone || '';
      const phone = phoneFromAuth || phoneFromProfile;

      const profileData = {
        name: profile?.name || user.user_metadata?.name || user.user_metadata?.full_name || '',
        email: profile?.email || user.email || '',
        phone: phone,
        avatar_url: profile?.avatar_url || '',
        referral_code: profile?.referral_code || '',
        referrer_code: profile?.referrer_code || ''
      };

      setUserData(profileData);
      setReferrerCodeInput(profileData.referrer_code);
    } catch (error: any) {
      console.error('Error fetching user data:', error);
      toast({
        title: "Error",
        description: "Failed to load user profile.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          avatar_url: userData.avatar_url,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setIsEditMode(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveReferrerCode = async () => {
    if (!user) return;
    
    const trimmedCode = referrerCodeInput.trim();
    
    // Validate the referrer code exists in database if it's not empty
    if (trimmedCode !== '') {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id')
          .eq('referral_code', trimmedCode)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error validating referrer code:', error);
          toast({
            title: "Validation Error",
            description: "Failed to validate referrer code. Please try again.",
            variant: "destructive"
          });
          return;
        }

        if (!data) {
          toast({
            title: "Invalid Referrer Code",
            description: "The referrer code doesn't exist. Please check and try again.",
            variant: "destructive"
          });
          return;
        }
      } catch (error) {
        console.error('Error validating referrer code:', error);
        toast({
          title: "Validation Error",
          description: "An unexpected error occurred while validating the referrer code.",
          variant: "destructive"
        });
        return;
      }
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ referrer_code: trimmedCode })
        .eq('id', user.id);

      if (error) {
        toast({
          title: "Update Failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        setUserData(prev => ({ ...prev, referrer_code: trimmedCode }));
        toast({
          title: "Referrer Updated",
          description: trimmedCode ? "Your referrer code has been saved successfully." : "Referrer code has been cleared.",
        });
      }
    } catch (error) {
      toast({
        title: "Update Error",
        description: "An unexpected error occurred while updating your referrer.",
        variant: "destructive"
      });
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      setUserData(prev => ({ ...prev, avatar_url: urlData.publicUrl }));
      
      toast({
        title: "Avatar Uploaded",
        description: "Your avatar has been uploaded successfully.",
      });
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload avatar.",
        variant: "destructive"
      });
    }
  };

  const copyReferralCode = () => {
    if (userData.referral_code) {
      navigator.clipboard.writeText(userData.referral_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied!",
        description: "Referral code copied to clipboard.",
      });
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  const hasExistingReferrer = userData.referrer_code && userData.referrer_code.trim() !== '';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Profile Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your personal information and preferences
        </p>
      </div>

      {/* Profile Picture */}
      <Card className="card-modern">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Picture
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={userData.avatar_url} alt={userData.name} />
              <AvatarFallback className="text-lg">
                {getInitials(userData.name) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <input
                type="file"
                id="avatar-upload"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
              <label htmlFor="avatar-upload">
                <Button variant="outline" className="cursor-pointer" asChild>
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    Change Avatar
                  </span>
                </Button>
              </label>
              <p className="text-xs text-muted-foreground mt-2">
                Recommended: Square image, at least 400x400px
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card className="card-modern">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details and contact information
              </CardDescription>
            </div>
            {!isEditMode ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditMode(true)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsEditMode(false);
                    fetchUserData(); // Reset changes
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="btn-hero"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={userData.name}
                onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your full name"
                className="input-modern"
                disabled={!isEditMode}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={userData.email}
                placeholder="Enter your email"
                className="input-modern"
                disabled
              />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed here. Contact support if needed.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              value={userData.phone}
              onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="Enter your phone number"
              className="input-modern"
              disabled={!isEditMode}
            />
          </div>
        </CardContent>
      </Card>

      {/* Referral Program */}
      <Card className="card-modern">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Gift className="h-5 w-5" />
            Referral Program
          </CardTitle>
          <CardDescription>
            Share your referral code with friends and earn rewards
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Your Referral Code */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Your Referral Code</Label>
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <code className="flex-1 text-lg font-mono tracking-wider">
                {userData.referral_code || 'Loading...'}
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={copyReferralCode}
                disabled={!userData.referral_code}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Share this code with friends to earn referral rewards when they sign up.
            </p>
          </div>

          {/* Your Referrer Code */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Your Referrer Code</Label>
            {hasExistingReferrer ? (
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-base px-3 py-1">
                  {userData.referrer_code}
                </Badge>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  placeholder="Enter referrer's code (optional)"
                  value={referrerCodeInput}
                  onChange={(e) => setReferrerCodeInput(e.target.value)}
                  className="input-modern"
                />
                <Button
                  onClick={handleSaveReferrerCode}
                  size="sm"
                  className="btn-hero"
                >
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              {hasExistingReferrer 
                ? "Your referrer has been set and cannot be changed."
                : "If someone referred you, enter their referral code here. This can only be set once."
              }
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;
