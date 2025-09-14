"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface Language {
  code: string;
  name: string;
  region: string;
  flag: string;
}

interface Currency {
  code: string;
  name: string;
  symbol: string;
  region: string;
}

const languages: Language[] = [
  { code: 'en-US', name: 'English', region: 'United States', flag: '🇺🇸' },
  { code: 'bn-BD', name: 'বাংলা', region: 'Bangladesh', flag: '🇧🇩' },
  { code: 'es-ES', name: 'Español', region: 'España', flag: '🇪🇸' },
  { code: 'fr-FR', name: 'Français', region: 'France', flag: '🇫🇷' },
  { code: 'de-DE', name: 'Deutsch', region: 'Deutschland', flag: '🇩🇪' },
  { code: 'it-IT', name: 'Italiano', region: 'Italia', flag: '🇮🇹' },
  { code: 'hi-IN', name: 'हिन्दी', region: 'India', flag: '🇮🇳' },
  { code: 'ja-JP', name: '日本語', region: '日本', flag: '🇯🇵' },
  { code: 'ko-KR', name: '한국어', region: '대한민국', flag: '🇰🇷' },
  { code: 'zh-CN', name: '中文', region: '中国', flag: '🇨🇳' }
];

const currencies: Currency[] = [
  { code: 'USD', name: 'United States dollar', symbol: '$', region: 'United States' },
  { code: 'BDT', name: 'Bangladeshi taka', symbol: '৳', region: 'Bangladesh' },
  { code: 'EUR', name: 'Euro', symbol: '€', region: 'Spain' },
  { code: 'GBP', name: 'Pound sterling', symbol: '£', region: 'United Kingdom' },
  { code: 'JPY', name: 'Japanese yen', symbol: '¥', region: 'Japan' },
  { code: 'KRW', name: 'South Korean won', symbol: '₩', region: 'South Korea' },
  { code: 'CNY', name: 'Chinese yuan', symbol: '¥', region: 'China' },
  { code: 'INR', name: 'Indian rupee', symbol: '₹', region: 'India' },
  { code: 'DKK', name: 'Danish krone', symbol: 'kr', region: 'Denmark' },
  { code: 'CHF', name: 'Swiss franc', symbol: 'CHF', region: 'Switzerland' }
];

interface UnifiedLanguageCurrencyModalProps {
  open: boolean;
  onClose: () => void;
  onSelectLanguage: (language: Language) => void;
  onSelectCurrency: (currency: Currency) => void;
  selectedLanguage: Language;
  selectedCurrency: Currency;
}

export default function UnifiedLanguageCurrencyModal({ 
  open, 
  onClose, 
  onSelectLanguage, 
  onSelectCurrency, 
  selectedLanguage, 
  selectedCurrency 
}: UnifiedLanguageCurrencyModalProps) {
  const [activeTab, setActiveTab] = useState<'language' | 'currency'>('language');
  const [translationEnabled, setTranslationEnabled] = useState(true);
  const modalRef = useRef<HTMLDivElement>(null);

  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [open, onClose]);

  console.log('Modal render - open:', open);
  
  if (!open) return null;

  if (typeof window === 'undefined') return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999
      }}
    >
      
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      
      <div 
        ref={modalRef}
        className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-4xl max-h-[80vh] overflow-hidden z-10"
        style={{ position: 'relative', zIndex: 10000 }}
      >
       
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex space-x-8 border-b border-gray-300">
            <button
              onClick={() => setActiveTab('language')}
              className={`pb-4 text-lg font-medium transition-colors relative ${
                activeTab === 'language'
                  ? 'text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Language and region
              {activeTab === 'language' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('currency')}
              className={`pb-4 text-lg font-medium transition-colors relative ${
                activeTab === 'currency'
                  ? 'text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Currency
              {activeTab === 'currency' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></div>
              )}
            </button>
          </div>
        </div>

        {activeTab === 'language' && (
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Translation</h3>
                <p className="text-sm text-gray-600">Automatically translate descriptions and reviews to English.</p>
              </div>
              <button
                onClick={() => setTranslationEnabled(!translationEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  translationEnabled ? 'bg-gray-900' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    translationEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                >
                  {translationEnabled && (
                    <svg className="h-3 w-3 text-gray-900 m-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </span>
              </button>
            </div>
          </div>
        )}

       
        <div className="p-6">
          {activeTab === 'language' && (
            <>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Choose a language and region</h3>
              <div className="grid grid-cols-5 gap-3 max-h-96 overflow-y-auto">
                {languages.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => onSelectLanguage(language)}
                    className={`p-3 text-left rounded-lg border-2 transition-all hover:bg-gray-50 ${
                      selectedLanguage.code === language.code
                        ? 'border-gray-900 bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="font-medium text-gray-900 text-sm mb-1">{language.name}</div>
                      <div className="text-xs text-gray-600">{language.region}</div>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          {activeTab === 'currency' && (
            <>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Choose a currency</h3>
              <div className="grid grid-cols-5 gap-3 max-h-96 overflow-y-auto">
                {currencies.map((currency) => (
                  <button
                    key={currency.code}
                    onClick={() => onSelectCurrency(currency)}
                    className={`p-3 text-left rounded-lg border-2 transition-all hover:bg-gray-50 ${
                      selectedCurrency.code === currency.code
                        ? 'border-gray-900 bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="font-medium text-gray-900 text-sm mb-1">{currency.name}</div>
                      <div className="text-xs text-gray-600">{currency.code} - {currency.symbol}</div>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}