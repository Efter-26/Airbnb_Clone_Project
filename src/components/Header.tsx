// src/components/Header.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Navbar from "./Navbar";
import SearchBar from "./SearchBar";
import AirbnbLogo from "./AirbnbLogo";
import { useModal } from "../contexts/ModalContext";
import { useLanguage } from "../contexts/LanguageContext";
import DateRangeModal from "./DateRangeModal";
import BecomeHostModal from "./BecomeHostModal";

export default function Header() {
  const { setUnifiedModalOpen } = useModal();
  const { t } = useLanguage();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showBottomNav, setShowBottomNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isRoomDetailsPage, setIsRoomDetailsPage] = useState(false);
  const [isSearchResultsPage, setIsSearchResultsPage] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [becomeHostModalOpen, setBecomeHostModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ top: 0, right: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Check if we're on a room details page or search results page (client-side only)
  useEffect(() => {
    setIsClient(true);
    setIsRoomDetailsPage(pathname?.startsWith('/rooms/') || false);
    setIsSearchResultsPage(pathname === '/search');
  }, [pathname]);

  // Update button position when dropdown opens
  useEffect(() => {
    if (dropdownOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setButtonPosition({
        top: rect.bottom + window.scrollY + 8,
        right: window.innerWidth - rect.right - window.scrollX
      });
    }
  }, [dropdownOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current && !buttonRef.current.contains(event.target as Node) &&
        dropdownRef.current && !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);
  
  // Scrolled search bar states
  const [destination, setDestination] = useState('');
  const [guests, setGuests] = useState({ adults: 1, children: 0, infants: 0, pets: 0 });
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [showFullHeader, setShowFullHeader] = useState(false);
  const [mobileActiveSection, setMobileActiveSection] = useState<'where' | 'when' | 'who'>('where');
  const [showMobileModal, setShowMobileModal] = useState(false);
  
  const scrolledModalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 100);
      
      // Bottom navigation scroll behavior
      if (scrollTop > lastScrollY && scrollTop > 50) {
        // Scrolling down - hide bottom nav
        setShowBottomNav(false);
      } else if (scrollTop < lastScrollY) {
        // Scrolling up - show bottom nav
        setShowBottomNav(true);
      }
      
      setLastScrollY(scrollTop);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Click outside to close scrolled modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      console.log('Click detected, showFullHeader:', showFullHeader);
      if (scrolledModalRef.current && !scrolledModalRef.current.contains(target)) {
        console.log('Click outside detected, closing full header');
        setShowFullHeader(false);
      }
    };

    if (showFullHeader) {
      // Add a small delay to prevent immediate closing when clicking the search bar
      const timeoutId = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 100);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showFullHeader]);

  return (
    <>
      <header className={`w-full bg-gray-100 backdrop-blur border-b transition-all duration-300 z-50 ${
        (isScrolled && !(isClient && (isRoomDetailsPage || isSearchResultsPage)))
          ? 'fixed top-0 shadow-lg' 
          : 'relative'
      }`}>
        {/* Mobile Header - Search bar + tabs */}
        <div className="md:hidden px-4 py-3">
          {/* Search Bar */}
          <div 
            className="bg-white border border-gray-300 rounded-full shadow-sm hover:shadow-md transition-shadow cursor-pointer mb-4"
            onClick={() => {
              setShowFullHeader(true);
              setShowMobileModal(true);
            }}
          >
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <div className="text-left">
                  <div className="text-gray-500 text-sm">Where</div>
                  <div className="text-gray-900 font-medium">
                    {destination || 'Search destinations'}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-left">
                  <div className="text-gray-500 text-sm">When</div>
                  <div className="text-gray-900 font-medium">
                    {checkIn && checkOut 
                      ? `${checkIn.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${checkOut.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                      : t('search.addDates')
                    }
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-gray-500 text-sm">Who</div>
                  <div className="text-gray-900 font-medium">
                    {guests.adults + guests.children + guests.infants + guests.pets > 0
                      ? (() => {
                          const parts = [];
                          if (guests.adults > 0) parts.push(`${guests.adults} adult${guests.adults > 1 ? 's' : ''}`);
                          if (guests.children > 0) parts.push(`${guests.children} child${guests.children > 1 ? 'ren' : ''}`);
                          if (guests.infants > 0) parts.push(`${guests.infants} infant${guests.infants > 1 ? 's' : ''}`);
                          if (guests.pets > 0) parts.push(`${guests.pets} pet${guests.pets > 1 ? 's' : ''}`);
                          return parts.join(', ');
                        })()
                      : t('search.addGuests')
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Center Tabs */}
          <div className="flex justify-center space-x-8">
            <button className="flex flex-col items-center">
              <div className="w-8 h-8 mb-1 flex items-center justify-center">
                <img 
                  src="https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-search-bar-icons/original/a32adab1-f9df-47e1-a411-bdff91b579c3.png?im_w=240"
                  alt="house"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xs font-medium text-gray-900">Homes</span>
            </button>
            <button className="flex flex-col items-center">
              <div className="w-8 h-8 mb-1 flex items-center justify-center">
                <img 
                  src="https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-search-bar-icons/original/e47ab655-027b-4679-b2e6-df1c99a5c33d.png?im_w=240"
                  alt="balloon"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xs font-medium text-gray-500">Experiences</span>
            </button>
            <button className="flex flex-col items-center">
              <div className="w-8 h-8 mb-1 flex items-center justify-center">
                <img 
                  src="https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-search-bar-icons/original/3d67e9a9-520a-49ee-b439-7b3a75ea814d.png?im_w=240"
                  alt="services"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xs font-medium text-gray-500">Services</span>
            </button>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:block">
          {showFullHeader ? (
            /* Full header with navbar and search bar */
            <div className="p-4" ref={scrolledModalRef}>
              <Navbar onOpenModal={() => setUnifiedModalOpen(true)} />
              <div className="mx-auto max-w-5xl px-4 md:px-6 lg:px-0">
                <SearchBar />
              </div>
            </div>
          ) : (isScrolled || (isClient && (isRoomDetailsPage || isSearchResultsPage))) ? (
            /* 3-column search bar for scrolled state or room details page */
            <div className="w-full px-4 py-3">
              <div className="flex items-center justify-between max-w-7xl mx-auto">
                {/* Left: Logo */}
                <div className="flex items-center">
                  <Link href="/" className="flex items-center">
                    <AirbnbLogo className="h-8 w-auto" />
                  </Link>
                </div>

                {/* Center: Simplified 3-Column Search Bar */}
                <div className="flex justify-center">
                  <div 
                    className="bg-white border border-gray-300 rounded-full shadow-sm hover:shadow-md transition-shadow cursor-pointer w-auto"
                    onClick={() => {
                      console.log('3-column search bar clicked, setting showFullHeader to true');
                      setShowFullHeader(true);
                    }}
                  >
                    <div className="flex items-center">
                      {/* Anywhere Column */}
                      <div className="px-4 py-3 text-left hover:bg-gray-50 rounded-l-full transition-colors flex items-center gap-2">
                        <img 
                          src="https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-search-bar-icons/original/4aae4ed7-5939-4e76-b100-e69440ebeae4.png?im_w=240"
                          alt="house"
                          className="w-12 h-10"
                        />
                        <span className="text-sm font-medium text-gray-900">{t('search.anywhere')}</span>
                      </div>
                      
                      <div className="w-px h-6 bg-gray-300"></div>
                      
                      {/* Anytime Column */}
                      <div className="px-4 py-3 text-left hover:bg-gray-50 transition-colors">
                        <span className="text-sm font-medium text-gray-900">{t('search.anytime')}</span>
                      </div>
                      
                      <div className="w-px h-6 bg-gray-300"></div>
                      
                      {/* Add guests Column */}
                      <div className="px-4 py-3 text-left hover:bg-gray-50 rounded-r-full transition-colors">
                        <span className="text-sm font-medium text-gray-900">{t('search.addGuests')}</span>
                      </div>
                      
                      {/* Search Button */}
                      <div className="m-1 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setBecomeHostModalOpen(true)}
                    className="hide-become-host text-[15px] font-medium text-gray-950 hover:bg-gray-100 rounded-full px-3 py-2"
                  >
                    {t('nav.becomeHost')}
                  </button>
                  <button
                    className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
                    onClick={() => setUnifiedModalOpen(true)}
                    aria-label="Language and Currency"
                  >
                    <img
                      width="24"
                      height="24"
                      src="https://img.icons8.com/forma-light/24/1A1A1A/geography.png"
                      alt="geography"
                    />
                  </button>
                  <button 
                    ref={buttonRef}
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-black"
                  >
                    <img
                      width="20"
                      height="20"
                      src="https://img.icons8.com/ios-glyphs/30/1A1A1A/menu--v3.png"
                      alt="menu--v3"
                    />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Normal state: Full header with navbar and search bar */
            <div className="p-4">
              <Navbar onOpenModal={() => setUnifiedModalOpen(true)} />
      <div className="mx-auto max-w-5xl px-4 md:px-6 lg:px-0">
        <SearchBar />
              </div>
            </div>
          )}
      </div>
    </header>

      {/* Dropdown Menu for Scrolled Header */}
      {dropdownOpen && createPortal(
        <div
          ref={dropdownRef}
          className="fixed w-80 bg-white border rounded-lg shadow-lg py-4 text-sm z-[9999] min-w-max"
          style={{
            top: `${buttonPosition.top}px`,
            right: `${buttonPosition.right}px`
          }}
        >
          {/* Help Center */}
          <Link
            href="/help"
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-950 border-b border-gray-200"
          >
            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="font-medium">{t('nav.helpCenter')}</span>
          </Link>

          {/* Become a host */}
          <button
            onClick={() => setBecomeHostModalOpen(true)}
            className="flex items-center justify-between px-4 py-4 hover:bg-gray-50 text-gray-950 border-b border-gray-200 w-full text-left"
          >
            <div className="flex-1">
              <div className="font-semibold text-gray-900 mb-1">{t('nav.becomeHost')}</div>
              <div className="text-sm text-gray-500">It&apos;s easy to start hosting and earn extra income.</div>
            </div>
            <div className="ml-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <div className="w-6 h-6 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </button>

          {/* Refer a Host */}
          <Link
            href="/refer"
            className="block px-4 py-3 hover:bg-gray-50 text-gray-950 border-b border-gray-200"
          >
            {t('nav.referHost')}
          </Link>

          {/* Find a co-host */}
          <Link
            href="/cohost"
            className="block px-4 py-3 hover:bg-gray-50 text-gray-950 border-b border-gray-200"
          >
            {t('nav.findCohost')}
          </Link>

          {/* Gift cards */}
          <Link
            href="/gift-cards"
            className="block px-4 py-3 hover:bg-gray-50 text-gray-950 border-b border-gray-200"
          >
            {t('nav.giftCards')}
          </Link>

          {/* Log in or sign up */}
          <Link
            href="/login"
            className="block px-4 py-3 hover:bg-gray-50 text-gray-950"
          >
            {t('nav.loginSignup')}
          </Link>
        </div>,
        document.body
      )}

      {/* Mobile Bottom Navigation */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 transition-transform duration-300 ${
        showBottomNav ? 'translate-y-0' : 'translate-y-full'
      }`}>
        <div className="flex items-center justify-around py-2">
          <button className="flex flex-col items-center py-2 px-3 text-red-500">
            <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            </svg>
            <span className="text-xs font-medium">Explore</span>
          </button>
          <button className="flex flex-col items-center py-2 px-3 text-gray-500">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="text-xs font-medium">Wishlist</span>
          </button>
          <button className="flex flex-col items-center py-2 px-3 text-gray-500">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-xs font-medium">Login</span>
          </button>
        </div>
      </div>

      {/* Mobile Search Modal */}
      {showMobileModal && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-50">
          <div className="bg-white h-full flex flex-col">
            {/* Header with Navbar Tabs */}
            <div className="p-4 border-b">
              <div className="flex items-center justify-between mb-4">
                <div className="flex space-x-6">
                  <button className="text-lg font-semibold text-gray-900 border-b-2 border-black pb-2">Homes</button>
                  <button className="text-lg font-semibold text-gray-500">Experiences</button>
                  <button className="text-lg font-semibold text-gray-500">Services</button>
                </div>
                <button 
                  onClick={() => {
                    setShowFullHeader(false);
                    setShowMobileModal(false);
                    setMobileActiveSection('where');
                  }}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-hidden">
              {mobileActiveSection === 'where' && (
                <div className="p-4 h-full">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Where?</h2>
                  <div className="text-gray-500 mb-6">Search destinations</div>
                  
                  {/* Search Input */}
                  <div className="mb-6">
                    <input
                      type="text"
                      placeholder="Search destinations"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full p-4 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  {/* Recent Searches */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Recent searches</h3>
                    <div className="space-y-2">
                        <button
                          onClick={() => {
                            setDestination('Kuala Lumpur');
                            setShowMobileModal(false);
                            setShowFullHeader(false);
                          }}
                          className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                        <div className="text-xl">🏢</div>
                        <div className="flex-1 text-left">
                          <div className="font-medium text-gray-900">Kuala Lumpur</div>
                          <div className="text-sm text-gray-500">Oct 17 – 19 • 1 guest</div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Suggested Destinations */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Suggested destinations</h3>
                    <div className="space-y-2">
                      {[
                        { name: 'Nearby', country: '', description: 'Find what\'s around you', icon: '✈️' },
                        { name: 'Toronto', country: 'Canada', description: 'Guests interested in Ottawa also looked here', icon: '🏢' },
                        { name: 'Bangkok', country: 'Thailand', description: 'Because your wishlist has stays in Bangkok', icon: '🏛️' },
                        { name: 'London', country: 'United Kingdom', description: 'For sights like Buckingham Palace', icon: '🌉' },
                        { name: 'New York', country: 'NY', description: 'For its stunning architecture', icon: '🌉' }
                      ].map((dest, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setDestination(dest.name);
                            setShowMobileModal(false);
                            setShowFullHeader(false);
                          }}
                          className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <div className="text-xl">{dest.icon}</div>
                          <div className="flex-1 text-left">
                            <div className="font-medium text-gray-900">
                              {dest.name}
                              {dest.country && <span className="text-gray-500">, {dest.country}</span>}
                            </div>
                            <div className="text-sm text-gray-500">{dest.description}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {mobileActiveSection === 'when' && (
                <div className="p-4 h-full">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">When?</h2>
                  <div className="text-gray-500 mb-6">{t('search.addDates')}</div>
                  
                  {/* Mobile Date Range Modal */}
                  <div className="h-full overflow-hidden">
                    <DateRangeModal
                      open={true}
                      activeField="checkin"
                      checkIn={checkIn}
                      checkOut={checkOut}
                      onPick={(date) => {
                        if (!checkIn) {
                          setCheckIn(date);
                        } else if (!checkOut && date > checkIn) {
                          setCheckOut(date);
                        } else {
                          setCheckIn(date);
                          setCheckOut(null);
                        }
                      }}
                      onClose={() => setShowMobileModal(false)}
                    />
                  </div>
                  
                  {/* Done Button for Date Selection */}
                  <div className="p-4 border-t bg-white">
                    <button
                      onClick={() => {
                        setShowMobileModal(false);
                        setShowFullHeader(false);
                      }}
                      className="w-full bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 transition-colors"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}

              {mobileActiveSection === 'who' && (
                <div className="p-4 h-full">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Who?</h2>
                  <div className="text-gray-500 mb-6">{t('search.addGuests')}</div>
                  
                  <div className="space-y-6">
                    {/* Adults */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-lg font-medium text-gray-900">Adults</div>
                        <div className="text-sm text-gray-500">Ages 13 or above</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setGuests(prev => ({ ...prev, adults: Math.max(1, prev.adults - 1) }))}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <span className="text-lg font-medium w-8 text-center">{guests.adults}</span>
                        <button
                          onClick={() => setGuests(prev => ({ ...prev, adults: prev.adults + 1 }))}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Children */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-lg font-medium text-gray-900">Children</div>
                        <div className="text-sm text-gray-500">Ages 2-12</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setGuests(prev => ({ ...prev, children: Math.max(0, prev.children - 1) }))}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <span className="text-lg font-medium w-8 text-center">{guests.children}</span>
                        <button
                          onClick={() => setGuests(prev => ({ ...prev, children: prev.children + 1 }))}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Infants */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-lg font-medium text-gray-900">Infants</div>
                        <div className="text-sm text-gray-500">Under 2</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setGuests(prev => ({ ...prev, infants: Math.max(0, prev.infants - 1) }))}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <span className="text-lg font-medium w-8 text-center">{guests.infants}</span>
                        <button
                          onClick={() => setGuests(prev => ({ ...prev, infants: prev.infants + 1 }))}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Pets */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-lg font-medium text-gray-900">Pets</div>
                        <div className="text-sm text-gray-500">Bringing a service animal?</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setGuests(prev => ({ ...prev, pets: Math.max(0, prev.pets - 1) }))}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <span className="text-lg font-medium w-8 text-center">{guests.pets}</span>
                        <button
                          onClick={() => setGuests(prev => ({ ...prev, pets: prev.pets + 1 }))}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Done Button for Guest Selection */}
                  <div className="p-4 border-t bg-white">
                    <button
                      onClick={() => {
                        setShowMobileModal(false);
                        setShowFullHeader(false);
                      }}
                      className="w-full bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 transition-colors"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Section Navigation */}
            <div className="border-t p-4">
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => setMobileActiveSection('where')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    mobileActiveSection === 'where' ? 'bg-gray-100 text-gray-900' : 'text-gray-500'
                  }`}
                >
                  Where
                </button>
                <button 
                  onClick={() => setMobileActiveSection('when')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    mobileActiveSection === 'when' ? 'bg-gray-100 text-gray-900' : 'text-gray-500'
                  }`}
                >
                  When
                </button>
                <button 
                  onClick={() => setMobileActiveSection('who')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    mobileActiveSection === 'who' ? 'bg-gray-100 text-gray-900' : 'text-gray-500'
                  }`}
                >
                  Who
                </button>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="border-t p-4">
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => {
                    setDestination('');
                    setCheckIn(null);
                    setCheckOut(null);
                    setGuests({ adults: 1, children: 0, infants: 0, pets: 0 });
                  }}
                  className="text-gray-500 underline hover:text-gray-700"
                >
                  Clear all
                </button>
                <button 
                  onClick={() => {
                    setShowMobileModal(false);
                    setShowFullHeader(false);
                  }}
                  className="bg-red-500 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-red-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Become Host Modal */}
      <BecomeHostModal
        isOpen={becomeHostModalOpen}
        onClose={() => setBecomeHostModalOpen(false)}
      />

    </>
  );
}
