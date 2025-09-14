"use client";

import { useState, useEffect, useRef } from "react";
import PropertyCard from "./PropertyCard";

interface Property {
  id: string;
  title: string;
  type: string;
  price: string;
  rating: number;
  image: string;
  isGuestFavorite?: boolean;
  category: string;
  city: string;
  hotelName: string;
}

interface BackendProperty {
  _id: string;
  title: string;
  type: string;
  location: string;
  city: string;
  country: string;
  hotelName: string;
  price: number;
  currency: string;
  duration: string;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  images: string[];
  isGuestFavorite: boolean;
  isFavorite: boolean;
  category: string;
  amenities: string[];
  maxGuests: number;
  guestCapacity: {
    adults: number;
    children: number;
    infants: number;
    pets: number;
  };
  bedrooms: number;
  bathrooms: number;
  description: string;
  highlights: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  houseRules: string[];
  safetyInfo: string[];
  cancellationPolicy: string;
  checkInTime: string;
  checkOutTime: string;
  selfCheckIn: boolean;
  instantBook: boolean;
  rareFind: boolean;
  bookingStatus: string;
  priceDetails: {
    basePrice: number;
    originalPrice: number;
    discount: number;
    cleaningFee: number;
    serviceFee: number;
    taxes: number;
  };
  host: {
    name: string;
    avatar: string;
    isSuperhost: boolean;
    profileImageUrl: string;
    reviewsCount: number;
    rating: number;
    yearsHosting: number;
    livesIn: string;
    coHosts: Array<{
      name: string;
      profileImageUrl: string;
    }>;
    responseRate: string;
    responseTime: string;
    joinedDate: string;
    verified: boolean;
  };
  coordinates: {
    latitude: number;
    longitude: number;
  };
  availability: {
    startDate: string;
    endDate: string;
    isAvailable: boolean;
  };
  languages: {
    english: {
      title: string;
      description: string;
    };
    bangla: {
      title: string;
      description: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  success: boolean;
  data: BackendProperty[];
}

export default function HeroSection() {
  const [groupedProperties, setGroupedProperties] = useState<{ [key: string]: Property[] }>({});
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const scrollRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://airbnb-clone-backend-mauve.vercel.app/api/hotelrooms`);
        const apiResponse: ApiResponse = await response.json();
        
        if (!apiResponse.success) {
          throw new Error('API request failed');
        }
        
        const data = apiResponse.data;
        
        const mappedData = data.map((item: BackendProperty) => ({
          id: item._id,
          title: item.title,
          type: item.type,
          price: `${item.currency}${item.price} for ${item.duration}`,
          rating: item.rating,
          image: item.imageUrl || item.images[0] || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
          isGuestFavorite: item.isGuestFavorite,
          category: item.category || 'Other',
          city: item.city,
          hotelName: item.hotelName || item.title
        }));

        const grouped = mappedData.reduce((acc, property) => {
          const category = property.category;
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(property);
          return acc;
        }, {} as { [key: string]: Property[] });

        
        const sortedCategories = Object.entries(grouped)
          .sort(([,a], [,b]) => b.length - a.length)
          .slice(0, 5);

        const top5Categories = sortedCategories.reduce((acc, [category, properties]) => {
          acc[category] = properties;
          return acc;
        }, {} as { [key: string]: Property[] });

        setGroupedProperties(top5Categories);
      } catch (error) {
        console.error('Error fetching properties:', error);
        setGroupedProperties({});
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

 
  const scrollLeft = (category: string) => {
    const container = scrollRefs.current[category];
    if (container) {
      container.scrollBy({ left: -240, behavior: 'smooth' });
    }
  };

  const scrollRight = (category: string) => {
    const container = scrollRefs.current[category];
    if (container) {
      container.scrollBy({ left: 240, behavior: 'smooth' });
    }
  };

  const handleFavorite = (id: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };

  const getCategoryTitle = (category: string) => {
    
    return category;
  };

  if (loading) {
    return (
      <div className="py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="flex gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-80 h-64 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {Object.entries(groupedProperties).map(([category, categoryProperties]) => (
        <div key={category} className="relative">
          
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {getCategoryTitle(category)}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollLeft(category)}
                className="p-2 rounded-full border border-gray-300 hover:border-gray-400 transition-colors"
              >
                <img width="15" height="15" src="https://img.icons8.com/forma-bold-sharp/24/back.png" alt="back"/>
              </button>
              <button
                onClick={() => scrollRight(category)}
                className="p-2 rounded-full border border-gray-300 hover:border-gray-400 transition-colors"
              >
                <img width="15" height="15" src="https://img.icons8.com/forma-bold-sharp/24/forward.png" alt="forward"/>
              </button>
            </div>
          </div>

          <div
            ref={el => { scrollRefs.current[category] = el; }}
            className="flex gap-3 overflow-x-auto scrollbar-hide pb-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categoryProperties.map((property) => (
              <PropertyCard
                key={property.id}
                id={property.id}
                title={`${property.type} in ${property.hotelName}`}
                price={property.price}
                rating={property.rating}
                image={property.image}
                isGuestFavorite={property.isGuestFavorite}
                isFavorited={favorites.has(property.id)}
                onFavorite={handleFavorite}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
