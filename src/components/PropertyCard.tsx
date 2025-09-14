"use client";

import Image from "next/image";

interface PropertyCardProps {
  id: string;
  title: string;
  price: string;
  rating: number;
  image: string;
  isGuestFavorite?: boolean;
  onFavorite?: (id: string) => void;
  isFavorited?: boolean;
}

export default function PropertyCard({
  id,
  title,
  price,
  rating,
  image,
  isGuestFavorite = false,
  onFavorite,
  isFavorited = false
}: PropertyCardProps) {
  const handleCardClick = () => {
    window.open(`/rooms/${id}`, '_blank');
  };

  return (
    <div 
      className="relative flex-shrink-0 w-51 group cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative w-full h-50 rounded-xl overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
        />
        
        {isGuestFavorite && (
          <div className="absolute top-3 left-3">
            <span className="bg-white px-2 py-1 rounded-full text-xs font-medium text-gray-800 shadow-sm">
              Guest favorite
            </span>
          </div>
        )}
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFavorite?.(id);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
        >
          <svg
            className={`w-5 h-5 ${isFavorited ? 'text-red-500 fill-current' : 'text-gray-700'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </div>
      
      <div className="mt-1">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 text-xs truncate">{title}</h3>
        </div>
        
        <div className="flex items-center gap-1 mt-1">
          <span className="text-gray-600 text-xs">{price}</span>
          <span className="text-gray-400 text-xs">·</span>
          <div className="flex items-center gap-1">
            <svg className="w-2.5 h-2.5 text-black" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-xs font-medium text-gray-900">{rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
