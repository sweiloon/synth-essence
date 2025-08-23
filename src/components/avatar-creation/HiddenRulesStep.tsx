
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';

const hiddenRulesTemplates = [
  {
    title: "Sales Representative",
    description: "Build relationships first, then guide to specific products",
    content: "As a sales representative, your primary goal is to build genuine relationships with customers before attempting any sales. Start conversations by understanding their needs, challenges, and preferences. Show empathy and provide valuable insights related to their situation. Once trust is established, naturally guide the conversation toward our premium product line, highlighting how it specifically addresses their mentioned concerns. Never appear pushy or overly sales-focused. Use storytelling and social proof to demonstrate value rather than just listing features."
  },
  {
    title: "Customer Support Agent",
    description: "Resolve issues while identifying upselling opportunities",
    content: "While your primary role is to provide excellent customer support and resolve issues efficiently, you should also identify opportunities to introduce customers to additional services or upgrades that could benefit them. When helping customers, subtly assess their usage patterns and needs. If appropriate, mention relevant premium features or services that could enhance their experience. Frame these suggestions as helpful recommendations rather than sales pitches, and always prioritize issue resolution first."
  },
  {
    title: "Financial Advisor",
    description: "Educate clients while steering toward premium investment products",
    content: "Your role is to provide valuable financial education and build trust with clients. Focus on understanding their financial goals, risk tolerance, and current situation. Provide genuine, helpful advice about financial planning and investment strategies. When appropriate, naturally introduce our premium investment products that align with their goals, emphasizing long-term value and exclusive benefits. Always maintain professional integrity and ensure recommendations truly benefit the client."
  },
  {
    title: "Real Estate Agent",
    description: "Build relationships and guide clients to premium properties",
    content: "As a real estate professional, your goal is to understand clients' lifestyle needs and preferences deeply. Build rapport by asking about their family, work, and future plans. Show genuine interest in their housing needs and provide valuable market insights. When showing properties, subtly emphasize the premium locations and high-end features that match their expressed desires. Create emotional connections to properties by helping them envision their life there."
  },
  {
    title: "Educational Consultant",
    description: "Provide value while promoting premium educational programs",
    content: "Your primary focus is to provide valuable educational guidance and support to students or parents. Understand their academic goals, learning challenges, and career aspirations. Offer genuine advice about study strategies, career paths, and educational opportunities. When discussing educational options, naturally highlight our premium programs and courses that align with their goals, emphasizing unique benefits and success outcomes."
  }
];

interface HiddenRulesStepProps {
  data: any;
  onUpdate: (data: any) => void;
}

const HiddenRulesStep = ({ data, onUpdate }: HiddenRulesStepProps) => {
  const handleTemplateSelect = (template: string) => {
    onUpdate({ hiddenRules: template });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-amber-50 border-amber-200">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2 text-amber-800">
            <EyeOff className="h-4 w-4" />
            Hidden Rules (Optional)
          </CardTitle>
          <CardDescription className="text-amber-700">
            This section is for internal guidelines that your avatar will follow but won't explicitly mention to users.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="space-y-2">
        <Label htmlFor="hiddenRules" className="text-lg font-semibold">Hidden Rules & Guidelines</Label>
        <p className="text-sm text-muted-foreground">
          Define secret objectives or guidelines for your avatar's behavior (e.g., sales targets, relationship building strategies).
        </p>
        <Textarea
          id="hiddenRules"
          placeholder="Enter hidden rules and guidelines here..."
          value={data.hiddenRules}
          onChange={(e) => onUpdate({ hiddenRules: e.target.value })}
          className="min-h-[150px] resize-y"
        />
        <div className="text-xs text-muted-foreground">
          Characters: {data.hiddenRules.length}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="text-lg font-semibold">Hidden Rules Templates</Label>
          <p className="text-sm text-muted-foreground">
            Click on any template to auto-fill the hidden rules text box
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-80 overflow-y-auto">
          {hiddenRulesTemplates.map((template, index) => (
            <Card
              key={index}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleTemplateSelect(template.content)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{template.title}</CardTitle>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {template.content.substring(0, 120)}...
                </p>
                <Button variant="outline" size="sm" className="mt-2 w-full">
                  Use This Template
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card className="bg-gray-50 border-gray-200">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2 text-gray-800">
            <Eye className="h-4 w-4" />
            Privacy Notice
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700">
            Hidden rules are internal guidelines that help shape your avatar's behavior. 
            They won't be visible to end users but will influence how your avatar responds and interacts.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default HiddenRulesStep;
