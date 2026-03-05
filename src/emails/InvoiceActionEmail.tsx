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

interface InvoiceActionEmailProps {
  customerName: string;
  actionParams: {
    type: "extended" | "approved";
    plan: string;
    tier: number;
    callsLimit: number;
    currentPeriodEnd?: string;
  };
}

export default function InvoiceActionEmail({
  customerName = "Zákazníku",
  actionParams = {
    type: "extended",
    plan: "solo",
    tier: 1,
    callsLimit: 50,
  },
}: InvoiceActionEmailProps) {
  const isExtended = actionParams.type === "extended";
  const title = isExtended ? "Platba přijata — Plán prodloužen ✅" : "Změna tarifu byla schválena ✅";
  const previewText = isExtended
    ? `Váš plán ${actionParams.plan} byl prodloužen o měsíc.`
    : `Vaše žádost o úpravu na ${actionParams.plan} byla úspěšně zpracována.`;

  return (
    <Html lang="cs">
      <Head />
      <Preview>{previewText}</Preview>
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
                  <td>
                    <Text style={logoTextStyle}>SimCall</Text>
                  </td>
                </tr>
              </tbody>
            </table>
          </Section>

          {/* Main Content */}
          <Section style={contentSectionStyle}>
            <Text style={headingStyle}>
              Dobrý den, {customerName.split(" ")[0]}! 👋
            </Text>
            
            {isExtended ? (
              <>
                <Text style={textStyle}>
                  Úspěšně jsme přijali vaši platbu na fakturu. Váš balíček
                  byl prodloužen o další zúčtovací období a limity hovorů byly obnoveny.
                </Text>
              </>
            ) : (
              <>
                <Text style={textStyle}>
                  Vaše žádost o úpravu tarifu (Upgrade/Downgrade) byla úspěšně schválena
                  administrátorem. Váš účet nyní odpovídá nově vybranému plánu.
                </Text>
                <Text style={textStyle}>
                  V případě rozdílu v předplatném vám zašleme do e-mailu opravnou fakturu
                  s patřičným vyúčtováním.
                </Text>
              </>
            )}

            <Section style={detailsBoxStyle}>
              <Text style={{ ...detailsLabelStyle, marginBottom: "8px" }}>
                Aktuální stav účtu:
              </Text>
              <table style={{ width: "100%", padding: "12px 16px" }}>
                <tbody>
                  <tr>
                    <td style={tableLabelStyle}>Plán:</td>
                    <td style={tableValueStyle}><strong style={{ textTransform: "capitalize" }}>{actionParams.plan} (Tier {actionParams.tier})</strong></td>
                  </tr>
                  <tr>
                    <td style={tableLabelStyle}>Limit hovorů:</td>
                    <td style={tableValueStyle}><strong>{actionParams.callsLimit} hovorů</strong> / měsíc</td>
                  </tr>
                  {actionParams.currentPeriodEnd && (
                    <tr>
                      <td style={tableLabelStyle}>Platí do:</td>
                      <td style={tableValueStyle}>
                        <strong>{new Date(actionParams.currentPeriodEnd).toLocaleDateString("cs-CZ")}</strong>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </Section>

            <Section style={{ textAlign: "center", marginTop: "32px" }}>
              <Button href="https://simcall.cz/login" style={buttonStyle}>
                Přejít do aplikace
              </Button>
            </Section>

            <Hr style={hrStyle} />

            <Text style={footerTextStyle}>
              Potřebujete s něčím poradit? Jednoduše odpovězte na tento e-mail
              nebo nás kontaktujte na <a href="mailto:info@simcall.cz" style={footerLinkStyle}>info@simcall.cz</a>.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// -------------------------------------------------------------
// INLINE STYLES
// -------------------------------------------------------------
const bodyStyle = {
  backgroundColor: "#f9fafb", // neutral-50
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
  padding: "40px 20px",
  margin: 0,
};

const containerStyle = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "0",
  borderRadius: "16px",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)",
  maxWidth: "560px",
  overflow: "hidden",
};

const logoSectionStyle = {
  backgroundColor: "#f8fafc", // slate-50
  padding: "24px",
  borderBottom: "1px solid #f1f5f9", // slate-100
  textAlign: "center" as const,
};

const logoBadgeStyle = {
  backgroundColor: "#ed2c2c", // Primary red
  borderRadius: "8px",
  width: "32px",
  height: "32px",
  textAlign: "center" as const,
  verticalAlign: "middle" as const,
};

const logoTextStyle = {
  color: "#0f172a", // slate-900
  fontSize: "20px",
  fontWeight: 800,
  marginLeft: "10px",
  letterSpacing: "-0.02em",
  margin: 0,
  lineHeight: "32px",
};

const contentSectionStyle = {
  padding: "40px 32px",
};

const headingStyle = {
  fontSize: "22px",
  fontWeight: 700,
  color: "#0f172a",
  margin: "0 0 16px",
  letterSpacing: "-0.02em",
};

const textStyle = {
  fontSize: "15px",
  lineHeight: "24px",
  color: "#334155", // slate-700
  margin: "0 0 20px",
};

const detailsBoxStyle = {
  backgroundColor: "#f8fafc", // slate-50
  borderRadius: "12px",
  border: "1px solid #e2e8f0", // slate-200
  marginTop: "24px",
  overflow: "hidden",
};

const detailsLabelStyle = {
  fontSize: "13px",
  fontWeight: 600,
  color: "#64748b", // slate-500
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
  margin: "16px 16px 0",
};

const tableLabelStyle = {
  fontSize: "14px",
  color: "#64748b", // slate-500
  paddingRight: "16px",
  width: "120px",
  lineHeight: "24px",
};

const tableValueStyle = {
  fontSize: "15px",
  color: "#0f172a", // slate-900
  lineHeight: "24px",
};

const buttonStyle = {
  backgroundColor: "#ed2c2c",
  color: "#ffffff",
  fontWeight: 600,
  fontSize: "15px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "14px 28px",
  borderRadius: "8px",
  boxShadow: "0 2px 4px -1px rgba(237, 44, 44, 0.4)",
};

const hrStyle = {
  borderColor: "#e2e8f0", // slate-200
  margin: "40px 0 24px",
};

const footerTextStyle = {
  fontSize: "13px",
  color: "#64748b", // slate-500
  lineHeight: "20px",
  margin: 0,
};

const footerLinkStyle = {
  color: "#ed2c2c",
  textDecoration: "underline",
};
