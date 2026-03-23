import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Hr,
  Img
} from "@react-email/components";
import * as React from "react";
import { format } from "date-fns";
import { cs } from "date-fns/locale";

interface MeetingConfirmationEmailProps {
  guestName: string;
  startTime: Date;
  meetLink: string;
}

export const MeetingConfirmationEmail = ({
  guestName,
  startTime,
  meetLink,
}: MeetingConfirmationEmailProps) => {
  const formattedDate = format(new Date(startTime), "EEEE d. MMMM yyyy", { locale: cs });
  const formattedTime = format(new Date(startTime), "HH:mm", { locale: cs });

  return (
    <Html>
      <Head />
      <Preview>Vaše schůzka se SimCall je potvrzena ({formattedDate} v {formattedTime})</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Schůzka potvrzena</Heading>
          <Text style={text}>Dobrý den, {guestName},</Text>
          <Text style={text}>
            děkujeme za váš zájem. Vaše schůzka se SimCall je úspěšně naplánována. Těšíme se na online setkání, kde společně probereme vaše potřeby.
          </Text>

          <Section style={detailsContainer}>
            <Text style={detailsTitle}>Detaily schůzky</Text>
            <Text style={detailItem}>
              <strong>Kdy:</strong> {formattedDate} v {formattedTime} (30 minut)
            </Text>
            <Text style={detailItem}>
              <strong>Kde:</strong> Google Meet
            </Text>
          </Section>

          <Section style={buttonContainer}>
            <Link href={meetLink} style={button}>
              Připojit se k hovoru (Google Meet)
            </Link>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            V případě, že se nebudete moci zúčastnit, dejte nám prosím vědět odpovědí na tento email.
            <br />
            © {new Date().getFullYear()} SimCall
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default MeetingConfirmationEmail;

const main = {
  backgroundColor: "#f9fafb",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "40px 20px",
  maxWidth: "560px",
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  border: "1px solid #f3f4f6",
  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
};

const h1 = {
  color: "#111827",
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "0 0 24px",
};

const text = {
  color: "#4b5563",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 16px",
};

const detailsContainer = {
  backgroundColor: "#f9fafb",
  padding: "20px",
  borderRadius: "8px",
  margin: "24px 0",
};

const detailsTitle = {
  color: "#111827",
  fontSize: "16px",
  fontWeight: "bold",
  margin: "0 0 12px",
};

const detailItem = {
  color: "#4b5563",
  fontSize: "15px",
  margin: "0 0 8px",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  backgroundColor: "#3b82f6",
  borderRadius: "6px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "14px 24px",
  fontWeight: "medium",
};

const hr = {
  borderColor: "#e5e7eb",
  margin: "32px 0 24px",
};

const footer = {
  color: "#9ca3af",
  fontSize: "14px",
  textAlign: "center" as const,
};
