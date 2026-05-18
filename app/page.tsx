"use client";

import HotelScroll from "@/components/hotelCarousel";
import { Feature1, Feature2 } from "@/components/features";
import { Footer } from "@/components/footer";
import Header from "@/components/header";
import RevealSection from "@/components/revealSection";

const page = () => {
  return (
    <div className="min-h-screen w-full bg-[url('/landscape.jpg')] bg-cover bg-bottom bg-fixed bg-no-repeat">
      <div>
        <Header />
      </div>
      <br />
      <div>
        <h1 className="font-bold text-[35px]">
          Trouvez l'hotêl parfait{" "}
          <span className="text-[color:var(--blue)]">où que vous soyez</span>
        </h1>
        <h2 className="text-xl font-bold">
          Géolocalisation, disponibilités instantanées
        </h2>
        <br />
        <p>
          Services exclusifs, Évasion garantie, Disponibilité en temps réel.
        </p>
        <p>Des centaines d'hôtels au Cameroun, à portée de main.</p>
      </div>

      {/* Section Statistiques */}
      <div className="flex justify-center w-full px-4 mt-12">
        <div className="bg-[rgb(150,130,120,.2)]/90 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/10 w-full max-w-4xl flex flex-wrap justify-around items-center gap-y-8 gap-x-4">
          <div className="flex flex-col items-center min-w-[120px]">
            <span className="text-white text-4xl font-bold mb-1 tracking-tight">
              100+
            </span>
            <span className="text-[0.65rem] uppercase tracking-[0.2em] font-semibold">
              Hôtels
            </span>
          </div>

          <div className="flex flex-col items-center min-w-[120px]">
            <span className="text-white text-4xl font-bold mb-1 tracking-tight">
              62
            </span>
            <span className="text-[0.65rem] uppercase tracking-[0.2em] font-semibold">
              Régions en Afrique
            </span>
          </div>

          <div className="flex flex-col items-center min-w-[120px]">
            <div className="flex items-center text-white text-4xl font-bold mb-1 tracking-tight">
              4.2<span className="text-2xl ml-1 text-yellow-400">★</span>
            </div>
            <span className="text-[0.65rem] uppercase tracking-[0.2em] font-semibold text-center">
              Note moyenne
            </span>
          </div>

          <div className="flex flex-col items-center min-w-[120px]">
            <span className="text-white text-4xl font-bold mb-1 tracking-tight">
              24/7
            </span>
            <span className="text-[0.65rem] uppercase tracking-[0.2em] font-semibold">
              Disponible
            </span>
          </div>
        </div>
      </div>

      {/* Hotels */}
      <RevealSection delay={100}>
        <HotelScroll />
      </RevealSection>
      <br />
      <RevealSection delay={60}>
        <Feature1 />
      </RevealSection>

      <RevealSection delay={60}>
        <Feature2 />
      </RevealSection>

      <RevealSection delay={80}>
        <Footer />
      </RevealSection>
    </div>
  );
};

export default page;
