import { NextResponse } from "next/server";
import {
  notifyBusiness,
  NotifyColors,
  notifyNewRegistration,
  notifyPaymentCompleted,
  notifyMeetingBooked,
  notifyContactForm,
  notifySupportTicket,
} from "@/lib/notifications";

// GET /api/notify/test — Test all Discord notifications
export async function GET() {
  const results: { event: string; ok: boolean; error?: string }[] = [];

  const tests = [
    {
      event: "Direct webhook test",
      fn: () => notifyBusiness({
        title: "🧪 Test notifikací",
        description: "Všechny notifikace fungují správně!",
        color: NotifyColors.SUCCESS,
      }),
    },
    {
      event: "Nová registrace",
      fn: () => notifyNewRegistration("test@simcall.cz", "Test Uživatel"),
    },
    {
      event: "Platba přijata",
      fn: () => notifyPaymentCompleted("test@simcall.cz", "solo", 50, 990),
    },
    {
      event: "Nová schůzka",
      fn: () => notifyMeetingBooked("Test Klient", "test@simcall.cz", "2026-03-10", "14:00"),
    },
    {
      event: "Kontaktní formulář",
      fn: () => notifyContactForm("Test Osoba", "test@simcall.cz", "Testovací zpráva"),
    },
    {
      event: "Support ticket",
      fn: () => notifySupportTicket("test@simcall.cz", "Test ticket", "Toto je test"),
    },
  ];

  for (const test of tests) {
    try {
      await test.fn();
      results.push({ event: test.event, ok: true });
    } catch (err) {
      results.push({
        event: test.event,
        ok: false,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  const allOk = results.every((r) => r.ok);

  return NextResponse.json({
    success: allOk,
    webhookConfigured: !!process.env.DISCORD_WEBHOOK_URL,
    results,
  });
}
