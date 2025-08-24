
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { BookOpen } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface BackstoryStepProps {
  data: any;
  onUpdate: (field: string, value: any) => void;
  avatarId?: string;
}

export const BackstoryStep: React.FC<BackstoryStepProps> = ({ 
  data, 
  onUpdate, 
  avatarId 
}) => {
  const { user } = useAuth();

  // Set up real-time updates for backstory changes
  useEffect(() => {
    if (!avatarId || !user) return;

    const channel = supabase
      .channel('backstory-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'avatars',
          filter: `id=eq.${avatarId}`
        },
        (payload) => {
          console.log('Backstory updated:', payload);
          if (payload.new) {
            const newData = payload.new as any;
            onUpdate('backstory', newData.backstory || '');
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [avatarId, user, onUpdate]);

  return (
    <div className="space-y-6">
      {/* Main Backstory Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Backstory & Background
            {avatarId && (
              <Badge variant="outline" className="text-xs">
                Real-time Updates Enabled
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Define your avatar's history, experiences, and background story
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="backstory">Avatar Backstory *</Label>
            <Textarea
              id="backstory"
              placeholder="Write your avatar's detailed backstory, including their history, experiences, education, career, relationships, and any significant life events that shaped their personality and worldview..."
              value={data.backstory || ''}
              onChange={(e) => onUpdate('backstory', e.target.value)}
              className="min-h-[300px] resize-y"
              style={{ resize: 'vertical' }}
            />
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Provide a comprehensive backstory to make your avatar more authentic and relatable
              </p>
              <Badge variant="outline" className="text-xs">
                {data.backstory?.length || 0} characters
              </Badge>
            </div>
          </div>

          {/* Guidelines */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Backstory Guidelines</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Include childhood experiences and family background</li>
              <li>• Describe education, career path, and professional experiences</li>
              <li>• Mention significant relationships and social connections</li>
              <li>• Add life challenges, achievements, and turning points</li>
              <li>• Include hobbies, interests, and personal values</li>
              <li>• Describe current lifestyle and living situation</li>
              <li>• The more detailed the backstory, the more realistic your avatar will be</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
