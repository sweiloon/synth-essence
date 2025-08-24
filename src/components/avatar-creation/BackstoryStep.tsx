
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BookOpen, Search, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Template {
  id: string;
  title: string;
  content: string;
  category: string;
  template_type: string;
}

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
  const { toast } = useToast();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(true);

  // Load templates
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const { data: templatesData, error } = await supabase
          .from('avatar_templates')
          .select('*')
          .eq('template_type', 'backstory')
          .eq('is_active', true)
          .order('title');

        if (error) {
          console.error('Error fetching templates:', error);
        } else {
          setTemplates(templatesData || []);
          setFilteredTemplates(templatesData || []);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoadingTemplates(false);
      }
    };

    fetchTemplates();
  }, []);

  // Filter templates based on search
  useEffect(() => {
    const filtered = templates.filter(template =>
      template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTemplates(filtered);
  }, [searchTerm, templates]);

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

  const handleTemplateSelect = (template: Template) => {
    onUpdate('backstory', template.content);
    toast({
      title: "Template Applied",
      description: `"${template.title}" template has been applied to your backstory.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Template Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5" />
            Backstory Templates
          </CardTitle>
          <CardDescription>
            Choose from pre-made templates to get started quickly
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Templates Grid */}
          {isLoadingTemplates ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
              {filteredTemplates.map((template) => (
                <Card 
                  key={template.id} 
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleTemplateSelect(template)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">{template.title}</h4>
                        {template.category && (
                          <Badge variant="outline" className="text-xs">
                            {template.category}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {template.content.substring(0, 100)}...
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!isLoadingTemplates && filteredTemplates.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-2" />
              <p>No templates found</p>
            </div>
          )}
        </CardContent>
      </Card>

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
