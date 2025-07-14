'use client';

import { useState, useCallback } from 'react';
import { Toast, ToastType } from '@/components/ui/toast';

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((
    type: ToastType,
    title: string,
    description?: string,
    duration?: number
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    const toast: Toast = {
      id,
      type,
      title,
      description,
      duration,
    };

    setToasts(prev => [...prev, toast]);
    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const success = useCallback((title: string, description?: string) => {
    return addToast('success', title, description);
  }, [addToast]);

  const error = useCallback((title: string, description?: string) => {
    return addToast('error', title, description);
  }, [addToast]);

  const info = useCallback((title: string, description?: string) => {
    return addToast('info', title, description);
  }, [addToast]);

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    info,
  };
}
