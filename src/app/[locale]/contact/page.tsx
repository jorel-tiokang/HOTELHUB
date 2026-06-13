import Header from "@/src/components/Header";
import ContactPage from "@/src/components/Contactcomponents";
import RevealSection from "@/src/components/revealSection";

export default function Contact() {
  return (
    <>
      <Header />
      <RevealSection delay={30}>
        <ContactPage />
      </RevealSection>
    </>
  );
}
