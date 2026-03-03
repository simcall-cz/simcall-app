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
        return NextResponse.json({ error: membersError.message }, { status: 500 });
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

    // Build enriched member list with call stats
    const enrichedMembers = await Promise.all(
      rawMembers.map(async (member) => {
        const profile = member.profiles;
        const userId = member.user_id;

        const { count: totalCalls } = await supabase
          .from("calls")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId);

        const { data: scoreData } = await supabase
          .from("calls")
          .select("score")
          .eq("user_id", userId)
          .not("score", "is", null);

        const scores = (scoreData || []).map((c) => c.score as number);
        const avgScore =
          scores.length > 0
            ? Math.round(
                (scores.reduce((a, b) => a + b, 0) / scores.length) * 10
              ) / 10
            : null;

        const { count: callsThisMonth } = await supabase
          .from("calls")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId)
          .gte("date", monthStart)
          .lte("date", monthEnd);

        return {
          userId,
          fullName: profile?.full_name || "",
          email: profile?.email || "",
          role: member.role,
          totalCalls: totalCalls || 0,
          avgScore,
          callsThisMonth: callsThisMonth || 0,
        };
      })
    );

    // Team-level totals
    const teamCallsUsed = enrichedMembers.reduce(
      (sum, m) => sum + m.callsThisMonth,
      0
    );

    // Get team subscription for calls limit — try manager's subscription
    const managerId = companyId
      ? rawMembers.find((m) => m.role === "manager")?.user_id
      : user.id;

    const { data: teamSub } = await supabase
      .from("subscriptions")
      .select("calls_limit")
      .eq("user_id", managerId || user.id)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    return NextResponse.json({
      members: enrichedMembers,
      teamCallsUsed,
      teamCallsLimit: teamSub?.calls_limit || 0,
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
    const { isManager, user, companyId } = await verifyManager(request);
    if (!isManager || !user || !companyId) {
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
        { error: insertError.message },
        { status: 500 }
      );
    }

    // Update user's profile with team plan role and company
    await supabase
      .from("profiles")
      .update({ role: "team", company_id: companyId })
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
    const { isManager, user, companyId } = await verifyManager(request);
    if (!isManager || !user || !companyId) {
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

    // Remove from company_members
    const { error: deleteError } = await supabase
      .from("company_members")
      .delete()
      .eq("company_id", companyId)
      .eq("user_id", userId);

    if (deleteError) {
      return NextResponse.json(
        { error: deleteError.message },
        { status: 500 }
      );
    }

    // Reset user's profile to demo
    await supabase
      .from("profiles")
      .update({ role: "demo", company_id: null })
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
