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

interface OrderConfirmationEmailProps {
  customerName: string;
  plan: string;
  tier: number;
  minutesLimit: number;
  customerEmail: string;
}

const planLabels: Record<string, string> = {
  solo: "Solo",
  team: "Team",
};

export default function OrderConfirmationEmail({
  customerName = "zákazníku",
  plan = "solo",
  tier = 1,
  minutesLimit = 100,
  customerEmail = "",
}: OrderConfirmationEmailProps) {
  const firstName = customerName.split(" ")[0];
  const planLabel = planLabels[plan] || plan;

  return (
    <Html lang="cs">
      <Head />
      <Preview>Potvrzení objednávky — SimCall {planLabel}</Preview>
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
              Děkujeme za objednávku, {firstName}! ✅
            </Text>
            <Text style={paragraphStyle}>
              Vaše předplatné bylo úspěšně aktivováno. Zde je shrnutí:
            </Text>

            {/* Order summary box */}
            <Section style={summaryBoxStyle}>
              <table cellPadding={0} cellSpacing={0} style={{ width: "100%" }}>
                <tbody>
                  <tr>
                    <td style={summaryLabelStyle}>Plán</td>
                    <td style={summaryValueStyle}>{planLabel} (Tier {tier})</td>
                  </tr>
                  <tr>
                    <td style={summaryLabelStyle}>Minut měsíčně</td>
                    <td style={summaryValueStyle}>{minutesLimit.toLocaleString("cs-CZ")}</td>
                  </tr>
                  <tr>
                    <td style={summaryLabelStyle}>E-mail účtu</td>
                    <td style={summaryValueStyle}>{customerEmail}</td>
                  </tr>
                  <tr>
                    <td style={summaryLabelStyle}>Stav</td>
                    <td style={{ ...summaryValueStyle, color: "#16a34a", fontWeight: 600 }}>
                      Aktivní ✓
                    </td>
                  </tr>
                </tbody>
              </table>
            </Section>

            <Text style={paragraphStyle}>
              Nyní máte přístup ke všem funkcím vašeho plánu. Začněte
              trénovat prodejní hovory s AI hned teď!
            </Text>

            <Section style={ctaContainerStyle}>
              <Button style={ctaButtonStyle} href="https://simcall.cz/dashboard">
                Začít trénovat →
              </Button>
            </Section>
          </Section>

          <Hr style={hrStyle} />

          {/* Footer */}
          <Section style={footerStyle}>
            <Text style={footerTextStyle}>
              Pro správu předplatného navštivte{" "}
              <a href="https://simcall.cz/dashboard/profil" style={linkStyle}>
                svůj profil
              </a>
              .
            </Text>
            <Text style={footerTextStyle}>
              Potřebujete pomoct? Napište na{" "}
              <a href="mailto:simcallcz@gmail.com" style={linkStyle}>
                simcallcz@gmail.com
              </a>
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
  borderRadius: "12px",
  overflow: "hidden",
  border: "1px solid #e5e5e5",
};

const logoSectionStyle: React.CSSProperties = {
  padding: "32px 40px 0",
  textAlign: "center",
};

const logoBadgeStyle: React.CSSProperties = {
  backgroundColor: "#ef4444",
  borderRadius: "8px",
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

const summaryBoxStyle: React.CSSProperties = {
  backgroundColor: "#fafafa",
  border: "1px solid #e5e5e5",
  borderRadius: "8px",
  padding: "20px",
  margin: "20px 0",
};

const summaryLabelStyle: React.CSSProperties = {
  fontSize: "13px",
  color: "#737373",
  padding: "6px 0",
  width: "45%",
};

const summaryValueStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "#171717",
  fontWeight: 500,
  padding: "6px 0",
  textAlign: "right" as const,
};

const ctaContainerStyle: React.CSSProperties = {
  textAlign: "center",
  margin: "28px 0 8px",
};

const ctaButtonStyle: React.CSSProperties = {
  backgroundColor: "#ef4444",
  color: "#ffffff",
  padding: "14px 32px",
  borderRadius: "8px",
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
  margin: "8px 0 0",
  textAlign: "center" as const,
};

const linkStyle: React.CSSProperties = {
  color: "#ef4444",
  textDecoration: "underline",
};
