"use client";
import React from "react";

// Définition de la structure pour TypeScript
interface Room {
  name: string;
  hotel: string;
  city: string;
  type: string;
  capacity: number;
  price: string;
  rating: number;
  tags: string[];
  image: string;
  avail: boolean;
}

const ROOMS: Room[] = [
  {
    name: "Chambre Supérieure",
    hotel: "Royal Palace",
    city: "Douala",
    type: "Double",
    capacity: 2,
    price: "85 000",
    rating: 4.8,
    tags: ["Wifi", "Clim", "TV"],
    image: "rooms/room1.jpeg",
    avail: true,
  },
  {
    name: "Suite Présidentielle",
    hotel: "Hilton Hotel",
    city: "Yaoundé",
    type: "Suite",
    capacity: 4,
    price: "185 000",
    rating: 4.9,
    tags: ["Piscine", "Spa", "Bar"],
    image: "rooms/room2.jpeg",
    avail: true,
  },
  {
    name: "Chambre Standard",
    hotel: "Akwa Palace",
    city: "Douala",
    type: "Simple",
    capacity: 1,
    price: "55 000",
    rating: 4.5,
    tags: ["Wifi", "Parking"],
    image: "rooms/room3.jpeg",
    avail: false,
  },
  {
    name: "Junior Suite",
    hotel: "Mont Fébé",
    city: "Yaoundé",
    type: "Suite",
    capacity: 2,
    price: "120 000",
    rating: 4.7,
    tags: ["Vue", "Clim"],
    image: "rooms/room4.jpeg",
    avail: true,
  },
  {
    name: "Chambre Deluxe",
    hotel: "Sawa Hotel",
    city: "Douala",
    type: "Double",
    capacity: 3,
    price: "95 000",
    rating: 4.6,
    tags: ["Gym", "Resto","Cave"],
    image: "rooms/room5.jpeg",
    avail: true,
  },
];

// Doubler la liste pour créer l'effet de boucle infinie sans saut visuel
const ALL_ROOMS = [...ROOMS, ...ROOMS];

export default function HotelScroll() {
  return (
    <section className="py-12 overflow-hidden">
      <div className="text-center mb-10 px-4">
        <span className="inline-block bg-[rgb(150,130,120,.4)] text-[#3C3489] text-[1.2rem] font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-widest">
          ✦ Des séjours pour tous les goûts
        </span>
        <h2 className="text-[17px] font-bold text-[#1a1a2e]">
          Inscrivez-vous pour accéder aux tarifs, disponibilités et réservations en direct.
        </h2>
      </div>

      <div className="relative w-full mask-gradient overflow-hidden">
        <div className="animate-scroll flex gap-6 px-6">
          {ALL_ROOMS.map((room, index) => (
            <div
              key={index}
              className="w-[260px] flex-shrink-0 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
            >
              {/* SECTION IMAGE MODIFIÉE */}
              <div className="h-[160px] relative overflow-hidden">
                <img
                  src={room.image}
                  alt={room.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Overlays (Badges) */}
                <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-md text-white text-[0.65rem] px-2 py-1 rounded-lg">
                  {room.type} · {room.capacity} pers.
                </div>
                <div className="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded-lg flex items-center gap-1 text-[0.75rem] font-bold text-gray-800">
                  <span className="text-orange-400">★</span>
                  {room.rating}
                </div>
              </div>

              {/* Infos de la chambre */}
              <div className="p-5">
                <h3 className="font-bold text-[#1a1a2e] text-[0.95rem] truncate">
                  {room.name}
                </h3>
                <p className="text-[0.8rem] text-gray-500 mb-4 italic">
                  📍 {room.hotel}, {room.city}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-5">
                  {room.tags.slice(0, 3).map((tag, i) => (
                    <span
                      key={i}
                      className="bg-[#f0f0ff] text-[#534AB7] text-[0.65rem] px-2 py-0.5 rounded-md font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                  <div className="text-[#3C3489] font-bold text-[1.1rem]">
                    {room.price}{" "}
                    <span className="text-[0.7rem] text-gray-400 font-normal">
                      FCFA
                    </span>
                  </div>
                  <div
                    className={`text-[0.7rem] font-bold ${room.avail ? "text-emerald-600" : "text-rose-500"}`}
                  >
                    {room.avail ? "● Disponible" : "Complet"}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
