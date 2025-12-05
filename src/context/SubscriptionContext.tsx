"use client";

import React, { createContext, useState, useEffect, ReactNode } from 'react';

interface SubscriptionContextType {
  isSubscribed: boolean;
  isLoading: boolean;
  subscribe: () => void;
  unsubscribe: () => void;
}

export const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

interface SubscriptionProviderProps {
  children: ReactNode;
}

export const SubscriptionProvider = ({ children }: SubscriptionProviderProps) => {
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for subscription status on mount
    try {
      const storedSubscription = localStorage.getItem('isSubscribed');
      if (storedSubscription === 'true') {
        setIsSubscribed(true);
      }
    } catch (error) {
      console.error("Could not access localStorage:", error);
    } finally {
        setIsLoading(false);
    }
  }, []);

  const subscribe = () => {
    try {
      localStorage.setItem('isSubscribed', 'true');
      setIsSubscribed(true);
    } catch (error) {
      console.error("Could not access localStorage:", error);
    }
  };

  const unsubscribe = () => {
    try {
      localStorage.removeItem('isSubscribed');
      setIsSubscribed(false);
    } catch (error) {
      console.error("Could not access localStorage:", error);
    }
  };
  
  return (
    <SubscriptionContext.Provider value={{ isSubscribed, isLoading, subscribe, unsubscribe }}>
      {children}
    </SubscriptionContext.Provider>
  );
};
