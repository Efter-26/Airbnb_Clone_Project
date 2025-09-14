"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

interface ModalContextType {
  unifiedModalOpen: boolean;
  setUnifiedModalOpen: (open: boolean) => void;
  selectedLanguage: {
    code: string;
    name: string;
    region: string;
    flag: string;
  };
  setSelectedLanguage: (language: any) => void;
  selectedCurrency: {
    code: string;
    name: string;
    symbol: string;
    region: string;
  };
  setSelectedCurrency: (currency: any) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [unifiedModalOpen, setUnifiedModalOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState({
    code: 'en-US',
    name: 'English',
    region: 'United States',
    flag: '🇺🇸'
  });
  const [selectedCurrency, setSelectedCurrency] = useState({
    code: 'USD',
    name: 'United States dollar',
    symbol: '$',
    region: 'United States'
  });

  return (
    <ModalContext.Provider value={{
      unifiedModalOpen,
      setUnifiedModalOpen,
      selectedLanguage,
      setSelectedLanguage,
      selectedCurrency,
      setSelectedCurrency
    }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}
