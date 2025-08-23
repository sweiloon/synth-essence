
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Zap, Wand2, Palette, Camera, Video } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const AvatarSection = () => {
  const { toast } = useToast();
  const [comingSoonDialog, setComingSoonDialog] = React.useState(false);

  const handleFeatureClick = (featureName: string) => {
    setComingSoonDialog(true);
  };

  const features = [
    {
      icon: User,
      title: "3D Avatar Generator",
      description: "Create lifelike 3D avatars from photos",
      action: () => handleFeatureClick("3D Avatar Generator")
    },
    {
      icon: Wand2,
      title: "Style Transfer",
      description: "Apply different artistic styles to your avatar",
      action: () => handleFeatureClick("Style Transfer")
    },
    {
      icon: Palette,
      title: "Customization Tools",
      description: "Fine-tune appearance, clothing, and accessories",
      action: () => handleFeatureClick("Customization Tools")
    },
    {
      icon: Camera,
      title: "Photo Enhancement",
      description: "Improve photo quality for better avatar generation",
      action: () => handleFeatureClick("Photo Enhancement")
    },
    {
      icon: Video,
      title: "Animation Creator",
      description: "Create animated expressions and gestures",
      action: () => handleFeatureClick("Animation Creator")
    },
    {
      icon: Zap,
      title: "Quick Generator",
      description: "Generate avatars instantly with AI",
      action: () => handleFeatureClick("Quick Generator")
    }
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <User className="h-5 w-5" />
          AI Avatar Designer
        </h1>
        <p className="text-sm text-muted-foreground">
          Create and customize your AI avatars with advanced tools
        </p>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map((feature, index) => (
          <Card key={index} className="card-modern cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]" onClick={feature.action}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <feature.icon className="h-4 w-4" />
                {feature.title}
              </CardTitle>
              <CardDescription className="text-sm">
                {feature.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full text-sm h-8" onClick={(e) => { e.stopPropagation(); feature.action(); }}>
                Try Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info Section */}
      <Card className="card-modern">
        <CardHeader>
          <CardTitle className="text-base">Getting Started</CardTitle>
          <CardDescription className="text-sm">
            Follow these steps to create your perfect AI avatar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">1. Upload Your Photos</h4>
            <p className="text-xs text-muted-foreground">
              Upload clear, high-quality photos for best results
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-sm">2. Choose Your Style</h4>
            <p className="text-xs text-muted-foreground">
              Select from various artistic styles and customization options
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-sm">3. Generate & Refine</h4>
            <p className="text-xs text-muted-foreground">
              Let AI create your avatar and make final adjustments
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Coming Soon Dialog */}
      <Dialog open={comingSoonDialog} onOpenChange={setComingSoonDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-base">Coming Soon</DialogTitle>
            <DialogDescription className="text-sm">
              This feature is currently under development and will be available soon!
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={() => setComingSoonDialog(false)} className="text-sm h-9">
              Got it
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AvatarSection;
