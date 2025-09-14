"use client";

import { useState, useEffect, useRef } from "react";

interface Language {
  code: string;
  name: string;
  region: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'en-US', name: 'English', region: 'United States', flag: '🇺🇸' },
  { code: 'bn-BD', name: 'বাংলা', region: 'Bangladesh', flag: '🇧🇩' },
  { code: 'es-ES', name: 'Español', region: 'España', flag: '🇪🇸' },
  { code: 'fr-FR', name: 'Français', region: 'France', flag: '🇫🇷' },
  { code: 'de-DE', name: 'Deutsch', region: 'Deutschland', flag: '🇩🇪' },
  { code: 'it-IT', name: 'Italiano', region: 'Italia', flag: '🇮🇹' },
  { code: 'pt-PT', name: 'Português', region: 'Portugal', flag: '🇵🇹' },
  { code: 'ja-JP', name: '日本語', region: '日本', flag: '🇯🇵' },
  { code: 'ko-KR', name: '한국어', region: '대한민국', flag: '🇰🇷' },
  { code: 'zh-CN', name: '中文', region: '中国', flag: '🇨🇳' }
];

interface LanguageModalProps {
  open: boolean;
  onClose: () => void;
  onSelectLanguage: (language: Language) => void;
  selectedLanguage: Language;
}

export default function LanguageModal({ open, onClose, onSelectLanguage, selectedLanguage }: LanguageModalProps) {
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

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      
      <div 
        ref={modalRef}
        className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-4xl mx-4 max-h-[80vh] overflow-hidden"
      >
       
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
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

        <div className="p-6">
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
        </div>
      </div>
    </div>
  );
}
