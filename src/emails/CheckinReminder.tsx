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

interface CheckinReminderProps {
  clientName: string;
  hotelName: string;
  roomType: string;
  checkIn: string;
  bookingRef: string;
  hotelAddress?: string;
}

export default function CheckinReminder({
  clientName = "Cher client",
  hotelName = "Hakuna Matata Resort",
  roomType = "Suite Deluxe",
  checkIn = "2026-07-01",
  bookingRef = "RES-001",
  hotelAddress = "Yaoundé, Cameroun",
}: CheckinReminderProps) {
  return (
    <Html>
      <Head />
      <Preview>⏰ Rappel : votre check-in au {hotelName} est demain !</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={logo}>🏨 HotelHub</Heading>
            <Text style={tagline}>Votre séjour commence bientôt</Text>
          </Section>

          <Section style={heroSection}>
            <Text style={heroEmoji}>⏰</Text>
            <Heading style={heroHeading}>Check-in demain !</Heading>
            <Text style={heroSub}>
              Bonjour <strong>{clientName}</strong>, votre séjour au{" "}
              <strong>{hotelName}</strong> commence demain. Voici un rappel des
              informations importantes.
            </Text>
          </Section>

          <Hr style={divider} />

          <Section style={detailsSection}>
            <Heading as="h2" style={sectionTitle}>
              Informations de check-in
            </Heading>
            <Row style={detailRow}>
              <Column style={detailLabel}>🏨 Hôtel</Column>
              <Column style={detailValue}>{hotelName}</Column>
            </Row>
            <Row style={detailRow}>
              <Column style={detailLabel}>📍 Adresse</Column>
              <Column style={detailValue}>{hotelAddress}</Column>
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
              <Column style={detailLabel}>🧾 Référence</Column>
              <Column style={detailValue}>{bookingRef}</Column>
            </Row>
          </Section>

          <Hr style={divider} />

          <Section style={tipBox}>
            <Text style={tipTitle}>💡 Conseils pour votre arrivée</Text>
            <Text style={tipText}>
              • Munissez-vous de votre pièce d'identité et de votre référence de
              réservation.
            </Text>
            <Text style={tipText}>
              • Contactez l'hôtel via HotelHub si vous avez des questions
              spéciales.
            </Text>
            <Text style={tipText}>
              • Le check-in anticipé est possible sous réserve de disponibilité.
            </Text>
          </Section>

          <Hr style={divider} />

          <Section style={footer}>
            <Text style={footerText}>
              Bon séjour ! L'équipe HotelHub vous souhaite une excellente
              expérience.
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
  background: "linear-gradient(135deg, #1a3a5c 0%, #5b21b6 100%)",
  padding: "32px 40px",
  textAlign: "center",
};
const logo: React.CSSProperties = { color: "#ffffff", fontSize: "28px", fontWeight: "800", margin: "0" };
const tagline: React.CSSProperties = { color: "rgba(255,255,255,0.7)", fontSize: "13px", margin: "4px 0 0" };
const heroSection: React.CSSProperties = { padding: "40px 40px 24px", textAlign: "center" };
const heroEmoji: React.CSSProperties = { fontSize: "48px", margin: "0 0 12px" };
const heroHeading: React.CSSProperties = { color: "#ffffff", fontSize: "26px", fontWeight: "700", margin: "0 0 12px" };
const heroSub: React.CSSProperties = { color: "rgba(255,255,255,0.65)", fontSize: "15px", lineHeight: "1.6", margin: "0" };
const divider: React.CSSProperties = { borderColor: "rgba(255,255,255,0.08)", margin: "0 40px" };
const detailsSection: React.CSSProperties = { padding: "24px 40px" };
const sectionTitle: React.CSSProperties = { color: "#d4a017", fontSize: "14px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 16px" };
const detailRow: React.CSSProperties = { marginBottom: "10px" };
const detailLabel: React.CSSProperties = { color: "rgba(255,255,255,0.45)", fontSize: "13px", width: "45%" };
const detailValue: React.CSSProperties = { color: "#ffffff", fontSize: "14px", fontWeight: "600" };
const tipBox: React.CSSProperties = { padding: "20px 40px", backgroundColor: "rgba(91,33,182,0.1)", margin: "0 40px", borderRadius: "12px" };
const tipTitle: React.CSSProperties = { color: "#a78bfa", fontSize: "13px", fontWeight: "700", margin: "0 0 10px" };
const tipText: React.CSSProperties = { color: "rgba(255,255,255,0.55)", fontSize: "13px", margin: "0 0 6px", lineHeight: "1.5" };
const footer: React.CSSProperties = { padding: "24px 40px 32px", textAlign: "center" };
const footerText: React.CSSProperties = { color: "rgba(255,255,255,0.45)", fontSize: "13px", margin: "0 0 8px" };
const footerSmall: React.CSSProperties = { color: "rgba(255,255,255,0.25)", fontSize: "11px", margin: "0" };
