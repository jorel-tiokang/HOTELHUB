"use client";

import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import "leaflet-defaulticon-compatibility";
import { Star, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useLocale } from "next-intl";
import type { Hotel } from "@/services/hotel";
import HotelCard from "./Hotelcard";
import { X } from "lucide-react";
import { useCurrencyStore } from "@/store/currencyStore";
import { formatPrice } from "@/utils/currency";

// ── Custom Hotel Marker Icon ──────────────────────────────────────────────────
// Accepts a pre-formatted price string (built at call-site where hooks are available)
function createHotelIcon(formattedPrice: string) {
  return L.divIcon({
    className: "",
    html: `
      <div style="
        background: #1c1714;
        border: 2px solid #d4af37;
        color: #d4af37;
        font-weight: 700;
        font-size: 11px;
        padding: 4px 8px;
        border-radius: 20px;
        white-space: nowrap;
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        cursor: pointer;
        transition: transform 0.15s ease;
      ">${formattedPrice}</div>
    `,
    iconAnchor: [30, 16],
    iconSize: [65, 32],
  });
}

// ── User Location Marker Icon ─────────────────────────────────────────────────
const userIcon = L.divIcon({
  className: "",
  html: `
    <div style="position:relative;width:20px;height:20px">
      <div style="
        width:20px;height:20px;
        background:rgba(83,31,143,0.25);
        border-radius:50%;
        animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;
      "></div>
      <div style="
        position:absolute;top:4px;left:4px;
        width:12px;height:12px;
        background:#531f8f;
        border-radius:50%;
        border:2px solid white;
        box-shadow:0 2px 6px rgba(83,31,143,0.5);
      "></div>
    </div>
    <style>@keyframes ping{75%,100%{transform:scale(2.5);opacity:0}}</style>
  `,
  iconAnchor: [10, 10],
  iconSize: [20, 20],
});

// ── Auto-fit bounds helper ────────────────────────────────────────────────────
function FitBounds({
  hotels,
  userLocation,
}: {
  hotels: Hotel[];
  userLocation: { lat: number; lng: number } | null;
}) {
  const map = useMap();
  const prevCount = useRef(0);

  useEffect(() => {
    const points: [number, number][] = hotels.map((h) => [
      h.location.lat,
      h.location.lng,
    ]);
    if (userLocation) points.push([userLocation.lat, userLocation.lng]);

    if (points.length === 0) return;
    if (points.length === prevCount.current) return; // avoid re-fitting on unrelated re-renders
    prevCount.current = points.length;

    const bounds = L.latLngBounds(points);
    map.fitBounds(bounds, { padding: [48, 48], maxZoom: 14 });
  }, [hotels, userLocation, map]);

  return null;
}

// ── Main Component ────────────────────────────────────────────────────────────
interface InteractiveMapProps {
  hotels: Hotel[];
  userLocation?: { lat: number; lng: number } | null;
  showAvailableOnly?: boolean;
  className?: string;
}

export default function InteractiveMap({
  hotels,
  userLocation = null,
  showAvailableOnly = false,
  className = "h-full w-full",
}: InteractiveMapProps) {
  const locale = useLocale();
  const { currency } = useCurrencyStore();
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);

  const defaultCenter: [number, number] =
    hotels[0]
      ? [hotels[0].location.lat, hotels[0].location.lng]
      : [3.8667, 11.5167];

  return (
    <div className={className} style={{ position: "relative" }}>
      <MapContainer
        center={defaultCenter}
        zoom={11}
        scrollWheelZoom
        className="h-full w-full"
        style={{ background: "#1a1a2e" }}
      >
      {/* Dark-themed OpenStreetMap tiles */}
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        subdomains="abcd"
        maxZoom={19}
      />

      {/* Auto-fit bounds whenever hotels or user location changes */}
      <FitBounds hotels={hotels} userLocation={userLocation} />

      {/* User location marker */}
      {userLocation && (
        <Marker
          position={[userLocation.lat, userLocation.lng]}
          icon={userIcon}
        >
          <Popup>
            <span className="text-xs font-semibold">Votre position</span>
          </Popup>
        </Marker>
      )}

      {/* Hotel markers (clustered) */}
      <MarkerClusterGroup
        chunkedLoading
        maxClusterRadius={60}
        showCoverageOnHover={false}
      >
        {hotels.map((hotel) => {
          const lowestPrice = Math.min(...hotel.rooms.map((r) => r.prixParNuit));
          const formattedMarkerPrice = formatPrice(lowestPrice, currency, locale);
          return (
            <Marker
              key={hotel.id}
              position={[hotel.location.lat, hotel.location.lng]}
              icon={createHotelIcon(formattedMarkerPrice)}
              eventHandlers={{
                click: () => setSelectedHotel(hotel),
              }}
            >
            </Marker>
          );
        })}
      </MarkerClusterGroup>
    </MapContainer>

    {/* Custom Overlay for Selected Hotel */}
    {selectedHotel && (
      <div 
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] w-[92%] sm:w-[380px]"
        style={{ animation: "slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)" }}
      >
        <div className="relative">
          <button
            onClick={() => setSelectedHotel(null)}
            className="absolute -top-3 -right-3 z-10 bg-white dark:bg-[#1c1714] text-black dark:text-white rounded-full p-1.5 shadow-lg border border-border hover:scale-110 transition-transform"
          >
            <X className="w-5 h-5" />
          </button>
          <HotelCard
            hotel={selectedHotel}
            showAvailableOnly={showAvailableOnly}
            userLocation={userLocation}
            showDescription={true}
          />
        </div>
      </div>
    )}
    </div>
  );
}
