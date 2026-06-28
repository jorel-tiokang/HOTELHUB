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

import type { Chambre } from "@/types/chambre";

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
    pays: "Cameroun",
    countryCode: "CM",
    localisation: "Douala",
    adresse: "Douala Centre, Avenue de Gaulle",
    etoiles: 5,
    nombreChambres: 80,
    services: ["Piscine", "Spa", "Restaurant", "Bar"],
    email: "contact@royalpalace.cm",
    telephone: "+237 233 000 001",
    receptionHours: { open: "00:00", close: "23:59" },
    cancellationPolicy: "Annulation gratuite jusqu'à 24h avant l'arrivée. Au-delà, le montant total du séjour est dû.",
    actif: true,
    statReservations: 34,
    statRecettes: 12500000,
    tauxOccupation: 72,
  },
  {
    id: "H002",
    nom: "Hilton Hotel",
    pays: "Cameroun",
    countryCode: "CM",
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
    pays: "Cameroun",
    countryCode: "CM",
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

export const mockChambres: Chambre[] = [
  {
    id: "C001",
    numero: 101,
    type: "Simple",
    capacite: 1,
    prixParNuit: 55000,
    description: "Chambre standard avec vue sur jardin",
    equipements: ["Wifi", "Clim", "TV"],
    statut: "DISPONIBLE",
    images: [],
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
    images: [],
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
    images: [],
  },
];

export const mockDirecteurHotel = mockHotels[0];

export const weeklyOccupancyData = [
  { day: "Lun", occupancy: 65 },
  { day: "Mar", occupancy: 78 },
  { day: "Mer", occupancy: 82 },
  { day: "Jeu", occupancy: 74 },
  { day: "Ven", occupancy: 91 },
  { day: "Sam", occupancy: 95 },
  { day: "Dim", occupancy: 88 },
];

export const recentBookings = [
  {
    id: "B001",
    guest: "Jean-Pierre Mbeki",
    roomType: "Suite Presidentielle",
    checkIn: "15 Mai 2026",
    checkOut: "18 Mai 2026",
    status: "CONFIRMEE",
    price: 185000,
  },
  {
    id: "B002",
    guest: "Marie Nguesso",
    roomType: "Chambre Double",
    checkIn: "16 Mai 2026",
    checkOut: "19 Mai 2026",
    status: "EN_ATTENTE",
    price: 85000,
  },
  {
    id: "B003",
    guest: "Paul Biya Jr.",
    roomType: "Junior Suite",
    checkIn: "17 Mai 2026",
    checkOut: "20 Mai 2026",
    status: "CONFIRMEE",
    price: 120000,
  },
  {
    id: "B004",
    guest: "Aminata Diallo",
    roomType: "Chambre Simple",
    checkIn: "18 Mai 2026",
    checkOut: "21 Mai 2026",
    status: "EN_ATTENTE",
    price: 55000,
  },
  {
    id: "B005",
    guest: "Kofi Mensah",
    roomType: "Suite Executive",
    checkIn: "19 Mai 2026",
    checkOut: "22 Mai 2026",
    status: "CONFIRMEE",
    price: 150000,
  },
];

export const latestReviews = [
  {
    id: "R001",
    guest: "Sophie Etienne",
    rating: 5,
    text: "Sejour exceptionnel ! Le personnel est aux petits soins et la chambre etait impeccable.",
    date: "12 Mai 2026",
    reply: null,
  },
  {
    id: "R002",
    guest: "Marc Ondoa",
    rating: 4,
    text: "Tres bon hotel, juste la climatisation un peu bruyante la nuit.",
    date: "10 Mai 2026",
    reply:
      "Merci pour votre retour. Nous avons pris note et ferons le necessaire.",
  },
  {
    id: "R003",
    guest: "Fatou Ndiaye",
    rating: 5,
    text: "Le petit-dejeuner est delicieux et la vue depuis ma chambre etait magnifique !",
    date: "8 Mai 2026",
    reply: null,
  },
];

export const staffMembers = [
  {
    id: "S001",
    name: "Alain Kamga",
    role: "Receptionniste",
    contact: "+237 699 123 456",
    status: "Actif",
  },
  {
    id: "S002",
    name: "Celine Fouda",
    role: "Gouvernante",
    contact: "+237 677 234 567",
    status: "Actif",
  },
  {
    id: "S003",
    name: "Bruno Essomba",
    role: "Concierge",
    contact: "+237 655 345 678",
    status: "Actif",
  },
  {
    id: "S004",
    name: "Diane Mbarga",
    role: "Chef Cuisinier",
    contact: "+237 699 456 789",
    status: "Inactif",
  },
];
