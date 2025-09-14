// src/components/DestinationModal.tsx
"use client";

import { useState, useEffect, useRef } from "react";

interface DestinationModalProps {
  open: boolean;
  onClose: () => void;
  onSelectDestination: (destination: string) => void;
  searchQuery: string;
}

interface RecentSearch {
  id: string;
  destination: string;
  dates: string;
  guests: string;
  icon: string;
}

interface SuggestedDestination {
  id: string;
  name: string;
  country: string;
  description: string;
  icon: string;
  iconColor: string;
}

const recentSearches: RecentSearch[] = [
  {
    id: "1",
    destination: "Kuala Lumpur",
    dates: "Oct 17 – 19",
    guests: "1 guest",
    icon: "🏢"
  }
];

const suggestedDestinations: SuggestedDestination[] = [
  {
    id: "1",
    name: "Nearby",
    country: "",
    description: "Find what's around you",
    icon: "✈️",
    iconColor: "text-blue-500"
  },
  {
    id: "2",
    name: "Toronto",
    country: "Canada",
    description: "Guests interested in Ottawa also looked here",
    icon: "🏢",
    iconColor: "text-blue-500"
  },
  {
    id: "3",
    name: "Bangkok",
    country: "Thailand",
    description: "Because your wishlist has stays in Bangkok",
    icon: "🏛️",
    iconColor: "text-green-500"
  },
  {
    id: "4",
    name: "London",
    country: "United Kingdom",
    description: "For sights like Buckingham Palace",
    icon: "🌉",
    iconColor: "text-amber-600"
  },
  {
    id: "5",
    name: "New York",
    country: "NY",
    description: "For its stunning architecture",
    icon: "🌉",
    iconColor: "text-amber-600"
  }
];

export default function DestinationModal({
  open,
  onClose,
  onSelectDestination,
  searchQuery
}: DestinationModalProps) {
  const [filteredDestinations, setFilteredDestinations] = useState<SuggestedDestination[]>(suggestedDestinations);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredDestinations(suggestedDestinations);
    } else {
      const filtered = suggestedDestinations.filter(dest =>
        dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.country.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredDestinations(filtered);
    }
  }, [searchQuery]);

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

  const handleDestinationSelect = (destination: string) => {
    onSelectDestination(destination);
    onClose();
  };

  const handleRecentSearchSelect = (destination: string) => {
    onSelectDestination(destination);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="absolute left-0 right-0 top-full mt-2 z-50">
      <div ref={modalRef} className="bg-white rounded-2xl shadow-[0_6px_16px_rgba(0,0,0,0.12)] border border-gray-200 overflow-hidden">
        <div className="max-h-96 overflow-y-auto">
          {/* Recent Searches */}
          {recentSearches.length > 0 && searchQuery.trim() === "" && (
            <div className="p-4 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Recent searches</h3>
              <div className="space-y-2">
                {recentSearches.map((search) => (
                  <button
                    key={search.id}
                    onClick={() => handleRecentSearchSelect(search.destination)}
                    className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="text-lg">{search.icon}</div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-gray-900">{search.destination}</div>
                      <div className="text-sm text-gray-500">{search.dates} • {search.guests}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Suggested Destinations */}
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              {searchQuery.trim() === "" ? "Suggested destinations" : "Search results"}
            </h3>
            <div className="space-y-2">
              {filteredDestinations.length > 0 ? (
                filteredDestinations.map((destination) => (
                  <button
                    key={destination.id}
                    onClick={() => handleDestinationSelect(destination.name)}
                    className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className={`text-lg ${destination.iconColor}`}>
                      {destination.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-gray-900">
                        {destination.name}
                        {destination.country && (
                          <span className="text-gray-500">, {destination.country}</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">{destination.description}</div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">🔍</div>
                  <div>No destinations found</div>
                  <div className="text-sm">Try a different search term</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
