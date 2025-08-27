import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  Calendar, 
  DollarSign, 
  Check, 
  ArrowLeft,
  Sparkles,
  Users,
  Building
} from 'lucide-react';

const BillingSection = () => {
  const [showPricing, setShowPricing] = useState(false);

  if (showPricing) {
    return <PricingPage onBack={() => setShowPricing(false)} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Billing & Plans</h1>
        <p className="text-muted-foreground">
          Manage your subscription and billing information
        </p>
      </div>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Current Plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-green-600">Starter (Monthly)</h3>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="default" 
                size="sm"
                onClick={() => setShowPricing(true)}
              >
                Change plan
              </Button>
              <Button variant="outline" size="sm">
                Cancel plan
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 text-muted-foreground font-medium">Date</th>
                  <th className="text-left py-3 text-muted-foreground font-medium">Status</th>
                  <th className="text-right py-3 text-muted-foreground font-medium">Amount Due</th>
                </tr>
              </thead>
              <tbody className="space-y-2">
                <tr className="border-b">
                  <td className="py-4 text-muted-foreground">09 August, 2025</td>
                  <td className="py-4">
                    <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-300">
                      Completed
                    </Badge>
                  </td>
                  <td className="py-4 text-right text-muted-foreground">USD 25.92</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 text-muted-foreground">09 July, 2025</td>
                  <td className="py-4">
                    <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-300">
                      Completed
                    </Badge>
                  </td>
                  <td className="py-4 text-right text-muted-foreground">USD 25.92</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 text-muted-foreground">09 June, 2025</td>
                  <td className="py-4">
                    <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-300">
                      Completed
                    </Badge>
                  </td>
                  <td className="py-4 text-right text-muted-foreground">USD 25.92</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="flex justify-center mt-6">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" disabled>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button variant="default" size="sm" className="bg-primary text-primary-foreground">
                1
              </Button>
              <Button variant="ghost" size="sm" disabled>
                <ArrowLeft className="h-4 w-4 rotate-180" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">VISA</span>
              </div>
              <div>
                <p className="font-medium">Visa ending in 6661</p>
                <p className="text-sm text-muted-foreground">Expires May, 2032</p>
              </div>
            </div>
            <Button variant="default" size="sm">
              Change payment method
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const PricingPage = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="shrink-0"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Pricing</h1>
        </div>
      </div>

      {/* Features */}
      <div className="text-center space-y-4 mb-8">
        <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-primary flex items-center justify-center">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
            </div>
            24/7 support
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-primary flex items-center justify-center">
              <Check className="w-3 h-3 text-primary" />
            </div>
            30-day money-back guarantee
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-primary flex items-center justify-center">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
            </div>
            Cancel anytime
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Starter Plan */}
        <Card className="relative border-2 border-primary bg-gradient-to-br from-primary/10 to-primary/5">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-primary text-primary-foreground px-4 py-1 font-medium">
              MOST POPULAR
            </Badge>
          </div>
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-muted-foreground">STARTER</div>
              <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                30% OFF
              </Badge>
            </div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-2xl font-bold">2 Avatar IP</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Great for students, beginners, and enthusiasts to get started.
            </p>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground line-through">RM 999</div>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-bold">RM 588</span>
                <span className="text-muted-foreground">/mo</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Get 12 months for RM 4939.20 (regular price RM 7056). Renews at RM 588/mo.
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full" size="lg">
              Select plan
            </Button>
          </CardContent>
        </Card>

        {/* Hobbyist Plan */}
        <Card className="border-muted">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-muted-foreground">HOBBYIST/SMALL TEAM</div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-300">
                29% OFF
              </Badge>
            </div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users className="w-5 h-5 text-primary" />
              <span className="text-2xl font-bold">10 Avatar IP</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Ideal for freelancers and creators to turn ideas into side hustles.
            </p>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground line-through">RM 243.99</div>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-bold">RM 2288</span>
                <span className="text-muted-foreground">/mo</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Get 12 months for RM 19,493.76 (regular price RM 27,456). Renews at RM 2288/mo.
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full" size="lg">
              Select plan
            </Button>
          </CardContent>
        </Card>

        {/* Enterprise Plan */}
        <Card className="border-muted">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-muted-foreground">ENTERPRISE</div>
              <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-300">
                20% OFF
              </Badge>
            </div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Building className="w-5 h-5 text-primary" />
              <span className="text-2xl font-bold">Unlimited Avatar IP</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Built for startups, teams, and innovators seeking more flexibility.
            </p>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground line-through">RM 434.99</div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">Flexible Plans</div>
                <div className="text-xs text-muted-foreground">Custom Plans</div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full" size="lg">
              Select plan
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Features List */}
      <Card className="mt-8">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            Every plan has <span className="text-primary">everything you need</span> and more
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <FeatureItem text="KnowledgeBase Training" isNew />
              <FeatureItem text="Whatsapp Integration" />
              <FeatureItem text="Telegram Integration" />
              <FeatureItem text="Unlimited Workflow Call" />
              <FeatureItem text="Context Engineer Memory" />
            </div>
            <div className="space-y-4">
              <FeatureItem text="Hosting" isFree />
              <FeatureItem text="IP Management" />
              <FeatureItem text="Unlimited Version Control" />
              <FeatureItem text="Daily backups" />
              <FeatureItem text="GraphRAG Integration" />
            </div>
            <div className="space-y-4">
              <FeatureItem text="Supabase integration" />
              <FeatureItem text="Auto error fixer" />
              <FeatureItem text="Code editor" />
              <FeatureItem text="24/7 customer support" />
              <FeatureItem text="30-Day money-back guarantee" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const FeatureItem = ({ text, isNew = false, isFree = false }: { 
  text: string; 
  isNew?: boolean; 
  isFree?: boolean; 
}) => (
  <div className="flex items-center gap-3">
    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
      <Check className="w-3 h-3 text-green-600" />
    </div>
    <span className="text-sm">{text}</span>
    {isNew && (
      <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-300 text-xs px-2 py-0">
        NEW
      </Badge>
    )}
    {isFree && (
      <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-300 text-xs px-2 py-0">
        1 YEAR FREE
      </Badge>
    )}
  </div>
);

export default BillingSection;