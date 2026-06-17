"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import type { Room } from "@/services/hotel";

export default function BookableRoomCard({
  room,
  hotelId,
}: {
  room: Room;
  hotelId: string;
}) {
  const t = useTranslations("hotelsPage.detail");
  const locale = useLocale();
  const available = room.statut === "DISPONIBLE";

  return (
    <div className="flex flex-col sm:flex-row gap-4 bg-card rounded-2xl
      border border-border p-4 hover:shadow-md transition-all duration-300">

      {/* Image */}
      <div className="relative w-full sm:w-44 h-36 rounded-xl overflow-hidden shrink-0">
        <img
          src={room.images[0]}
          alt={room.type}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {!available && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white text-xs font-bold uppercase tracking-wider">
              {t("bookNow") === "Réserver" ? "Indisponible" : "Unavailable"}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 justify-between gap-2">
        <div>
          <h4 className="text-foreground font-bold text-base">
            {room.type} — N°{room.numero}
          </h4>
          <p className="text-foreground/50 text-sm">
            {room.capacite} {t("capacity")}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {room.equipements.map((eq) => (
              <span key={eq} className="px-2 py-0.5 bg-white/5 text-foreground/50
                text-xs rounded-md border border-border">
                {eq}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p
            className="text-purple dark:text-gold font-black text-lg"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {room.prixParNuit.toLocaleString("fr-FR")}
            <span className="text-foreground/40 text-xs font-normal ml-1">
              FCFA{t("perNight")}
            </span>
          </p>

          <Link
            href={`/${locale}/hotels/${hotelId}/rooms/${room.id}`}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all
              ${available
                ? "bg-purple dark:bg-gold text-white dark:text-[#1c1714] hover:opacity-90"
                : "bg-foreground/10 text-foreground/40 cursor-not-allowed pointer-events-none"
              }`}
          >
            {t("viewDetails")}
          </Link>
        </div>
      </div>
    </div>
  );
}