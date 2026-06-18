"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState } from "react";
import { notFound } from "next/navigation";
import { getHotelById, getRoomById } from "@/mocks/hotelsData";
import BookableRoomCard from "./BookableRoomCard";
import Header from "./Header";
import { Footer } from "./footer";
import { useCurrencyStore } from "@/store/currencyStore";
import { formatPrice } from "@/utils/currency";

export default function RoomDetailPage({
  hotelId,
  roomId,
}: {
  hotelId: string;
  roomId: string;
}) {
  const t = useTranslations("hotelsPage.room");
  const locale = useLocale();
  const { currency } = useCurrencyStore();
  const hotel = getHotelById(hotelId);
  const room = getRoomById(hotelId, roomId);

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

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

  const otherRooms = hotel.rooms.filter((r) => r.id !== room.id);

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
                <p
                  className="text-2xl font-black text-purple dark:text-gold"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {formatPrice(room.prixParNuit, currency, locale)}
                  <span className="text-foreground/40 text-sm font-normal">
                    {" "}{t("checkIn") === "Arrivée" ? "/nuit" : "/night"}
                  </span>
                </p>

                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-foreground/50 text-xs uppercase tracking-wider font-semibold">
                      {t("checkIn")}
                    </label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
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
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
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
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-foreground/60 text-sm">{t("totalPrice")}</span>
                  <span
                    className="text-foreground font-bold text-lg"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {formatPrice(total, currency, locale)}
                  </span>
                </div>

                <button
                  disabled={room.statut !== "DISPONIBLE"}
                  className="w-full py-3.5 rounded-xl font-bold text-sm
                    bg-purple dark:bg-gold text-white dark:text-[#1c1714]
                    hover:opacity-90 transition-opacity
                    disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {t("bookButton")}
                </button>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}