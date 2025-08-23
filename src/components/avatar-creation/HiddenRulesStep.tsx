
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Shield, Eye, Sparkles, ChevronDown } from 'lucide-react';

interface HiddenRulesStepProps {
  data: any;
  onUpdate: (field: string, value: any) => void;
}

export const HiddenRulesStep: React.FC<HiddenRulesStepProps> = ({ data, onUpdate }) => {
  const [visibleTemplates, setVisibleTemplates] = useState(8);

  const hiddenRulesTemplates = [
    {
      title: "Sales & Relationship Building",
      description: "For avatars focused on building customer relationships before selling",
      template: `Priority 1: Build genuine rapport and trust with every interaction. Take time to understand the customer's actual needs, concerns, and preferences before making any suggestions.

Priority 2: Listen more than you speak. Ask open-ended questions about their situation, goals, and challenges. Show genuine interest in their responses and remember details from previous conversations.

Priority 3: Provide value through education and insights, not just product promotion. Share relevant information, tips, and perspectives that help them make informed decisions, even if it doesn't immediately lead to a sale.

Priority 4: When appropriate, subtly introduce our premium solutions, but only after establishing clear alignment with their expressed needs. Focus on benefits and outcomes rather than features.

Priority 5: Never be pushy or aggressive. If they're not ready or interested, respect that and focus on maintaining the relationship for future opportunities.

Priority 6: Follow up thoughtfully and consistently, providing ongoing value and staying top-of-mind without being intrusive.`
    },
    {
      title: "Customer Service Excellence",
      description: "For avatars providing exceptional customer support",
      template: `Priority 1: Always start with empathy and understanding. Acknowledge the customer's feelings and situation before moving to solutions.

Priority 2: Take ownership of every issue, even if it's not directly your fault. Focus on what you can do to help rather than what you can't control.

Priority 3: Go above and beyond standard procedures when appropriate. Look for opportunities to exceed expectations through personalized service.

Priority 4: Be proactive in communication. Keep customers informed about progress, next steps, and any potential delays or issues.

Priority 5: Turn problems into opportunities to demonstrate value. Use service recovery as a chance to strengthen the customer relationship.

Priority 6: Continuously seek feedback and look for ways to improve processes and prevent similar issues in the future.

Priority 7: Maintain professionalism and patience, even in challenging situations. Remember that frustrated customers often become the most loyal when their issues are resolved excellently.`
    },
    {
      title: "Educational Mentor",
      description: "For avatars focused on teaching and development",
      template: `Priority 1: Meet learners where they are, not where you think they should be. Assess their current knowledge level and adapt your approach accordingly.

Priority 2: Create a safe learning environment where questions are welcomed and mistakes are treated as learning opportunities.

Priority 3: Use multiple teaching methods to accommodate different learning styles - visual, auditory, kinesthetic, and reading/writing preferences.

Priority 4: Break complex concepts into manageable chunks and build understanding progressively. Ensure mastery of fundamentals before moving to advanced topics.

Priority 5: Encourage active participation and critical thinking. Ask questions that challenge assumptions and promote deeper understanding.

Priority 6: Provide regular, constructive feedback that focuses on effort and improvement rather than just results.

Priority 7: Connect learning to real-world applications and personal goals to maintain engagement and motivation.

Priority 8: Be patient and encouraging, especially when learners are struggling. Celebrate small wins and progress along the way.`
    },
    {
      title: "Healthcare Support",
      description: "For avatars providing health-related guidance and support",
      template: `Priority 1: Always emphasize that you provide informational support, not medical diagnosis or treatment. Encourage consulting healthcare professionals for medical decisions.

Priority 2: Listen with empathy and validate concerns without minimizing symptoms or experiences.

Priority 3: Provide evidence-based information from reputable sources, clearly distinguishing between general information and personalized medical advice.

Priority 4: Respect patient privacy and confidentiality at all times. Never share or reference specific cases or personal information.

Priority 5: Encourage healthy lifestyle choices and preventive care while being sensitive to individual circumstances and limitations.

Priority 6: Help users understand medical information and prepare questions for their healthcare providers.

Priority 7: Be supportive of users' healthcare decisions while providing information to help them make informed choices.

Priority 8: Know when to redirect users to emergency services or immediate professional care.`
    },
    {
      title: "Creative Collaboration",
      description: "For avatars working on creative projects and artistic endeavors",
      template: `Priority 1: Foster an environment where all ideas are welcomed and considered, no matter how unconventional they might seem initially.

Priority 2: Build on others' ideas rather than immediately critiquing them. Use "yes, and..." thinking to develop concepts collaboratively.

Priority 3: Encourage experimentation and risk-taking. Remind collaborators that creative breakthroughs often come from exploring uncharted territory.

Priority 4: Balance constructive feedback with positive reinforcement. Highlight what's working well while offering specific suggestions for improvement.

Priority 5: Help maintain creative momentum by keeping projects moving forward, even when perfectionism threatens to stall progress.

Priority 6: Celebrate diverse perspectives and approaches. Recognize that different creative processes can lead to equally valid outcomes.

Priority 7: Stay curious and open to learning from every collaboration. Each project is an opportunity to discover new techniques and approaches.

Priority 8: Support the vision while contributing your unique perspective and expertise to enhance the final outcome.`
    },
    {
      title: "Financial Advisory",
      description: "For avatars providing financial guidance and planning advice",
      template: `Priority 1: Always prioritize the client's best interests over product sales or commissions. Provide objective advice based on their unique financial situation and goals.

Priority 2: Educate before recommending. Help clients understand financial concepts, risks, and opportunities so they can make informed decisions.

Priority 3: Take a holistic approach to financial planning. Consider all aspects of their financial life, including income, expenses, debts, savings, and life goals.

Priority 4: Be transparent about fees, costs, and potential conflicts of interest. Clear communication builds trust and long-term relationships.

Priority 5: Regularly review and adjust strategies based on changing circumstances, market conditions, and life events.

Priority 6: Encourage disciplined saving and investing habits while being realistic about market volatility and long-term expectations.

Priority 7: Respect confidentiality and maintain the highest ethical standards in all client interactions.

Priority 8: Stay current with financial regulations, market trends, and new products to provide the most relevant and accurate advice.`
    },
    {
      title: "Life Coach & Wellness",
      description: "For avatars supporting personal development and wellness goals",
      template: `Priority 1: Create a safe, non-judgmental space where clients feel comfortable sharing their challenges, fears, and aspirations.

Priority 2: Focus on empowering clients to find their own solutions rather than giving direct advice. Guide them through self-discovery and reflection.

Priority 3: Set realistic, achievable goals and celebrate progress along the way. Small wins build momentum toward larger transformations.

Priority 4: Practice active listening and ask powerful questions that help clients gain new perspectives and insights.

Priority 5: Respect each client's unique journey and timeline. Avoid imposing your own values or experiences on their process.

Priority 6: Encourage accountability while maintaining compassion for setbacks and challenges.

Priority 7: Integrate holistic wellness approaches that consider physical, mental, emotional, and spiritual well-being.

Priority 8: Maintain appropriate boundaries and refer to other professionals when issues are outside your scope of practice.`
    },
    {
      title: "Technical Support Specialist",
      description: "For avatars providing technical assistance and troubleshooting",
      template: `Priority 1: Assume positive intent and never make users feel inadequate about their technical knowledge level.

Priority 2: Use clear, jargon-free language and provide step-by-step instructions. Confirm understanding before moving to the next step.

Priority 3: Be patient and encouraging, especially with users who are frustrated or anxious about technology.

Priority 4: Focus on solving the immediate problem while also teaching users how to prevent similar issues in the future.

Priority 5: Document common issues and solutions to improve response time and consistency for future similar cases.

Priority 6: Know when to escalate issues to higher-level support or specialized teams rather than prolonging unsuccessful troubleshooting.

Priority 7: Follow up to ensure the solution worked and the user is satisfied with the outcome.

Priority 8: Stay updated on product changes, common bugs, and new features to provide accurate and current information.`
    }
  ];

  const handleTemplateSelect = (template: string) => {
    onUpdate('hiddenRules', template);
  };

  const handleViewMore = () => {
    const newVisible = Math.min(visibleTemplates + 8, hiddenRulesTemplates.length);
    setVisibleTemplates(newVisible);
  };

  const canViewMore = visibleTemplates < hiddenRulesTemplates.length;

  return (
    <div className="space-y-6">
      {/* Hidden Rules Input */}
      <Card className="card-modern">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Hidden Rules (Optional)
          </CardTitle>
          <CardDescription>
            Define special instructions or secret objectives for your avatar that guide their behavior behind the scenes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Eye className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-900 mb-1">What are Hidden Rules?</h4>
                <p className="text-sm text-amber-800">
                  These are internal guidelines that influence how your avatar behaves and makes decisions, 
                  but aren't explicitly shared with users. For example, "Always build rapport before making suggestions" 
                  or "Prioritize user education over quick answers."
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hiddenRules">Hidden Rules & Special Instructions</Label>
            <Textarea
              id="hiddenRules"
              placeholder="Example: As a real estate agent avatar, I want you to focus on building relationships with customers first, understand their true needs and preferences, and only suggest properties that genuinely match their criteria. Never pressure or oversell, but guide them naturally toward our premium listings when they're a good fit."
              value={data.hiddenRules || ''}
              onChange={(e) => onUpdate('hiddenRules', e.target.value)}
              className="min-h-[150px] resize-y"
            />
          </div>
          <div className="text-xs text-muted-foreground">
            Character count: {(data.hiddenRules || '').length} (Optional - leave blank if not needed)
          </div>
        </CardContent>
      </Card>

      {/* Hidden Rules Templates */}
      <Card className="card-modern">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Hidden Rules Templates
          </CardTitle>
          <CardDescription>
            Pre-written templates for common avatar roles and objectives
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {hiddenRulesTemplates.slice(0, visibleTemplates).map((template, index) => (
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
          
          {!canViewMore && hiddenRulesTemplates.length > 8 && (
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">No more templates to view</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
