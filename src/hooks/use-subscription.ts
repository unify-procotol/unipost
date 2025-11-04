'use client';

import { useState, useCallback } from 'react';

export interface SubscriptionData {
  email: string;
  name?: string;
  prefix: string;
  labels?: string[];
}

export interface SubscriptionResult {
  success: boolean;
  message: string;
}

interface UseSubscriptionReturn {
  loading: boolean;
  error: string | null;
  success: boolean;
  subscribe: (data: SubscriptionData) => Promise<SubscriptionResult>;
  unsubscribe: (email: string, prefix: string) => Promise<SubscriptionResult>;
  checkSubscription: (email: string, prefix: string) => Promise<{ subscribed: boolean }>;
  reset: () => void;
}

export function useSubscription(): UseSubscriptionReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const subscribe = useCallback(async (data: SubscriptionData): Promise<SubscriptionResult> => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('https://unipost.uni-labs.org/api/subscribe/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(true);
        return { success: true, message: result.message };
      } else {
        setError(result.message);
        return { success: false, message: result.message };
      }
    } catch {
      const errorMessage = 'Network error. Please check your connection and try again.';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const unsubscribe = useCallback(async (email: string, prefix: string): Promise<SubscriptionResult> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://unipost.uni-labs.org/api/subscribe/?email=${encodeURIComponent(email)}&prefix=${encodeURIComponent(prefix)}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(true);
        return { success: true, message: result.message };
      } else {
        setError(result.message);
        return { success: false, message: result.message };
      }
    } catch {
      const errorMessage = 'Network error. Please check your connection and try again.';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const checkSubscription = useCallback(async (email: string, prefix: string): Promise<{ subscribed: boolean }> => {
    try {
      const response = await fetch(`https://unipost.uni-labs.org/api/subscribe/check?email=${encodeURIComponent(email)}&prefix=${encodeURIComponent(prefix)}`);
      const result = await response.json();
      return { subscribed: result.subscribed || false };
    } catch (err) {
      console.error('Check subscription error:', err);
      return { subscribed: false };
    }
  }, []);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  }, []);

  return {
    loading,
    error,
    success,
    subscribe,
    unsubscribe,
    checkSubscription,
    reset,
  };
}
