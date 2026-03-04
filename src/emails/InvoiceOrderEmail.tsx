import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Hr,
  Preview,
} from "@react-email/components";

interface InvoiceOrderEmailProps {
  customerName: string;
  email: string;
  plan: string;
  tier: number;
  amount: number;
  companyName?: string;
  ico?: string;
  dic?: string;
  address?: string;
}

const planLabels: Record<string, string> = {
  solo: "Solo",
  team: "Team",
};

export default function InvoiceOrderEmail({
  customerName = "zákazníku",
  email = "",
  plan = "solo",
  tier = 50,
  amount = 0,
  companyName = "",
  ico = "",
  dic = "",
  address = "",
}: InvoiceOrderEmailProps) {
  const firstName = customerName.split(" ")[0];
  const planLabel = planLabels[plan] || plan;

  return (
    <Html lang="cs">
      <Head />
      <Preview>Objednávka přijata — faktura bude vystavena do 24 hodin</Preview>
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
              Objednávka přijata, {firstName}! 📋
            </Text>
            <Text style={paragraphStyle}>
              Děkujeme za vaši objednávku. Vaše faktura bude vystavena a zaslána
              na váš e-mail <strong>do 24 hodin</strong>.
            </Text>

            {/* Order summary */}
            <Section style={summaryBoxStyle}>
              <Text style={{ fontSize: "14px", fontWeight: 600, color: "#171717", margin: "0 0 12px" }}>
                📦 Shrnutí objednávky
              </Text>
              <table cellPadding={0} cellSpacing={0} style={{ width: "100%" }}>
                <tbody>
                  <tr>
                    <td style={summaryLabelStyle}>Plán</td>
                    <td style={summaryValueStyle}>{planLabel} {tier}</td>
                  </tr>
                  <tr>
                    <td style={summaryLabelStyle}>Hovorů měsíčně</td>
                    <td style={summaryValueStyle}>{tier.toLocaleString("cs-CZ")}</td>
                  </tr>
                  <tr>
                    <td style={summaryLabelStyle}>Cena</td>
                    <td style={{ ...summaryValueStyle, fontWeight: 700 }}>
                      {amount.toLocaleString("cs-CZ")} Kč/měs
                    </td>
                  </tr>
                  <tr>
                    <td style={summaryLabelStyle}>Způsob platby</td>
                    <td style={summaryValueStyle}>Faktura</td>
                  </tr>
                  <tr>
                    <td style={summaryLabelStyle}>E-mail</td>
                    <td style={summaryValueStyle}>{email}</td>
                  </tr>
                </tbody>
              </table>
            </Section>

            {/* Billing details */}
            {(companyName || ico) && (
              <Section style={billingBoxStyle}>
                <Text style={{ fontSize: "14px", fontWeight: 600, color: "#171717", margin: "0 0 12px" }}>
                  🏢 Fakturační údaje
                </Text>
                <table cellPadding={0} cellSpacing={0} style={{ width: "100%" }}>
                  <tbody>
                    {companyName && (
                      <tr>
                        <td style={summaryLabelStyle}>Firma</td>
                        <td style={summaryValueStyle}>{companyName}</td>
                      </tr>
                    )}
                    {ico && (
                      <tr>
                        <td style={summaryLabelStyle}>IČO</td>
                        <td style={summaryValueStyle}>{ico}</td>
                      </tr>
                    )}
                    {dic && (
                      <tr>
                        <td style={summaryLabelStyle}>DIČ</td>
                        <td style={summaryValueStyle}>{dic}</td>
                      </tr>
                    )}
                    {address && (
                      <tr>
                        <td style={summaryLabelStyle}>Adresa</td>
                        <td style={summaryValueStyle}>{address}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </Section>
            )}

            {/* Info box */}
            <Section style={infoBoxStyle}>
              <Text style={{ fontSize: "14px", fontWeight: 600, color: "#171717", margin: "0 0 8px" }}>
                ⏳ Co se stane dál?
              </Text>
              <Text style={{ fontSize: "13px", color: "#525252", lineHeight: "1.6", margin: "0 0 6px" }}>
                1. <strong>Do 24 hodin</strong> vám na tento e-mail zašleme fakturu s platebními údaji.
              </Text>
              <Text style={{ fontSize: "13px", color: "#525252", lineHeight: "1.6", margin: "0 0 6px" }}>
                2. Po připsání platby na náš účet vám <strong>automaticky aktivujeme</strong> váš plán.
              </Text>
              <Text style={{ fontSize: "13px", color: "#525252", lineHeight: "1.6", margin: 0 }}>
                3. O aktivaci vás budeme informovat e-mailem.
              </Text>
            </Section>
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

const billingBoxStyle: React.CSSProperties = {
  backgroundColor: "#fafafa",
  border: "1px solid #e5e5e5",
  borderRadius: "8px",
  padding: "20px",
  margin: "0 0 20px",
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

const infoBoxStyle: React.CSSProperties = {
  backgroundColor: "#eff6ff",
  border: "1px solid #bfdbfe",
  borderRadius: "8px",
  padding: "16px 20px",
  margin: "0 0 8px",
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
