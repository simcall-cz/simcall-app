import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

// POST /api/forms/submit - Submit a form (contact, meeting, enterprise)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, name, email, phone, company, subject, message, meeting_date, meeting_time, team_size } = body as {
      type: "kontakt" | "schuzka" | "enterprise";
      name: string;
      email: string;
      phone?: string;
      company?: string;
      subject?: string;
      message?: string;
      meeting_date?: string;
      meeting_time?: string;
      team_size?: string;
    };

    // Validate required fields
    if (!type || !name || !email) {
      return NextResponse.json(
        { error: "type, name, and email are required" },
        { status: 400 }
      );
    }

    // Validate type
    if (!["kontakt", "schuzka", "enterprise"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid form type" },
        { status: 400 }
      );
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const db = createServerClient();

    const { data, error } = await db
      .from("form_submissions")
      .insert({
        type,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || null,
        company: company?.trim() || null,
        subject: subject?.trim() || null,
        message: message?.trim() || null,
        meeting_date: meeting_date || null,
        meeting_time: meeting_time || null,
        team_size: team_size || null,
        status: "new",
      })
      .select()
      .single();

    if (error) {
      console.error("Form submission error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data.id });
  } catch (err) {
    console.error("POST /api/forms/submit error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
