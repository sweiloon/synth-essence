
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Key, 
  Eye, 
  EyeOff, 
  Plus, 
  Trash2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { UserProfile } from '@/components/settings/UserProfile';
import ReferralSection from '@/components/settings/ReferralSection';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface ApiKey {
  id: string;
  name: string;
  service: string;
  key: string;
  lastUsed: string;
  status: 'active' | 'inactive';
}

const SettingsSection = () => {
  const { user } = useAuth();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: '1',
      name: 'OpenAI GPT-4',
      service: 'OpenAI',
      key: 'sk-proj-••••••••••••••••••••••••••••••••••••••••••••••••',
      lastUsed: '2 hours ago',
      status: 'active'
    },
    {
      id: '2',
      name: 'ElevenLabs TTS',
      service: 'ElevenLabs',
      key: 'el_••••••••••••••••••••••••••••••••••••••••••••••••',
      lastUsed: '1 day ago',
      status: 'active'
    },
    {
      id: '3',
      name: 'Stability AI',
      service: 'Stability AI',
      key: 'sk-••••••••••••••••••••••••••••••••••••••••••••••••',
      lastUsed: '3 days ago',
      status: 'inactive'
    }
  ]);

  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [newApiKey, setNewApiKey] = useState({ name: '', service: '', key: '' });
  const { toast } = useToast();

  // Fetch profile data for referral section
  const { data: profileData } = useQuery({
    queryKey: ['profile-referral', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('referral_code, referrer_code')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        throw error;
      }

      return data || { referralCode: '', referrerCode: '' };
    },
    enabled: !!user?.id
  });

  const handleReferralUpdate = (data: { referrerCode: string }) => {
    // This will be handled by the ReferralSection component
    console.log('Referral updated:', data);
  };

  const handleAddApiKey = () => {
    if (newApiKey.name && newApiKey.service && newApiKey.key) {
      const newKey: ApiKey = {
        id: Date.now().toString(),
        name: newApiKey.name,
        service: newApiKey.service,
        key: newApiKey.key.substring(0, 10) + '••••••••••••••••••••••••••••••••••••••••••••••••',
        lastUsed: 'Never',
        status: 'active'
      };
      setApiKeys([...apiKeys, newKey]);
      setNewApiKey({ name: '', service: '', key: '' });
      toast({
        title: "API Key Added",
        description: "Your API key has been successfully added.",
      });
    }
  };

  const handleDeleteApiKey = (id: string) => {
    setApiKeys(apiKeys.filter(key => key.id !== id));
    toast({
      title: "API Key Deleted",
      description: "The API key has been removed from your account.",
    });
  };

  const toggleKeyVisibility = (id: string) => {
    setShowKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="h-6 w-6" />
          Settings
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your profile and API configurations
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile Management</TabsTrigger>
          <TabsTrigger value="referral">Referral System</TabsTrigger>
          <TabsTrigger value="api">API Management</TabsTrigger>
        </TabsList>

        {/* Profile Management Tab */}
        <TabsContent value="profile" className="space-y-4">
          <UserProfile />
        </TabsContent>

        {/* Referral System Tab */}
        <TabsContent value="referral" className="space-y-4">
          {profileData && (
            <ReferralSection
              profileData={{
                referralCode: profileData.referral_code || '',
                referrerCode: profileData.referrer_code || ''
              }}
              onUpdate={handleReferralUpdate}
            />
          )}
        </TabsContent>

        {/* API Management Tab */}
        <TabsContent value="api" className="space-y-4">
          {/* Add New API Key */}
          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Plus className="h-5 w-5" />
                Add New API Key
              </CardTitle>
              <CardDescription>
                Configure API keys for model training and avatar generation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="keyName">Key Name</Label>
                  <Input
                    id="keyName"
                    placeholder="e.g., OpenAI GPT-4"
                    value={newApiKey.name}
                    onChange={(e) => setNewApiKey({...newApiKey, name: e.target.value})}
                    className="input-modern"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="service">Service</Label>
                  <Input
                    id="service"
                    placeholder="e.g., OpenAI, ElevenLabs"
                    value={newApiKey.service}
                    onChange={(e) => setNewApiKey({...newApiKey, service: e.target.value})}
                    className="input-modern"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Key</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    placeholder="sk-..."
                    value={newApiKey.key}
                    onChange={(e) => setNewApiKey({...newApiKey, key: e.target.value})}
                    className="input-modern"
                  />
                </div>
              </div>
              
              <Button onClick={handleAddApiKey} className="btn-hero">
                <Plus className="h-4 w-4 mr-1" />
                Add API Key
              </Button>
            </CardContent>
          </Card>

          {/* Existing API Keys */}
          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Key className="h-5 w-5" />
                Your API Keys
              </CardTitle>
              <CardDescription>
                Manage your existing API keys and their usage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {apiKeys.map((apiKey) => (
                  <div key={apiKey.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{apiKey.name}</span>
                        <Badge 
                          variant={apiKey.status === 'active' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {apiKey.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{apiKey.service}</p>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {showKeys[apiKey.id] ? apiKey.key.replace('••••••••••••••••••••••••••••••••••••••••••••••••', 'ACTUAL_KEY_HERE') : apiKey.key}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleKeyVisibility(apiKey.id)}
                        >
                          {showKeys[apiKey.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">Last used: {apiKey.lastUsed}</p>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteApiKey(apiKey.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsSection;
