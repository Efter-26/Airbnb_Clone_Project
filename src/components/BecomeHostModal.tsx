"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface BecomeHostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BecomeHostModal({ isOpen, onClose }: BecomeHostModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div 
      className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-[9999]"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
          What would you like to host?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Home Option */}
          <div className="flex flex-col items-center p-6 border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-colors cursor-pointer">
            <div className="w-20 h-20 mb-4 flex items-center justify-center">
              <img 
                src="https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-search-bar-icons/original/a32adab1-f9df-47e1-a411-bdff91b579c3.png?im_w=240"
                alt="Home"
                className="w-30 h-30 object-contain"
              />
            </div>
            <span className="text-lg font-medium text-gray-900">Home</span>
          </div>

          <div className="flex flex-col items-center p-6 border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-colors cursor-pointer">
            <div className="w-20 h-20 mb-4 flex items-center justify-center">
              <img 
                src="https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-search-bar-icons/original/e47ab655-027b-4679-b2e6-df1c99a5c33d.png?im_w=240"
                alt="Experience"
                className="w-30 h-30 object-contain"
              />
            </div>
            <span className="text-lg font-medium text-gray-900">Experience</span>
          </div>

          <div className="flex flex-col items-center p-6 border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-colors cursor-pointer">
            <div className="w-20 h-20 mb-4 flex items-center justify-center">
              <img 
                src="https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-search-bar-icons/original/3d67e9a9-520a-49ee-b439-7b3a75ea814d.png?im_w=240"
                alt="Service"
                className="w-30 h-30 object-contain"
              />
            </div>
            <span className="text-lg font-medium text-gray-900">Service</span>
          </div>
        </div>

        <div className="flex justify-end">
          <button 
            className="px-6 py-3 bg-gray-300 text-gray-500 rounded-lg font-medium cursor-not-allowed"
            disabled
          >
            Next
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
