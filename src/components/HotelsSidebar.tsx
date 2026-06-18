"use client";

import { useTranslations, useLocale } from "next-intl";
import { SlidersHorizontal, MapPin, Check } from "lucide-react";
import { useHotelsFilterStore } from "@/store/hotelsfilterstore";
import { hotelsData } from "@/mocks/hotelsData";
import MapWrapper from "./MapWrapper";
import MapModal from "./MapModal";
import { useState } from "react";
import { useCurrencyStore } from "@/store/currencyStore";
import { formatPrice } from "@/utils/currency";

const AMENITIES = ["Wifi", "Piscine", "Parking", "Gym", "Climatisation"];

export default function HotelsSidebar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const t = useTranslations("hotelsPage");
  const locale = useLocale();
  const { currency } = useCurrencyStore();
  const {
    priceMax,
    setPriceMax,
    showAvailableOnly,
    toggleAvailableOnly,
    requestGeolocation,
    selectedAmenities,
    toggleAmenity,
    selectedCity,
    setSelectedCity,
    userLocation,
  } = useHotelsFilterStore();

  // Extract unique cities from mock data
  const cities = Array.from(new Set(hotelsData.map((h) => h.city))).sort();

  return (
    <aside
      className="flex flex-col gap-6 lg:sticky lg:top-32 self-start
      bg-card rounded-2xl border border-border p-6 h-fit"
    >
      <div className="flex items-center gap-2">
        <SlidersHorizontal className="w-4 h-4 text-purple dark:text-gold" />
        <h3 className="font-bold text-foreground text-sm">
          {t("filters.title", { default: "Map View" })}
        </h3>
      </div>

      {/* City selector */}
      <div className="flex flex-col gap-2">
        <label className="text-foreground/50 text-xs uppercase tracking-wider font-semibold">
          {t("filters.city")}
        </label>
        <select
          value={selectedCity || ""}
          onChange={(e) => setSelectedCity(e.target.value || null)}
          className="w-full bg-background border border-border text-foreground rounded-xl px-3 py-2 text-sm outline-none focus:border-purple dark:focus:border-gold transition-colors"
        >
          <option value="">{t("filters.allCities")}</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {/* Available toggle */}
      <div className="flex flex-col gap-2">
        <label className="text-foreground/50 text-xs uppercase tracking-wider font-semibold">
          {t("filters.availableOnly")}
        </label>
        <button
          onClick={toggleAvailableOnly}
          className={`relative w-12 h-6 rounded-full transition-colors duration-200
            ${showAvailableOnly ? "bg-purple dark:bg-gold" : "bg-foreground/15"}`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white
              transition-transform duration-200
              ${showAvailableOnly ? "translate-x-6" : "translate-x-0"}`}
          />
        </button>
        <span className="text-foreground/40 text-xs">
          {showAvailableOnly
            ? t("filters.availableOnly")
            : t("filters.allRooms")}
        </span>
      </div>

      {/* Price slider */}
      <div className="flex flex-col gap-2">
        <label className="text-foreground/50 text-xs uppercase tracking-wider font-semibold">
          {t("filters.priceLabel")}
        </label>
        <input
          type="range"
          min={20000}
          max={200000}
          step={5000}
          value={priceMax}
          onChange={(e) => setPriceMax(Number(e.target.value))}
          className="w-full accent-purple dark:accent-gold"
        />
        <span className="text-foreground/60 text-sm font-semibold">
          {formatPrice(priceMax, currency, locale)}
        </span>
      </div>

      {/* Amenities checkboxes */}
      <div className="flex flex-col gap-3">
        <label className="text-foreground/50 text-xs uppercase tracking-wider font-semibold">
          {t("filters.amenities")}
        </label>
        <div className="flex flex-col gap-2">
          {AMENITIES.map((amenity) => {
            const isChecked = selectedAmenities.includes(amenity);
            return (
              <label
                key={amenity}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors
                    ${isChecked
                      ? "bg-purple dark:bg-gold border-purple dark:border-gold"
                      : "border-border group-hover:border-purple dark:group-hover:border-gold"
                    }`}
                >
                  {isChecked && (
                    <Check className="w-3 h-3 text-white dark:text-charcoal" />
                  )}
                </div>
                <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">
                  {t(`filters.amenitiesList.${amenity}`)}
                </span>
                {/* Hidden input to make it accessible */}
                <input
                  type="checkbox"
                  className="hidden"
                  checked={isChecked}
                  onChange={() => toggleAmenity(amenity)}
                />
              </label>
            );
          })}
        </div>
      </div>

      {/* Geolocation */}
      <button
        onClick={requestGeolocation}
        className="flex items-center justify-center gap-2 px-4 py-2.5
          rounded-xl border border-purple/20 dark:border-gold/20
          text-purple dark:text-gold text-sm font-semibold
          hover:bg-purple/5 dark:hover:bg-gold/5 transition-colors mt-2"
      >
        <MapPin className="w-4 h-4" />
        {t("filters.useLocation")}
      </button>
      <div className="flex flex-col gap-2 mt-4">
        <label className="text-foreground/50 text-xs uppercase tracking-wider font-semibold">
          {t("filters.mapView", { default: "Map View" })}
        </label>
        {/* Clickable thumbnail — opens the full modal */}
        <div
          onClick={() => setIsModalOpen(true)}
          className="h-40 w-full rounded-xl overflow-hidden border border-border cursor-pointer
            hover:border-purple dark:hover:border-gold transition-colors relative group"
        >
          <MapWrapper hotels={hotelsData} userLocation={userLocation} />
          {/* Overlay hint */}
          <div className="absolute inset-0 flex items-center justify-center
            bg-black/0 group-hover:bg-black/30 transition-colors duration-200 pointer-events-none">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200
              text-white text-xs font-semibold bg-black/60 px-3 py-1.5 rounded-full">
              {t("filters.mapView")}
            </span>
          </div>
        </div>
      </div>

      {/* Full-screen map modal */}
      <MapModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        hotels={hotelsData}
        userLocation={userLocation}
      />
    </aside>
  );
}
