export interface Avis {
  id: string;
  clientId: string;
  hotelId: string;
  reservationId: string;         // lié à un séjour réel
  texte: string;
  note: 1 | 2 | 3 | 4 | 5;
  dateDepot: string;
  reponseDirecteur: string | null;
  dateReponse: string | null;
}