import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { verifyManager } from "@/lib/auth";

// GET /api/manager/team - List team members with stats
export async function GET(request: NextRequest) {
  try {
    const { isManager, user, companyId } = await verifyManager(request);
    if (!isManager || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createServerClient();

    let rawMembers: { user_id: string; role: string; profiles: { id: string; full_name: string; email: string } | null }[];

    if (companyId) {
      const { data: companyMembers, error: membersError } = await supabase
        .from("company_members")
        .select("user_id, role, profiles:user_id (id, full_name, email)")
        .eq("company_id", companyId);

      if (membersError) {
        return NextResponse.json({ error: "Failed to load team" }, { status: 500 });
      }
      rawMembers = (companyMembers || []) as unknown as typeof rawMembers;
    } else {
      // No company — show manager as single-person team
      const { data: profile } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .eq("id", user.id)
        .single();

      rawMembers = [{
        user_id: user.id,
        role: "manager",
        profiles: profile || { id: user.id, full_name: "", email: user.email || "" },
      }];
    }

    // Current month boundaries
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();

    // Bulk-fetch all calls for every member in a single query to avoid N+1
    const memberUserIds = rawMembers.map((m) => m.user_id);
    const { data: allCalls } = await supabase
      .from("calls")
      .select("user_id, duration_seconds, score, date, status")
      .in("user_id", memberUserIds);

    const calls = allCalls || [];

    // Build enriched member list with call stats computed in-memory
    const enrichedMembers = rawMembers.map((member) => {
      const profile = member.profiles;
      const userId = member.user_id;

      const memberCalls = calls.filter((c) => c.user_id === userId);

      const completedCalls = memberCalls.filter((c) => c.status === "completed");

      const totalMinutes = Math.round(
        completedCalls.reduce((sum: number, c: { duration_seconds: number }) => sum + (c.duration_seconds || 0), 0) / 60
      );

      const scoredCalls = memberCalls.filter((c) => c.score !== null && c.score !== undefined);
      const scores = scoredCalls.map((c) => c.score as number);
      const avgScore =
        scores.length > 0
          ? Math.round(
              (scores.reduce((a, b) => a + b, 0) / scores.length) * 10
            ) / 10
          : null;

      const minutesThisMonth = Math.round(
        completedCalls
          .filter((c) => c.date >= monthStart && c.date <= monthEnd)
          .reduce((sum: number, c: { duration_seconds: number }) => sum + (c.duration_seconds || 0), 0) / 60
      );

      return {
        userId,
        fullName: profile?.full_name || "",
        email: profile?.email || "",
        role: member.role,
        totalMinutes,
        avgScore,
        minutesThisMonth,
      };
    });

    // Team-level totals
    const teamMinutesUsed = enrichedMembers.reduce(
      (sum, m) => sum + m.minutesThisMonth,
      0
    );

    // Get team subscription for calls limit — try manager's subscription
    const managerId = companyId
      ? rawMembers.find((m) => m.role === "manager")?.user_id
      : user.id;

    const { data: teamSub } = await supabase
      .from("subscriptions")
      .select("minutes_limit")
      .eq("user_id", managerId || user.id)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    return NextResponse.json({
      members: enrichedMembers,
      teamMinutesUsed,
      teamMinutesLimit: teamSub?.minutes_limit || 0,
    });
  } catch (err) {
    console.error("GET /api/manager/team error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/manager/team - Add a team member by email
export async function POST(request: NextRequest) {
  try {
    const { isManager, user, companyId: existingCompanyId } = await verifyManager(request);
    if (!isManager || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createServerClient();
    const body = await request.json();
    const { email } = body as { email: string };

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Auto-create company if team_manager has none
    let companyId = existingCompanyId;
    if (!companyId) {
      // Check if user already owns a company
      const { data: existingCompany } = await supabase
        .from("companies")
        .select("id")
        .eq("owner_id", user.id)
        .limit(1)
        .single();

      if (existingCompany) {
        companyId = existingCompany.id;
      } else {
        // Create new company
        const { data: newCompany, error: companyErr } = await supabase
          .from("companies")
          .insert({ name: "Můj tým", owner_id: user.id })
          .select("id")
          .single();

        if (companyErr || !newCompany) {
          return NextResponse.json(
            { error: "Nepodařilo se vytvořit tým: " + (companyErr?.message || "") },
            { status: 500 }
          );
        }
        companyId = newCompany.id;

        // Add manager as the first member
        await supabase.from("company_members").insert({
          company_id: companyId,
          user_id: user.id,
          role: "manager",
        });
      }
    }

    // Look up user by email in profiles
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, email, full_name")
      .eq("email", email.toLowerCase().trim())
      .single();

    if (!profile) {
      return NextResponse.json(
        {
          error:
            "Uživatel s tímto emailem nebyl nalezen. Musí se nejprve zaregistrovat.",
        },
        { status: 404 }
      );
    }

    // Cannot add yourself
    if (profile.id === user.id) {
      return NextResponse.json(
        { error: "Nemůžete přidat sami sebe — jste již manažer týmu." },
        { status: 400 }
      );
    }

    // Check if already a member
    const { data: existing } = await supabase
      .from("company_members")
      .select("id")
      .eq("company_id", companyId)
      .eq("user_id", profile.id)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "Tento uživatel je již členem týmu." },
        { status: 409 }
      );
    }

    // Add to company_members as agent
    const { error: insertError } = await supabase
      .from("company_members")
      .insert({
        company_id: companyId,
        user_id: profile.id,
        role: "agent",
      });

    if (insertError) {
      return NextResponse.json(
        { error: "Failed to add member" },
        { status: 500 }
      );
    }

    // Update user's profile role to team
    await supabase
      .from("profiles")
      .update({ role: "team" })
      .eq("id", profile.id);

    return NextResponse.json({
      success: true,
      member: {
        userId: profile.id,
        fullName: profile.full_name,
        email: profile.email,
        role: "agent",
      },
    });
  } catch (err) {
    console.error("POST /api/manager/team error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/manager/team - Remove a team member
export async function DELETE(request: NextRequest) {
  try {
    const { isManager, user, companyId: existingCompanyId } = await verifyManager(request);
    if (!isManager || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createServerClient();
    const body = await request.json();
    const { userId } = body as { userId: string };

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    // Cannot remove self (the manager)
    if (userId === user.id) {
      return NextResponse.json(
        { error: "Nemůžete odebrat sami sebe z týmu." },
        { status: 400 }
      );
    }

    // Find company ID — use existing or look up from companies table
    let companyId = existingCompanyId;
    if (!companyId) {
      const { data: company } = await supabase
        .from("companies")
        .select("id")
        .eq("owner_id", user.id)
        .limit(1)
        .single();
      companyId = company?.id || null;
    }

    if (!companyId) {
      return NextResponse.json(
        { error: "Nebyl nalezen žádný tým." },
        { status: 404 }
      );
    }

    // Remove from company_members
    const { error: deleteError } = await supabase
      .from("company_members")
      .delete()
      .eq("company_id", companyId)
      .eq("user_id", userId);

    if (deleteError) {
      return NextResponse.json(
        { error: "Failed to remove member" },
        { status: 500 }
      );
    }

    // Reset user's profile to free
    await supabase
      .from("profiles")
      .update({ role: "free" })
      .eq("id", userId);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/manager/team error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
