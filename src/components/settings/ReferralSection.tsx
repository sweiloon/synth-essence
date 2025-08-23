
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Copy, Gift, Users, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface ReferralSectionProps {
  profileData: {
    referralCode: string;
    referrerCode: string;
  };
  onUpdate: (data: { referrerCode: string }) => void;
}

const ReferralSection: React.FC<ReferralSectionProps> = ({ profileData, onUpdate }) => {
  const [referrerCode, setReferrerCode] = useState(profileData.referrerCode || '');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const copyReferralCode = () => {
    if (profileData.referralCode) {
      navigator.clipboard.writeText(profileData.referralCode);
      toast({
        title: "Copied!",
        description: "Your referral code has been copied to clipboard.",
      });
    }
  };

  const handleSaveReferrer = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ referrer_code: referrerCode })
        .eq('id', user.id);

      if (error) {
        toast({
          title: "Update Failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        onUpdate({ referrerCode });
        toast({
          title: "Referrer Updated",
          description: "Your referrer code has been saved successfully.",
        });
      }
    } catch (error) {
      toast({
        title: "Update Error",
        description: "An unexpected error occurred while updating your referrer.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="card-modern">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Gift className="h-5 w-5" />
          Referral System
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
              {profileData.referralCode || 'Loading...'}
            </code>
            <Button
              variant="outline"
              size="sm"
              onClick={copyReferralCode}
              disabled={!profileData.referralCode}
            >
              <Copy className="h-4 w-4 mr-1" />
              Copy
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Share this code with friends to earn referral rewards when they sign up.
          </p>
        </div>

        {/* Your Referrer */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Your Referrer Code</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Enter referrer's code (optional)"
              value={referrerCode}
              onChange={(e) => setReferrerCode(e.target.value)}
              className="input-modern"
            />
            <Button
              onClick={handleSaveReferrer}
              disabled={isLoading}
              size="sm"
            >
              <Save className="h-4 w-4 mr-1" />
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
          </div>
          {profileData.referrerCode && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Current: {profileData.referrerCode}</Badge>
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            If someone referred you, enter their referral code here.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReferralSection;
