
export const mockReservations = [
  {
    id: "R001",
    hotel: "Royal Palace",
    localisation: "Douala",
    chambre: "Suite Présidentielle",
    jourDebut: "2026-05-10",
    jourFin: "2026-05-14",
    montantTotal: 740000,
    statut: "CONFIRMEE",
  },
  {
    id: "R002",
    hotel: "Hilton Hotel",
    localisation: "Yaoundé",
    chambre: "Chambre Standard",
    jourDebut: "2026-06-01",
    jourFin: "2026-06-03",
    montantTotal: 110000,
    statut: "EN_ATTENTE",
  },
  {
    id: "R003",
    hotel: "Akwa Palace",
    localisation: "Douala",
    chambre: "Junior Suite",
    jourDebut: "2026-04-01",
    jourFin: "2026-04-05",
    montantTotal: 360000,
    statut: "ANNULEE",
  },
];

export const mockAvis = [
  {
    id: "A001",
    hotel: "Royal Palace",
    texte: "Séjour exceptionnel, personnel très accueillant.",
    dateDepot: "2026-04-06",
    reponseDirecteur: null,
  },
  {
    id: "A002",
    hotel: "Akwa Palace",
    texte: "Chambre propre mais climatisation bruyante.",
    dateDepot: "2026-04-10",
    reponseDirecteur: "Merci pour votre retour, nous avons pris note.",
  },
];

export const mockHotels = [
  {
    id: "H001",
    nom: "Royal Palace",
    localisation: "Douala",
    etoiles: 5,
    nombreChambres: 80,
    services: ["Piscine", "Spa", "Restaurant", "Bar"],
    email: "contact@royalpalace.cm",
    telephone: "+237 233 000 001",
    statReservations: 34,
    statRecettes: 12500000,
    tauxOccupation: 72,
  },
  {
    id: "H002",
    nom: "Hilton Hotel",
    localisation: "Yaoundé",
    etoiles: 5,
    nombreChambres: 120,
    services: ["Gym", "Restaurant", "Parking", "Wifi"],
    email: "contact@hilton.cm",
    telephone: "+237 222 000 002",
    statReservations: 58,
    statRecettes: 21000000,
    tauxOccupation: 85,
  },
  {
    id: "H003",
    nom: "Akwa Palace",
    localisation: "Douala",
    etoiles: 4,
    nombreChambres: 60,
    services: ["Spa", "Bar", "Parking"],
    email: "contact@akwapalace.cm",
    telephone: "+237 233 000 003",
    statReservations: 22,
    statRecettes: 7800000,
    tauxOccupation: 55,
  },
];

export const mockChambres = [
  {
    id: "C001",
    numero: 101,
    type: "Simple",
    capacite: 1,
    prixParNuit: 55000,
    description: "Chambre standard avec vue sur jardin",
    equipements: ["Wifi", "Clim", "TV"],
    statut: "DISPONIBLE",
  },
  {
    id: "C002",
    numero: 201,
    type: "Suite",
    capacite: 4,
    prixParNuit: 185000,
    description: "Suite présidentielle avec terrasse panoramique",
    equipements: ["Piscine", "Spa", "Bar", "Wifi"],
    statut: "INDISPONIBLE",
  },
  {
    id: "C003",
    numero: 102,
    type: "Double",
    capacite: 2,
    prixParNuit: 85000,
    description: "Chambre supérieure avec vue sur mer",
    equipements: ["Wifi", "Clim", "TV", "Gym"],
    statut: "DISPONIBLE",
  },
];

export const mockDirecteurHotel = mockHotels[0];
