"use client";

import { useState, useEffect, useRef } from "react";

interface Currency {
  code: string;
  name: string;
  symbol: string;
  region: string;
}

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

interface CurrencyModalProps {
  open: boolean;
  onClose: () => void;
  onSelectCurrency: (currency: Currency) => void;
  selectedCurrency: Currency;
}

export default function CurrencyModal({ open, onClose, onSelectCurrency, selectedCurrency }: CurrencyModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      // Prevent body scroll when modal is open
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
      {/* Dim backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      
      {/* Modal */}
      <div 
        ref={modalRef}
        className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-4xl mx-4 max-h-[80vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Choose a currency</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Currency Grid */}
        <div className="p-6">
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
        </div>
      </div>
    </div>
  );
}
