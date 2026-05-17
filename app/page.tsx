"use client";

import HotelScroll from "@/components/hotelCarousel";
import { Feature1, Feature2 } from "@/components/features";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { useScrollReveal } from "@/hooks/useScrollReveal";

// Helper: wraps a section with a scroll-reveal observer and stagger delay
function RevealSection({
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

const page = () => {
  return (
    <div className="min-h-screen w-full bg-[url('/landscape.jpg')] bg-cover bg-bottom bg-fixed bg-no-repeat">
      
      <div>
        <Header />
      </div>
      <br />

      {/* Hero text */}
      <RevealSection>
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
        <p>Des centaines d&apos;hôtels au Cameroun, à portée de main.</p>
      </RevealSection>

      {/* Section Statistiques */}
      <RevealSection delay={80} className="flex justify-center w-full px-4 mt-12">
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
              4.2<span className="text-2xl ml-1 text-white">★</span>
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
      </RevealSection>

      {/* Hotels carousel */}
      <RevealSection delay={60}>
        <HotelScroll />
      </RevealSection>

      <br />

      {/* Feature 1 */}
      <RevealSection delay={0}>
        <Feature1 />
      </RevealSection>

      {/* Feature 2 */}
      <RevealSection delay={80}>
        <Feature2 />
      </RevealSection>

      {/* Footer */}
      <RevealSection delay={40}>
        <Footer />
      </RevealSection>
    </div>
  );
};

export default page;
