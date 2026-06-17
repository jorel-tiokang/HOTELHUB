"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { Star, MapPin } from "lucide-react";
import type { Hotel } from "@/services/hotel";
import { getLowestPrice } from "@/mocks/hotelsData";
import { distanceKm } from "@/store/hotelsfilterstore";

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

  const price = getLowestPrice(hotel, showAvailableOnly);
  const dist = userLocation ? distanceKm(userLocation, hotel.location) : null;

  return (
    <Link
      href={`/${locale}/hotels/${hotel.id}`}
      className="group flex flex-col bg-card rounded-2xl border border-border
        overflow-hidden shadow-sm hover:shadow-xl hover:shadow-purple/5
        dark:hover:shadow-gold/5 hover:-translate-y-1.5
        transition-all duration-300"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={hotel.image}
          alt={hotel.name}
          className="absolute inset-0 w-full h-full object-cover
            group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

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
                {price.toLocaleString("fr-FR")}
              </span>{" "}
              FCFA{t("perNight")}
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