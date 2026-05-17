"use client";

import { Zap, CircleDollarSign, Globe, WifiOff } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

// Individual staggered item wrapper
function RevealItem({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`${isVisible ? "reveal-visible" : "reveal-hidden"} ${className}`}
      style={{ animationDelay: isVisible ? `${delay}ms` : undefined }}
    >
      {children}
    </div>
  );
}

export function Feature1() {
  const featureItems = [
    {
      icon: <Zap className="text-[color:var(--blue)] w-8 h-8 mb-2" />,
      title: "Temps réel",
      desc: "L'assurance d'une réponse immédiate.",
    },
    {
      icon: <Globe className="text-[color:var(--blue)] w-8 h-8 mb-2" />,
      title: "Multilingue",
      desc: "Francais, Anglais, Portugais",
    },
    {
      icon: <CircleDollarSign className="text-[color:var(--blue)] w-8 h-8 mb-2" />,
      title: "Multi-devises",
      desc: "XAF, USD, EUR",
    },
    {
      icon: <WifiOff className="text-[color:var(--blue)] w-8 h-8 mb-2" />,
      title: "Offline-first",
      desc: "Réservation sans connexion, Synchronisation automatique",
    },
  ];

  return (
    <>
      <div className="text-center mb-10 px-4">
        <span className="inline-block bg-[rgb(150,130,120,.4)] text-[#3C3489] text-[1.2rem] font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-widest">
          ✦ Pourquoi HôtelHub ?
        </span>
      </div>
      <div className="grid grid-cols-4 bg-[rgb(150,130,120,.2)]/90 backdrop-blur-md">
        {featureItems.map((item, i) => (
          <RevealItem key={i} delay={i * 90} className="flex flex-col items-center p-4">
            {item.icon}
            <h3 className="font-bold text-lg">{item.title}</h3>
            <p className="text-sm text-gray-900">{item.desc}</p>
          </RevealItem>
        ))}
      </div>
    </>
  );
}

const roleCards = [
  {
    title: "Client",
    accent: "#008080",
    items: [
      "Recherche intélligente",
      "Réservation & annulation",
      "Historique de réservations",
      "Dépôt d'avis après séjour",
    ],
  },
  {
    title: "PDG d'hôtels",
    accent: "#3C3489",
    items: [
      "Gestion des hôtels",
      "Tableau de bord des réservations",
      "Consultations des avis",
      "Statistiques de performance",
    ],
  },
  {
    title: "Directeur d'hôtel",
    accent: "#CC7A5C",
    items: [
      "Gestion des chambres et tarifs",
      "Réception des paiements sécurisés",
      "Support dédié 24h/24",
    ],
  },
];

export function Feature2() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
      {roleCards.map((card, i) => (
        <RevealItem key={i} delay={i * 110}>
          <div
            className="bg-white rounded-2xl shadow-sm p-8 flex flex-col h-full"
            style={{ borderTop: `4px solid ${card.accent}` }}
          >
            <h3 className="text-2xl font-bold text-[#26215c] mb-6">{card.title}</h3>
            <ul className="space-y-4 mb-8 flex-grow">
              {card.items.map((item, j) => (
                <li key={j} className="flex items-start text-gray-600 text-sm">
                  <span
                    className="mr-3 mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: card.accent }}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </RevealItem>
      ))}
    </div>
  );
}
