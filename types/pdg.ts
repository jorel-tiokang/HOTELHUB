import { Utilisateur } from "./utilisateur";

export interface PDG extends Utilisateur {
  role: "PDG";
  // Un PDG possède plusieurs hôtels
  hotelIds: string[];
}