
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Copy } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface BackstoryStepProps {
  data: any;
  onUpdate: (field: string, value: any) => void;
  avatarId?: string;
}

interface Template {
  id: string;
  title: string;
  content: string;
  category: string;
}

export const BackstoryStep: React.FC<BackstoryStepProps> = ({ 
  data, 
  onUpdate, 
  avatarId 
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);

  // Fetch templates
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const { data: templatesData, error } = await supabase
          .from('avatar_templates')
          .select('id, title, content, category')
          .eq('template_type', 'backstory')
          .eq('is_active', true)
          .order('category', { ascending: true });

        if (error) {
          console.error('Error fetching templates:', error);
        } else {
          setTemplates(templatesData || []);
        }
      } catch (error) {
        console.error('Error fetching templates:', error);
      } finally {
        setLoadingTemplates(false);
      }
    };

    fetchTemplates();
  }, []);

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

  const handleUseTemplate = (template: Template) => {
    onUpdate('backstory', template.content);
    toast({
      title: "Template Applied",
      description: `"${template.title}" template has been applied to your backstory.`,
    });
  };

  const groupedTemplates = templates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, Template[]>);

  return (
    <Card className="card-modern">
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
        {/* Templates Section */}
        {!loadingTemplates && templates.length > 0 && (
          <div className="space-y-4">
            <Label>Quick Start Templates</Label>
            {Object.entries(groupedTemplates).map(([category, categoryTemplates]) => (
              <div key={category} className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground capitalize">
                  {category}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {categoryTemplates.map((template) => (
                    <Button
                      key={template.id}
                      variant="outline"
                      className="justify-start h-auto p-3 text-left"
                      onClick={() => handleUseTemplate(template)}
                    >
                      <div className="flex items-center gap-2 w-full">
                        <Copy className="h-4 w-4 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">
                            {template.title}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {template.content.substring(0, 50)}...
                          </p>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

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
  );
};
