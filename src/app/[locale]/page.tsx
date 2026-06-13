import Header from "@/src/components/Header";
import HeroSection from "@/src/components/HeroSection";
import HotelScroll from "@/src/components/hotelCarousel";
import TrustSection from "@/src/components/TrustSection";
import FeaturesSection from "@/src/components/FeaturesSection";
import TestimonialsSection from "@/src/components/TestimonialsSection";
import CTASection from "@/src/components/CTASection";
import { Footer } from "@/src/components/footer";
import RevealSection from "@/src/components/revealSection";

export default function HomePage() {
  return (
    <>
      {/* Floating header — renders above everything */}
      <Header />

      <main className="flex flex-col">

        {/* 1. Hero — full screen with background, search, stats */}
        <HeroSection />

        {/* 2. Hotel carousel */}
        <RevealSection delay={80}>
          <HotelScroll />
        </RevealSection>

        {/* 3. Trust / Seamless booking section */}
        <RevealSection delay={100}>
          <TrustSection />
        </RevealSection>

        {/* 4. Features grid */}
        <RevealSection delay={100}>
          <FeaturesSection />
        </RevealSection>

        {/* 5. Testimonials */}
        <RevealSection delay={80}>
          <TestimonialsSection />
        </RevealSection>

        {/* 6. CTA banner */}
        <RevealSection delay={60}>
          <CTASection />
        </RevealSection>

        {/* 7. Footer */}
        <Footer />
      </main>
    </>
  );
}