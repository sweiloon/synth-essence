
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AvatarDetailStep from '@/components/avatar-creation/AvatarDetailStep';
import AvatarPersonaStep from '@/components/avatar-creation/AvatarPersonaStep';
import BackstoryStep from '@/components/avatar-creation/BackstoryStep';
import KnowledgeBaseStep from '@/components/avatar-creation/KnowledgeBaseStep';
import HiddenRulesStep from '@/components/avatar-creation/HiddenRulesStep';
import { useToast } from '@/hooks/use-toast';

const CreateAvatar = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [avatarData, setAvatarData] = useState({
    // Step 1: Avatar Details
    name: '',
    age: '',
    gender: '',
    languages: [],
    // Step 2: Persona
    favorites: [],
    mbti: '',
    // Step 3: Backstory
    backstory: '',
    // Step 4: Knowledge Base
    knowledgeFiles: [],
    // Step 5: Hidden Rules
    hiddenRules: ''
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const steps = [
    { id: 1, title: 'Avatar Detail', completed: false },
    { id: 2, title: 'Avatar Persona', completed: false },
    { id: 3, title: 'Backstory', completed: false },
    { id: 4, title: 'Knowledge Base', completed: false },
    { id: 5, title: 'Hidden Rules', completed: false }
  ];

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      handleCreateAvatar();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCreateAvatar = () => {
    // Get existing avatars from localStorage
    const existingAvatars = JSON.parse(localStorage.getItem('myAvatars') || '[]');
    
    // Create new avatar object
    const newAvatar = {
      id: Date.now().toString(),
      ...avatarData,
      images: [], // Will be added later in image upload feature
      progress: {
        chatbot: false,
        tts: false,
        images: false,
        avatar: false
      },
      createdAt: new Date().toISOString()
    };

    // Save to localStorage
    const updatedAvatars = [...existingAvatars, newAvatar];
    localStorage.setItem('myAvatars', JSON.stringify(updatedAvatars));
    
    toast({
      title: "Avatar Created!",
      description: `${avatarData.name} has been created successfully.`,
    });
    
    navigate('/dashboard', { state: { activeSection: 'my-avatar' } });
  };

  const updateAvatarData = (stepData: any) => {
    setAvatarData(prev => ({ ...prev, ...stepData }));
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return avatarData.name && avatarData.age && avatarData.gender && avatarData.languages.length > 0;
      case 2:
        return avatarData.favorites.length >= 5 && avatarData.mbti;
      case 3:
        return avatarData.backstory.trim().length > 0;
      case 4:
        return true; // Knowledge base is optional
      case 5:
        return true; // Hidden rules is optional
      default:
        return false;
    }
  };

  const renderStep = () => {
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

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold">Create New Avatar</h1>
        </div>

        {/* Step Indicator */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`
                    flex items-center justify-center w-10 h-10 rounded-full border-2 
                    ${currentStep === step.id 
                      ? 'bg-primary border-primary text-primary-foreground' 
                      : currentStep > step.id 
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'bg-background border-muted-foreground/30'
                    }
                  `}>
                    {currentStep > step.id ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-medium">{step.id}</span>
                    )}
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm font-medium ${
                      currentStep === step.id ? 'text-primary' : 'text-muted-foreground'
                    }`}>
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-px mx-4 ${
                      currentStep > step.id ? 'bg-green-500' : 'bg-muted-foreground/30'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Step Content */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Step {currentStep}: {steps[currentStep - 1].title}</CardTitle>
          </CardHeader>
          <CardContent>
            {renderStep()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <Button 
            onClick={handleNext}
            disabled={!isStepValid()}
          >
            {currentStep === 5 ? 'Create Avatar' : 'Next'}
            {currentStep < 5 && <ArrowRight className="h-4 w-4 ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateAvatar;
