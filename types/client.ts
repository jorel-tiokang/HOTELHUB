// ============================================
// CLIENT
// ============================================

import { Utilisateur } from "./utilisateur";

export interface Client extends Utilisateur {
  role: "CLIENT";
  localisation: string;
  sexe: "HOMME" | "FEMME" | "AUTRE";
  dateNaissance: string;
  adresse: string;
}