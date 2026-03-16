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

interface ContactFormEmailProps {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactFormEmail({
  name = "",
  email = "",
  subject = "",
  message = "",
}: ContactFormEmailProps) {
  return (
    <Html lang="cs">
      <Head />
      <Preview>Nová zpráva z kontaktního formuláře od {name}</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
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

          <Section style={contentStyle}>
            <Text style={headingStyle}>Nová zpráva z kontaktního formuláře</Text>

            <Section style={detailsBoxStyle}>
              <table cellPadding={0} cellSpacing={0} style={{ width: "100%" }}>
                <tbody>
                  <tr>
                    <td style={labelStyle}>Jméno</td>
                    <td style={valueStyle}>{name}</td>
                  </tr>
                  <tr>
                    <td style={labelStyle}>E-mail</td>
                    <td style={valueStyle}>
                      <a href={`mailto:${email}`} style={linkStyle}>
                        {email}
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td style={labelStyle}>Předmět</td>
                    <td style={valueStyle}>{subject}</td>
                  </tr>
                </tbody>
              </table>
            </Section>

            <Text style={{ ...paragraphStyle, fontWeight: 600, marginBottom: "4px" }}>
              Zpráva:
            </Text>
            <Section style={messageBoxStyle}>
              <Text style={messageTextStyle}>{message}</Text>
            </Section>

            <Text style={hintStyle}>
              Odpovězte přímo na tento e-mail nebo na{" "}
              <a href={`mailto:${email}`} style={linkStyle}>
                {email}
              </a>
            </Text>
          </Section>

          <Hr style={hrStyle} />

          <Section style={footerStyle}>
            <Text style={footerTextStyle}>
              SimCall — kontaktní formulář na simcall.cz/kontakt
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

const detailsBoxStyle: React.CSSProperties = {
  backgroundColor: "#fafafa",
  border: "1px solid #e5e5e5",
  borderRadius: "4px",
  padding: "20px",
  margin: "16px 0",
};

const labelStyle: React.CSSProperties = {
  fontSize: "13px",
  color: "#737373",
  padding: "6px 0",
  width: "25%",
};

const valueStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "#171717",
  fontWeight: 500,
  padding: "6px 0",
  textAlign: "right" as const,
};

const messageBoxStyle: React.CSSProperties = {
  backgroundColor: "#fafafa",
  border: "1px solid #e5e5e5",
  borderRadius: "4px",
  padding: "16px",
  margin: "8px 0 16px",
};

const messageTextStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "#525252",
  lineHeight: "1.6",
  margin: 0,
  whiteSpace: "pre-wrap" as const,
};

const hintStyle: React.CSSProperties = {
  fontSize: "13px",
  color: "#a3a3a3",
  margin: "16px 0 0",
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
