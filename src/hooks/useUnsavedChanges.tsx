
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
      // Only show browser dialog for actual page unload (refresh/close)
      // Not for in-app navigation
      if (hasUnsavedChanges && !showDialog) {
        e.preventDefault();
        e.returnValue = messageRef.current;
        return messageRef.current;
      }
    };

    const handlePopState = (e: PopStateEvent) => {
      if (hasUnsavedChanges && !showDialog) {
        // Prevent navigation and show custom dialog
        e.preventDefault();
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
  }, [hasUnsavedChanges, showDialog]);

  const confirmNavigation = (callback: () => void) => {
    if (hasUnsavedChanges) {
      setShowDialog(true);
      setPendingCallback(() => callback);
    } else {
      callback();
    }
  };

  const handleConfirm = () => {
    if (pendingCallback) {
      const callback = pendingCallback;
      setPendingCallback(null);
      setShowDialog(false);
      // Execute callback immediately
      callback();
    } else {
      setShowDialog(false);
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
