import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
  Preview,
} from "@react-email/components";

interface TicketResponseEmailProps {
  customerName: string;
  ticketSubject: string;
  ticketMessage: string;
  adminResponse: string;
}

export default function TicketResponseEmail({
  customerName = "zákazníku",
  ticketSubject = "Dotaz na službu",
  ticketMessage = "Původní zpráva zákazníka...",
  adminResponse = "Odpověď od týmu SimCall...",
}: TicketResponseEmailProps) {
  const firstName = customerName.split(" ")[0];

  return (
    <Html lang="cs">
      <Head />
      <Preview>Odpověď na váš tiket: {ticketSubject}</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          {/* Logo */}
          <Section style={logoSectionStyle}>
            <table cellPadding={0} cellSpacing={0} style={{ margin: "0 auto" }}>
              <tbody>
                <tr>
                  <td style={logoBadgeStyle}>
                    <Text style={{ color: "#fff", fontWeight: 900, fontSize: "16px", margin: 0 }}>
                      S
                    </Text>
                  </td>
                  <td style={{ paddingLeft: "10px" }}>
                    <Text style={{ fontSize: "20px", fontWeight: 700, margin: 0, color: "#171717" }}>
                      Sim<span style={{ color: "#ef4444" }}>Call</span>
                    </Text>
                  </td>
                </tr>
              </tbody>
            </table>
          </Section>

          {/* Content */}
          <Section style={contentStyle}>
            <Text style={headingStyle}>
              Odpověď na váš tiket
            </Text>
            <Text style={paragraphStyle}>
              Dobrý den, {firstName},
            </Text>
            <Text style={paragraphStyle}>
              náš tým odpověděl na váš tiket. Níže najdete vaši původní zprávu a odpověď.
            </Text>

            {/* Original question */}
            <Text style={labelStyle}>Vaše zpráva ({ticketSubject}):</Text>
            <Section style={originalMessageStyle}>
              <Text style={originalMessageTextStyle}>
                {ticketMessage}
              </Text>
            </Section>

            {/* Admin response */}
            <Text style={labelStyle}>Odpověď od týmu SimCall:</Text>
            <Section style={responseStyle}>
              <Text style={responseTextStyle}>
                {adminResponse}
              </Text>
            </Section>

            <Section style={ctaContainerStyle}>
              <Button style={ctaButtonStyle} href="https://simcall.cz/dashboard/podpora">
                Zobrazit v dashboardu
              </Button>
            </Section>
          </Section>

          <Hr style={hrStyle} />

          <Section style={footerStyle}>
            <Text style={footerTextStyle}>
              Na tento e-mail můžete odpovědět nebo vytvořte nový tiket v dashboardu.
            </Text>
            <Text style={footerSmallStyle}>
              SimCall | AI tréninková platforma pro realitní makléře
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// ============================================================
// Styles
// ============================================================

const bodyStyle: React.CSSProperties = {
  backgroundColor: "#f5f5f5",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  margin: 0,
  padding: "40px 0",
};

const containerStyle: React.CSSProperties = {
  maxWidth: "560px",
  margin: "0 auto",
  backgroundColor: "#ffffff",
  borderRadius: "4px",
  overflow: "hidden",
  border: "1px solid #e5e5e5",
};

const logoSectionStyle: React.CSSProperties = {
  padding: "32px 40px 0",
  textAlign: "center",
};

const logoBadgeStyle: React.CSSProperties = {
  backgroundColor: "#ef4444",
  borderRadius: "4px",
  width: "36px",
  height: "36px",
  textAlign: "center",
  verticalAlign: "middle",
};

const contentStyle: React.CSSProperties = {
  padding: "24px 40px",
};

const headingStyle: React.CSSProperties = {
  fontSize: "22px",
  fontWeight: 700,
  color: "#171717",
  margin: "0 0 16px",
  lineHeight: "1.3",
};

const paragraphStyle: React.CSSProperties = {
  fontSize: "15px",
  color: "#525252",
  lineHeight: "1.6",
  margin: "0 0 12px",
};

const labelStyle: React.CSSProperties = {
  fontSize: "13px",
  fontWeight: 600,
  color: "#737373",
  margin: "20px 0 6px",
};

const originalMessageStyle: React.CSSProperties = {
  backgroundColor: "#fafafa",
  border: "1px solid #e5e5e5",
  borderRadius: "8px",
  padding: "16px",
  margin: "0 0 8px",
};

const originalMessageTextStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "#525252",
  lineHeight: "1.6",
  margin: 0,
  whiteSpace: "pre-wrap" as const,
};

const responseStyle: React.CSSProperties = {
  backgroundColor: "#eff6ff",
  border: "1px solid #bfdbfe",
  borderRadius: "8px",
  padding: "16px",
  margin: "0 0 8px",
};

const responseTextStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "#1e40af",
  lineHeight: "1.6",
  margin: 0,
  whiteSpace: "pre-wrap" as const,
};

const ctaContainerStyle: React.CSSProperties = {
  textAlign: "center",
  margin: "28px 0 8px",
};

const ctaButtonStyle: React.CSSProperties = {
  backgroundColor: "#ef4444",
  color: "#ffffff",
  padding: "14px 32px",
  borderRadius: "4px",
  fontSize: "14px",
  fontWeight: 600,
  textDecoration: "none",
  display: "inline-block",
};

const hrStyle: React.CSSProperties = {
  borderColor: "#e5e5e5",
  margin: "0",
};

const footerStyle: React.CSSProperties = {
  padding: "24px 40px",
};

const footerTextStyle: React.CSSProperties = {
  fontSize: "13px",
  color: "#737373",
  margin: "0 0 8px",
  textAlign: "center" as const,
};

const footerSmallStyle: React.CSSProperties = {
  fontSize: "12px",
  color: "#a3a3a3",
  margin: 0,
  textAlign: "center" as const,
};
