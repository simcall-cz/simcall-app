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

interface MeetingBookedEmailProps {
  name: string;
  email: string;
  company: string;
  meetingDate: string;
  meetingTime: string;
  teamSize?: string;
  note?: string;
  meetLink?: string;
  /** If true, renders admin notification version instead of customer confirmation */
  isAdminNotification?: boolean;
}

export default function MeetingBookedEmail({
  name = "zákazníku",
  email = "",
  company = "",
  meetingDate = "",
  meetingTime = "",
  teamSize = "",
  note = "",
  meetLink = "https://meet.google.com/",
  isAdminNotification = false,
}: MeetingBookedEmailProps) {
  const firstName = name.split(" ")[0];

  return (
    <Html lang="cs">
      <Head />
      <Preview>
        {isAdminNotification
          ? `Nová schůzka: ${name} (${company})`
          : `Potvrzení schůzky — ${meetingDate} v ${meetingTime}`}
      </Preview>
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
            {isAdminNotification ? (
              <>
                <Text style={headingStyle}>📅 Nová rezervace schůzky</Text>
                <Text style={paragraphStyle}>
                  Nový zájemce si právě zarezervoval schůzku:
                </Text>
              </>
            ) : (
              <>
                <Text style={headingStyle}>
                  Schůzka potvrzena, {firstName}! 📅
                </Text>
                <Text style={paragraphStyle}>
                  Děkujeme za zájem o SimCall Enterprise. Vaše schůzka je
                  naplánována.
                </Text>
              </>
            )}

            {/* Meeting details box */}
            <Section style={detailsBoxStyle}>
              <table cellPadding={0} cellSpacing={0} style={{ width: "100%" }}>
                <tbody>
                  <tr>
                    <td style={detailLabelStyle}>📆 Datum</td>
                    <td style={detailValueStyle}>{meetingDate}</td>
                  </tr>
                  <tr>
                    <td style={detailLabelStyle}>🕐 Čas</td>
                    <td style={detailValueStyle}>{meetingTime}</td>
                  </tr>
                  <tr>
                    <td style={detailLabelStyle}>👤 Jméno</td>
                    <td style={detailValueStyle}>{name}</td>
                  </tr>
                  <tr>
                    <td style={detailLabelStyle}>📧 E-mail</td>
                    <td style={detailValueStyle}>{email}</td>
                  </tr>
                  <tr>
                    <td style={detailLabelStyle}>🏢 Firma</td>
                    <td style={detailValueStyle}>{company}</td>
                  </tr>
                  {teamSize && (
                    <tr>
                      <td style={detailLabelStyle}>👥 Tým</td>
                      <td style={detailValueStyle}>{teamSize} makléřů</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </Section>

            {note && (
              <>
                <Text style={{ ...paragraphStyle, fontWeight: 600, marginBottom: "4px" }}>
                  Poznámka:
                </Text>
                <Text style={paragraphStyle}>{note}</Text>
              </>
            )}

            {!isAdminNotification && (
              <Text style={paragraphStyle}>
                Pozvánka do kalendáře Vám během několika minut obvykle pípne ve Vašem e-mailu. Pokud potřebujete termín změnit, napište nám na{" "}
                <a href="mailto:simcallcz@gmail.com" style={linkStyle}>
                  simcallcz@gmail.com
                </a>
                .
              </Text>
            )}
          </Section>

          <Hr style={hrStyle} />

          <Section style={footerStyle}>
            <Text style={footerTextStyle}>
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

const detailsBoxStyle: React.CSSProperties = {
  backgroundColor: "#fafafa",
  border: "1px solid #e5e5e5",
  borderRadius: "8px",
  padding: "20px",
  margin: "20px 0",
};

const detailLabelStyle: React.CSSProperties = {
  fontSize: "13px",
  color: "#737373",
  padding: "6px 0",
  width: "30%",
};

const detailValueStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "#171717",
  fontWeight: 500,
  padding: "6px 0",
  textAlign: "right" as const,
};

const hrStyle: React.CSSProperties = {
  borderColor: "#e5e5e5",
  margin: "0",
};

const footerStyle: React.CSSProperties = {
  padding: "24px 40px",
};

const footerTextStyle: React.CSSProperties = {
  fontSize: "12px",
  color: "#a3a3a3",
  margin: 0,
  textAlign: "center" as const,
};

const linkStyle: React.CSSProperties = {
  color: "#ef4444",
  textDecoration: "underline",
};
