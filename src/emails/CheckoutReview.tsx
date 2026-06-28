import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Row,
  Column,
} from "@react-email/components";
import * as React from "react";

interface CheckoutReviewProps {
  clientName: string;
  hotelName: string;
  checkOut: string;
  bookingRef: string;
}

export default function CheckoutReview({
  clientName = "Cher client",
  hotelName = "Hakuna Matata Resort",
  checkOut = "2026-07-05",
  bookingRef = "RES-001",
}: CheckoutReviewProps) {
  return (
    <Html>
      <Head />
      <Preview>⭐ Partagez votre expérience au {hotelName} !</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={logo}>🏨 HotelHub</Heading>
            <Text style={tagline}>Merci pour votre séjour</Text>
          </Section>

          <Section style={heroSection}>
            <Text style={heroEmoji}>⭐</Text>
            <Heading style={heroHeading}>Comment était votre séjour ?</Heading>
            <Text style={heroSub}>
              Bonjour <strong>{clientName}</strong>, votre séjour au{" "}
              <strong>{hotelName}</strong> s'est terminé le {checkOut}. Votre
              avis nous aide à améliorer l'expérience pour tous.
            </Text>
          </Section>

          <Hr style={divider} />

          <Section style={starsSection}>
            <Text style={starsLabel}>Donnez une note à votre séjour</Text>
            <Text style={stars}>⭐ ⭐ ⭐ ⭐ ⭐</Text>
            <Text style={starsHint}>
              Connectez-vous à HotelHub et rendez-vous dans l'onglet "Avis" de
              votre tableau de bord pour laisser votre évaluation.
            </Text>
          </Section>

          <Hr style={divider} />

          <Section style={detailsSection}>
            <Row style={detailRow}>
              <Column style={detailLabel}>🧾 Référence</Column>
              <Column style={detailValue}>{bookingRef}</Column>
            </Row>
            <Row style={detailRow}>
              <Column style={detailLabel}>🏨 Hôtel</Column>
              <Column style={detailValue}>{hotelName}</Column>
            </Row>
            <Row style={detailRow}>
              <Column style={detailLabel}>📅 Départ</Column>
              <Column style={detailValue}>{checkOut}</Column>
            </Row>
          </Section>

          <Hr style={divider} />

          <Section style={footer}>
            <Text style={footerText}>
              Merci d'avoir choisi HotelHub pour votre séjour. À bientôt !
            </Text>
            <Text style={footerSmall}>
              © {new Date().getFullYear()} HotelHub — Tous droits réservés
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main: React.CSSProperties = { backgroundColor: "#0f0f10", fontFamily: "'Inter', 'Helvetica Neue', sans-serif" };
const container: React.CSSProperties = { maxWidth: "560px", margin: "0 auto", backgroundColor: "#1a1a1f", borderRadius: "16px", overflow: "hidden" };
const header: React.CSSProperties = { background: "linear-gradient(135deg, #9b6c00 0%, #5b21b6 100%)", padding: "32px 40px", textAlign: "center" };
const logo: React.CSSProperties = { color: "#ffffff", fontSize: "28px", fontWeight: "800", margin: "0" };
const tagline: React.CSSProperties = { color: "rgba(255,255,255,0.7)", fontSize: "13px", margin: "4px 0 0" };
const heroSection: React.CSSProperties = { padding: "40px 40px 24px", textAlign: "center" };
const heroEmoji: React.CSSProperties = { fontSize: "48px", margin: "0 0 12px" };
const heroHeading: React.CSSProperties = { color: "#ffffff", fontSize: "26px", fontWeight: "700", margin: "0 0 12px" };
const heroSub: React.CSSProperties = { color: "rgba(255,255,255,0.65)", fontSize: "15px", lineHeight: "1.6", margin: "0" };
const divider: React.CSSProperties = { borderColor: "rgba(255,255,255,0.08)", margin: "0 40px" };
const starsSection: React.CSSProperties = { padding: "24px 40px", textAlign: "center" };
const starsLabel: React.CSSProperties = { color: "rgba(255,255,255,0.5)", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 8px" };
const stars: React.CSSProperties = { fontSize: "32px", margin: "0 0 12px" };
const starsHint: React.CSSProperties = { color: "rgba(255,255,255,0.45)", fontSize: "13px", lineHeight: "1.5", margin: "0" };
const detailsSection: React.CSSProperties = { padding: "16px 40px 24px" };
const detailRow: React.CSSProperties = { marginBottom: "10px" };
const detailLabel: React.CSSProperties = { color: "rgba(255,255,255,0.45)", fontSize: "13px", width: "45%" };
const detailValue: React.CSSProperties = { color: "#ffffff", fontSize: "14px", fontWeight: "600" };
const footer: React.CSSProperties = { padding: "24px 40px 32px", textAlign: "center" };
const footerText: React.CSSProperties = { color: "rgba(255,255,255,0.45)", fontSize: "13px", margin: "0 0 8px" };
const footerSmall: React.CSSProperties = { color: "rgba(255,255,255,0.25)", fontSize: "11px", margin: "0" };
