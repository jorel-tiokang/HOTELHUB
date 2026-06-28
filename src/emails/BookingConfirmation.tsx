import {
  Body,
  Button,
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

interface BookingConfirmationProps {
  clientName: string;
  hotelName: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  totalPrice: number;
  bookingRef: string;
}

export default function BookingConfirmation({
  clientName = "Cher client",
  hotelName = "Hakuna Matata Resort",
  roomType = "Suite Deluxe",
  checkIn = "2026-07-01",
  checkOut = "2026-07-05",
  nights = 4,
  totalPrice = 120000,
  bookingRef = "RES-001",
}: BookingConfirmationProps) {
  const previewText = `Votre réservation au ${hotelName} est confirmée !`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={logo}>🏨 HotelHub</Heading>
            <Text style={tagline}>Bienvenue dans l'excellence</Text>
          </Section>

          {/* Hero */}
          <Section style={heroSection}>
            <Text style={heroEmoji}>✅</Text>
            <Heading style={heroHeading}>Réservation Confirmée</Heading>
            <Text style={heroSub}>
              Bonjour <strong>{clientName}</strong>, votre séjour au{" "}
              <strong>{hotelName}</strong> est bien confirmé.
            </Text>
          </Section>

          <Hr style={divider} />

          {/* Booking Details */}
          <Section style={detailsSection}>
            <Heading as="h2" style={sectionTitle}>
              Détails de votre séjour
            </Heading>

            <Row style={detailRow}>
              <Column style={detailLabel}>🏨 Hôtel</Column>
              <Column style={detailValue}>{hotelName}</Column>
            </Row>
            <Row style={detailRow}>
              <Column style={detailLabel}>🛏️ Chambre</Column>
              <Column style={detailValue}>{roomType}</Column>
            </Row>
            <Row style={detailRow}>
              <Column style={detailLabel}>📅 Arrivée</Column>
              <Column style={detailValue}>{checkIn}</Column>
            </Row>
            <Row style={detailRow}>
              <Column style={detailLabel}>📅 Départ</Column>
              <Column style={detailValue}>{checkOut}</Column>
            </Row>
            <Row style={detailRow}>
              <Column style={detailLabel}>🌙 Nuits</Column>
              <Column style={detailValue}>{nights}</Column>
            </Row>
            <Row style={detailRow}>
              <Column style={detailLabel}>🧾 Référence</Column>
              <Column style={detailValue}>{bookingRef}</Column>
            </Row>
          </Section>

          <Hr style={divider} />

          {/* Price Box */}
          <Section style={priceBox}>
            <Text style={priceLabel}>Montant total</Text>
            <Text style={priceValue}>{totalPrice.toLocaleString()} FCFA</Text>
          </Section>

          <Hr style={divider} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Besoin d'aide ? Contactez directement l'hôtel via la messagerie
              HotelHub.
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

// ── Styles ─────────────────────────────────────────────────────────────────────

const main: React.CSSProperties = {
  backgroundColor: "#0f0f10",
  fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
};

const container: React.CSSProperties = {
  maxWidth: "560px",
  margin: "0 auto",
  backgroundColor: "#1a1a1f",
  borderRadius: "16px",
  overflow: "hidden",
};

const header: React.CSSProperties = {
  background: "linear-gradient(135deg, #5b21b6 0%, #9b6c00 100%)",
  padding: "32px 40px",
  textAlign: "center",
};

const logo: React.CSSProperties = {
  color: "#ffffff",
  fontSize: "28px",
  fontWeight: "800",
  margin: "0",
};

const tagline: React.CSSProperties = {
  color: "rgba(255,255,255,0.7)",
  fontSize: "13px",
  margin: "4px 0 0",
};

const heroSection: React.CSSProperties = {
  padding: "40px 40px 24px",
  textAlign: "center",
};

const heroEmoji: React.CSSProperties = {
  fontSize: "48px",
  margin: "0 0 12px",
};

const heroHeading: React.CSSProperties = {
  color: "#ffffff",
  fontSize: "26px",
  fontWeight: "700",
  margin: "0 0 12px",
};

const heroSub: React.CSSProperties = {
  color: "rgba(255,255,255,0.65)",
  fontSize: "15px",
  lineHeight: "1.6",
  margin: "0",
};

const divider: React.CSSProperties = {
  borderColor: "rgba(255,255,255,0.08)",
  margin: "0 40px",
};

const detailsSection: React.CSSProperties = {
  padding: "24px 40px",
};

const sectionTitle: React.CSSProperties = {
  color: "#d4a017",
  fontSize: "14px",
  fontWeight: "600",
  textTransform: "uppercase",
  letterSpacing: "1px",
  margin: "0 0 16px",
};

const detailRow: React.CSSProperties = {
  marginBottom: "10px",
};

const detailLabel: React.CSSProperties = {
  color: "rgba(255,255,255,0.45)",
  fontSize: "13px",
  width: "45%",
};

const detailValue: React.CSSProperties = {
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: "600",
};

const priceBox: React.CSSProperties = {
  padding: "24px 40px",
  textAlign: "center",
};

const priceLabel: React.CSSProperties = {
  color: "rgba(255,255,255,0.5)",
  fontSize: "12px",
  textTransform: "uppercase",
  letterSpacing: "1px",
  margin: "0 0 4px",
};

const priceValue: React.CSSProperties = {
  color: "#d4a017",
  fontSize: "32px",
  fontWeight: "800",
  margin: "0",
};

const footer: React.CSSProperties = {
  padding: "24px 40px 32px",
  textAlign: "center",
};

const footerText: React.CSSProperties = {
  color: "rgba(255,255,255,0.45)",
  fontSize: "13px",
  margin: "0 0 8px",
};

const footerSmall: React.CSSProperties = {
  color: "rgba(255,255,255,0.25)",
  fontSize: "11px",
  margin: "0",
};
