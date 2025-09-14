/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import UnifiedModal from "./UnifiedModal";
import { useLanguage } from "../contexts/LanguageContext";

type ActiveField = null | "where" | "checkin" | "checkout" | "who";

interface GuestCounts {
  adults: number;
  children: number;
  infants: number;
  pets: number;
}

export default function SearchBar() {
  const [activeField, setActiveField] = useState<ActiveField>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [dateMode, setDateMode] = useState<"dates" | "months" | "flexible">("dates");
  const [isClient, setIsClient] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    setIsClient(true);
  }, []);


  const [destination, setDestination] = useState<string>("");
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [guests, setGuests] = useState<GuestCounts>({
    adults: 0,
    children: 0,
    infants: 0,
    pets: 0
  });

  const openFor = (field: ActiveField) => {
    setActiveField(field);
    setModalOpen(true);
  };
  
  const closeModal = () => {
    setModalOpen(false);
    setActiveField(null);
  };


  const handleDestinationSelect = (selectedDestination: string) => {
    setDestination(selectedDestination);
  };

  const handleGuestsChange = (newGuests: GuestCounts) => {
    setGuests(newGuests);
  };

  const fmt = (d: Date | null) =>
    d
      ? d.toLocaleDateString(undefined, { month: "short", day: "numeric" })
      : t('search.addDates');

  const getDateDisplay = () => {
    if (dateMode === "dates") {
      if (checkIn && checkOut) {
        return `${fmt(checkIn)} - ${fmt(checkOut)}`;
      } else if (checkIn) {
        return fmt(checkIn);
      }
      return t('search.addDates');
    } else if (dateMode === "months") {
      return "3 months";
    } else if (dateMode === "flexible") {
      return "Anytime";
    }
    return t('search.addDates');
  };

  const handleSearch = () => {
    if (!destination.trim()) {
      alert("Please enter a destination");
      return;
    }

    const params = new URLSearchParams();
    params.append('where', destination);
    
    if (checkIn) {
      params.append('checkIn', checkIn.toISOString().split('T')[0]);
    }
    if (checkOut) {
      params.append('checkOut', checkOut.toISOString().split('T')[0]);
    }
    
    const totalGuests = guests.adults + guests.children + guests.infants + guests.pets;
    params.append('guests', totalGuests.toString());
    params.append('adults', guests.adults.toString());
    params.append('children', guests.children.toString());
    params.append('infants', guests.infants.toString());
    params.append('pets', guests.pets.toString());

    window.location.href = `/search?${params.toString()}`;
  };

  const handlePick = (d: Date) => {
    const picked = new Date(d.getFullYear(), d.getMonth(), d.getDate());

    if (activeField === "checkin") {
      setCheckIn(picked);
      setCheckOut((co) => (co && co > picked ? co : null));
      setActiveField("checkout");
      return;
    }

    if (!checkIn) {
      setCheckIn(picked);
      setActiveField("checkout");
      return;
    }
    if (picked > checkIn) {
      setCheckOut(picked);
    } else {
      setCheckIn(picked);
      setCheckOut(null);
      setActiveField("checkout");
    }
  };

  const clearCheckIn = () => {
    setCheckIn(null);
    setCheckOut(null);
    setActiveField("checkin");
    setModalOpen(true);
  };
  const clearCheckOut = () => {
    setCheckOut(null);
    setActiveField("checkout");
    setModalOpen(true);
  };

  const clearDestination = () => {
    setDestination("");
    setActiveField("where");
    setModalOpen(true);
  };

  const clearGuests = () => {
    setGuests({ adults: 0, children: 0, infants: 0, pets: 0 });
    setActiveField("who");
    setModalOpen(true);
  };

  const getGuestText = () => {
    const totalGuests = guests.adults + guests.children;
    const infants = guests.infants;
    const pets = guests.pets;
    
    if (totalGuests === 0 && infants === 0 && pets === 0) return t('search.addGuests');
    
    let text = "";
    
    if (totalGuests > 0) {
      text += totalGuests === 1 ? "1 guest" : `${totalGuests} guests`;
    }
    
    if (infants > 0) {
      if (text) text += ", ";
      text += infants === 1 ? "1 infant" : `${infants} infants`;
    }
    
    if (pets > 0) {
      if (text) text += ", ";
      text += pets === 1 ? "1 pet" : `${pets} pets`;
    }
    
    return text;
  };


  if (!isClient) {
    return (
      <div className="relative py-4">
        <div className="relative mx-auto max-w-4xl rounded-full border border-gray-300 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.12)] px-1">
          <div className="flex items-center h-[68px] px-1 overflow-visible">
            <div className="flex-1 px-4 py-2">
              <div className="text-[12px] font-semibold text-gray-900">Where</div>
              <div className="text-[14px] text-gray-500">Search destinations</div>
            </div>
            <div className="w-px h-6 bg-gray-300 mx-2"></div>
            <div className="flex-1 px-4 py-2">
              <div className="text-[12px] font-semibold text-gray-900">Check in</div>
              <div className="text-[14px] text-gray-500">Add dates</div>
            </div>
            <div className="w-px h-6 bg-gray-300 mx-2"></div>
            <div className="flex-1 px-4 py-2">
              <div className="text-[12px] font-semibold text-gray-900">Check out</div>
              <div className="text-[14px] text-gray-500">Add dates</div>
            </div>
            <div className="w-px h-6 bg-gray-300 mx-2"></div>
            <div className="flex-1 px-4 py-2">
              <div className="text-[12px] font-semibold text-gray-900">Who</div>
              <div className="text-[14px] text-gray-500">Add guests</div>
            </div>
            <div className="ml-2 shrink-0">
              <button className="h-12 w-12 rounded-full border border-rose-500 bg-rose-500 flex items-center justify-center">
                <img
                  width={22}
                  height={22}
                  src="https://img.icons8.com/ios-glyphs/30/FFFFFF/search--v1.png"
                  alt="search"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative py-4">
      <div className="relative mx-auto max-w-4xl rounded-full border border-gray-300 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.12)] px-1">
        <div className="flex items-center h-[68px] px-1 overflow-visible">
          <Section
            grow="flex-[1.8]"
            onClick={() => openFor("where")}
            active={activeField === "where"}
            role="button"
          >
            <Content>
              <Label>{t('search.where')}</Label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => {
                    e.stopPropagation();
                    setDestination(e.target.value);
                    if (!modalOpen) {
                      setActiveField("where");
                      setModalOpen(true);
                    }
                  }}
                  onFocus={(e) => {
                    e.stopPropagation();
                    setActiveField("where");
                    setModalOpen(true);
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveField("where");
                    setModalOpen(true);
                  }}
                  placeholder={t('search.destinations')}
                  className="flex-1 bg-transparent text-[14px] text-gray-600 focus:outline-none focus:text-gray-900 placeholder:text-gray-600"
                />
                {destination && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      clearDestination();
                    }}
                    className="grid place-items-center h-5 w-5 rounded-full bg-gray-200 text-gray-700 text-[11px]"
                  >
                    ×
                  </button>
                )}
              </div>
            </Content>
            <Divider />
          </Section>

          {dateMode === "dates" ? (
            <>
              
              <Section
                grow="flex-[1]"
                onClick={() => openFor("checkin")}
                active={activeField === "checkin"}
                role="button"
              >
                <Content>
                  <Label>{t('search.checkin')}</Label>
                  <div className="flex items-center gap-2">
                    <Sub className={checkIn ? "text-gray-900" : ""}>{fmt(checkIn)}</Sub>
                    {checkIn && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          clearCheckIn();
                        }}
                        className="grid place-items-center h-5 w-5 rounded-full bg-gray-200 text-gray-700 text-[11px]"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </Content>
                <Divider />
              </Section>

              <Section
                grow="flex-[1]"
                onClick={() => openFor("checkout")}
                active={activeField === "checkout"}
                role="button"
              >
                <Content>
                  <Label>{t('search.checkout')}</Label>
                  <div className="flex items-center gap-2">
                    <Sub className={checkOut ? "text-gray-900" : ""}>{fmt(checkOut)}</Sub>
                    {checkOut && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          clearCheckOut();
                        }}
                        className="grid place-items-center h-5 w-5 rounded-full bg-gray-200 text-gray-700 text-[11px]"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </Content>
                <Divider />
              </Section>
            </>
          ) : (
            
            <Section
              grow="flex-[2]"
              onClick={() => openFor("checkin")}
              active={activeField === "checkin"}
              role="button"
            >
              <Content>
                <Label>{t('search.when')}</Label>
                <div className="flex items-center gap-2">
                  <Sub className="text-gray-900">{getDateDisplay()}</Sub>
                </div>
              </Content>
              <Divider />
            </Section>
          )}

          
          <Section
            grow="flex-[1.8]"
            onClick={() => openFor("who")}
            active={activeField === "who"}
            role="button"
            isLast
          >
            <Content>
              <Label>{t('search.who')}</Label>
              <div className="flex items-center gap-2">
                <Sub className={guests.adults + guests.children + guests.infants + guests.pets > 0 ? "text-gray-900" : ""}>
                  {getGuestText()}
                </Sub>
                {guests.adults + guests.children + guests.infants + guests.pets > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      clearGuests();
                    }}
                    className="grid place-items-center h-5 w-5 rounded-full bg-gray-200 text-gray-700 text-[11px]"
                  >
                    ×
                  </button>
                )}
              </div>
            </Content>
            <div className="ml-2 shrink-0 relative z-[5]">
              <button
                onClick={handleSearch}
                aria-label="Search"
                className={`
                  h-12 rounded-full border border-rose-500 bg-rose-500
                  shadow-[0_4px_12px_rgba(255,56,92,0.35)]
                  flex items-center justify-center gap-1 px-3
                  transition-all duration-200 ease-out
                  ${activeField ? 'w-auto' : 'w-12'}
                  hover:bg-rose-600
                `}
              >
                <img
                  width={22}
                  height={22}
                  src="https://img.icons8.com/ios-glyphs/30/FFFFFF/search--v1.png"
                  alt="search"
                />
                {activeField && (
                  <span className="text-white text-sm font-medium whitespace-nowrap">{t('search.search')}</span>
                )}
              </button>
            </div>
          </Section>
        </div>

        <UnifiedModal
          open={modalOpen}
          onClose={closeModal}
          activeField={activeField}
          destination={destination}
          onSelectDestination={handleDestinationSelect}
          checkIn={checkIn}
          checkOut={checkOut}
          onPick={handlePick}
          dateMode={dateMode}
          onDateModeChange={setDateMode}
          guests={guests}
          onApplyGuests={handleGuestsChange}
        />
      </div>
    </div>
  );
}

