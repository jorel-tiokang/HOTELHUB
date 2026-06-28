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
  actif?: boolean;
  images: string[];
}

export interface ReceptionHours {
  open: string;  // "HH:MM", e.g. "08:00"
  close: string; // "HH:MM", e.g. "22:00"
}

export interface Hotel {
  id: string;
  name: string;
  country: string;
  countryCode: string;
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
  /** Reception opening hours — used to validate client arrival time */
  receptionHours: ReceptionHours;
  /** Plain-text cancellation / refund policy shown to clients */
  cancellationPolicy: string;
  /** If false, the hotel is hidden from the client catalogue */
  actif: boolean;
  /** System fields (non-editable by director) */
  createdAt: string;
  updatedAt: string;
}