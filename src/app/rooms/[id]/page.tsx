"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

interface RoomDetails {
  success: boolean;
  data: {
    _id: string;
    title: string;
    type: string;
    city: string;
    country: string;
    hotelName: string;
    price: number;
    currency: string;
    rating: number;
    reviewsCount: number;
    imageUrl: string;
    images: string[];
    isGuestFavorite: boolean;
    amenities: string[];
    maxGuests: number;
    bedrooms: number;
    bathrooms: number;
    description: string;
    highlights: Array<{
      title: string;
      description: string;
      _id: string;
    }>;
    houseRules: string[];
    safetyInfo: string[];
    cancellationPolicy: string;
    checkInTime: string;
    checkOutTime: string;
    guestCapacity: {
      adults: number;
      children: number;
      infants: number;
      pets: number;
    };
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
      isSuperhost: boolean;
      yearsHosting: number;
      responseRate: string;
      responseTime: string;
      reviewsCount: number;
      coHosts: string[];
      verified: boolean;
    };
    availability: {
      startDate: string;
      endDate: string;
      isAvailable: boolean;
      blockedDates: string[];
    };
  };
}

export default function RoomDetailsPage() {
  const params = useParams();
  const roomId = params.id as string;
  const [room, setRoom] = useState<RoomDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showAllImages, setShowAllImages] = useState(false);

  const roomData = room?.data;
  
  const images = roomData?.images || [];
  const hasImages = images.length > 0;
  
  const amenities = roomData?.amenities || [];
  const host = roomData?.host || {
    name: "Host",
    isSuperhost: false,
    responseRate: "100%",
    responseTime: "within an hour",
    yearsHosting: 1,
    reviewsCount: 0
  };
  const safetyFeatures = roomData?.safetyInfo || [];
  const cancellationPolicy = roomData?.cancellationPolicy || "Free cancellation for 48 hours";
  const checkIn = roomData?.checkInTime || "4:00 PM";
  const checkOut = roomData?.checkOutTime || "11:00 AM";
  const maxGuests = roomData?.maxGuests || 2;
  const bedrooms = roomData?.bedrooms || 1;
  const bathrooms = roomData?.bathrooms || 1;
  const isGuestFavorite = roomData?.isGuestFavorite || false;
  const highlights = roomData?.highlights || [];

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://airbnb-clone-backend-mauve.vercel.app/api/hotelrooms/${roomId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch room details');
        }
        
        const data = await response.json();
        setRoom(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (roomId) {
      fetchRoomDetails();
    }
  }, [roomId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Room not found</h1>
          <p className="text-gray-600">The room you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 rounded-2xl overflow-hidden">
                <div className="md:col-span-2 relative h-96">
                  {hasImages ? (
                    <Image
                      src={images[selectedImageIndex] || images[0]}
                      alt={roomData?.title || 'Room'}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p>No images available</p>
                      </div>
                    </div>
                  )}
                  {isGuestFavorite && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-800 shadow-sm">
                        Guest favorite
                      </span>
                    </div>
                  )}
                  <button
                    onClick={() => setShowAllImages(true)}
                    className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                      Show all photos
                    </div>
                  </button>
                </div>
                
                {hasImages && images.slice(1, 5).map((image, index) => (
                  <div key={index} className="relative h-48">
                    <Image
                      src={image}
                      alt={`${roomData?.title || 'Room'} ${index + 2}`}
                      fill
                      className="object-cover cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setSelectedImageIndex(index + 1)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{roomData?.title || 'Room'}</h1>
              <p className="text-gray-600 mb-4">
                {roomData?.type} in {roomData?.city}, {roomData?.country}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>{maxGuests} guests</span>
                <span>·</span>
                <span>{bedrooms} bedroom</span>
                <span>·</span>
                <span>{bedrooms} bed</span>
                <span>·</span>
                <span>{bathrooms} bath</span>
              </div>
            </div>

            {isGuestFavorite && (
              <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold text-gray-900">Guest favorite</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-semibold text-gray-900">{roomData?.rating}</span>
                    <span className="text-gray-600">({roomData?.reviewsCount} reviews)</span>
                  </div>
                </div>
                <p className="text-gray-600 mt-2">
                  One of the most loved homes on Airbnb, according to guests.
                </p>
              </div>
            )}

            <div className="border-t pt-8 mb-8">
              <div className="flex items-start gap-4">
                <div className="relative">
                  <div className="w-15 h-15 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-semibold text-gray-600">
                      {host.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  {host.isSuperhost && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">Hosted by {host.name}</h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <span>{host.reviewsCount} reviews</span>
                    <span>·</span>
                    <span>{host.yearsHosting} years hosting</span>
                  </div>
                  <div className="mt-4 text-sm text-gray-600">
                    <p>Response rate: {host.responseRate}</p>
                    <p>Responds {host.responseTime}</p>
                  </div>
                  <button className="mt-4 px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    Message host
                  </button>
                </div>
              </div>
            </div>

            {highlights.length > 0 && (
              <div className="border-t pt-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">What guests love</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {highlights.map((highlight) => (
                    <div key={highlight._id} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{highlight.title}</h3>
                        <p className="text-sm text-gray-600">{highlight.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t pt-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">What this place offers</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-900">{amenity}</span>
                  </div>
                ))}
              </div>
              <button className="mt-4 text-gray-600 underline hover:text-gray-800">
                Show all {amenities.length} amenities
              </button>
            </div>

            <div className="border-t pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Things to know</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">House rules</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>Check-in: {checkIn}</li>
                    <li>Checkout before {checkOut}</li>
                    <li>{maxGuests} guests maximum</li>
                  </ul>
                  <button className="mt-2 text-gray-600 underline hover:text-gray-800 text-sm">
                    Show more
                  </button>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Safety & property</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    {safetyFeatures.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                  <button className="mt-2 text-gray-600 underline hover:text-gray-800 text-sm">
                    Show more
                  </button>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Cancellation policy</h3>
                  <p className="text-sm text-gray-600">{cancellationPolicy}</p>
                  <button className="mt-2 text-gray-600 underline hover:text-gray-800 text-sm">
                    Show more
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      {roomData?.priceDetails?.originalPrice && roomData.priceDetails.originalPrice > roomData.price && (
                        <span className="text-lg text-gray-500 line-through">
                          {roomData.currency}{roomData.priceDetails.originalPrice}
                        </span>
                      )}
                      <span className="text-2xl font-bold text-gray-900">
                        {roomData?.currency}{roomData?.price}
                      </span>
                    </div>
                    <span className="text-gray-600"> / night</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-semibold">{roomData?.rating}</span>
                    <span className="text-gray-600">({roomData?.reviewsCount})</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="border border-gray-300 rounded-lg p-3">
                      <label className="text-xs font-semibold text-gray-700 uppercase">Check-in</label>
                      <div className="text-sm text-gray-900">10/31/2025</div>
                    </div>
                    <div className="border border-gray-300 rounded-lg p-3">
                      <label className="text-xs font-semibold text-gray-700 uppercase">Checkout</label>
                      <div className="text-sm text-gray-900">11/2/2025</div>
                    </div>
                  </div>
                  
                  <div className="border border-gray-300 rounded-lg p-3">
                    <label className="text-xs font-semibold text-gray-700 uppercase">Guests</label>
                    <div className="text-sm text-gray-900">1 guest</div>
                  </div>
                </div>

                <button className="w-full bg-red-500 text-white py-4 rounded-lg font-semibold hover:bg-red-600 transition-colors mt-6">
                  Reserve
                </button>
                
                <p className="text-center text-sm text-gray-600 mt-4">
                  You won&apos;t be charged yet
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showAllImages && hasImages && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <div className="relative max-w-4xl max-h-full p-4">
            <button
              onClick={() => setShowAllImages(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <Image
              src={images[selectedImageIndex]}
              alt={roomData?.title || 'Room'}
              width={800}
              height={600}
              className="rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
