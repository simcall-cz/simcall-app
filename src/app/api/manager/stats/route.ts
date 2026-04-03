import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { verifyManager } from "@/lib/auth";

// GET /api/manager/stats - Team statistics for the manager dashboard
export async function GET(request: NextRequest) {
  try {
    const { isManager, user, companyId } = await verifyManager(request);
    if (!isManager || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createServerClient();

    // If no company, show the manager's own data
    let memberIds: string[];
    let members: { user_id: string; role: string; profiles: { id: string; full_name: string; email: string } | null }[] = [];

    if (companyId) {
      const { data: companyMembers, error: membersError } = await supabase
        .from("company_members")
        .select("user_id, role, profiles:user_id (id, full_name, email)")
        .eq("company_id", companyId);

      if (membersError) {
        return NextResponse.json({ error: "Failed to load stats" }, { status: 500 });
      }
      members = (companyMembers || []) as unknown as typeof members;
      memberIds = members.map((m) => m.user_id);
    } else {
      // No company — show own data
      const { data: profile } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .eq("id", user.id)
        .single();

      members = [{
        user_id: user.id,
        role: "manager",
        profiles: profile || { id: user.id, full_name: "", email: user.email || "" },
      }];
      memberIds = [user.id];
    }

    if (memberIds.length === 0) {
      return NextResponse.json({
        totalMinutesThisMonth: 0,
        avgTeamScore: null,
        topPerformer: null,
        leaderboard: [],
        callsDistribution: [],
      });
    }

    // Current month boundaries
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();

    // Fetch all calls this month for team members
    const { data: monthCalls } = await supabase
      .from("calls")
      .select("user_id, score, date, duration_seconds")
      .in("user_id", memberIds)
      .gte("date", monthStart)
      .lte("date", monthEnd);

    const allMonthCalls = monthCalls || [];

    // Total team minutes this month
    const totalMinutesThisMonth = Math.round(
      allMonthCalls.reduce((sum, c) => sum + ((c as any).duration_seconds || 0), 0) / 60
    );

    // Average team score (only scored calls)
    const scoredCalls = allMonthCalls.filter((c) => c.score != null);
    const avgTeamScore =
      scoredCalls.length > 0
        ? Math.round(
            (scoredCalls.reduce((sum, c) => sum + (c.score as number), 0) /
              scoredCalls.length) *
              10
          ) / 10
        : null;

    // Per-member stats for leaderboard
    const leaderboard = (members || []).map((member) => {
      const profile = member.profiles as unknown as {
        id: string;
        full_name: string;
        email: string;
      } | null;

      const memberCalls = allMonthCalls.filter(
        (c) => c.user_id === member.user_id
      );
      const memberScored = memberCalls.filter((c) => c.score != null);
      const memberAvgScore =
        memberScored.length > 0
          ? Math.round(
              (memberScored.reduce((sum, c) => sum + (c.score as number), 0) /
                memberScored.length) *
                10
            ) / 10
          : null;

      return {
        userId: member.user_id,
        fullName: profile?.full_name || "",
        email: profile?.email || "",
        role: member.role,
        minutesCount: Math.round(memberCalls.reduce((sum, c) => sum + ((c as any).duration_seconds || 0), 0) / 60),
        avgScore: memberAvgScore,
      };
    });

    // Sort leaderboard by avg score descending (nulls last)
    leaderboard.sort((a, b) => {
      if (a.avgScore == null && b.avgScore == null) return 0;
      if (a.avgScore == null) return 1;
      if (b.avgScore == null) return -1;
      return b.avgScore - a.avgScore;
    });

    // Top performer: member with highest avg score (must have at least 1 scored call)
    const topPerformer =
      leaderboard.find((m) => m.avgScore != null) || null;

    // Minutes distribution per member
    const callsDistribution = leaderboard.map((m) => ({
      userId: m.userId,
      fullName: m.fullName,
      minutesCount: m.minutesCount,
    }));

    return NextResponse.json({
      totalMinutesThisMonth,
      avgTeamScore,
      topPerformer: topPerformer
        ? {
            userId: topPerformer.userId,
            fullName: topPerformer.fullName,
            avgScore: topPerformer.avgScore,
          }
        : null,
      leaderboard,
      callsDistribution,
    });
  } catch (err) {
    console.error("GET /api/manager/stats error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
