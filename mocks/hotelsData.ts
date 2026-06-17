import type { Hotel } from "@/services/hotel";

/**
 * Correspondence pattern: each Room has a `hotelId` field AND lives inside
 * its parent Hotel's `rooms` array. This dual-link lets you:
 *  - Get all rooms for a hotel via `hotel.rooms`
 *  - Flatten all rooms across hotels (e.g. global room search) via `room.hotelId`
 */
export const hotelsData: Hotel[] = [
  {
    id: "h1",
    name: "Hakuna Matata Resort",
    city: "Douala",
    address: "Boulevard de la Liberté, Douala",
    location: { lat: 4.0511, lng: 9.7679 },
    description:
      "A beautiful resort with swimming pool and ocean views, blending comfort and tropical charm.",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=900&auto=format&fit=crop&q=80",
    ],
    amenities: ["Wifi", "Piscine", "Parking", "Climatisation", "Restaurant"],
    rating: 4.9,
    reviewCount: 342,
    rooms: [
      {
        id: "r1", hotelId: "h1", numero: 101, type: "Double",
        capacite: 2, prixParNuit: 65000,
        description: "Chambre double avec vue sur l'océan.",
        equipements: ["Wifi", "Clim", "TV"],
        statut: "DISPONIBLE",
        images: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&auto=format&fit=crop&q=80"],
      },
      {
        id: "r2", hotelId: "h1", numero: 102, type: "Suite",
        capacite: 4, prixParNuit: 120000,
        description: "Suite spacieuse avec salon privé.",
        equipements: ["Wifi", "Clim", "TV", "Minibar"],
        statut: "INDISPONIBLE",
        images: ["https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&auto=format&fit=crop&q=80"],
      },
    ],
  },
  {
    id: "h2",
    name: "Samba Valarta Hotel",
    city: "Yaoundé",
    address: "Quartier Bastos, Yaoundé",
    location: { lat: 3.8667, lng: 11.5167 },
    description: "Hôtel moderne au cœur de la capitale, idéal pour les voyages d'affaires.",
    image: "https://plus.unsplash.com/premium_photo-1675745329954-9639d3b74bbf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8aG90ZWx8ZW58MHx8MHx8fDA%3D",
    images: [
      "https://images.unsplash.com/photo-1551882547-ff40c63fe2e2?w=900&auto=format&fit=crop&q=80",
    ],
    amenities: ["Wifi", "Parking", "Gym", "Restaurant"],
    rating: 4.6,
    reviewCount: 198,
    rooms: [
      {
        id: "r3", hotelId: "h2", numero: 201, type: "Simple",
        capacite: 1, prixParNuit: 45000,
        description: "Chambre simple, confortable et fonctionnelle.",
        equipements: ["Wifi", "TV"],
        statut: "DISPONIBLE",
        images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80"],
      },
    ],
  },
  {
    id: "h3",
    name: "Maona Loa Lodge",
    city: "Kribi",
    address: "Plage de Kribi",
    location: { lat: 2.9333, lng: 9.9167 },
    description: "Un lodge paisible près de la plage, parfait pour se détendre.",
    image: "https://images.unsplash.com/photo-1535827841776-24afc1e255ac?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGhvdGVsfGVufDB8fDB8fHww",
    images: [
      "https://images.unsplash.com/photo-1455587734955-081b22074882?w=900&auto=format&fit=crop&q=80",
    ],
    amenities: ["Wifi", "Piscine", "Plage privée"],
    rating: 4.8,
    reviewCount: 271,
    rooms: [
      {
        id: "r4", hotelId: "h3", numero: 301, type: "Double",
        capacite: 2, prixParNuit: 58000,
        description: "Chambre avec accès direct à la plage.",
        equipements: ["Wifi", "Clim"],
        statut: "DISPONIBLE",
        images: ["https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&auto=format&fit=crop&q=80"],
      },
      {
        id: "r5", hotelId: "h3", numero: 302, type: "Familiale",
        capacite: 5, prixParNuit: 95000,
        description: "Grande chambre pour familles.",
        equipements: ["Wifi", "Clim", "TV"],
        statut: "DISPONIBLE",
        images: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&auto=format&fit=crop&q=80"],
      },
    ],
  },
  {
    id: "h4",
    name: "Royal Palace",
    city: "Douala",
    address: "Douala Centre",
    location: { lat: 4.0511, lng: 9.7679 },
    description: "Hôtel de luxe au cœur de Douala.",
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=500&auto=format&fit=crop&q=60",
    images: ["https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=500&auto=format&fit=crop&q=60"],
    amenities: ["Wifi", "Clim", "TV"],
    rating: 4.8,
    reviewCount: 120,
    rooms: [
      {
        id: "r6", hotelId: "h4", numero: 401, type: "Chambre Supérieure",
        capacite: 2, prixParNuit: 85000,
        description: "Chambre supérieure double.",
        equipements: ["Wifi", "Clim", "TV"],
        statut: "DISPONIBLE",
        images: ["https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=500&auto=format&fit=crop&q=60"],
      }
    ]
  },
  {
    id: "h5",
    name: "Hilton Hotel",
    city: "Yaoundé",
    address: "Centre Ville, Yaoundé",
    location: { lat: 3.8667, lng: 11.5167 },
    description: "Hôtel 5 étoiles avec services premium.",
    image: "https://plus.unsplash.com/premium_photo-1661879252375-7c1db1932572?w=500&auto=format&fit=crop&q=60",
    images: ["https://plus.unsplash.com/premium_photo-1661879252375-7c1db1932572?w=500&auto=format&fit=crop&q=60"],
    amenities: ["Piscine", "Spa", "Bar"],
    rating: 4.9,
    reviewCount: 450,
    rooms: [
      {
        id: "r7", hotelId: "h5", numero: 501, type: "Suite Présidentielle",
        capacite: 4, prixParNuit: 185000,
        description: "Suite très spacieuse avec vue.",
        equipements: ["Piscine", "Spa", "Bar"],
        statut: "DISPONIBLE",
        images: ["https://plus.unsplash.com/premium_photo-1661879252375-7c1db1932572?w=500&auto=format&fit=crop&q=60"],
      }
    ]
  },
  {
    id: "h6",
    name: "Akwa Palace",
    city: "Douala",
    address: "Boulevard de la Liberté, Douala",
    location: { lat: 4.0511, lng: 9.7679 },
    description: "Un classique au centre de Douala.",
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&auto=format&fit=crop&q=60",
    images: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&auto=format&fit=crop&q=60"],
    amenities: ["Wifi", "Parking"],
    rating: 4.5,
    reviewCount: 300,
    rooms: [
      {
        id: "r8", hotelId: "h6", numero: 601, type: "Chambre Standard",
        capacite: 1, prixParNuit: 55000,
        description: "Chambre standard pour voyageurs.",
        equipements: ["Wifi", "Parking"],
        statut: "INDISPONIBLE",
        images: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&auto=format&fit=crop&q=60"],
      }
    ]
  },
  {
    id: "h7",
    name: "Mont Fébé",
    city: "Yaoundé",
    address: "Colline du Mont Fébé, Yaoundé",
    location: { lat: 3.8667, lng: 11.5167 },
    description: "Hôtel surplombant la ville aux sept collines.",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500&auto=format&fit=crop&q=60",
    images: ["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500&auto=format&fit=crop&q=60"],
    amenities: ["Vue", "Clim"],
    rating: 4.7,
    reviewCount: 210,
    rooms: [
      {
        id: "r9", hotelId: "h7", numero: 701, type: "Junior Suite",
        capacite: 2, prixParNuit: 120000,
        description: "Suite junior élégante avec vue panoramique.",
        equipements: ["Vue", "Clim"],
        statut: "DISPONIBLE",
        images: ["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500&auto=format&fit=crop&q=60"],
      }
    ]
  },
  {
    id: "h8",
    name: "Sawa Hotel",
    city: "Douala",
    address: "Bonanjo, Douala",
    location: { lat: 4.0511, lng: 9.7679 },
    description: "L'expérience tropicale au centre des affaires.",
    image: "https://images.unsplash.com/photo-1568495248636-6432b97bd949?w=500&auto=format&fit=crop&q=60",
    images: ["https://images.unsplash.com/photo-1568495248636-6432b97bd949?w=500&auto=format&fit=crop&q=60"],
    amenities: ["Gym", "Resto", "Cave"],
    rating: 4.6,
    reviewCount: 185,
    rooms: [
      {
        id: "r10", hotelId: "h8", numero: 801, type: "Chambre Deluxe",
        capacite: 3, prixParNuit: 95000,
        description: "Chambre deluxe avec tout le confort moderne.",
        equipements: ["Gym", "Resto", "Cave"],
        statut: "DISPONIBLE",
        images: ["https://images.unsplash.com/photo-1568495248636-6432b97bd949?w=500&auto=format&fit=crop&q=60"],
      }
    ]
  }
];

/* ── Helper functions: hotel/room correspondence ─────────────────────── */

export function getHotelById(id: string): Hotel | undefined {
  return hotelsData.find((h) => h.id === id);
}

export function getRoomById(hotelId: string, roomId: string) {
  return getHotelById(hotelId)?.rooms.find((r) => r.id === roomId);
}

export function getAllRooms() {
  return hotelsData.flatMap((h) => h.rooms.map((r) => ({ ...r, hotelName: h.name, city: h.city, rating: h.rating })));
}

export function getAvailableRooms(hotel: Hotel) {
  return hotel.rooms.filter((r) => r.statut === "DISPONIBLE");
}

export function getLowestPrice(hotel: Hotel, availableOnly: boolean) {
  const rooms = availableOnly ? getAvailableRooms(hotel) : hotel.rooms;
  if (rooms.length === 0) return null;
  return Math.min(...rooms.map((r) => r.prixParNuit));
}