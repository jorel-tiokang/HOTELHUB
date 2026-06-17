"use client";

import dynamic from "next/dynamic";
import type { Hotel } from "@/services/hotel";

// Leaflet needs the browser's `window` object, so we disable SSR here.
const InteractiveMap = dynamic(() => import("./InteractiveMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-charcoal rounded-xl">
      <div className="flex flex-col items-center gap-3">
        <div
          className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: "rgba(212,175,55,0.3)", borderTopColor: "#d4af37" }}
        />
        <span className="text-sm" style={{ color: "rgba(212,175,55,0.6)" }}>
          Chargement de la carte…
        </span>
      </div>
    </div>
  ),
});

interface MapWrapperProps {
  hotels: Hotel[];
  userLocation?: { lat: number; lng: number } | null;
  className?: string;
}

export default function MapWrapper({
  hotels,
  userLocation,
  className = "h-full w-full",
}: MapWrapperProps) {
  return (
    <InteractiveMap
      hotels={hotels}
      userLocation={userLocation}
      className={className}
    />
  );
}
