import { Devise } from "./utilisateur";

export interface HotelStats {
  tauxOccupation: number;        // pourcentage 0-100
  reservationsTotal: number;
  reservationsConfirmees: number;
  recettesMois: number;          // dans la devise du PDG
  recettesTotal: number;
  noteMoyenne: number;           // 0-5
  // Pour les graphiques
  historiqueRecettes: MetriqueFinanciere[];
  historiqueOccupation: MetriqueFinanciere[];
}

export interface MetriqueFinanciere {
  periode: string;               // "2026-05", "2026-06"...
  valeur: number;
  devise: Devise;
}
