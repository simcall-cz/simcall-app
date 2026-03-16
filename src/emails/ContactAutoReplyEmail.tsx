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

interface ContactAutoReplyEmailProps {
  name: string;
}

export default function ContactAutoReplyEmail({
  name = "zákazníku",
}: ContactAutoReplyEmailProps) {
  const firstName = name.split(" ")[0];

  return (
    <Html lang="cs">
      <Head />
      <Preview>Vaši zprávu jsme přijali — odpovíme do 24 hodin</Preview>
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
              Potvrzení o přijetí zprávy
            </Text>
            <Text style={paragraphStyle}>
              Dobrý den,
            </Text>
            <Text style={paragraphStyle}>
              Vaši zprávu jsme v pořádku přijali. Náš tým se jí bude podrobně věnovat a 
              obdržíte odpověď zpravidla <strong>do 24 hodin</strong>.
            </Text>
            <Text style={paragraphStyle}>
              Pro rychlé odpovědi doporučujeme navštívit sekci Častých dotazů na našich stránkách.
            </Text>

            <Section style={ctaContainerStyle}>
              <Button style={ctaButtonStyle} href="https://simcall.cz/faq">
                Přejít na sekci FAQ →
              </Button>
            </Section>
          </Section>

          <Hr style={hrStyle} />

          <Section style={footerStyle}>
            <Text style={footerTextStyle}>
              Tento e-mail byl odeslán automaticky. Na odpovědi na tuto zprávu
              nebudeme reagovat.
            </Text>
            <Text style={footerSmallStyle}>
              SimCall — AI tréninková platforma pro realitní makléře
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
