
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, User, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

import { AvatarDetailStep } from '@/components/avatar-creation/AvatarDetailStep';
import { AvatarPersonaStep } from '@/components/avatar-creation/AvatarPersonaStep';
import { BackstoryStep } from '@/components/avatar-creation/BackstoryStep';
import { HiddenRulesStep } from '@/components/avatar-creation/HiddenRulesStep';
import { KnowledgeBaseStep } from '@/components/avatar-creation/KnowledgeBaseStep';
import { AvatarCreationLoading } from '@/components/ui/avatar-creation-loading';

const CreateAvatar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isCreating, setIsCreating] = useState(false);
  const [creationStatus, setCreationStatus] = useState<'creating' | 'success' | 'error'>('creating');
  const [creationProgress, setCreationProgress] = useState(0);
  const [createdAvatarId, setCreatedAvatarId] = useState<string | null>(null);

  const [avatarData, setAvatarData] = useState({
    name: '',
    age: null,
    gender: '',
    originCountry: 'Malaysia',
    primaryLanguage: 'English',
    secondaryLanguages: [],
    avatarImages: [],
    personalityTraits: [],
    mbtiType: '',
    backstory: '',
    hiddenRules: '',
  });

  const steps = [
    {
      title: 'Avatar Details',
      component: AvatarDetailStep,
      description: 'Basic information about your avatar'
    },
    {
      title: 'Personality',
      component: AvatarPersonaStep,
      description: 'Define personality traits and characteristics'
    },
    {
      title: 'Backstory',
      component: BackstoryStep,
      description: 'Create a detailed background story'
    },
    {
      title: 'Hidden Rules',
      component: HiddenRulesStep,
      description: 'Set behavior guidelines and constraints'
    },
    {
      title: 'Knowledge Base',
      component: KnowledgeBaseStep,
      description: 'Upload documents for specialized knowledge'
    }
  ];

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const updateAvatarData = (field: string, value: any) => {
    setAvatarData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateProgress = () => {
    // Progress should be 0% at step 0, then increment by 20% for each step
    return (currentStep / steps.length) * 100;
  };

  const isStepValid = (stepIndex: number) => {
    switch (stepIndex) {
      case 0: // Avatar Details
        return avatarData.name.trim() !== '' && avatarData.age && avatarData.gender;
      case 1: // Personality
        return avatarData.personalityTraits.length > 0;
      case 2: // Backstory
        return avatarData.backstory.trim() !== '';
      case 3: // Hidden Rules
        return true; // Optional step
      case 4: // Knowledge Base
        return true; // Optional step
      default:
        return false;
    }
  };

  const canProceed = () => {
    return isStepValid(currentStep);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCreateAvatar = async () => {
    if (!user) return;

    setIsCreating(true);
    setCreationStatus('creating');
    setCreationProgress(0);

    try {
      // Simulate progress during creation
      const progressInterval = setInterval(() => {
        setCreationProgress(prev => {
          const next = prev + 5;
          return next > 90 ? 90 : next;
        });
      }, 1000);

      const { data, error } = await supabase
        .from('avatars')
        .insert({
          user_id: user.id,
          name: avatarData.name,
          age: avatarData.age,
          gender: avatarData.gender,
          origin_country: avatarData.originCountry,
          primary_language: avatarData.primaryLanguage,
          secondary_languages: avatarData.secondaryLanguages,
          avatar_images: avatarData.avatarImages,
          personality_traits: avatarData.personalityTraits,
          mbti_type: avatarData.mbtiType,
          backstory: avatarData.backstory,
          hidden_rules: avatarData.hiddenRules,
        })
        .select()
        .single();

      clearInterval(progressInterval);
      setCreationProgress(100);

      if (error) {
        throw error;
      }

      setCreatedAvatarId(data.id);
      setCreationStatus('success');
      
      toast({
        title: "Avatar Created Successfully!",
        description: `${avatarData.name} has been created and is ready to use.`,
      });

      // Redirect to avatar detail page after a short delay
      setTimeout(() => {
        navigate(`/avatar/${data.id}`);
      }, 2000);

    } catch (error: any) {
      console.error('Error creating avatar:', error);
      setCreationStatus('error');
      
      toast({
        title: "Failed to Create Avatar",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (!user) {
    return null;
  }

  if (isCreating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <div className="container mx-auto max-w-2xl py-8">
          <AvatarCreationLoading 
            status={creationStatus}
            progress={creationProgress}
            message={
              creationStatus === 'creating' ? `Creating ${avatarData.name}...` :
              creationStatus === 'success' ? `${avatarData.name} created successfully!` :
              'Failed to create avatar'
            }
          />
          
          {creationStatus === 'success' && (
            <div className="mt-6 text-center">
              <Button
                onClick={() => navigate(`/avatar/${createdAvatarId}`)}
                className="btn-hero"
              >
                View Avatar
              </Button>
            </div>
          )}
          
          {creationStatus === 'error' && (
            <div className="mt-6 text-center space-x-4">
              <Button
                onClick={() => {
                  setIsCreating(false);
                  setCreationProgress(0);
                }}
                variant="outline"
              >
                Try Again
              </Button>
              <Button
                onClick={() => navigate('/dashboard?section=avatars')}
                className="btn-hero"
              >
                Back to My Avatars
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="container mx-auto max-w-4xl py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard?section=avatars')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to My Avatars
            </Button>
            <Badge variant="outline">
              Step {currentStep + 1} of {steps.length}
            </Badge>
          </div>
          
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
              <User className="h-8 w-8" />
              Create New Avatar
            </h1>
            <p className="text-muted-foreground">
              {steps[currentStep].description}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{steps[currentStep].title}</span>
              <span>{Math.round(calculateProgress())}% Complete</span>
            </div>
            <Progress value={calculateProgress()} className="h-2" />
          </div>
        </div>

        {/* Step Content */}
        <div className="mb-8">
          <CurrentStepComponent
            data={avatarData}
            onUpdate={updateAvatarData}
          />
        </div>

        {/* Navigation */}
        <Card className="card-modern">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>

              <div className="flex items-center gap-2">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === currentStep
                        ? 'bg-primary'
                        : index < currentStep
                        ? 'bg-green-500'
                        : 'bg-muted'
                    }`}
                  />
                ))}
              </div>

              {currentStep === steps.length - 1 ? (
                <Button
                  onClick={handleCreateAvatar}
                  disabled={!canProceed() || !avatarData.name.trim()}
                  className="btn-hero flex items-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Create Avatar
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="btn-hero flex items-center gap-2"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateAvatar;
