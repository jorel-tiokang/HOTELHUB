"use client";
import { useTranslations } from "next-intl";
import React from "react";
import { getAllRooms } from "@/mocks/hotelsData";
import BookableRoomCard from "./BookableRoomCard";

export default function HotelScroll() {
  const t = useTranslations("text");
  
  // We get the flattened list of all rooms from all hotels
  const roomsData = getAllRooms();
  
  // Duplicate the array to create the infinite scroll effect
  const ALL_ROOMS = [...roomsData, ...roomsData];

  return (
    <section className="py-12 overflow-hidden">
      <div className="text-center mb-10 px-4">
        <span className="inline-block dark:bg-[rgb(150,130,120,.4)] text-foreground bg-purple/20 text-[1.2rem] font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-widest backdrop-blur-sm">
          ✦ {t("1")}
        </span>
        <h2 className="text-[17px] font-bold text-foreground drop-shadow-md">
          {t("2")}
        </h2>
      </div>

      <div className="relative w-full mask-gradient overflow-hidden pb-8">
        <div className="animate-scroll flex gap-6 px-6">
          {ALL_ROOMS.map((room, index) => (
            <div key={`${room.id}-${index}`} className="w-[320px] shrink-0 flex flex-col h-full">
              <BookableRoomCard room={room as any} hotelId={room.hotelId} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
