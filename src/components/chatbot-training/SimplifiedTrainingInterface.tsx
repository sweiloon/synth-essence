
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { AvatarSelectorDropdown } from './AvatarSelectorDropdown';
import { AvatarOverview } from './AvatarOverview';
import { TestChat } from './TestChat';

export const SimplifiedTrainingInterface = () => {
  const [selectedAvatarId, setSelectedAvatarId] = useState<string | null>(null);
  const [isAvatarDetailsOpen, setIsAvatarDetailsOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Avatar Selection */}
      <AvatarSelectorDropdown
        selectedAvatarId={selectedAvatarId}
        onSelectAvatar={setSelectedAvatarId}
      />

      {/* Avatar Details & Prompts - Collapsible */}
      {selectedAvatarId && (
        <Collapsible open={isAvatarDetailsOpen} onOpenChange={setIsAvatarDetailsOpen}>
          <Card className="card-modern">
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    Avatar Details & Prompts
                  </span>
                  <Button variant="ghost" size="sm">
                    {isAvatarDetailsOpen ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0">
                <AvatarOverview avatarId={selectedAvatarId} />
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}

      {/* Test Chat */}
      {selectedAvatarId && (
        <TestChat avatarId={selectedAvatarId} />
      )}
    </div>
  );
};
