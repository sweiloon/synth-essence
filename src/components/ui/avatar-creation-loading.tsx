
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { User, CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface AvatarCreationLoadingProps {
  status: 'creating' | 'success' | 'error';
  progress?: number;
  message?: string;
}

export const AvatarCreationLoading: React.FC<AvatarCreationLoadingProps> = ({ 
  status, 
  progress = 0,
  message 
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'creating':
        return <Loader2 className="h-8 w-8 animate-spin text-primary" />;
      case 'success':
        return <CheckCircle className="h-8 w-8 text-green-500" />;
      case 'error':
        return <XCircle className="h-8 w-8 text-red-500" />;
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'creating':
        return message || 'Creating your avatar...';
      case 'success':
        return message || 'Avatar created successfully!';
      case 'error':
        return message || 'Failed to create avatar. Please try again.';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'creating':
        return 'text-primary';
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
    }
  };

  return (
    <Card className="card-modern">
      <CardContent className="p-8">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="p-4 rounded-full bg-muted/20">
            <User className="h-12 w-12 text-muted-foreground" />
          </div>
          
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <h3 className={`text-lg font-semibold ${getStatusColor()}`}>
              {getStatusMessage()}
            </h3>
          </div>
          
          {status === 'creating' && (
            <div className="w-full max-w-md space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-muted-foreground">
                This may take up to 20 seconds...
              </p>
            </div>
          )}
          
          {status === 'success' && (
            <p className="text-sm text-muted-foreground max-w-md">
              Your avatar has been successfully created and is ready to use!
            </p>
          )}
          
          {status === 'error' && (
            <p className="text-sm text-muted-foreground max-w-md">
              Something went wrong while creating your avatar. Please check your connection and try again.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
