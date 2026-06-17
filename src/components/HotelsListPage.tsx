"use client";

import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { Search, MapPin, Map } from "lucide-react";
import { getAvailableRooms } from "@/mocks/hotelsData";
import { useHotelsStore } from "@/store/hotelsStore";
import { useHotelsFilterStore } from "@/store/hotelsfilterstore";
import HotelsSidebar from "./HotelsSidebar";
import HotelCard from "./Hotelcard";
import MapModal from "./MapModal";
import Header from "./Header";
import { Footer } from "./footer";

export default function HotelsPage() {
  const [isMapOpen, setIsMapOpen] = useState(false);
  const t = useTranslations("hotelsPage");
  const {
    searchQuery, setSearchQuery,
    priceMax,
    showAvailableOnly,
    userLocation,
    selectedAmenities,
    selectedCity,
  } = useHotelsFilterStore();

  const { hotels } = useHotelsStore();

  const filteredHotels = useMemo(() => {
    return hotels.filter((hotel) => {
      // 1. Search Query
      const matchesQuery =
        hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hotel.city.toLowerCase().includes(searchQuery.toLowerCase());

      // 2. City
      const matchesCity = !selectedCity || hotel.city === selectedCity;

      // 3. Availability and Price
      const rooms = showAvailableOnly ? getAvailableRooms(hotel) : hotel.rooms;
      const matchesAvailability = !showAvailableOnly || rooms.length > 0;
      const matchesPrice = rooms.some((r) => r.prixParNuit <= priceMax) || rooms.length === 0;

      // 4. Amenities
      const hotelAmenities = new Set([
        ...hotel.amenities,
        ...hotel.rooms.flatMap((r) => r.equipements)
      ]);
      const matchesAmenities = selectedAmenities.every((amenity) =>
        hotelAmenities.has(amenity)
      );

      return matchesQuery && matchesCity && matchesAvailability && matchesPrice && matchesAmenities;
    });
  }, [hotels, searchQuery, showAvailableOnly, priceMax, selectedCity, selectedAmenities]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-28">

        {/* ── Hero ── */}
        <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1800&auto=format&fit=crop&q=85"
            alt="Hotels"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70" />

          <div className="relative z-10 flex flex-col items-center text-center gap-4 px-6 max-w-2xl">
            <h1
              className="text-4xl sm:text-5xl font-black text-white"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {t("title")}
            </h1>
            <p className="text-white/70 text-base">{t("subtitle")}</p>

            {/* Search bar */}
            <div className="w-full max-w-lg flex items-center gap-2 mt-4
              bg-white/10 backdrop-blur-md border border-white/20
              rounded-xl px-4 py-3">
              <Search className="w-4 h-4 text-white/50" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("searchPlaceholder")}
                className="bg-transparent text-white placeholder-white/40
                  text-sm outline-none flex-1"
              />
            </div>
          </div>
        </section>

        {/* ── Content ── */}
        <section className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">

            <HotelsSidebar />

            {/* Right column: count bar + hotel grid */}
            <div className="flex flex-col gap-6">

              {/* Count + Map button row */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-foreground/50">
                  <span className="font-bold text-foreground">{filteredHotels.length}</span>{" "}
                  {t("map.hotelsFound")}
                </p>
                <button
                  id="open-map-button"
                  onClick={() => setIsMapOpen(true)}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl
                    text-sm font-semibold border transition-all duration-200
                    hover:-translate-y-0.5 hover:shadow-lg"
                  style={{
                    background: "rgba(212,175,55,0.08)",
                    border: "1px solid rgba(212,175,55,0.25)",
                    color: "#d4af37",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(212,175,55,0.15)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(212,175,55,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(212,175,55,0.08)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  }}
                >
                  <Map className="w-4 h-4" />
                  {t("map.openButton")}
                </button>
              </div>

              {/* Hotel grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filteredHotels.map((hotel) => (
                  <HotelCard
                    key={hotel.id}
                    hotel={hotel}
                    showAvailableOnly={showAvailableOnly}
                    userLocation={userLocation}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      {/* ── Map Modal ─────────────────────────────────────────── */}
      <MapModal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        hotels={filteredHotels}
        userLocation={userLocation}
        showAvailableOnly={showAvailableOnly}
      />

      {/* ── Mobile floating map button ─────────────────────────── */}
      <button
        id="open-map-fab"
        onClick={() => setIsMapOpen(true)}
        className="sm:hidden fixed bottom-6 right-6 z-40 flex items-center gap-2
          px-5 py-3 rounded-2xl shadow-2xl font-bold text-sm
          transition-all duration-200 active:scale-95"
        style={{
          background: "#d4af37",
          color: "#1c1714",
          boxShadow: "0 8px 32px rgba(212,175,55,0.4), 0 2px 8px rgba(0,0,0,0.3)",
        }}
      >
        <Map className="w-4 h-4" />
        {t("map.openButton")}
      </button>
    </>
  );
}