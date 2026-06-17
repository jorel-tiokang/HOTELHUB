"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import "leaflet-defaulticon-compatibility";
import { Star, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useLocale } from "next-intl";
import type { Hotel } from "@/services/hotel";

// ── Custom Hotel Marker Icon ──────────────────────────────────────────────────
function createHotelIcon(price: number) {
  const formatted = (price / 1000).toFixed(0) + "k";
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
      ">${formatted} FCFA</div>
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
  className?: string;
}

export default function InteractiveMap({
  hotels,
  userLocation = null,
  className = "h-full w-full",
}: InteractiveMapProps) {
  const locale = useLocale();

  const defaultCenter: [number, number] =
    hotels[0]
      ? [hotels[0].location.lat, hotels[0].location.lng]
      : [3.8667, 11.5167];

  return (
    <MapContainer
      center={defaultCenter}
      zoom={11}
      scrollWheelZoom
      className={className}
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
          return (
            <Marker
              key={hotel.id}
              position={[hotel.location.lat, hotel.location.lng]}
              icon={createHotelIcon(lowestPrice)}
            >
              <Popup
                minWidth={220}
                maxWidth={260}
                className="hotel-popup"
              >
                <div
                  style={{
                    background: "#1c1714",
                    borderRadius: "12px",
                    overflow: "hidden",
                    width: "220px",
                    border: "1px solid rgba(212,175,55,0.2)",
                  }}
                >
                  {/* Hotel image */}
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    style={{
                      width: "100%",
                      height: "110px",
                      objectFit: "cover",
                    }}
                  />
                  <div style={{ padding: "10px 12px" }}>
                    <p
                      style={{
                        color: "white",
                        fontWeight: 700,
                        fontSize: "14px",
                        marginBottom: "2px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {hotel.name}
                    </p>
                    <p
                      style={{
                        color: "rgba(255,255,255,0.5)",
                        fontSize: "11px",
                        marginBottom: "8px",
                      }}
                    >
                      {hotel.city} · {hotel.address}
                    </p>

                    {/* Rating + price row */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "10px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <Star
                          style={{
                            width: "12px",
                            height: "12px",
                            color: "#d4af37",
                            fill: "#d4af37",
                          }}
                        />
                        <span
                          style={{
                            color: "white",
                            fontSize: "12px",
                            fontWeight: 600,
                          }}
                        >
                          {hotel.rating}
                        </span>
                        <span
                          style={{
                            color: "rgba(255,255,255,0.4)",
                            fontSize: "11px",
                          }}
                        >
                          ({hotel.reviewCount})
                        </span>
                      </div>
                      <span
                        style={{
                          color: "#d4af37",
                          fontWeight: 700,
                          fontSize: "13px",
                        }}
                      >
                        {lowestPrice.toLocaleString("fr-FR")}
                        <span
                          style={{
                            color: "rgba(255,255,255,0.4)",
                            fontWeight: 400,
                            fontSize: "10px",
                          }}
                        >
                          {" "}
                          FCFA/nuit
                        </span>
                      </span>
                    </div>

                    {/* CTA link */}
                    <Link
                      href={`/${locale}/hotels/${hotel.id}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                        background: "#d4af37",
                        color: "#1c1714",
                        fontWeight: 700,
                        fontSize: "12px",
                        padding: "7px 0",
                        borderRadius: "8px",
                        textDecoration: "none",
                        transition: "opacity 0.15s",
                      }}
                    >
                      Voir l&apos;hôtel
                      <ExternalLink style={{ width: "11px", height: "11px" }} />
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MarkerClusterGroup>
    </MapContainer>
  );
}
