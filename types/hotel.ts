import { HotelStats } from "./hotelstats";
import { Service } from "./service";
import { Langue } from "./utilisateur";

export interface Hotel {
  id: string;
  pdgId: string;             // propriétaire
  directeurId: string | null; // null si pas encore assigné
  nom: string;
  localisation: string;
  etoiles: 1 | 2 | 3 | 4 | 5;
  nombreChambresTotal: number;
  photos: string[];          // URLs
  services: Service[];
  email: string;
  telephone: string;
  traductions: Record<Langue, { nom: string; description: string }>;
  actif: boolean;            // false = soft delete
  createdAt: string;
  updatedAt: string;

  // Snapshot stats (calculés côté backend)
  stats?: HotelStats;
}