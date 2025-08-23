
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { AvatarDetailStep } from '@/components/avatar-creation/AvatarDetailStep';
import { AvatarPersonaStep } from '@/components/avatar-creation/AvatarPersonaStep';
import { BackstoryStep } from '@/components/avatar-creation/BackstoryStep';
import { KnowledgeBaseStep } from '@/components/avatar-creation/KnowledgeBaseStep';
import { HiddenRulesStep } from '@/components/avatar-creation/HiddenRulesStep';
import { useToast } from '@/hooks/use-toast';

const CreateAvatar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [avatarData, setAvatarData] = useState({
    // Step 1: Avatar Detail
    avatarImages: [],
    name: '',
    originCountry: 'Malaysia',
    age: '',
    gender: '',
    primaryLanguage: '',
    secondaryLanguages: [],
    
    // Step 2: Avatar Persona
    favorites: [],
    mbti: '',
    
    // Step 3: Backstory
    backstory: '',
    
    // Step 4: Knowledge Base
    knowledgeFiles: [],
    
    // Step 5: Hidden Rules
    hiddenRules: ''
  });

  const steps = [
    { id: 1, name: 'Avatar Detail', description: 'Basic information' },
    { id: 2, name: 'Avatar Persona', description: 'Personality & preferences' },
    { id: 3, name: 'Backstory', description: 'Character background' },
    { id: 4, name: 'Knowledge Base', description: 'Upload documents' },
    { id: 5, name: 'Hidden Rules', description: 'Special instructions' }
  ];

  const hasUnsavedData = () => {
    return (
      avatarData.name ||
      avatarData.age ||
      avatarData.gender ||
      avatarData.primaryLanguage ||
      avatarData.secondaryLanguages.length > 0 ||
      avatarData.avatarImages.length > 0 ||
      avatarData.favorites.length > 0 ||
      avatarData.mbti ||
      avatarData.backstory ||
      avatarData.knowledgeFiles.length > 0 ||
      avatarData.hiddenRules
    );
  };

  const updateAvatarData = (field: string, value: any) => {
    setAvatarData(prev => ({ ...prev, [field]: value }));
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        if (!avatarData.name || !avatarData.age || !avatarData.gender || !avatarData.primaryLanguage) {
          toast({
            title: "Missing Information",
            description: "Please fill in all required fields in Avatar Detail.",
            variant: "destructive"
          });
          return false;
        }
        break;
      case 2:
        if (avatarData.favorites.length < 5 || !avatarData.mbti) {
          toast({
            title: "Missing Information",
            description: "Please select at least 5 favorites and choose an MBTI type.",
            variant: "destructive"
          });
          return false;
        }
        break;
      case 3:
        if (!avatarData.backstory.trim()) {
          toast({
            title: "Missing Information",
            description: "Please provide a backstory for your avatar.",
            variant: "destructive"
          });
          return false;
        }
        break;
    }
    return true;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep === 5) {
        handleCreateAvatar();
      } else {
        setCurrentStep(prev => prev + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleBackToMyAvatar = () => {
    if (hasUnsavedData()) {
      setShowExitDialog(true);
    } else {
      navigate('/dashboard', { state: { activeSection: 'my-avatar' } });
    }
  };

  const handleCreateAvatar = () => {
    // Save avatar to localStorage (later will be replaced with Supabase)
    const savedAvatars = JSON.parse(localStorage.getItem('myAvatars') || '[]');
    const newAvatar = {
      id: Date.now().toString(),
      ...avatarData,
      progress: {
        chatbot: false,
        tts: false,
        images: false,
        avatar: false
      },
      createdAt: new Date().toISOString()
    };
    
    savedAvatars.push(newAvatar);
    localStorage.setItem('myAvatars', JSON.stringify(savedAvatars));
    
    toast({
      title: "Avatar Created!",
      description: `${avatarData.name} has been created successfully.`,
    });
    
    navigate('/dashboard', { state: { activeSection: 'my-avatar' } });
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <AvatarDetailStep data={avatarData} onUpdate={updateAvatarData} />;
      case 2:
        return <AvatarPersonaStep data={avatarData} onUpdate={updateAvatarData} />;
      case 3:
        return <BackstoryStep data={avatarData} onUpdate={updateAvatarData} />;
      case 4:
        return <KnowledgeBaseStep data={avatarData} onUpdate={updateAvatarData} />;
      case 5:
        return <HiddenRulesStep data={avatarData} onUpdate={updateAvatarData} />;
      default:
        return null;
    }
  };

  // Handle browser back button
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedData()) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    const handlePopState = (e: PopStateEvent) => {
      if (hasUnsavedData()) {
        e.preventDefault();
        setShowExitDialog(true);
        window.history.pushState(null, '', window.location.pathname);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
    
    // Push initial state
    window.history.pushState(null, '', window.location.pathname);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [avatarData]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handleBackToMyAvatar}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to My Avatar
            </Button>
            <h1 className="text-2xl font-bold">Create New Avatar</h1>
            <div className="w-32" /> {/* Spacer */}
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep > step.id 
                      ? 'bg-primary text-primary-foreground' 
                      : currentStep === step.id 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                  }`}>
                    {currentStep > step.id ? <Check className="w-4 h-4" /> : step.id}
                  </div>
                  <div className="ml-3 text-left">
                    <p className={`text-sm font-medium ${currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {step.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-px w-12 mx-4 ${currentStep > step.id ? 'bg-primary' : 'bg-border'}`} />
                )}
              </div>
            ))}
          </div>
          <Progress value={(currentStep / steps.length) * 100} className="h-2" />
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {renderCurrentStep()}
        </div>
      </div>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            <Button onClick={handleNext} className="btn-hero">
              {currentStep === 5 ? 'Create Avatar' : 'Next'}
              {currentStep < 5 && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Exit Confirmation Dialog */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              Your avatar creation is not complete yet. All the details you've entered will be lost if you leave now. 
              Are you sure you want to go back to My Avatar page?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Stay and Continue</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => navigate('/dashboard', { state: { activeSection: 'my-avatar' } })}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Yes, Discard Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bottom padding to account for fixed navigation */}
      <div className="h-20" />
    </div>
  );
};

export default CreateAvatar;
