// ============================================
// ENUMS
// ============================================

export type Role = "CLIENT" | "PDG" | "DIRECTEUR";

export type StatutReservation = "EN_ATTENTE" | "CONFIRMEE" | "ANNULEE";

export type StatutChambre = "DISPONIBLE" | "INDISPONIBLE";

export type StatutDirecteur = "ACTIF" | "DESACTIVE" | "REVOQUE";

export type TypeChambre = "SIMPLE" | "DOUBLE" | "SUITE" | "JUNIOR_SUITE" | "PRESIDENTIELLE";

export type Devise = "XAF" | "EUR" | "USD" | "NGN" | "KES";

export type Langue = "fr" | "en" | "pt";

// ============================================
// UTILISATEUR (base commune)
// ============================================

export interface Utilisateur {
  id: string;
  nom: string;
  email: string;
  telephone: string;
  motDePasseHash: string;
  role: Role;
  langue: Langue;           // internationalisation
  devise: Devise;           // multi-devises
  createdAt: string;        // ISO date
  updatedAt: string;
}