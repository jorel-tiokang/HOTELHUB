import { Devise } from "./utilisateur";

export type StatutChambre = "DISPONIBLE" | "INDISPONIBLE";

export interface Chambre {
  id: string;
  hotelId?: string;
  numero: number;
  type: string;
  capacite: number;
  prixParNuit: number;
  devises?: Devise;
  description: string;
  equipements: string[];
  statut: StatutChambre;
  /** Local object URLs (from File) or remote URLs */
  images: string[];
  createdAt?: string;
  updatedAt?: string; 
}

export interface NewChambreFormData {
  numero: string;
  type: string;
  capacite: string;
  prixParNuit: string;
  description: string;
  equipements: string;
  images: File[];
}
