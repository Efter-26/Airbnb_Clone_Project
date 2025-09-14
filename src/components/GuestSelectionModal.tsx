// src/components/GuestSelectionModal.tsx
"use client";

import { useState, useEffect, useRef } from "react";

interface GuestSelectionModalProps {
  open: boolean;
  onClose: () => void;
  onGuestsChange: (guests: GuestCounts) => void;
  initialGuests: GuestCounts;
}

interface GuestCounts {
  adults: number;
  children: number;
  infants: number;
  pets: number;
}

export default function GuestSelectionModal({
  open,
  onClose,
  onGuestsChange,
  initialGuests
}: GuestSelectionModalProps) {
  const [guests, setGuests] = useState<GuestCounts>(initialGuests);
  const modalRef = useRef<HTMLDivElement>(null);

  const updateGuestCount = (type: keyof GuestCounts, delta: number) => {
    const newGuests = {
      ...guests,
      [type]: Math.max(0, guests[type] + delta)
    };
    setGuests(newGuests);
    onGuestsChange(newGuests);
  };

  // Close modal when clicking outside
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="absolute left-0 right-0 top-full mt-2 z-50">
      <div ref={modalRef} className="bg-white rounded-2xl shadow-[0_6px_16px_rgba(0,0,0,0.12)] border border-gray-200 overflow-hidden">
        <div className="p-6">
          {/* Adults */}
          <div className="flex items-center justify-between py-4 border-b border-gray-200">
            <div>
              <div className="font-semibold text-gray-900">Adults</div>
              <div className="text-sm text-gray-500">Ages 13 or above</div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => updateGuestCount('adults', -1)}
                disabled={guests.adults === 0}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <span className="w-8 text-center font-medium text-gray-900">{guests.adults}</span>
              <button
                onClick={() => updateGuestCount('adults', 1)}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 text-gray-900"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
          </div>

          {/* Children */}
          <div className="flex items-center justify-between py-4 border-b border-gray-200">
            <div>
              <div className="font-semibold text-gray-900">Children</div>
              <div className="text-sm text-gray-500">Ages 2 – 12</div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => updateGuestCount('children', -1)}
                disabled={guests.children === 0}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <span className="w-8 text-center font-medium text-gray-900">{guests.children}</span>
              <button
                onClick={() => updateGuestCount('children', 1)}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 text-gray-900"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
          </div>

          {/* Infants */}
          <div className="flex items-center justify-between py-4 border-b border-gray-200">
            <div>
              <div className="font-semibold text-gray-900">Infants</div>
              <div className="text-sm text-gray-500">Under 2</div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => updateGuestCount('infants', -1)}
                disabled={guests.infants === 0}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <span className="w-8 text-center font-medium text-gray-900">{guests.infants}</span>
              <button
                onClick={() => updateGuestCount('infants', 1)}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 text-gray-900"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
          </div>

          {/* Pets */}
          <div className="flex items-center justify-between py-4">
            <div>
              <div className="font-semibold text-gray-900">Pets</div>
              <div className="text-sm text-gray-500">
                <a href="#" className="text-gray-500 hover:text-gray-700 underline">
                  Bringing a service animal?
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => updateGuestCount('pets', -1)}
                disabled={guests.pets === 0}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <span className="w-8 text-center font-medium text-gray-900">{guests.pets}</span>
              <button
                onClick={() => updateGuestCount('pets', 1)}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 text-gray-900"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
