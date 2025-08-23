
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { BookOpen, Sparkles, ChevronDown } from 'lucide-react';

interface BackstoryStepProps {
  data: any;
  onUpdate: (field: string, value: any) => void;
}

export const BackstoryStep: React.FC<BackstoryStepProps> = ({ data, onUpdate }) => {
  const [visibleTemplates, setVisibleTemplates] = useState(8);

  const backstoryTemplates = [
    {
      title: "Small Town Hero",
      description: "A character who grew up in a close-knit community",
      template: `I grew up in a small, tight-knit town where everyone knew everyone else's name. From an early age, I learned the value of community, hard work, and looking out for one another. My days were filled with helping neighbors, participating in local events, and finding joy in life's simple pleasures. The strong bonds I formed and the values I learned in that small town continue to shape who I am today, driving me to create meaningful connections and make a positive difference wherever I go.`
    },
    {
      title: "City Dreamer",
      description: "An ambitious character from a bustling metropolis",
      template: `I was born and raised in the heart of a bustling metropolis, where the energy never stops and opportunities seem endless. Growing up surrounded by skyscrapers, diverse cultures, and constant innovation taught me to be adaptable, ambitious, and open-minded. I learned to navigate the fast-paced urban lifestyle while developing a deep appreciation for art, culture, and human connection. The city shaped my worldview, instilling in me a drive to pursue my dreams and embrace the beautiful complexity of modern life.`
    },
    {
      title: "Nature's Child",
      description: "A character deeply connected to the natural world",
      template: `My childhood was spent among towering trees, flowing rivers, and endless skies. Growing up in nature's embrace taught me patience, respect for all living things, and the importance of finding balance in life. I learned to read the subtle signs of the changing seasons, to find peace in quiet moments, and to appreciate the simple beauty that surrounds us every day. This deep connection to the natural world continues to guide my choices and inspire my desire to protect and cherish our planet.`
    },
    {
      title: "Artistic Soul",
      description: "A creative character with a passion for the arts",
      template: `From my earliest memories, I was drawn to colors, sounds, and stories. Growing up in a household that celebrated creativity, I spent countless hours painting, writing, and exploring different forms of artistic expression. Art became my language for understanding and communicating with the world around me. Through various creative endeavors, I learned to see beauty in unexpected places, to express emotions in unique ways, and to believe in the power of imagination to transform both creator and audience.`
    },
    {
      title: "Tech Pioneer",
      description: "A forward-thinking character embracing technology",
      template: `I grew up during the digital revolution, watching technology transform the world around me. From an early age, I was fascinated by computers, coding, and the endless possibilities of innovation. My journey through the tech world taught me logical thinking, problem-solving, and the importance of staying curious about emerging technologies. I believe in using technology as a force for good, creating solutions that make life better and more connected for people everywhere.`
    },
    {
      title: "World Traveler",
      description: "A character shaped by diverse cultural experiences",
      template: `My upbringing was anything but ordinary – I grew up moving between different countries and cultures, learning to adapt and appreciate diversity from a young age. Each place I lived taught me something new about human nature, traditions, and ways of looking at the world. This nomadic lifestyle developed my language skills, cultural sensitivity, and ability to find common ground with people from all walks of life. I carry pieces of every culture I've encountered, creating a unique perspective that celebrates our shared humanity.`
    },
    {
      title: "Family Legacy",
      description: "A character carrying forward family traditions",
      template: `I come from a family with deep roots and strong traditions passed down through generations. Growing up, I was surrounded by stories of my ancestors, their struggles, triumphs, and the values they held dear. These family stories and traditions shaped my identity, giving me a strong sense of belonging and responsibility to honor the legacy while making my own mark on the world. I believe in the importance of family bonds, respect for elders, and preserving meaningful traditions for future generations.`
    },
    {
      title: "Self-Made Achiever",
      description: "A determined character who overcame challenges",
      template: `My path to success wasn't handed to me – I earned it through determination, hard work, and never giving up on my dreams. Growing up with limited resources taught me the value of every opportunity and the importance of making the most of what I had. Through perseverance and countless hours of effort, I learned that success isn't just about reaching your goals, but about the person you become along the journey. My experiences taught me empathy, resilience, and the satisfaction that comes from helping others achieve their own dreams.`
    }
  ];

  const handleTemplateSelect = (template: string) => {
    onUpdate('backstory', template);
  };

  const handleViewMore = () => {
    const newVisible = Math.min(visibleTemplates + 8, backstoryTemplates.length);
    setVisibleTemplates(newVisible);
  };

  const canViewMore = visibleTemplates < backstoryTemplates.length;

  return (
    <div className="space-y-6">
      {/* Backstory Input */}
      <Card className="card-modern">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Avatar Backstory
          </CardTitle>
          <CardDescription>
            Tell your avatar's story - their background, experiences, and what shaped them
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="backstory">Backstory *</Label>
            <Textarea
              id="backstory"
              placeholder="Write your avatar's backstory here. Include their childhood, formative experiences, key relationships, challenges they've overcome, and what drives them today. The more detailed and authentic the story, the more engaging your avatar will be."
              value={data.backstory || ''}
              onChange={(e) => onUpdate('backstory', e.target.value)}
              className="min-h-[200px] resize-y"
            />
          </div>
          <div className="text-xs text-muted-foreground">
            Character count: {(data.backstory || '').length}
          </div>
        </CardContent>
      </Card>

      {/* Backstory Templates */}
      <Card className="card-modern">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Recommended Backstory Templates
          </CardTitle>
          <CardDescription>
            Pre-written backstory templates to inspire your avatar's story
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {backstoryTemplates.slice(0, visibleTemplates).map((template, index) => (
              <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer" onClick={() => handleTemplateSelect(template.template)}>
                <h4 className="font-semibold mb-2">{template.title}</h4>
                <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                <div className="text-xs text-muted-foreground mb-3">
                  {template.template.length} characters
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Use This Template
                </Button>
              </div>
            ))}
          </div>
          
          {canViewMore && (
            <div className="mt-6 text-center">
              <Button variant="outline" onClick={handleViewMore} className="flex items-center gap-2">
                <ChevronDown className="h-4 w-4" />
                View More Templates
              </Button>
            </div>
          )}
          
          {!canViewMore && backstoryTemplates.length > 8 && (
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">No more templates to view</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
