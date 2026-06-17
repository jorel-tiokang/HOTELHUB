export type StatutChambre = "DISPONIBLE" | "INDISPONIBLE";

export interface Room {
  id: string;
  hotelId: string;
  numero: number;
  type: string;
  capacite: number;
  prixParNuit: number;
  description: string;
  equipements: string[];
  statut: StatutChambre;
  images: string[];
}

export interface Hotel {
  id: string;
  name: string;
  city: string;
  address: string;
  location: { lat: number; lng: number };
  description: string;
  image: string;
  images: string[];
  amenities: string[];
  rating: number;
  reviewCount: number;
  rooms: Room[];
}