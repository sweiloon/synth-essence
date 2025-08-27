
import { useEffect, useRef, useState } from 'react';

interface UseUnsavedChangesProps {
  hasUnsavedChanges: boolean;
  message?: string;
}

export const useUnsavedChanges = ({ 
  hasUnsavedChanges, 
  message = "You have unsaved changes. If you leave now, all your progress will be lost. Are you sure you want to continue?" 
}: UseUnsavedChangesProps) => {
  const messageRef = useRef(message);
  const [showDialog, setShowDialog] = useState(false);
  const [pendingCallback, setPendingCallback] = useState<(() => void) | null>(null);
  
  useEffect(() => {
    messageRef.current = message;
  }, [message]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = messageRef.current;
        return messageRef.current;
      }
    };

    const handlePopState = (e: PopStateEvent) => {
      if (hasUnsavedChanges) {
        // Prevent navigation and show dialog
        window.history.pushState(null, '', window.location.href);
        setShowDialog(true);
        setPendingCallback(() => () => {
          window.history.back();
        });
      }
    };

    if (hasUnsavedChanges) {
      window.addEventListener('beforeunload', handleBeforeUnload);
      window.addEventListener('popstate', handlePopState);
      
      // Push a state to detect back button
      window.history.pushState(null, '', window.location.href);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [hasUnsavedChanges]);

  const confirmNavigation = (callback: () => void) => {
    if (hasUnsavedChanges) {
      setShowDialog(true);
      setPendingCallback(() => callback);
    } else {
      callback();
    }
  };

  const handleConfirm = () => {
    setShowDialog(false);
    if (pendingCallback) {
      pendingCallback();
      setPendingCallback(null);
    }
  };

  const handleCancel = () => {
    setShowDialog(false);
    setPendingCallback(null);
  };

  return { 
    confirmNavigation, 
    showDialog,
    handleConfirm,
    handleCancel,
    message: messageRef.current
  };
};
