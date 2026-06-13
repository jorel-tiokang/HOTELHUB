import { Langue } from "./utilisateur";

export interface Service {
  id: string;
  nom: string;               // "Piscine", "Spa", "Wifi"...
  icone?: string;            // nom d'icône Lucide
  traductions: Record<Langue, string>; // { fr: "Piscine", en: "Pool" }
}