import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, QrCode, User, Phone, Edit2, Trash2, Plus, UserCheck, UserX } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DeleteConfirmationDialog } from '@/components/ui/delete-confirmation-dialog';

interface Avatar {
  id: string;
  name: string;
  avatar_images: string[];
}

interface AssignedUser {
  id: string;
  name: string;
  phone: string;
  is_active: boolean;
  assigned_at: string;
}

const AvatarAssign = () => {
  const { id: avatarId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [avatar, setAvatar] = useState<Avatar | null>(null);
  const [assignedUsers, setAssignedUsers] = useState<AssignedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    userId: string;
    userName: string;
  }>({
    open: false,
    userId: '',
    userName: ''
  });

  useEffect(() => {
    if (user && avatarId) {
      loadAvatarData();
      loadAssignedUsers();
    }
  }, [user, avatarId]);

  const loadAvatarData = async () => {
    if (!user || !avatarId) return;

    try {
      const { data, error } = await supabase
        .from('avatars')
        .select('id, name, avatar_images')
        .eq('id', avatarId)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setAvatar(data);
    } catch (error: any) {
      console.error('Error loading avatar:', error);
      toast({
        title: "Error",
        description: "Failed to load avatar data.",
        variant: "destructive"
      });
    }
  };

  const loadAssignedUsers = async () => {
    if (!user || !avatarId) return;

    try {
      // Mock data for now - in real implementation, you'd fetch from your database
      const mockUsers: AssignedUser[] = [
        {
          id: '1',
          name: 'John Doe',
          phone: '+1234567890',
          is_active: true,
          assigned_at: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Jane Smith',
          phone: '+0987654321',
          is_active: false,
          assigned_at: new Date(Date.now() - 86400000).toISOString()
        }
      ];
      
      setAssignedUsers(mockUsers);
    } catch (error: any) {
      console.error('Error loading assigned users:', error);
      toast({
        title: "Error",
        description: "Failed to load assigned users.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/dashboard?section=my-avatar');
  };

  const handleEditUser = (userId: string, currentName: string) => {
    setEditingUser(userId);
    setEditName(currentName);
  };

  const handleSaveEdit = async (userId: string) => {
    try {
      // Mock save - in real implementation, update your database
      setAssignedUsers(prev => 
        prev.map(user => 
          user.id === userId ? { ...user, name: editName } : user
        )
      );
      
      setEditingUser(null);
      setEditName('');
      
      toast({
        title: "Success",
        description: "User name updated successfully.",
      });
    } catch (error: any) {
      console.error('Error updating user name:', error);
      toast({
        title: "Error",
        description: "Failed to update user name.",
        variant: "destructive"
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditName('');
  };

  const handleToggleActive = async (userId: string) => {
    try {
      // Mock toggle - in real implementation, update your database
      setAssignedUsers(prev => 
        prev.map(user => 
          user.id === userId ? { ...user, is_active: !user.is_active } : user
        )
      );
      
      toast({
        title: "Success",
        description: "User status updated successfully.",
      });
    } catch (error: any) {
      console.error('Error toggling user status:', error);
      toast({
        title: "Error",
        description: "Failed to update user status.",
        variant: "destructive"
      });
    }
  };

  const openDeleteDialog = (userId: string, userName: string) => {
    setDeleteDialog({ open: true, userId, userName });
  };

  const handleDeleteUser = async () => {
    try {
      // Mock delete - in real implementation, remove from your database
      setAssignedUsers(prev => prev.filter(user => user.id !== deleteDialog.userId));
      
      toast({
        title: "Success",
        description: `${deleteDialog.userName} has been removed from the assignment.`,
      });
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "Failed to remove user.",
        variant: "destructive"
      });
    } finally {
      setDeleteDialog({ open: false, userId: '', userName: '' });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading assignment data...</p>
        </div>
      </div>
    );
  }

  if (!avatar) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="text-center">
          <CardContent className="pt-6">
            <p className="text-muted-foreground">Avatar not found.</p>
            <Button onClick={handleBack} className="mt-4">
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Generate QR code URL (you can integrate with a real QR code service)
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`${window.location.origin}/assign/${avatarId}`)}`;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBack}
            className="shrink-0"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground truncate">
              Assign Avatar: {avatar.name}
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Share the QR code to assign this avatar to users
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* QR Code Section */}
          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                Assignment QR Code
              </CardTitle>
              <CardDescription>
                Users can scan this QR code to request assignment to this avatar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="inline-block p-4 bg-white rounded-lg border">
                  <img 
                    src={qrCodeUrl} 
                    alt="Assignment QR Code"
                    className="w-48 h-48 mx-auto"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Have users scan this QR code to submit their information for avatar assignment
                </p>
                <Button variant="outline" className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Download QR Code
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Assigned Users Section */}
          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Assigned Users ({assignedUsers.length})
              </CardTitle>
              <CardDescription>
                Manage users who have been assigned to this avatar
              </CardDescription>
            </CardHeader>
            <CardContent>
              {assignedUsers.length === 0 ? (
                <div className="text-center py-8">
                  <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No users assigned yet</p>
                  <p className="text-sm text-muted-foreground">
                    Share the QR code to get started
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {assignedUsers.map((assignedUser) => (
                    <div
                      key={assignedUser.id}
                      className="flex items-center justify-between p-4 border rounded-lg bg-background/50"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          {editingUser === assignedUser.id ? (
                            <div className="space-y-2">
                              <Input
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                placeholder="Enter name"
                                className="h-8"
                              />
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleSaveEdit(assignedUser.id)}
                                  disabled={!editName.trim()}
                                >
                                  Save
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={handleCancelEdit}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center gap-2">
                                <p className="font-medium truncate">{assignedUser.name}</p>
                                <Badge variant={assignedUser.is_active ? "default" : "secondary"}>
                                  {assignedUser.is_active ? "Active" : "Inactive"}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Phone className="h-3 w-3" />
                                <span>{assignedUser.phone}</span>
                                <span>•</span>
                                <span>Assigned {new Date(assignedUser.assigned_at).toLocaleDateString()}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      
                      {editingUser !== assignedUser.id && (
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditUser(assignedUser.id, assignedUser.name)}
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleActive(assignedUser.id)}
                            className={assignedUser.is_active ? "text-amber-600" : "text-green-600"}
                          >
                            {assignedUser.is_active ? <UserX className="h-3 w-3" /> : <UserCheck className="h-3 w-3" />}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openDeleteDialog(assignedUser.id, assignedUser.name)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmationDialog
          open={deleteDialog.open}
          onOpenChange={(open) => setDeleteDialog(prev => ({ ...prev, open }))}
          onConfirm={handleDeleteUser}
          title="Remove User Assignment"
          description="Are you sure you want to remove"
          itemName={deleteDialog.userName}
        />
      </div>
    </div>
  );
};

export default AvatarAssign;