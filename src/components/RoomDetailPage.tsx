"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import BookableRoomCard from "./BookableRoomCard";
import Header from "./Header";
import { Footer } from "./footer";
import { useCurrencyStore } from "@/store/currencyStore";
import { formatPrice } from "@/utils/currency";
import { useAuthStore } from "@/store/authStore";
import { useReservationStore } from "@/store/reservationStore";
import { useHotelsStore } from "@/store/hotelsStore";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

export default function RoomDetailPage({
  hotelId,
  roomId,
}: {
  hotelId: string;
  roomId: string;
}) {
  const t = useTranslations("hotelsPage.room");
  const locale = useLocale();
  const router = useRouter();
  const { currency } = useCurrencyStore();
  const { user, isAuthenticated } = useAuthStore();
  const { createBooking, isLoading: isBooking, error: bookingError } = useReservationStore();
  const { toggleRoomStatus, hotels } = useHotelsStore();

  const hotel = hotels.find((h) => h.id === hotelId);
  const room = hotel?.rooms.find((r) => r.id === roomId);

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [expectedArrivalTime, setExpectedArrivalTime] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  if (!hotel || !room) return notFound();

  const nights =
    checkIn && checkOut
      ? Math.max(
          1,
          Math.round(
            (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 1;

  const total = nights * room.prixParNuit;
  const otherRooms = hotel.rooms.filter((r) => r.id !== room.id && r.actif !== false);

  const today = new Date().toISOString().slice(0, 10);
  const isRoomAvailable = room.statut === "DISPONIBLE" && room.actif !== false;

  const handleBook = async () => {
    setLocalError(null);

    // Guard: must be logged in
    if (!isAuthenticated || !user) {
      router.push(`/${locale}/login`);
      return;
    }

    // Guard: dates required
    if (!checkIn || !checkOut) {
      setLocalError(t("checkIn") === "Arrivée"
        ? "Veuillez sélectionner vos dates d'arrivée et de départ."
        : "Please select your check-in and check-out dates.");
      return;
    }

    // Guard: checkout must be after checkin
    if (checkOut <= checkIn) {
      setLocalError(t("checkIn") === "Arrivée"
        ? "La date de départ doit être après la date d'arrivée."
        : "Check-out must be after check-in.");
      return;
    }

    if (!expectedArrivalTime) {
      setLocalError("Veuillez spécifier votre heure d'arrivée prévue.");
      return;
    }

    try {
      await createBooking({
        hotelId: hotel.id,
        hotelName: hotel.name,
        hotelCity: hotel.city,
        hotelCoverUrl: hotel.images?.[0] ?? "",
        roomId: room.id,
        roomCategory: room.type,
        roomNumber: room.numero,
        startDate: checkIn,
        endDate: checkOut,
        guestCount: guests,
        totalCostXaf: total,
        clientUserId: user.id,
        clientFullName: user.nom || "Client",
        expectedArrivalTime: expectedArrivalTime,
      });

      // Mark room as unavailable in hotelsStore (real-time UI update)
      toggleRoomStatus(hotelId, roomId);

      setBookingSuccess(true);
    } catch {
      // error is already set in the store, localError shown via bookingError
    }
  };

  // ── Success state ────────────────────────────────────────────────────────────
  if (bookingSuccess) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background pt-28 pb-16 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-6 flex flex-col items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-emerald-400" />
            </div>
            <div>
              <h1
                className="text-3xl font-black text-foreground mb-2"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {t("checkIn") === "Arrivée" ? "Réservation confirmée !" : "Booking confirmed!"}
              </h1>
              <p className="text-foreground/60 text-sm">
                {t("checkIn") === "Arrivée"
                  ? `${room.type} au ${hotel.name} — ${checkIn} → ${checkOut}`
                  : `${room.type} at ${hotel.name} — ${checkIn} → ${checkOut}`}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => router.push(`/${locale}/dashboard/client`)}
                className="px-6 py-3 rounded-xl bg-purple dark:bg-gold text-white dark:text-[#1c1714] font-bold text-sm hover:opacity-90 transition-opacity"
              >
                {t("checkIn") === "Arrivée" ? "Voir mes réservations" : "View my bookings"}
              </button>
              <button
                onClick={() => router.push(`/${locale}/hotels`)}
                className="px-6 py-3 rounded-xl border border-border text-foreground/70 hover:text-foreground font-semibold text-sm transition-colors"
              >
                {t("checkIn") === "Arrivée" ? "Explorer d'autres hôtels" : "Explore more hotels"}
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-28 pb-16">
        <div className="max-w-6xl mx-auto px-6 flex flex-col gap-12">

          {/* ── Gallery ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 h-[420px]">
            {room.images.map((img, i) => (
              <div
                key={i}
                className={`relative rounded-2xl overflow-hidden
                  ${i === 0 ? "sm:col-span-2 sm:row-span-2" : ""}`}
              >
                <img
                  src={img}
                  alt={`${room.type} ${i + 1}`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">

            {/* Left: details */}
            <div className="flex flex-col gap-8">
              <div>
                <p className="text-foreground/50 text-sm">{hotel.name}</p>
                <h1
                  className="text-3xl sm:text-4xl font-black text-foreground"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {room.type} — N°{room.numero}
                </h1>
              </div>

              <div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {t("description")}
                </h3>
                <p className="text-foreground/65 text-sm leading-relaxed">
                  {room.description}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-foreground mb-3">
                  {t("amenities")}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {room.equipements.map((eq) => (
                    <span key={eq} className="px-3 py-1.5 bg-purple/8 dark:bg-gold/8
                      text-purple dark:text-gold text-sm rounded-lg">
                      {eq}
                    </span>
                  ))}
                </div>
              </div>

              {/* Other rooms */}
              {otherRooms.length > 0 && (
                <div className="flex flex-col gap-4 pt-6 border-t border-border">
                  <h3 className="text-lg font-bold text-foreground">
                    {t("otherRooms")}
                  </h3>
                  {otherRooms.map((r) => (
                    <BookableRoomCard key={r.id} room={r} hotelId={hotel.id} />
                  ))}
                </div>
              )}
            </div>

            {/* Right: booking form */}
            <aside className="lg:sticky lg:top-32 self-start">
              <div className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-5">

                {/* Price */}
                <p
                  className="text-2xl font-black text-purple dark:text-gold"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {formatPrice(room.prixParNuit, currency, locale)}
                  <span className="text-foreground/40 text-sm font-normal">
                    {" "}{t("checkIn") === "Arrivée" ? "/nuit" : "/night"}
                  </span>
                </p>

                {/* Availability badge */}
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold w-fit
                  ${isRoomAvailable
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25"
                    : "bg-red-500/15 text-red-400 border border-red-500/25"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isRoomAvailable ? "bg-emerald-400" : "bg-red-400"}`} />
                  {isRoomAvailable
                    ? (t("checkIn") === "Arrivée" ? "Disponible" : "Available")
                    : (t("checkIn") === "Arrivée" ? "Indisponible" : "Unavailable")}
                </div>

                {/* Date / guest inputs */}
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-foreground/50 text-xs uppercase tracking-wider font-semibold">
                      {t("checkIn")}
                    </label>
                    <input
                      type="date"
                      min={today}
                      value={checkIn}
                      onChange={(e) => { setCheckIn(e.target.value); setLocalError(null); }}
                      className="bg-white/5 border border-border rounded-xl px-3 py-2.5
                        text-foreground text-sm outline-none focus:border-purple dark:focus:border-gold"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-foreground/50 text-xs uppercase tracking-wider font-semibold">
                      {t("checkOut")}
                    </label>
                    <input
                      type="date"
                      min={checkIn || today}
                      value={checkOut}
                      onChange={(e) => { setCheckOut(e.target.value); setLocalError(null); }}
                      className="bg-white/5 border border-border rounded-xl px-3 py-2.5
                        text-foreground text-sm outline-none focus:border-purple dark:focus:border-gold"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-foreground/50 text-xs uppercase tracking-wider font-semibold">
                      {t("guests")}
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={room.capacite}
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="bg-white/5 border border-border rounded-xl px-3 py-2.5
                        text-foreground text-sm outline-none focus:border-purple dark:focus:border-gold"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-foreground/50 text-xs uppercase tracking-wider font-semibold">
                      Heure d'arrivée prévue
                    </label>
                    <input
                      type="time"
                      value={expectedArrivalTime}
                      onChange={(e) => { setExpectedArrivalTime(e.target.value); setLocalError(null); }}
                      className="bg-white/5 border border-border rounded-xl px-3 py-2.5
                        text-foreground text-sm outline-none focus:border-purple dark:focus:border-gold"
                    />
                  </div>
                </div>

                {hotel.cancellationPolicy && (
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 text-xs text-blue-400">
                    <span className="font-bold">Politique :</span> {hotel.cancellationPolicy}
                  </div>
                )}

                {/* Total */}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-foreground/60 text-sm">
                    {t("totalPrice")}
                    {checkIn && checkOut && (
                      <span className="text-foreground/40 ml-1">({nights} nuit{nights > 1 ? "s" : ""})</span>
                    )}
                  </span>
                  <span
                    className="text-foreground font-bold text-lg"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {formatPrice(total, currency, locale)}
                  </span>
                </div>

                {/* Error messages */}
                {(localError || bookingError) && (
                  <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <p className="text-red-300 text-sm">{localError || bookingError}</p>
                  </div>
                )}

                {/* Book button */}
                <button
                  onClick={handleBook}
                  disabled={!isRoomAvailable || isBooking}
                  className="w-full py-3.5 rounded-xl font-bold text-sm
                    bg-purple dark:bg-gold text-white dark:text-[#1c1714]
                    hover:opacity-90 transition-opacity
                    disabled:opacity-40 disabled:cursor-not-allowed
                    flex items-center justify-center gap-2"
                >
                  {isBooking ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t("checkIn") === "Arrivée" ? "Réservation en cours…" : "Booking…"}
                    </>
                  ) : (
                    t("bookButton")
                  )}
                </button>

                {/* Login nudge for guests */}
                {!isAuthenticated && (
                  <p className="text-foreground/40 text-xs text-center">
                    {t("checkIn") === "Arrivée"
                      ? <>Vous devez être <button onClick={() => router.push(`/${locale}/login`)} className="text-purple dark:text-gold underline">connecté</button> pour réserver.</>
                      : <>You must be <button onClick={() => router.push(`/${locale}/login`)} className="text-purple dark:text-gold underline">logged in</button> to book.</>
                    }
                  </p>
                )}
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}