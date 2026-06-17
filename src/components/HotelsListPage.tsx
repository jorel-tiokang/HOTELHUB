"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { Search, MapPin, SlidersHorizontal } from "lucide-react";
import { hotelsData, getAvailableRooms } from "@/mocks/hotelsData";
import { useHotelsFilterStore } from "@/store/hotelsfilterstore";
import HotelCard from "./Hotelcard";
import Header from "./Header";
import { Footer } from "./footer";

export default function HotelsPage() {
  const t = useTranslations("hotelsPage");
  const {
    searchQuery, setSearchQuery,
    priceMax, setPriceMax,
    showAvailableOnly, toggleAvailableOnly,
    userLocation, requestGeolocation,
  } = useHotelsFilterStore();

  const filteredHotels = useMemo(() => {
    return hotelsData.filter((hotel) => {
      const matchesQuery =
        hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hotel.city.toLowerCase().includes(searchQuery.toLowerCase());

      const rooms = showAvailableOnly ? getAvailableRooms(hotel) : hotel.rooms;
      const matchesAvailability = !showAvailableOnly || rooms.length > 0;
      const matchesPrice = rooms.some((r) => r.prixParNuit <= priceMax) || rooms.length === 0;

      return matchesQuery && matchesAvailability && matchesPrice;
    });
  }, [searchQuery, showAvailableOnly, priceMax]);

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

            {/* Filters sidebar */}
            <aside className="flex flex-col gap-6 lg:sticky lg:top-32 self-start
              bg-card rounded-2xl border border-border p-6 h-fit">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-purple dark:text-gold" />
                <h3 className="font-bold text-foreground text-sm">
                  {t("filters.title")}
                </h3>
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
                  {showAvailableOnly ? t("filters.availableOnly") : t("filters.allRooms")}
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
                  {priceMax.toLocaleString("fr-FR")} FCFA
                </span>
              </div>

              {/* Geolocation */}
              <button
                onClick={requestGeolocation}
                className="flex items-center justify-center gap-2 px-4 py-2.5
                  rounded-xl border border-purple/20 dark:border-gold/20
                  text-purple dark:text-gold text-sm font-semibold
                  hover:bg-purple/5 dark:hover:bg-gold/5 transition-colors"
              >
                <MapPin className="w-4 h-4" />
                {t("filters.useLocation")}
              </button>
            </aside>

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
        </section>
      </main>
      <Footer />
    </>
  );
}