// src/components/NavTab.tsx
"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

export default function NavTab({
  href,
  label,
  icon, // optional fallback if you don't pass media
  videoSrc, // animation for the active tab
  posterInactive, // static image shown when NOT active
  badge,
  active,
  onSelect,
}: {
  href: string;
  label: string;
  icon?: string;
  videoSrc?: string;
  posterInactive?: string;
  badge?: "NEW";
  active?: boolean;
  onSelect?: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const waitForMetadata = (v: HTMLVideoElement) =>
    v.readyState >= 1
      ? Promise.resolve()
      : new Promise<void>((res) => {
          const h = () => {
            v.removeEventListener("loadedmetadata", h);
            res();
          };
          v.addEventListener("loadedmetadata", h, { once: true });
        });

  // Active: play forward once and hold on last frame; Inactive: reset to 0
  useEffect(() => {
    const v = videoRef.current;
    if (!videoSrc || !v) return;

    const playForwardOnce = async () => {
      await waitForMetadata(v);
      v.currentTime = 0;
      try {
        await v.play();
      } catch {}
      const onEnded = () => {
        v.pause();
        if (isFinite(v.duration) && v.duration > 0) {
          v.currentTime = Math.max(0, v.duration - 0.001); // hold last frame
        }
        v.removeEventListener("ended", onEnded);
      };
      v.addEventListener("ended", onEnded);
    };

    const resetToStart = async () => {
      await waitForMetadata(v);
      v.pause();
      v.currentTime = 0;
    };

    if (active) playForwardOnce();
    else resetToStart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, videoSrc]);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      onClick={(e) => {
        e.preventDefault(); // act like a mode switch, not navigation
        onSelect?.();
      }}
      className="group relative inline-flex"
    >
      {/* underline fixed at the bottom; only visible when active */}
      <span
        className={`pointer-events-none absolute left-0 right-0 bottom-0 h-[3px] rounded-full transition-colors ${
          active ? "bg-black" : "bg-transparent"
        }`}
      />

      {/* content row (icon + label). pb-1 keeps underline tight */}
      <div className="flex items-center gap-0 pb-1">
        {/* icon box: bigger footprint; media inside centered */}
        <span className="relative inline-block w-20 h-16">
          {active && videoSrc ? (
            // ACTIVE → big video, plays once, holds end frame
            <video
              key={`${active}-${videoSrc}`}
              ref={videoRef}
              muted
              playsInline
              preload="auto"
              crossOrigin="anonymous"
              className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 object-contain"
            >
              <source src={videoSrc} type="video/webm" />
              <source
                src={videoSrc
                  .replace("/webm/", "/hevc/")
                  .replace(".webm", ".mov")}
                type="video/mp4"
              />
            </video>
          ) : posterInactive ? (
            // INACTIVE → larger static poster with subtle hover motion
            <img
              src={posterInactive}
              alt=""
              draggable={false}
              className={[
                "absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 object-contain",
                !active
                  ? "transition-transform duration-300 ease-out will-change-transform group-hover:scale-125"
                  : "",
              ].join(" ")}
            />
          ) : (
            // fallback emoji/icon
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl leading-none select-none">
              {icon}
            </span>
          )}
        </span>

        {/* label: bold only when active */}
        <span
          className={`text-[15px] leading-tight ${
            active ? "font-semibold text-gray-900" : "font-normal text-gray-800"
          }`}
        >
          {label}
        </span>

        {badge ? (
          <span className="-mt-3 ml-1 text-[10px] font-semibold rounded-full px-2 py-0.5 bg-slate-800 text-white shadow">
            {badge}
          </span>
        ) : null}
      </div>
    </Link>
  );
}
