import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  User, 
  Key, 
  Eye, 
  EyeOff, 
  Plus, 
  Trash2,
  Edit,
  Save,
  Camera
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ApiKey {
  id: string;
  name: string;
  service: string;
  key: string;
  lastUsed: string;
  status: 'active' | 'inactive';
}

const SettingsSection = () => {
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    bio: 'AI Avatar enthusiast and creator',
    company: 'Tech Solutions Inc.',
    website: 'https://johndoe-ai.com'
  });

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
  const [isEditing, setIsEditing] = useState(false);
  const [newApiKey, setNewApiKey] = useState({ name: '', service: '', key: '' });
  const { toast } = useToast();

  const handleProfileSave = () => {
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
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
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">Profile Management</TabsTrigger>
          <TabsTrigger value="api">API Management</TabsTrigger>
        </TabsList>

        {/* Profile Management Tab */}
        <TabsContent value="profile" className="space-y-4">
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
                  <AvatarFallback>JD</AvatarFallback>
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
