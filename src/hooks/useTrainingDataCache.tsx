
import { useState, useEffect } from 'react';

interface TrainingData {
  systemPrompt: string;
  userPrompt: string;
  trainingInstructions: string;
  uploadedFiles: File[];
}

export const useTrainingDataCache = (avatarId: string | null) => {
  const [trainingData, setTrainingData] = useState<TrainingData>({
    systemPrompt: '',
    userPrompt: '',
    trainingInstructions: '',
    uploadedFiles: []
  });

  const cacheKey = avatarId ? `training_data_${avatarId}` : null;

  // Load cached data when avatar changes
  useEffect(() => {
    if (!cacheKey) {
      // Reset if no avatar selected
      setTrainingData({
        systemPrompt: '',
        userPrompt: '',
        trainingInstructions: '',
        uploadedFiles: []
      });
      return;
    }

    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsedData = JSON.parse(cached);
        setTrainingData({
          systemPrompt: parsedData.systemPrompt || '',
          userPrompt: parsedData.userPrompt || '',
          trainingInstructions: parsedData.trainingInstructions || '',
          uploadedFiles: [] // Files can't be cached, will be empty on page reload
        });
      } else {
        // Reset for new avatar
        setTrainingData({
          systemPrompt: '',
          userPrompt: '',
          trainingInstructions: '',
          uploadedFiles: []
        });
      }
    } catch (error) {
      console.error('Error loading cached training data:', error);
    }
  }, [cacheKey]);

  // Save data to cache whenever it changes
  const updateTrainingData = (data: Partial<TrainingData>) => {
    const newData = { ...trainingData, ...data };
    setTrainingData(newData);
    
    if (cacheKey) {
      try {
        // Only cache text data, not files
        const cacheData = {
          systemPrompt: newData.systemPrompt,
          userPrompt: newData.userPrompt,
          trainingInstructions: newData.trainingInstructions
        };
        localStorage.setItem(cacheKey, JSON.stringify(cacheData));
      } catch (error) {
        console.error('Error caching training data:', error);
      }
    }
  };

  const clearCache = () => {
    if (cacheKey) {
      localStorage.removeItem(cacheKey);
    }
    setTrainingData({
      systemPrompt: '',
      userPrompt: '',
      trainingInstructions: '',
      uploadedFiles: []
    });
  };

  return {
    trainingData,
    updateTrainingData,
    clearCache
  };
};
