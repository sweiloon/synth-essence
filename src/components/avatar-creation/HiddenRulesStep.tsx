
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, AlertTriangle, Search, FileText } from 'lucide-react';
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

interface HiddenRulesStepProps {
  data: any;
  onUpdate: (field: string, value: any) => void;
  avatarId?: string;
}

export const HiddenRulesStep: React.FC<HiddenRulesStepProps> = ({ 
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
          .eq('template_type', 'hidden_rules')
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

  // Set up real-time updates for hidden rules changes
  useEffect(() => {
    if (!avatarId || !user) return;

    const channel = supabase
      .channel('hidden-rules-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'avatars',
          filter: `id=eq.${avatarId}`
        },
        (payload) => {
          console.log('Hidden rules updated:', payload);
          if (payload.new) {
            const newData = payload.new as any;
            onUpdate('hiddenRules', newData.hidden_rules || '');
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [avatarId, user, onUpdate]);

  const handleTemplateSelect = (template: Template) => {
    const currentRules = data.hiddenRules || '';
    const newRules = currentRules ? `${currentRules}\n\n${template.content}` : template.content;
    onUpdate('hiddenRules', newRules);
    toast({
      title: "Template Applied",
      description: `"${template.title}" template has been added to your hidden rules.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Template Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5" />
            Hidden Rules Templates
          </CardTitle>
          <CardDescription>
            Choose from common rule templates to establish proper boundaries
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search rule templates..."
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

      {/* Main Hidden Rules Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Hidden Rules & Guidelines
            {avatarId && (
              <Badge variant="outline" className="text-xs">
                Real-time Updates Enabled
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Set internal behavior rules and constraints that guide your avatar's responses
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="hiddenRules">Hidden Rules & Constraints</Label>
            <Textarea
              id="hiddenRules"
              placeholder="Define internal rules and constraints that your avatar should follow. These are guidelines that shape behavior without being explicitly mentioned in conversations..."
              value={data.hiddenRules || ''}
              onChange={(e) => onUpdate('hiddenRules', e.target.value)}
              className="min-h-[250px] resize-y"
              style={{ resize: 'vertical' }}
            />
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                These rules help maintain consistent behavior and appropriate boundaries
              </p>
              <Badge variant="outline" className="text-xs">
                {data.hiddenRules?.length || 0} characters
              </Badge>
            </div>
          </div>

          {/* Warning Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-900 mb-1">Important Notice</h4>
                <p className="text-sm text-amber-800">
                  Hidden rules are internal guidelines that are not shared with users during conversations. 
                  They help maintain appropriate boundaries and consistent behavior patterns.
                </p>
              </div>
            </div>
          </div>

          {/* Guidelines */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Hidden Rules Examples</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Never discuss personal financial information</li>
              <li>• Maintain professional boundaries in workplace scenarios</li>
              <li>• Avoid giving medical or legal advice</li>
              <li>• Stay consistent with the defined personality traits</li>
              <li>• Redirect inappropriate conversations tactfully</li>
              <li>• Always prioritize user safety and well-being</li>
              <li>• Respect cultural sensitivities based on origin country</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
