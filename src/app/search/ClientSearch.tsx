"use client";

import { useEffect, useMemo, useState } from "react";
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

export default function ClientSearch() {
  const sp = useSearchParams();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const query = useMemo(() => {
    const get = (k: string) => sp.get(k) || "";
    return {
      where: get("where"),
      checkIn: get("checkIn"),
      checkOut: get("checkOut"),
      guests: get("guests"),
      adults: get("adults"),
      children: get("children"),
      infants: get("infants"),
      pets: get("pets"),
    };
  }, [sp]);

  useEffect(() => {
    const run = async () => {
      try {
        setIsLoading(true);
        setErr(null);

        if (!query.where) {
          setResults([]);
          setErr("No search criteria provided");
          return;
        }

        const params = new URLSearchParams();
        params.append("where", query.where);
        if (query.checkIn) params.append("checkIn", query.checkIn);
        if (query.checkOut) params.append("checkOut", query.checkOut);
        if (query.guests) params.append("guests", query.guests);
        if (query.adults) params.append("adults", query.adults);
        if (query.children) params.append("children", query.children);
        if (query.infants) params.append("infants", query.infants);
        if (query.pets) params.append("pets", query.pets);

        const res = await fetch(
          `https://airbnb-clone-backend-mauve.vercel.app/api/hotelrooms/search?${params.toString()}`,
          { cache: "no-store" }
        );

        if (!res.ok) throw new Error("Search failed");
        const data = await res.json();
        setResults(Array.isArray(data?.data) ? data.data : []);
      } catch (e) {
        console.error(e);
        setErr("Failed to search properties. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    run();
  }, [query]);

  const formatDate = (s: string) =>
    new Date(s).toLocaleDateString("en-US", { month: "short", day: "numeric" });

  const getTotalGuests = () => {
    const a = parseInt(query.adults || "0", 10);
    const c = parseInt(query.children || "0", 10);
    const i = parseInt(query.infants || "0", 10);
    const p = parseInt(query.pets || "0", 10);
    const total = a + c + i + p;
    if (total === 0) return "Add guests";

    const parts: string[] = [];
    if (a > 0) parts.push(`${a} guest${a > 1 ? "s" : ""}`);
    if (c > 0) parts.push(`${c} child${c > 1 ? "ren" : ""}`);
    if (i > 0) parts.push(`${i} infant${i > 1 ? "s" : ""}`);
    if (p > 0) parts.push(`${p} pet${p > 1 ? "s" : ""}`);
    return parts.join(", ");
  };

  const getDateRange = () => {
    if (query.checkIn && query.checkOut)
      return `${formatDate(query.checkIn)} - ${formatDate(query.checkOut)}`;
    if (query.checkIn) return formatDate(query.checkIn);
    return "Add dates";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Searching properties...</p>
        </div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Search Error</h2>
          <p className="text-gray-600 mb-4">{err}</p>
          <Link href="/" className="inline-flex items-center px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl font-semibold text-gray-900">
            {results.length} homes{query.where ? ` in ${query.where}` : ""}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {getDateRange()} • {getTotalGuests()}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {results.map((property) => (
              <Link
                key={property._id}
                href={`/rooms/${property._id}`}
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow group"
              >
                <div className="aspect-[4/3] relative">
                  <img
                    src={property.imageUrl || property.images?.[0] || "/images/placeholder.jpg"}
                    alt={property.title || property.hotelName || "Property"}
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
                    <span className="text-sm text-gray-500">
                      {property.city}, {property.country}
                    </span>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      <span className="text-sm font-medium">{property.rating}</span>
                      <span className="text-sm text-gray-500">({property.reviewsCount})</span>
                    </div>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                    {property.title || property.hotelName || "Property"}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{property.duration || "2 nights"}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-lg font-semibold text-gray-900">
                        {(property.currency || "$")}
                        {property.price}
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
            <Link href="/" className="inline-flex items-center px-6 py-3 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors">
              Back to Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
