"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { useState } from "react";
import { Star, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import type { Hotel } from "@/services/hotel";
import { getLowestPrice } from "@/mocks/hotelsData";
import { distanceKm } from "@/store/hotelsfilterstore";
import { useCurrencyStore } from "@/store/currencyStore";
import { formatPrice } from "@/utils/currency";

interface HotelCardProps {
  hotel: Hotel;
  showAvailableOnly: boolean;
  userLocation: { lat: number; lng: number } | null;
  showDescription?: boolean;
}

export default function HotelCard({
  hotel,
  showAvailableOnly,
  userLocation,
  showDescription = false,
}: HotelCardProps) {
  const t = useTranslations("hotelsPage.card");
  const locale = useLocale();
  const { currency } = useCurrencyStore();

  const price = getLowestPrice(hotel, showAvailableOnly);
  const dist = userLocation ? distanceKm(userLocation, hotel.location) : null;
  const [imgIndex, setImgIndex] = useState(0);

  const allImages = [hotel.image, ...(hotel.images || [])].filter(Boolean);

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setImgIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setImgIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  return (
    <Link
      href={`/${locale}/hotels/${hotel.id}`}
      className="group flex flex-col bg-card rounded-2xl border border-border
        overflow-hidden shadow-sm hover:shadow-xl hover:shadow-purple/5
        dark:hover:shadow-gold/5 hover:-translate-y-1.5
        transition-all duration-300"
    >
      {/* Image Carousel */}
      <div className="relative h-48 overflow-hidden group/carousel">
        <img
          src={allImages[imgIndex]}
          alt={`${hotel.name} - image ${imgIndex + 1}`}
          className="absolute inset-0 w-full h-full object-cover
            group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        {/* Navigation arrows (shown on hover) */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 text-white opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-black/60"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 text-white opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-black/60"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            
            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {allImages.map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    i === imgIndex ? "bg-white" : "bg-white/40"
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Rating badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1
          bg-white/90 dark:bg-[#1c1714]/90 backdrop-blur-sm
          px-2.5 py-1 rounded-full">
          <Star className="w-3.5 h-3.5 text-gold fill-gold" />
          <span className="text-foreground text-xs font-bold">{hotel.rating}</span>
        </div>

        {/* Distance badge */}
        {dist !== null && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1
            bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full">
            <MapPin className="w-3 h-3 text-white" />
            <span className="text-white text-xs">
              {dist.toFixed(1)} {t("kmAway")}
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col gap-3 p-5">
        <div>
          <h3
            className="text-lg font-bold text-foreground leading-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {hotel.name}
          </h3>
          <p className="text-foreground/50 text-sm">{hotel.city}</p>
          {showDescription && hotel.description && (
            <p className="text-foreground/70 text-sm line-clamp-2 mt-2">
              {hotel.description}
            </p>
          )}
        </div>

        {/* Amenities chips */}
        <div className="flex flex-wrap gap-1.5">
          {hotel.amenities.slice(0, 3).map((a) => (
            <span
              key={a}
              className="px-2 py-0.5 bg-purple/8 dark:bg-gold/8
                text-purple dark:text-gold text-xs rounded-md"
            >
              {a}
            </span>
          ))}
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          {price !== null ? (
            <p className="text-foreground/60 text-xs">
              {t("from")}{" "}
              <span
                className="text-purple dark:text-gold font-black text-base"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {formatPrice(price, currency, locale)}
              </span>{" "}
              {t("perNight")}
            </p>
          ) : (
            <p className="text-foreground/40 text-xs italic">{t("noRooms")}</p>
          )}
        </div>

        {/* Extended CTA for Map Modal Overlay */}
        {showDescription && (
          <div className="mt-1 flex items-center justify-center w-full py-2.5 rounded-xl bg-purple dark:bg-gold text-white dark:text-[#1c1714] font-bold text-sm transition-colors hover:opacity-90">
            {t("viewHotel")}
          </div>
        )}
      </div>
    </Link>
  );
}