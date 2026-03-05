import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
  Img,
  Preview,
} from "@react-email/components";

interface WelcomeEmailProps {
  fullName: string;
  planName: string;
}

export default function WelcomeEmail({
  fullName = "uživateli",
  planName = "Demo",
}: WelcomeEmailProps) {
  const firstName = fullName.split(" ")[0];

  return (
    <Html lang="cs">
      <Head />
      <Preview>Vítejte v SimCall — Vaše AI tréninková platforma</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          {/* Logo */}
          <Section style={logoSectionStyle}>
            <table cellPadding={0} cellSpacing={0} style={{ margin: "0 auto" }}>
              <tbody>
                <tr>
                  <td
                    style={{
                      backgroundColor: "#ef4444",
                      borderRadius: "8px",
                      width: "36px",
                      height: "36px",
                      textAlign: "center",
                      verticalAlign: "middle",
                    }}
                  >
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
              Vítejte v SimCall, {firstName}! 🎉
            </Text>
            <Text style={paragraphStyle}>
              Děkujeme za registraci. Váš účet je připraven a můžete začít
              trénovat své prodejní dovednosti s AI.
            </Text>
            <Text style={paragraphStyle}>
              <strong>Váš plán:</strong> {planName}
            </Text>

            <Text style={subheadingStyle}>Co vás čeká?</Text>
            <table cellPadding={0} cellSpacing={0} style={{ width: "100%" }}>
              <tbody>
                {[
                  "🎯 Realistické simulace prodejních hovorů",
                  "📊 Detailní zpětná vazba od AI po každém hovoru",
                  "📈 Sledování vašeho pokroku a statistiky",
                  "🤖 Různí AI agenti s různými osobnostmi",
                ].map((item, i) => (
                  <tr key={i}>
                    <td style={featureItemStyle}>{item}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <Section style={ctaContainerStyle}>
              <Button style={ctaButtonStyle} href="https://simcall.cz/dashboard">
                Přejít do dashboardu →
              </Button>
            </Section>

            {/* Upsell for Demo users */}
            {planName === "Demo" && (
              <Section style={upsellSectionStyle}>
                <Text style={upsellHeadingStyle}>
                  Posuňte svůj trénink na další úroveň 🚀
                </Text>
                <Text style={upsellParagraphStyle}>
                  V rámci verze <strong>Demo</strong> máte k dispozici první <strong>3 tréninkové hovory s 1 AI agentem</strong> zcela zdarma.
                </Text>
                <Text style={upsellParagraphStyle}>
                  Chcete trénovat bez omezení? Získejte přístup ke všem AI agentům, neomezeným scénářům na míru a detailní pokročilé analytice.
                </Text>
                <Section style={upsellCtaContainerStyle}>
                  <Button style={upsellCtaButtonStyle} href="https://simcall.cz/cenik">
                    Zobrazit prémiové tarify
                  </Button>
                </Section>
              </Section>
            )}
          </Section>

          <Hr style={hrStyle} />

          {/* Footer */}
          <Section style={footerStyle}>
            <Text style={footerTextStyle}>
              Máte dotazy? Napište nám na{" "}
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

const subheadingStyle: React.CSSProperties = {
  fontSize: "16px",
  fontWeight: 600,
  color: "#171717",
  margin: "24px 0 12px",
};

const paragraphStyle: React.CSSProperties = {
  fontSize: "15px",
  color: "#525252",
  lineHeight: "1.6",
  margin: "0 0 12px",
};

const featureItemStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "#525252",
  padding: "6px 0",
  lineHeight: "1.5",
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
  margin: 0,
  textAlign: "center" as const,
};

const linkStyle: React.CSSProperties = {
  color: "#ef4444",
  textDecoration: "underline",
};

const upsellSectionStyle: React.CSSProperties = {
  marginTop: "32px",
  padding: "24px",
  backgroundColor: "#fef2f2", // light red background
  borderRadius: "8px",
  border: "1px solid #fee2e2",
};

const upsellHeadingStyle: React.CSSProperties = {
  fontSize: "16px",
  fontWeight: 700,
  color: "#991b1b", // dark red text
  margin: "0 0 12px",
};

const upsellParagraphStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "#7f1d1d",
  lineHeight: "1.6",
  margin: "0 0 12px",
};

const upsellCtaContainerStyle: React.CSSProperties = {
  marginTop: "16px",
};

const upsellCtaButtonStyle: React.CSSProperties = {
  backgroundColor: "#ffffff",
  color: "#ef4444",
  padding: "10px 20px",
  borderRadius: "6px",
  border: "1px solid #ef4444",
  fontSize: "14px",
  fontWeight: 600,
  textDecoration: "none",
  display: "inline-block",
};
