
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, CheckCircle, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

import { AvatarDetailStep } from '@/components/avatar-creation/AvatarDetailStep';
import { AvatarPersonaStep } from '@/components/avatar-creation/AvatarPersonaStep';
import { BackstoryStep } from '@/components/avatar-creation/BackstoryStep';
import { KnowledgeBaseStep } from '@/components/avatar-creation/KnowledgeBaseStep';
import { HiddenRulesStep } from '@/components/avatar-creation/HiddenRulesStep';

const CreateAvatar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isCreating, setIsCreating] = useState(false);

  const [avatarData, setAvatarData] = useState({
    // Step 1: Avatar Detail
    name: '',
    avatarImages: [],
    originCountry: 'Malaysia',
    age: '',
    gender: '',
    primaryLanguage: 'English',
    secondaryLanguages: [],

    // Step 2: Avatar Persona
    personalityTraits: [],
    mbtiType: '',

    // Step 3: Backstory
    backstory: '',

    // Step 4: Knowledge Base
    knowledgeFiles: [],

    // Step 5: Hidden Rules
    hiddenRules: ''
  });

  const steps = [
    {
      title: 'Avatar Detail',
      description: 'Basic information and appearance',
      component: AvatarDetailStep
    },
    {
      title: 'Avatar Persona',
      description: 'Personality traits and characteristics',
      component: AvatarPersonaStep
    },
    {
      title: 'Backstory',
      description: 'Background and history',
      component: BackstoryStep
    },
    {
      title: 'Knowledge Base',
      description: 'Upload training documents',
      component: KnowledgeBaseStep
    },
    {
      title: 'Hidden Rules',
      description: 'Special instructions and constraints',
      component: HiddenRulesStep
    }
  ];

  const updateAvatarData = (field: string, value: any) => {
    console.log('Updating avatar data:', field, value);
    setAvatarData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateCurrentStep = () => {
    console.log('Validating step:', currentStep);
    console.log('Current avatar data:', avatarData);
    
    switch (currentStep) {
      case 0: // Avatar Detail
        if (!avatarData.name.trim()) {
          toast({
            title: "Validation Error",
            description: "Avatar name is required.",
            variant: "destructive"
          });
          return false;
        }
        if (!avatarData.originCountry) {
          toast({
            title: "Validation Error",
            description: "Origin country is required.",
            variant: "destructive"
          });
          return false;
        }
        if (!avatarData.age || parseInt(avatarData.age) < 1) {
          toast({
            title: "Validation Error",
            description: "Valid age is required.",
            variant: "destructive"
          });
          return false;
        }
        if (!avatarData.gender) {
          toast({
            title: "Validation Error",
            description: "Gender is required.",
            variant: "destructive"
          });
          return false;
        }
        if (!avatarData.primaryLanguage) {
          toast({
            title: "Validation Error",
            description: "Primary language is required.",
            variant: "destructive"
          });
          return false;
        }
        return true;
      case 1: // Avatar Persona
        console.log('Validating persona step. Personality traits:', avatarData.personalityTraits);
        console.log('MBTI Type:', avatarData.mbtiType);
        
        if (!avatarData.personalityTraits || avatarData.personalityTraits.length < 5) {
          toast({
            title: "Validation Error",
            description: "At least 5 personality traits are required.",
            variant: "destructive"
          });
          return false;
        }
        if (!avatarData.mbtiType) {
          toast({
            title: "Validation Error",
            description: "MBTI type selection is required.",
            variant: "destructive"
          });
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleCreateAvatar = async () => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to create an avatar.",
        variant: "destructive"
      });
      return;
    }

    if (!validateCurrentStep()) {
      return;
    }

    setIsCreating(true);
    try {
      // Upload avatar images to storage if any
      const uploadedImages: string[] = [];
      
      for (const imageUrl of avatarData.avatarImages) {
        if (imageUrl.startsWith('blob:')) {
          // This is a local blob URL, we need to upload it
          const response = await fetch(imageUrl);
          const blob = await response.blob();
          
          const fileExt = blob.type.split('/')[1] || 'jpg';
          const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
          
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(fileName, blob, {
              cacheControl: '3600',
              upsert: false
            });

          if (uploadError) {
            throw uploadError;
          }

          const { data: urlData } = supabase.storage
            .from('avatars')
            .getPublicUrl(fileName);

          uploadedImages.push(urlData.publicUrl);
        } else {
          // Already uploaded or external URL
          uploadedImages.push(imageUrl);
        }
      }

      // Save avatar to database
      const { data, error } = await supabase
        .from('avatars')
        .insert({
          user_id: user.id,
          name: avatarData.name,
          avatar_images: uploadedImages,
          origin_country: avatarData.originCountry,
          age: parseInt(avatarData.age),
          gender: avatarData.gender,
          primary_language: avatarData.primaryLanguage,
          secondary_languages: avatarData.secondaryLanguages,
          personality_traits: avatarData.personalityTraits,
          backstory: avatarData.backstory || null,
          knowledge_files: avatarData.knowledgeFiles,
          hidden_rules: avatarData.hiddenRules || null
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: "Avatar Created Successfully!",
        description: `${avatarData.name} has been created and saved.`,
      });

      // Navigate to the avatar detail page
      navigate(`/avatar/${data.id}`);

    } catch (error: any) {
      console.error('Error creating avatar:', error);
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create avatar. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Create New Avatar</h1>
            <p className="text-muted-foreground">Follow the steps to create your custom AI avatar</p>
          </div>
        </div>

        {/* Progress */}
        <Card className="mb-8">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
              </CardTitle>
              <Badge variant="outline">
                {Math.round(progress)}% Complete
              </Badge>
            </div>
            <CardDescription>{steps[currentStep].description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={progress} className="w-full" />
            
            {/* Step indicators */}
            <div className="flex justify-between mt-4">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-2 text-sm ${
                    index <= currentStep ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {index < currentStep ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : index === currentStep ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30" />
                  )}
                  <span className="hidden sm:inline">{step.title}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Current Step Content */}
        <CurrentStepComponent
          data={avatarData}
          onUpdate={updateAvatarData}
        />

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="flex gap-2">
            {currentStep < steps.length - 1 ? (
              <Button onClick={handleNext}>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handleCreateAvatar}
                disabled={isCreating}
                className="bg-primary hover:bg-primary/90"
              >
                {isCreating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Avatar...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Create Avatar
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAvatar;
