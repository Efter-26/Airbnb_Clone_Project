
"use client";

import DestinationModal from "./DestinationModal";
import DateRangeModal from "./DateRangeModal";
import GuestSelectionModal from "./GuestSelectionModal";

interface GuestCounts {
  adults: number;
  children: number;
  infants: number;
  pets: number;
}

interface UnifiedModalProps {
  open: boolean;
  onClose: () => void;
  activeField: "where" | "checkin" | "checkout" | "who" | null;
  
  destination: string;
  onSelectDestination: (destination: string) => void;
  
  checkIn: Date | null;
  checkOut: Date | null;
  onPick: (d: Date) => void;
  dateMode?: "dates" | "months" | "flexible";
  onDateModeChange?: (mode: "dates" | "months" | "flexible") => void;
  
  guests: GuestCounts;
  onApplyGuests: (guests: GuestCounts) => void;
}

export default function UnifiedModal({
  open,
  onClose,
  activeField,
  destination,
  onSelectDestination,
  checkIn,
  checkOut,
  onPick,
  dateMode = "dates",
  onDateModeChange,
  guests,
  onApplyGuests
}: UnifiedModalProps) {
  if (!open || !activeField) return null;

  
  if (activeField === "where") {
    return (
      <div className="absolute left-0 top-full mt-2 z-50" style={{ width: '50%' }}>
        <DestinationModal
          open={open}
          onClose={onClose}
          onSelectDestination={onSelectDestination}
          searchQuery={destination}
        />
      </div>
    );
  }

  
  if (activeField === "checkin" || activeField === "checkout") {
    return (
      <div className="absolute left-0 right-0 top-full mt-2 z-50">
        <DateRangeModal
          open={open}
          onClose={onClose}
          checkIn={checkIn}
          checkOut={checkOut}
          activeField={activeField === "checkout" ? "checkout" : "checkin"}
          onPick={onPick}
          dateMode={dateMode}
          onDateModeChange={onDateModeChange}
        />
      </div>
    );
  }

  if (activeField === "who") {
    return (
      <div className="absolute right-0 top-full mt-2 z-50" style={{ width: '50%' }}>
        <GuestSelectionModal
          open={open}
          onClose={onClose}
          onGuestsChange={onApplyGuests}
          initialGuests={guests}
        />
      </div>
    );
  }

  return null;
}
