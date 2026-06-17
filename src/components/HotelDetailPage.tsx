"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Star, MapPin } from "lucide-react";
import { getHotelById, getAvailableRooms } from "@/mocks/hotelsData";
import BookableRoomCard from "./BookableRoomCard";
import Header from "./Header";
import { Footer } from "./footer";
import { notFound } from "next/navigation";
import SimpleMap from "./Map";

export default function HotelDetailPage({ hotelId }: { hotelId: string }) {
  const t = useTranslations("hotelsPage.detail");
  const tf = useTranslations("hotelsPage.filters");
  const hotel = getHotelById(hotelId);
  const [availableOnly, setAvailableOnly] = useState(false);

  if (!hotel) return notFound();

  const rooms = availableOnly ? getAvailableRooms(hotel) : hotel.rooms;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-28">

        {/* ── Hero gallery ── */}
        <section className="relative h-[55vh] min-h-[420px] overflow-hidden">
          <img
            src={hotel.image}
            alt={hotel.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          <div className="relative z-10 h-full max-w-6xl mx-auto px-6
            flex flex-col justify-end pb-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1 bg-white/15 backdrop-blur-sm
                px-3 py-1 rounded-full">
                <Star className="w-3.5 h-3.5 text-gold fill-gold" />
                <span className="text-white text-sm font-bold">{hotel.rating}</span>
                <span className="text-white/60 text-xs">
                  ({hotel.reviewCount} {t("reviews")})
                </span>
              </div>
            </div>
            <h1
              className="text-4xl sm:text-5xl font-black text-white"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {hotel.name}
            </h1>
            <div className="flex items-center gap-1.5 text-white/70 mt-2">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{hotel.address}</span>
            </div>
          </div>
        </section>

        {/* ── Content ── */}
        <section className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">

  {/* Colonne Gauche : Infos + Chambres */}
  <div className="flex flex-col gap-10">

    {/* À propos */}
    <div className="flex flex-col gap-3">
      <h2
        className="text-2xl font-bold text-foreground"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        {t("about")}
      </h2>
      <p className="text-foreground/65 text-sm leading-relaxed">
        {hotel.description}
      </p>
    </div>

    {/* Services (Amenities) */}
    <div className="flex flex-col gap-3">
      <h3 className="text-lg font-bold text-foreground">{t("amenities")}</h3>
      <div className="flex flex-wrap gap-2">
        {hotel.amenities.map((a) => (
          <span key={a} className="px-3 py-1.5 bg-purple/8 dark:bg-gold/8
            text-purple dark:text-gold text-sm rounded-lg">
            {a}
          </span>
        ))}
      </div>
    </div>

    {/* 📱 CARTE VERSION MOBILE ET TABLETTE uniquement */}
    {/* Elle s'affiche ici sur mobile (sous les services), mais disparaît sur PC */}
    <div className="block lg:hidden w-full">
      <h3 className="text-lg font-bold text-foreground mb-3">{t("localisation") || "Localisation"}</h3>
      <div className="bg-card rounded-2xl border border-border p-3 shadow-sm">
        <SimpleMap />
      </div>
    </div>

    {/* Chambres */}
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2
          className="text-2xl font-bold text-foreground"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          {t("rooms")}
        </h2>

        {/* Toggle Disponibilité */}
        <button
          onClick={() => setAvailableOnly((v) => !v)}
          className={`relative w-12 h-6 rounded-full transition-colors
            ${availableOnly ? "bg-purple dark:bg-gold" : "bg-foreground/15"}`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white
              transition-transform ${availableOnly ? "translate-x-6" : "translate-x-0"}`}
          />
        </button>
      </div>
      <span className="text-foreground/40 text-xs -mt-2">
        {availableOnly ? tf("availableOnly") : tf("allRooms")}
      </span>

      <div className="flex flex-col gap-4">
        {rooms.map((room) => (
          <BookableRoomCard key={room.id} room={room} hotelId={hotel.id} />
        ))}
      </div>
    </div>
  </div>

  {/* 💻 COLONNE DROITE : Carte Version Desktop uniquement */}
  {/* Masquée sur mobile (`hidden`), collante et visible dès l'affichage large (`lg:block`) */}
  <aside className="hidden lg:block lg:sticky lg:top-32 self-start">
    <div className="bg-card rounded-2xl border border-border p-4 shadow-sm w-full">
      <h3 className="text-lg font-bold text-foreground mb-3">{t("localisation") || "Localisation"}</h3>
      {/* Suppression du h-64 rigide pour laisser SimpleMap s'exprimer sur PC */}
      <SimpleMap />
    </div>
  </aside>
</div>
        </section>
      </main>
      <Footer />
    </>
  );
}