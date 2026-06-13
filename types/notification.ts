import { Langue } from "./utilisateur";

export interface Notification {
  id: string;
  destinataireId: string;
  type: "RESERVATION_CONFIRMEE" | "RESERVATION_ANNULEE" | "NOUVEL_AVIS" | "COMPTE_CREE";
  message: Record<Langue, string>; // multilingue
  lu: boolean;
  createdAt: string;
}