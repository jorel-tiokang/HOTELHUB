import { Zap, CircleDollarSign, Globe, WifiOff } from "lucide-react"; // Exemple avec Lucide

export function Feature1() {
  return (
    <>
      <div className="text-center mb-10 px-4">
        <span className="inline-block bg-[rgb(150,130,120,.4)] text-[#3C3489] text-[1.2rem] font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-widest">
          ✦ Pourquoi HôtelHub ?
        </span>
      </div>
      <div className="grid grid-cols-4 bg-[rgb(150,130,120,.2)]/90 backdrop-blur-md">
        <div className="flex flex-col items-center p-4">
          <Zap className="text-[color:var(--blue)] w-8 h-8 mb-2" />
          <h3 className="font-bold text-lg">Temps réel</h3>
          <p className="text-sm text-gray-900">
            L'assurance d'une réponse immédiate.
          </p>
        </div>

        <div className="flex flex-col items-center p-4">
          <Globe className="text-[color:var(--blue)] w-8 h-8 mb-2" />
          <h3 className="font-bold text-lg">Multilingue</h3>
          <p className="text-sm text-gray-900">Francais, Anglais, Portugais</p>
        </div>

        <div className="flex flex-col items-center p-4">
          <CircleDollarSign className="text-[color:var(--blue)] w-8 h-8 mb-2" />
          <h3 className="font-bold text-lg">Multi-devises</h3>
          <p className="text-sm text-gray-900">XAF, USD, EUR</p>
        </div>

        <div className="flex flex-col items-center p-4">
          <WifiOff className="text-[color:var(--blue)] w-8 h-8 mb-2" />
          <h3 className="font-bold text-lg">Offline-first</h3>
          <p className="text-sm text-gray-900">
            Réservation sans connexion, Synchronisation automatique
          </p>
        </div>
      </div>
    </>
  );
}

export function Feature2() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
  
  <div className="bg-white rounded-2xl shadow-sm border-t-4 border-[#008080] p-8 flex flex-col h-full">
    <h3 className="text-2xl font-bold text-[#26215c] mb-6">Client</h3>
    
    <ul className="space-y-4 mb-8 flex-grow">
      {["Recherche intélligente", "Réservation & annulation", "Historique de réservations", "Dépôt d'avis après séjour"].map((item, i) => (
        <li key={i} className="flex items-start text-gray-600 text-sm">
          <span className="text-[#008080] mr-3 mt-1.5 w-1.5 h-1.5 rounded-full bg-[#008080] flex-shrink-0" />
          {item}
        </li>
      ))}
    </ul>
  </div>

  <div className="bg-white rounded-2xl shadow-sm border-t-4 border-[#3C3489] p-8 flex flex-col h-full">
    <h3 className="text-2xl font-bold text-[#26215c] mb-6">PDG d'hôtels</h3>
    
    <ul className="space-y-4 mb-8 flex-grow">
      {["Gestion des hôtels", "Tableau de bord des réservations", "Consultations des avis", "Statistiques de performance"].map((item, i) => (
        <li key={i} className="flex items-start text-gray-600 text-sm">
          <span className="text-[#3C3489] mr-3 mt-1.5 w-1.5 h-1.5 rounded-full bg-[#3C3489] flex-shrink-0" />
          {item}
        </li>
      ))}
    </ul>
  </div>

  <div className="bg-white rounded-2xl shadow-sm border-t-4 border-[#CC7A5C] p-8 flex flex-col h-full">
    <h3 className="text-2xl font-bold text-[#26215c] mb-6">Directeur d'hôtel</h3>
    
    <ul className="space-y-4 mb-8 flex-grow">
      {["Gestion des chambres et tarifs", "Réception des paiements sécurisés", "Support dédié 24h/24"].map((item, i) => (
        <li key={i} className="flex items-start text-gray-600 text-sm">
          <span className="text-[#CC7A5C] mr-3 mt-1.5 w-1.5 h-1.5 rounded-full bg-[#CC7A5C] flex-shrink-0" />
          {item}
        </li>
      ))}
    </ul>
  </div>

</div>
  );
}
