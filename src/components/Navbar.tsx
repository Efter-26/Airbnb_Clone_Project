
"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import AirbnbLogo from "./AirbnbLogo";
import NavTab from "./NavTab";
import { useLanguage } from "../contexts/LanguageContext";
import UnifiedLanguageCurrencyModal from "./UnifiedLanguageCurrencyModal";
import BecomeHostModal from "./BecomeHostModal";

type TabKey = "homes" | "experiences" | "services";

interface NavbarProps {
  active?: TabKey;
  onOpenModal?: () => void;
}

export default function Navbar({ active = "homes" }: NavbarProps) {
  const [activeTab, setActiveTab] = useState<TabKey>(active); // default "homes"
  const [modalOpen, setModalOpen] = useState(false);
  const [becomeHostModalOpen, setBecomeHostModalOpen] = useState(false);
  const { t, language, setLanguage } = useLanguage();
  
  return (
    <header className="w-full bg-gray-100 backdrop-blur">
      <div className="w-full h-20 px-2 md:px-6 flex items-center justify-between">
       
        <div className="flex h-full items-center">
          
          <Link href="/" className="flex items-center gap-2">
            <AirbnbLogo className="h-9 w-auto" />
            <span className="sr-only">Airbnb</span>
          </Link>

          
          <div className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 flex items-center gap-3 md:gap-4">
             <button
               onClick={() => setBecomeHostModalOpen(true)}
               className="hide-become-host text-[15px] font-medium text-gray-950 hover:bg-gray-100 rounded-full px-3 py-2"
             >
               {t('nav.becomeHost')}
             </button>
            <GlobeButton onOpenModal={() => {
              console.log('Opening modal...');
              setModalOpen(true);
            }} />
            <MenuDropdown onOpenBecomeHost={() => setBecomeHostModalOpen(true)} />
          </div>

          <nav className="font-bold pointer-events-auto absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:flex items-center gap-4">
             <NavTab
               href="/"
               label={t('nav.homes')}
               videoSrc="https://a0.muscache.com/videos/search-bar-icons/webm/house-selected.webm"
               posterInactive="https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-search-bar-icons/original/a32adab1-f9df-47e1-a411-bdff91b579c3.png?im_w=240"
               active={activeTab === "homes"}
               onSelect={() => setActiveTab("homes")}
             />
             <NavTab
               href="/experiences"
               label={t('nav.experiences')}
               videoSrc="https://a0.muscache.com/videos/search-bar-icons/webm/balloon-selected.webm"
               posterInactive="https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-search-bar-icons/original/e47ab655-027b-4679-b2e6-df1c99a5c33d.png?im_w=240"
               active={activeTab === "experiences"}
               onSelect={() => setActiveTab("experiences")}
             />
             <NavTab
               href="/services"
               label={t('nav.services')}
               videoSrc="https://a0.muscache.com/videos/search-bar-icons/webm/consierge-selected.webm"
               posterInactive="https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-search-bar-icons/original/3d67e9a9-520a-49ee-b439-7b3a75ea814d.png?im_w=240"
               active={activeTab === "services"}
               onSelect={() => setActiveTab("services")}
             />
          </nav>
        </div>
      </div>
      
      <UnifiedLanguageCurrencyModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSelectLanguage={(lang) => {
          
          const langCode = lang.code === 'en-US' ? 'en' : 'bn';
          setLanguage(langCode);
          setModalOpen(false);
          
          window.location.reload();
        }}
        onSelectCurrency={(currency) => {
          
          console.log('Selected currency:', currency);
        }}
        selectedLanguage={{
          code: language === 'en' ? 'en-US' : 'bn-BD',
          name: language === 'en' ? 'English' : 'বাংলা',
          region: language === 'en' ? 'United States' : 'Bangladesh',
          flag: language === 'en' ? '🇺🇸' : '🇧🇩'
        }}
        selectedCurrency={{
          code: 'USD',
          name: 'United States dollar',
          symbol: '$',
          region: 'United States'
        }}
      />
      
     
      <BecomeHostModal
        isOpen={becomeHostModalOpen}
        onClose={() => setBecomeHostModalOpen(false)}
      />
    </header>
  );
}

function GlobeButton({ onOpenModal }: { onOpenModal?: () => void }) {
  return (
    <button
      className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
      onClick={onOpenModal}
      aria-label="Language and Currency"
    >
      <img
        width="24"
        height="24"
        src="https://img.icons8.com/forma-light/24/1A1A1A/geography.png"
        alt="geography"
      />
    </button>
  );
}

function MenuDropdown({ onOpenBecomeHost }: { onOpenBecomeHost: () => void }) {
  const [open, setOpen] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ top: 0, right: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    if (open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setButtonPosition({
        top: rect.bottom + window.scrollY + 8,
        right: window.innerWidth - rect.right - window.scrollX
      });
    }
  }, [open]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current && !buttonRef.current.contains(event.target as Node) &&
        dropdownRef.current && !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-black"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Menu"
      >
        <img
          width="20"
          height="20"
          src="https://img.icons8.com/ios-glyphs/30/1A1A1A/menu--v3.png"
          alt="menu--v3"
        />
      </button>
       {open && createPortal(
         <div
           ref={dropdownRef}
           role="menu"
           className="fixed w-80 bg-white border rounded-lg shadow-lg py-4 text-sm z-[9999] min-w-max"
           style={{
             top: `${buttonPosition.top}px`,
             right: `${buttonPosition.right}px`
           }}
         >
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

           <button
             onClick={onOpenBecomeHost}
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

           <Link
             href="/refer"
             className="block px-4 py-3 hover:bg-gray-50 text-gray-950 border-b border-gray-200"
           >
             {t('nav.referHost')}
           </Link>

           <Link
             href="/cohost"
             className="block px-4 py-3 hover:bg-gray-50 text-gray-950 border-b border-gray-200"
           >
             {t('nav.findCohost')}
           </Link>

           <Link
             href="/gift-cards"
             className="block px-4 py-3 hover:bg-gray-50 text-gray-950 border-b border-gray-200"
           >
             {t('nav.giftCards')}
           </Link>

           <Link
             href="/login"
             className="block px-4 py-3 hover:bg-gray-50 text-gray-950"
           >
             {t('nav.loginSignup')}
           </Link>
         </div>,
         document.body
       )}
    </div>
  );
}
