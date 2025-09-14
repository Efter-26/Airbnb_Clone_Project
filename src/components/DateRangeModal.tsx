"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export default function DateRangeModal({
  open,
  onClose,
  checkIn,
  checkOut,
  onPick,
  dateMode = "dates",
  onDateModeChange,
}: {
  open: boolean;
  onClose: () => void;
  checkIn: Date | null;
  checkOut: Date | null;
  activeField: "checkin" | "checkout";
  onPick: (d: Date) => void;
  dateMode?: "dates" | "months" | "flexible";
  onDateModeChange?: (mode: "dates" | "months" | "flexible") => void;
}) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [selectedMode, setSelectedMode] = useState<"dates" | "months" | "flexible">(dateMode);
  const [selectedDuration, setSelectedDuration] = useState<"weekend" | "week" | "month">("weekend");
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
  const [monthDuration, setMonthDuration] = useState(3);

  useEffect(() => {
    setSelectedMode(dateMode);
  }, [dateMode]);

  const handleModeChange = (mode: "dates" | "months" | "flexible") => {
    setSelectedMode(mode);
    onDateModeChange?.(mode);
  };

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (panelRef.current && !panelRef.current.contains(t)) onClose();
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const today = new Date();
  const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);

  const [base, setBase] = useState<Date>(startOfMonth(today)); // left month
  const months = useMemo(
    () => [base, new Date(base.getFullYear(), base.getMonth() + 1, 1)],
    [base]
  );

  if (!open) return null;

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="false"
      className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-200 rounded-2xl shadow-lg p-6"
    >
      <div className="flex items-center justify-center mb-6">
        <div className="inline-flex rounded-full bg-gray-100 p-1">
          {[
            { key: "dates", label: "Dates" },
            { key: "months", label: "Months" },
            { key: "flexible", label: "Flexible" }
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => handleModeChange(item.key as "dates" | "months" | "flexible")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedMode === item.key
                  ? "bg-white shadow text-gray-900"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <button
          onClick={onClose}
          className="absolute right-6 h-8 w-8 rounded-full hover:bg-gray-100 grid place-items-center"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {selectedMode === "dates" && (
        <>
          <div className="grid grid-cols-2 gap-8">
            {months.map((m, i) => (
              <MonthView
                key={i}
                date={m}
                canPrev={i === 0 && base > startOfMonth(today)}
                canNext={i === 1}
                onPrev={() => setBase(new Date(base.getFullYear(), base.getMonth() - 1, 1))}
                onNext={() => setBase(new Date(base.getFullYear(), base.getMonth() + 1, 1))}
                checkIn={checkIn}
                checkOut={checkOut}
                onPick={onPick}
              />
            ))}
          </div>

          <div className="flex items-center justify-center mt-6 pt-6 border-t">
            <div className="flex gap-2">
              {["Exact dates", "+ 1 day", "+ 2 days", "+ 7 days"].map(
                (label, i) => (
                  <button
                    key={label}
                    className={`px-4 py-2 rounded-full border text-sm ${
                      i === 0 ? "border-gray-900 bg-gray-900 text-white" : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {label}
                  </button>
                )
              )}
            </div>
          </div>
        </>
      )}

      {selectedMode === "months" && (
        <MonthsView 
          monthDuration={monthDuration}
          setMonthDuration={setMonthDuration}
          onClose={onClose}
        />
      )}

      {selectedMode === "flexible" && (
        <FlexibleView 
          selectedDuration={selectedDuration}
          setSelectedDuration={setSelectedDuration}
          selectedMonths={selectedMonths}
          setSelectedMonths={setSelectedMonths}
          onClose={onClose}
        />
      )}
    </div>
  );
}

function MonthsView({ 
  monthDuration, 
  setMonthDuration 
}: { 
  monthDuration: number; 
  setMonthDuration: (duration: number) => void; 
  onClose: () => void; 
}) {
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMonthDuration(parseInt(e.target.value));
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl font-semibold text-gray-900 mb-8">When&apos;s your trip?</h2>
      
      <div className="relative w-64 h-64 mx-auto mb-8">
        <div className="relative w-full h-full">
          <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
          
          <div 
            className="absolute inset-0 rounded-full border-4 border-red-500"
            style={{
              background: `conic-gradient(from 0deg, #ef4444 0deg, #ef4444 ${(monthDuration / 12) * 360}deg, #e5e7eb ${(monthDuration / 12) * 360}deg, #e5e7eb 360deg)`
            }}
          ></div>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">{monthDuration}</div>
              <div className="text-sm text-gray-600">months</div>
            </div>
          </div>
          
          <div 
            className="absolute w-6 h-6 bg-white rounded-full shadow-lg border-2 border-red-500 transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${50 + 45 * Math.cos(((monthDuration / 12) * 360 - 90) * Math.PI / 180)}%`,
              top: `${50 + 45 * Math.sin(((monthDuration / 12) * 360 - 90) * Math.PI / 180)}%`
            }}
          ></div>
        </div>
        
        <input
          type="range"
          min="1"
          max="12"
          value={monthDuration}
          onChange={handleSliderChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
      
      <div className="text-lg text-gray-900 mb-8">
        Oct 1, 2025 to Jan 1, 2026
      </div>
    </div>
  );
}

function FlexibleView({ 
  selectedDuration, 
  setSelectedDuration, 
  selectedMonths, 
  setSelectedMonths 
}: { 
  selectedDuration: "weekend" | "week" | "month"; 
  setSelectedDuration: (duration: "weekend" | "week" | "month") => void; 
  selectedMonths: string[]; 
  setSelectedMonths: (months: string[]) => void; 
  onClose: () => void; 
}) {
  const durations = [
    { key: "weekend", label: "Weekend" },
    { key: "week", label: "Week" },
    { key: "month", label: "Month" }
  ];

  const months = [
    "September 2025", "October 2025", "November 2025", 
    "December 2025", "January 2026", "February 2026"
  ];
  const toggleMonth = (month: string) => {
    setSelectedMonths(
      selectedMonths.includes(month)
        ? selectedMonths.filter(m => m !== month)
        : [...selectedMonths, month]
    );
  };

  return (
    <div>
      <div className="mb-8 text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">How long would you like to stay?</h3>
        <div className="flex gap-2 justify-center">
          {durations.map((duration) => (
            <button
              key={duration.key}
              onClick={() => setSelectedDuration(duration.key as "weekend" | "week" | "month")}
              className={`px-4 py-2 rounded-full border text-sm ${
                selectedDuration === duration.key
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {duration.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Go anytime</h3>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {months.map((month) => (
            <button
              key={month}
              onClick={() => toggleMonth(month)}
              className={`flex-shrink-0 px-4 py-3 rounded-lg border text-sm ${
                selectedMonths.includes(month)
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <div className="text-center">
                <div className="w-8 h-8 mx-auto mb-2 bg-gray-100 rounded flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>{month}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function isSameDay(a: Date | null, b: Date | null) {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function MonthView({
  date,
  canPrev,
  canNext,
  onPrev,
  onNext,
  checkIn,
  checkOut,
  onPick,
}: {
  date: Date;
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  checkIn: Date | null;
  checkOut: Date | null;
  onPick: (d: Date) => void;
}) {
  const y = date.getFullYear();
  const m = date.getMonth();
  const name = date.toLocaleString(undefined, { month: "long" });

  const first = new Date(y, m, 1);
  const start = first.getDay();
  const days = new Date(y, m + 1, 0).getDate();

  const cells: Array<Date | null> = [];
  for (let i = 0; i < start; i++) cells.push(null);
  for (let d = 1; d <= days; d++) cells.push(new Date(y, m, d));
  while (cells.length < 42) cells.push(null);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        {canPrev ? (
          <button
            aria-label="Previous month"
            className="h-8 w-8 rounded-full hover:bg-gray-100 grid place-items-center"
            onClick={onPrev}
          >
            <img width="24" height="24" src="https://img.icons8.com/forma-bold-sharp/24/back.png" alt="back"/>
          </button>
        ) : (
          <span className="h-8 w-8" />
        )}

        <span className="text-lg font-semibold text-gray-900">
          {name} {y}
        </span>

        {canNext ? (
          <button
            aria-label="Next month"
            className="h-8 w-8 rounded-full hover:bg-gray-100 grid place-items-center"
            onClick={onNext}
          >
            <img width="24" height="24" src="https://img.icons8.com/forma-bold-sharp/24/forward.png" alt="forward"/>
          </button>
        ) : (
          <span className="h-8 w-8" />
        )}
      </div>

      <div className="grid grid-cols-7 text-center text-xs text-gray-500 mb-2">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={`${d}-${i}`} className="py-2 font-medium">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 text-center gap-1">
        {cells.map((d, i) => {
          const selected = isSameDay(d, checkIn) || isSameDay(d, checkOut);
          const isInRange = checkIn && checkOut && d && d.getTime() > checkIn.getTime() && d.getTime() < checkOut.getTime();
          const isToday = d && isSameDay(d, new Date());
          const isPast = d && d.getTime() < new Date().setHours(0, 0, 0, 0);
          
          return (
            <div key={i} className="h-10 flex items-center justify-center">
              {d ? (
                <button
                  onClick={() => onPick(d)}
                  disabled={isPast || false}
                  className={`h-8 w-8 rounded-full grid place-items-center text-sm font-medium transition-colors
                    ${isPast ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-100 text-gray-900'}
                    ${isToday ? 'bg-gray-100 text-gray-900' : ''}
                    ${selected ? 'bg-gray-900 text-white' : ''}
                    ${isInRange ? 'bg-gray-100 text-gray-900' : ''}
                  `}
                >
                  {d.getDate()}
                </button>
              ) : (
                <span className="h-8 w-8" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
