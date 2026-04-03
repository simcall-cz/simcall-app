import { NextRequest, NextResponse } from "next/server";

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

export async function POST(request: NextRequest) {
  if (!DISCORD_WEBHOOK_URL) {
    console.error("DISCORD_WEBHOOK_URL environment variable is not set");
    return NextResponse.json({ error: "Chyba serveru" }, { status: 500 });
  }

  try {
    const { email, terms } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Neplatný email" }, { status: 400 });
    }

    if (!terms) {
      return NextResponse.json(
        { error: "Musíš souhlasit s podmínkami" },
        { status: 400 }
      );
    }

    // Send to Discord webhook
    const discordPayload = {
      embeds: [
        {
          title: "📬 Nový zájem o SimCall",
          color: 0xe8491d,
          fields: [
            {
              name: "Email",
              value: email,
              inline: true,
            },
            {
              name: "Souhlas s podmínkami",
              value: terms ? "✅ Ano" : "❌ Ne",
              inline: true,
            },
          ],
          footer: {
            text: "SimCall — Early Access List",
          },
          timestamp: new Date().toISOString(),
        },
      ],
    };

    const discordRes = await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(discordPayload),
    });

    if (!discordRes.ok) {
      console.error("Discord webhook failed:", discordRes.status);
      return NextResponse.json(
        { error: "Chyba při odesílání" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Subscribe error:", err);
    return NextResponse.json({ error: "Chyba serveru" }, { status: 500 });
  }
}
