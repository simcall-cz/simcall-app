import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  const db = createServerClient();
  const userId = "4150a7fa-19fe-4e63-9ed3-89f7e9d8325c";
  
  const [profile, sub, company, companyMembers] = await Promise.all([
    db.from("profiles").select("*").eq("id", userId).single(),
    db.from("subscriptions").select("*").eq("user_id", userId),
    db.from("companies").select("*").eq("owner_id", userId),
    db.from("company_members").select("*").eq("user_id", userId),
  ]);
  
  return NextResponse.json({ 
    profile: profile.data, 
    sub: sub.data, 
    company: company.data,
    companyMembers: companyMembers.data
  });
}
