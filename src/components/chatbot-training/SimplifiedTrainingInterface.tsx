
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { AvatarSelectorDropdown } from './AvatarSelectorDropdown';
import { AvatarOverview } from './AvatarOverview';
import { TestChat } from './TestChat';

interface SimplifiedTrainingInterfaceProps {
  avatarName?: string;
  avatarId?: string;
  isTraining?: boolean;
  onTrainingStart?: () => void;
  onTrainingComplete?: () => void;
}

export const SimplifiedTrainingInterface: React.FC<SimplifiedTrainingInterfaceProps> = ({
  avatarName,
  avatarId,
  isTraining,
  onTrainingStart,
  onTrainingComplete
}) => {
  const [selectedAvatarId, setSelectedAvatarId] = useState<string | null>(avatarId || null);
  const [isAvatarDetailsOpen, setIsAvatarDetailsOpen] = useState(false);

  const currentAvatarId = selectedAvatarId || avatarId;

  return (
    <div className="space-y-6">
      {/* Avatar Selection - only show if no avatarId prop provided */}
      {!avatarId && (
        <AvatarSelectorDropdown
          selectedAvatarId={selectedAvatarId}
          onSelectAvatar={setSelectedAvatarId}
        />
      )}

      {/* Avatar Details & Prompts - Collapsible */}
      {currentAvatarId && (
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
                <AvatarOverview avatarId={currentAvatarId} />
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}

      {/* Test Chat */}
      {currentAvatarId && avatarName && (
        <TestChat 
          avatarName={avatarName}
          isTraining={isTraining || false}
        />
      )}
    </div>
  );
};
