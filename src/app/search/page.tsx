"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface SearchResult {
  _id: string;
  title?: string;
  hotelName?: string;
  city: string;
  country: string;
  price: number;
  currency: string;
  rating: number;
  reviewsCount: number;
  imageUrl?: string;
  images?: string[];
  isFavorite?: boolean;
  duration?: string;
  type?: string;
  maxGuests?: number;
  bedrooms?: number;
  bathrooms?: number;
}

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const performSearch = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get search parameters from URL
        const where = searchParams.get('where');
        const checkIn = searchParams.get('checkIn');
        const checkOut = searchParams.get('checkOut');
        const guests = searchParams.get('guests');
        const adults = searchParams.get('adults');
        const children = searchParams.get('children');
        const infants = searchParams.get('infants');
        const pets = searchParams.get('pets');

        if (!where) {
          setError('No search criteria provided');
          return;
        }

        // Build query parameters
        const params = new URLSearchParams();
        params.append('where', where);
        if (checkIn) params.append('checkIn', checkIn);
        if (checkOut) params.append('checkOut', checkOut);
        if (guests) params.append('guests', guests);
        if (adults) params.append('adults', adults);
        if (children) params.append('children', children);
        if (infants) params.append('infants', infants);
        if (pets) params.append('pets', pets);

        const response = await fetch(`https://airbnb-clone-backend-mauve.vercel.app/api/hotelrooms/search?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error('Search failed');
        }

        const data = await response.json();
        setSearchResults(data.data || []);
      } catch (err) {
        console.error('Search error:', err);
        setError('Failed to search properties. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    performSearch();
  }, [searchParams]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getTotalGuests = () => {
    const adults = parseInt(searchParams.get('adults') || '0');
    const children = parseInt(searchParams.get('children') || '0');
    const infants = parseInt(searchParams.get('infants') || '0');
    const pets = parseInt(searchParams.get('pets') || '0');
    
    const total = adults + children + infants + pets;
    if (total === 0) return 'Add guests';
    
    let guestText = '';
    if (adults > 0) guestText += `${adults} guest${adults > 1 ? 's' : ''}`;
    if (children > 0) guestText += `, ${children} child${children > 1 ? 'ren' : ''}`;
    if (infants > 0) guestText += `, ${infants} infant${infants > 1 ? 's' : ''}`;
    if (pets > 0) guestText += `, ${pets} pet${pets > 1 ? 's' : ''}`;
    
    return guestText;
  };

  const getDateRange = () => {
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    
    if (checkIn && checkOut) {
      return `${formatDate(checkIn)} - ${formatDate(checkOut)}`;
    } else if (checkIn) {
      return formatDate(checkIn);
    }
    return 'Add dates';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Searching properties...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Search Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link 
            href="/"
            className="inline-flex items-center px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Results Header */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl font-semibold text-gray-900">
            {searchResults.length} homes in {searchParams.get('where')}
          </h1>
        </div>
      </div>

      {/* Search Results Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {searchResults.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {searchResults.map((property) => (
              <Link
                key={property._id}
                href={`/rooms/${property._id}`}
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow group"
              >
                <div className="aspect-[4/3] relative">
                  <img
                    src={property.imageUrl || property.images?.[0] || '/images/placeholder.jpg'}
                    alt={property.title || property.hotelName || 'Property'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <button className="w-8 h-8 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:border-gray-900 transition-colors">
                      <svg className="w-4 h-4 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">{property.city}, {property.country}</span>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-yellow-500 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      <span className="text-sm font-medium">{property.rating}</span>
                      <span className="text-sm text-gray-500">({property.reviewsCount})</span>
                    </div>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                    {property.title || property.hotelName || 'Property'}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      {property.duration || '2 nights'}
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="text-lg font-semibold text-gray-900">
                        {property.currency || '$'}{property.price}
                      </span>
                      <span className="text-sm text-gray-500">per night</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search criteria</p>
            <Link 
              href="/"
              className="inline-flex items-center px-6 py-3 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