function Section({
  children,
  isLast,
  grow = "flex-1",
  onClick,
  role,
  active = false,
}: {
  children: React.ReactNode;
  isLast?: boolean;
  grow?: string;
  onClick?: () => void;
  role?: string;
  active?: boolean;
}) {
  
  let className = "group relative flex h-full px-3 py-1 overflow-hidden items-center";
  
  if (grow === "flex-1") {
    className += " flex-1";
  } else if (grow === "flex-[1.8]") {
    className += " flex-[1.8]";
  } else {
    className += " " + grow;
  }
  
  if (isLast) {
    className += " pr-3";
  } else {
    className += " pr-1";
  }
  
  if (onClick) {
    className += " cursor-pointer";
  }
  
  let hoverClassName = "absolute inset-0 rounded-full bg-gray-100 transition-opacity duration-200 ease-out";
  if (active) {
    hoverClassName += " opacity-100";
  } else {
    hoverClassName += " opacity-0 group-hover:opacity-100";
  }
  
  return (
    <div
      onClick={onClick}
      role={role as any}
      className={className}
    >
      <span className={hoverClassName} />
      <div className="relative z-[2] flex w-full items-center justify-between">
        {children}
      </div>
    </div>
  );
}

function Content({ children }: { children: React.ReactNode }) {
  return <div className="flex min-w-0 flex-col leading-tight space-y-[2px]">{children}</div>;
}

function Divider() {
  return (
    <span className="mx-2 h-7 w-px self-center rounded-full bg-gray-200 transition-opacity duration-150 group-hover:opacity-0" />
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <span className="text-[13px] font-semibold text-gray-800 tracking-tight">{children}</span>;
}

function Sub({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span className={`text-[14px] text-gray-600 truncate ${className}`}>{children}</span>;
}
