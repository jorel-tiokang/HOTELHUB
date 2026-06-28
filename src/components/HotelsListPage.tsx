"use client";

import { useTranslations } from "next-intl";
import { useMemo, useState, useEffect } from "react";
import { Search, MapPin, Map, CalendarDays, X } from "lucide-react";
import { getAvailableRooms } from "@/mocks/hotelsData";
import { useHotelsStore } from "@/store/hotelsStore";
import { useHotelsFilterStore } from "@/store/hotelsfilterstore";
import { useReservationStore } from "@/store/reservationStore";
import { isRoomAvailable, hotelHasAvailableRooms } from "@/utils/availability";
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
    selectedCountry,
    checkIn,
    checkOut,
    setCheckIn,
    setCheckOut,
  } = useHotelsFilterStore();

  const { hotels } = useHotelsStore();
  const { bookings } = useReservationStore();

  const filteredHotels = useMemo(() => {
    return hotels.filter((hotel) => {
      // 0. Active Status
      if (hotel.actif === false) return false;

      // 1. Search Query
      const matchesQuery =
        hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hotel.city.toLowerCase().includes(searchQuery.toLowerCase());

      // 1.5 Country
      const matchesCountry = !selectedCountry || hotel.countryCode === selectedCountry;

      // 2. City
      const matchesCity = !selectedCity || hotel.city === selectedCity;

      // Filter out inactive rooms
      const activeRooms = hotel.rooms.filter(r => r.actif !== false);

      // 3. Availability — date-aware if checkIn/checkOut set, fallback to status
      let matchesAvailability = true;
      let matchesPrice = true;

      if (checkIn && checkOut) {
        // Real date-based availability check
        const availableRoomIds = activeRooms
          .filter(r => isRoomAvailable(r.id, checkIn, checkOut, bookings))
          .map(r => r.id);

        matchesAvailability = !showAvailableOnly || availableRoomIds.length > 0;
        matchesPrice = activeRooms
          .filter(r => availableRoomIds.includes(r.id))
          .some(r => r.prixParNuit <= priceMax) || activeRooms.length === 0;
      } else {
        // Fallback: static status check
        const availableRooms = activeRooms.filter(r => r.statut === "DISPONIBLE");
        const rooms = showAvailableOnly ? availableRooms : activeRooms;
        matchesAvailability = !showAvailableOnly || rooms.length > 0;
        matchesPrice = rooms.some(r => r.prixParNuit <= priceMax) || rooms.length === 0;
      }

      // 4. Amenities
      const hotelAmenities = new Set([
        ...hotel.amenities,
        ...activeRooms.flatMap(r => r.equipements)
      ]);
      const matchesAmenities = selectedAmenities.every(amenity =>
        hotelAmenities.has(amenity)
      );

      return matchesQuery && matchesCountry && matchesCity && matchesAvailability && matchesPrice && matchesAmenities;
    });
  }, [hotels, bookings, searchQuery, showAvailableOnly, priceMax, selectedCity, selectedCountry, selectedAmenities, checkIn, checkOut]);

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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <p className="text-sm text-foreground/50">
                    <span className="font-bold text-foreground">{filteredHotels.length}</span>{" "}
                    {t("map.hotelsFound")}
                  </p>
                  {/* Active date filter badge */}
                  {checkIn && checkOut && (
                    <div className="flex items-center gap-2 text-xs bg-purple/10 border border-purple/20 text-purple dark:text-gold dark:bg-gold/10 dark:border-gold/20 px-3 py-1.5 rounded-full w-fit">
                      <CalendarDays className="w-3.5 h-3.5" />
                      <span>
                        {checkIn.toLocaleDateString()} → {checkOut.toLocaleDateString()}
                      </span>
                      <button onClick={() => { setCheckIn(null); setCheckOut(null); }} className="ml-1 hover:text-red-400 transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
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
        className="sm:hidden fixed bottom-6 right-6 z-30 flex items-center gap-2
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