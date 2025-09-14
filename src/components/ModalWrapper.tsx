/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useModal } from "../contexts/ModalContext";
import UnifiedLanguageCurrencyModal from "./UnifiedLanguageCurrencyModal";

export default function ModalWrapper() {
  const { unifiedModalOpen, setUnifiedModalOpen, selectedLanguage, setSelectedLanguage, selectedCurrency, setSelectedCurrency } = useModal();
  
  const handleLanguageSelect = (language: any) => {
    setSelectedLanguage(language);
  };

  const handleCurrencySelect = (currency: any) => {
    setSelectedCurrency(currency);
  };

  return (
    <UnifiedLanguageCurrencyModal
      open={unifiedModalOpen}
      onClose={() => setUnifiedModalOpen(false)}
      onSelectLanguage={handleLanguageSelect}
      onSelectCurrency={handleCurrencySelect}
      selectedLanguage={selectedLanguage}
      selectedCurrency={selectedCurrency}
    />
  );
}
