"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Star, MapPin, CalendarDays, MessageSquare } from "lucide-react";
import { getAvailableRooms } from "@/mocks/hotelsData";
import { useHotelsStore } from "@/store/hotelsStore";
import { useHotelsFilterStore } from "@/store/hotelsfilterstore";
import { useReservationStore } from "@/store/reservationStore";
import { useAuthStore } from "@/store/authStore";
import { isRoomAvailable, calcNights } from "@/utils/availability";
import BookableRoomCard from "./BookableRoomCard";
import Header from "./Header";
import { Footer } from "./footer";
import { notFound } from "next/navigation";
import SimpleMap from "./Map";
import DatePicker from "./DatePicker";
import ChatModal from "./client/ChatModal";

export default function HotelDetailPage({ hotelId }: { hotelId: string }) {
  const t = useTranslations("hotelsPage.detail");
  const tf = useTranslations("hotelsPage.filters");
  const { hotels } = useHotelsStore();
  const { directors } = useAuthStore();
  const hotel = hotels.find((h) => h.id === hotelId);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Find the director responsible for this hotel
  const hotelDirector = directors.find((d) => d.hotelId === hotelId);

  // Date-based availability
  const { checkIn: storeCheckIn, checkOut: storeCheckOut } = useHotelsFilterStore();
  const { bookings } = useReservationStore();
  const [localCheckIn, setLocalCheckIn] = useState<Date | undefined>(storeCheckIn ?? undefined);
  const [localCheckOut, setLocalCheckOut] = useState<Date | undefined>(storeCheckOut ?? undefined);

  const activeCheckIn = localCheckIn ?? null;
  const activeCheckOut = localCheckOut ?? null;
  const nights = activeCheckIn && activeCheckOut ? calcNights(activeCheckIn, activeCheckOut) : null;

  if (!hotel) return notFound();

  const activeRooms = hotel.rooms.filter(r => r.actif !== false);

  // Date-aware room availability
  const rooms = activeRooms.filter(r => {
    const dateAvailable = activeCheckIn && activeCheckOut
      ? isRoomAvailable(r.id, activeCheckIn, activeCheckOut, bookings)
      : r.statut === "DISPONIBLE" || !availableOnly;
    if (availableOnly) {
      return activeCheckIn && activeCheckOut
        ? isRoomAvailable(r.id, activeCheckIn, activeCheckOut, bookings)
        : r.statut === "DISPONIBLE";
    }
    return true;
  });

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

    {/* Date Picker Banner */}
    <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <CalendarDays className="w-4 h-4 text-gold" />
        <span className="text-sm font-semibold text-foreground">
          {t("checkIn") === "Arrivée" ? "Sélectionnez vos dates de séjour" : "Select your stay dates"}
        </span>
        {nights && (
          <span className="ml-auto text-xs text-gold font-bold bg-gold/10 px-2 py-1 rounded-full">
            {nights} {nights > 1 ? (t("checkIn") === "Arrivée" ? "nuits" : "nights") : (t("checkIn") === "Arrivée" ? "nuit" : "night")}
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <DatePicker
          label={t("checkIn")}
          selectedDate={localCheckIn}
          onDateChange={setLocalCheckIn}
          variant="solid"
        />
        <DatePicker
          label={t("checkOut")}
          selectedDate={localCheckOut}
          onDateChange={setLocalCheckOut}
          minDate={localCheckIn}
          variant="solid"
        />
      </div>
    </div>

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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {rooms.map((room) => (
          <BookableRoomCard
            key={room.id}
            room={room}
            hotelId={hotel.id}
            checkIn={activeCheckIn ?? undefined}
            checkOut={activeCheckOut ?? undefined}
            bookings={bookings}
          />
        ))}
      </div>
    </div>
  </div>

  {/* 💻 COLONNE DROITE : Carte + Contact Director */}
  <aside className="hidden lg:flex lg:flex-col lg:gap-4 lg:sticky lg:top-32 self-start">
    {/* Map card */}
    <div className="bg-card rounded-2xl border border-border p-4 shadow-sm w-full">
      <h3 className="text-lg font-bold text-foreground mb-3">{t("localisation") || "Localisation"}</h3>
      <SimpleMap />
    </div>

    {/* Contact hotel button */}
    <button
      onClick={() => setIsChatOpen(true)}
      className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl
        bg-purple dark:bg-gold text-white dark:text-[#1c1714]
        font-bold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-purple/20 dark:shadow-gold/20"
    >
      <MessageSquare className="w-4 h-4" />
      {t("contactHotel") || "Contacter l'hôtel"}
    </button>
  </aside>

  {/* Mobile contact button (fixed bottom) */}
  <div className="fixed bottom-6 right-4 z-40 lg:hidden">
    <button
      onClick={() => setIsChatOpen(true)}
      className="flex items-center gap-2 px-4 py-3 rounded-2xl
        bg-purple dark:bg-gold text-white dark:text-[#1c1714]
        font-bold text-sm shadow-2xl shadow-purple/30 dark:shadow-gold/30
        hover:opacity-90 transition-opacity"
    >
      <MessageSquare className="w-4 h-4" />
      {t("contactHotel") || "Contacter l'hôtel"}
    </button>
  </div>

  {/* Chat Modal */}
  {isChatOpen && hotelDirector && (
    <ChatModal
      directorId={hotelDirector.id}
      directorName={hotelDirector.nom}
      hotelName={hotel.name}
      onClose={() => setIsChatOpen(false)}
    />
  )}
  {isChatOpen && !hotelDirector && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={() => setIsChatOpen(false)}>
      <div className="bg-card border border-border rounded-2xl p-6 text-center max-w-sm shadow-2xl"
        onClick={e => e.stopPropagation()}>
        <MessageSquare className="w-10 h-10 text-foreground/30 mx-auto mb-3" />
        <p className="text-foreground font-semibold mb-1">{t("noDirector") || "Directeur non disponible"}</p>
        <p className="text-foreground/50 text-sm mb-4">{t("noDirectorDesc") || "Aucun directeur n'est encore assigné à cet hôtel."}</p>
        <button onClick={() => setIsChatOpen(false)}
          className="px-5 py-2 rounded-xl bg-foreground/5 hover:bg-foreground/10 text-foreground text-sm font-semibold transition-colors">
          Fermer
        </button>
      </div>
    </div>
  )}
</div>
        </section>
      </main>
      <Footer />
    </>
  );
}