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

interface DowngradeScheduledEmailProps {
  customerName: string;
  currentPlan: string;
  currentTier: number;
  newPlan: string;
  newTier: number;
  effectiveDate: string;
}

const planLabels: Record<string, string> = {
  solo: "Solo",
  team: "Team",
};

export default function DowngradeScheduledEmail({
  customerName = "zákazníku",
  currentPlan = "solo",
  currentTier = 100,
  newPlan = "solo",
  newTier = 30,
  effectiveDate = "",
}: DowngradeScheduledEmailProps) {
  const firstName = customerName.split(" ")[0];
  const currLabel = planLabels[currentPlan] || currentPlan;
  const newLabel = planLabels[newPlan] || newPlan;

  return (
    <Html lang="cs">
      <Head />
      <Preview>{`Změna balíčku SimCall naplánována – ${newLabel} ${newTier} minut`}</Preview>
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
              Změna balíčku naplánována ⬇️
            </Text>
            <Text style={paragraphStyle}>
              Dobrý den, {firstName}! Vaše žádost o změnu balíčku byla přijata.
              Změna se projeví na konci aktuálního zúčtovacího období.
            </Text>

            {/* Summary box */}
            <Section style={summaryBoxStyle}>
              <table cellPadding={0} cellSpacing={0} style={{ width: "100%" }}>
                <tbody>
                  <tr>
                    <td style={summaryLabelStyle}>Aktuální balíček</td>
                    <td style={summaryValueStyle}>{currLabel} {currentTier} minut</td>
                  </tr>
                  <tr>
                    <td style={summaryLabelStyle}>Nový balíček</td>
                    <td style={summaryValueStyle}>{newLabel} {newTier} minut</td>
                  </tr>
                  <tr>
                    <td style={summaryLabelStyle}>Aktivace</td>
                    <td style={{ ...summaryValueStyle, fontWeight: 600 }}>{effectiveDate}</td>
                  </tr>
                </tbody>
              </table>
            </Section>

            <Section style={infoBoxStyle}>
              <Text style={{ fontSize: "14px", fontWeight: 600, color: "#171717", margin: "0 0 8px" }}>
                ℹ️ Co to znamená?
              </Text>
              <Text style={{ fontSize: "13px", color: "#525252", lineHeight: "1.6", margin: 0 }}>
                Do data aktivace ({effectiveDate}) budete mít k dispozici všechny funkce
                a minuty vašeho aktuálního balíčku <strong>{currLabel} {currentTier}</strong>.
                Po tomto datu se automaticky přepne na <strong>{newLabel} {newTier}</strong> a
                bude se strhávat nová cena.
              </Text>
            </Section>

            <Section style={ctaContainerStyle}>
              <Button style={ctaButtonStyle} href="https://simcall.cz/dashboard/balicek">
                Zobrazit můj balíček →
              </Button>
            </Section>
          </Section>

          <Hr style={hrStyle} />

          {/* Footer */}
          <Section style={footerStyle}>
            <Text style={footerTextStyle}>
              Chcete změnu zrušit? Kontaktujte nás na{" "}
              <a href="mailto:simcallcz@gmail.com" style={linkStyle}>
                simcallcz@gmail.com
              </a>
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
  backgroundColor: "#fefce8",
  border: "1px solid #fef08a",
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

const infoBoxStyle: React.CSSProperties = {
  backgroundColor: "#eff6ff",
  border: "1px solid #bfdbfe",
  borderRadius: "8px",
  padding: "16px 20px",
  margin: "0 0 8px",
};

const ctaContainerStyle: React.CSSProperties = {
  textAlign: "center",
  margin: "24px 0 8px",
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
