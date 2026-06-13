import { StatutDirecteur, Utilisateur } from "./utilisateur";

export interface Directeur extends Utilisateur {
  role: "DIRECTEUR";
  // Créé par le PDG, assigné à un seul hôtel
  hotelId: string;
  pdgId: string;             // PDG qui a créé ce compte
  statut: StatutDirecteur;   // ACTIF | DESACTIVE | REVOQUE
  motDePasseTemporaire: boolean; // true = doit changer au 1er login
  dateAffectation: string;
}