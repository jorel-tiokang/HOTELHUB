"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X, MapPin, Map } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Hotel } from "@/services/hotel";
import MapWrapper from "./MapWrapper";

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotels: Hotel[];
  userLocation?: { lat: number; lng: number } | null;
  showAvailableOnly?: boolean;
}

export default function MapModal({
  isOpen,
  onClose,
  hotels,
  userLocation,
  showAvailableOnly = false,
}: MapModalProps) {
  const t = useTranslations("hotelsPage");
  const backdropRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    /* ── Backdrop ─────────────────────────────────────────────────────────── */
    <div
      ref={backdropRef}
      id="map-modal-backdrop"
      className="fixed inset-0 z-[999] flex items-center justify-center p-0 sm:p-6 lg:p-10"
      onClick={(e) => {
        if (e.target === backdropRef.current) onClose();
      }}
      style={{
        background: "rgba(0,0,0,0.78)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        animation: "fadeIn 0.2s ease",
      }}
    >
      {/* ── Modal Panel ──────────────────────────────────────────────────────── */}
      <div
        id="map-modal-panel"
        className="relative w-full h-full sm:rounded-2xl overflow-hidden flex flex-col
          sm:h-[90vh] lg:max-w-6xl sm:max-w-[92vw]"
        style={{
          background: "#1c1714",
          border: "1px solid rgba(212,175,55,0.12)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(212,175,55,0.06)",
          animation: "slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <div
          className="flex items-center justify-between px-5 py-3.5 flex-shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(212,175,55,0.12)" }}
            >
              <Map className="w-4 h-4" style={{ color: "#d4af37" }} />
            </div>
            <div>
              <p
                className="text-white font-bold text-sm leading-tight"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {t("map.title")}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                <span style={{ color: "#d4af37", fontWeight: 600 }}>
                  {hotels.length}
                </span>{" "}
                {t("map.hotelsFound")}
                {userLocation && (
                  <>
                    {" · "}
                    <span style={{ color: "rgb(83,31,143)" }}>
                      {t("map.locationActive")}
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>

          <button
            id="map-modal-close"
            onClick={onClose}
            aria-label="Close map"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm
              font-semibold transition-all duration-150"
            style={{
              color: "rgba(255,255,255,0.5)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = "white";
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)";
              (e.currentTarget as HTMLElement).style.background = "transparent";
            }}
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">{t("map.close")}</span>
          </button>
        </div>

        {/* ── Map Area ───────────────────────────────────────────────────────── */}
        <div className="flex-1 relative overflow-hidden">
          {hotels.length === 0 ? (
            /* Empty state */
            <div className="h-full flex flex-col items-center justify-center gap-4">
              <MapPin className="w-12 h-12" style={{ color: "rgba(212,175,55,0.3)" }} />
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
                {t("map.noHotels")}
              </p>
            </div>
          ) : (
            <MapWrapper
              hotels={hotels}
              userLocation={userLocation}
              showAvailableOnly={showAvailableOnly}
              className="h-full w-full"
            />
          )}
        </div>

        {/* ── Footer hint ────────────────────────────────────────────────────── */}
        <div
          className="flex items-center justify-between px-5 py-2.5 flex-shrink-0"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
            {t("map.hint")}
          </p>
          <button
            onClick={onClose}
            className="text-xs font-semibold transition-colors"
            style={{ color: "#d4af37" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.opacity = "0.6";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.opacity = "1";
            }}
          >
            ✕ {t("map.close")}
          </button>
        </div>
      </div>

      {/* ── Keyframe animations (injected inline) ─────────────────────────── */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
      `}</style>
    </div>,
    document.body
  );
}
