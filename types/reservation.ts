import { Devise, StatutReservation } from "./utilisateur";

export interface Reservation {
  id: string;
  clientId: string;
  chambreId: string;
  hotelId: string;
  jourDebut: string;             // ISO date "2026-06-01"
  jourFin: string;
  nombrePersonnes: number;
  montantTotal: number;
  devise: Devise;
  statut: StatutReservation;
  // Règle DSS : un hôtel ne peut être supprimé
  // que si aucune réservation n'est CONFIRMEE
  createdAt: string;
  updatedAt: string;
}

