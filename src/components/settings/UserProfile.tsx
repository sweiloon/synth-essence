
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Phone, MapPin, Edit, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UserInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
}

export const UserProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: ''
  });
  const [editedInfo, setEditedInfo] = useState<UserInfo>(userInfo);
  const { toast } = useToast();

  useEffect(() => {
    // Fetch user information from localStorage (or API in the future)
    const savedUserInfo = localStorage.getItem('userInfo');
    if (savedUserInfo) {
      const parsedInfo = JSON.parse(savedUserInfo);
      setUserInfo(parsedInfo);
      setEditedInfo(parsedInfo);
    } else {
      // Default values if no user info exists
      const defaultInfo = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        address: '123 Main St, City, State 12345'
      };
      setUserInfo(defaultInfo);
      setEditedInfo(defaultInfo);
    }
  }, []);

  const handleSave = () => {
    // Save to localStorage (in the future, this would be an API call)
    localStorage.setItem('userInfo', JSON.stringify(editedInfo));
    setUserInfo(editedInfo);
    setIsEditing(false);
    
    toast({
      title: "Profile Updated",
      description: "Your personal information has been saved successfully.",
    });
  };

  const handleCancel = () => {
    setEditedInfo(userInfo);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof UserInfo, value: string) => {
    setEditedInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card className="card-modern">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button size="sm" onClick={handleSave}>
                  <Save className="h-3 w-3 mr-1" />
                  Save
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancel}>
                  <X className="h-3 w-3 mr-1" />
                  Cancel
                </Button>
              </>
            ) : (
              <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                <Edit className="h-3 w-3 mr-1" />
                Edit
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="firstName"
                value={isEditing ? editedInfo.firstName : userInfo.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                disabled={!isEditing}
                className={`pl-10 ${!isEditing ? 'bg-muted/20' : ''}`}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="lastName"
                value={isEditing ? editedInfo.lastName : userInfo.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                disabled={!isEditing}
                className={`pl-10 ${!isEditing ? 'bg-muted/20' : ''}`}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={isEditing ? editedInfo.email : userInfo.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={!isEditing}
                className={`pl-10 ${!isEditing ? 'bg-muted/20' : ''}`}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                value={isEditing ? editedInfo.phone : userInfo.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                disabled={!isEditing}
                className={`pl-10 ${!isEditing ? 'bg-muted/20' : ''}`}
              />
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="address">Address</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="address"
                value={isEditing ? editedInfo.address : userInfo.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                disabled={!isEditing}
                className={`pl-10 ${!isEditing ? 'bg-muted/20' : ''}`}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
