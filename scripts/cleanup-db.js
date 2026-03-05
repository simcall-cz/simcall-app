import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";

// Load environment from .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

// Create admin client bypassing RLS
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const WHITELISTED_EMAILS = [
  "simcallcz@gmail.com",
  "trung.le@gmail.com"
];

async function cleanupData() {
  console.log("Fetching users from auth.users...");
  
  // 1. Get all users
  const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  if (usersError) {
    console.error("Error fetching users:", usersError.message);
    process.exit(1);
  }

  const allUsers = usersData.users;
  console.log(`Found ${allUsers.length} total users.`);

  // Find users to delete
  const usersToDelete = allUsers.filter(u => !WHITELISTED_EMAILS.includes(u.email));
  const usersToKeep = allUsers.filter(u => WHITELISTED_EMAILS.includes(u.email));

  console.log("\n--- Users to KEEP ---");
  usersToKeep.forEach(u => console.log(`• ${u.email} (${u.id})`));

  console.log(`\n--- Users to DELETE (${usersToDelete.length}) ---`);
  
  if (usersToDelete.length === 0) {
    console.log("No users to delete. Exiting.");
    process.exit(0);
  }

  for (const user of usersToDelete) {
    console.log(`Processing deletion for: ${user.email} (${user.id})`);

    // 2. Cascade delete dependent records first
    // Note: If you have foreign keys with ON DELETE CASCADE, some of this is automatic.
    // Doing it manually to be absolutely safe about cleaning up garbage data.
    
    // Calls
    const { error: callsErr } = await supabase.from("calls").delete().eq("user_id", user.id);
    if (callsErr) console.warn(`  - Error deleting calls: ${callsErr.message}`);

    // Subscriptions
    const { error: subsErr } = await supabase.from("subscriptions").delete().eq("user_id", user.id);
    if (subsErr) console.warn(`  - Error deleting subscriptions: ${subsErr.message}`);

    // Payments
    const { error: paymentsErr } = await supabase.from("payments").delete().eq("user_id", user.id);
    if (paymentsErr) console.warn(`  - Error deleting payments: ${paymentsErr.message}`);

    // Profiles (usually auto-deletes if matched 1:1 with auth.users, but just in case)
    const { error: profileErr } = await supabase.from("profiles").delete().eq("id", user.id);
    if (profileErr) console.warn(`  - Error deleting profile: ${profileErr.message}`);

    // 3. Delete the Auth user
    const { error: authErr } = await supabase.auth.admin.deleteUser(user.id);
    if (authErr) {
      console.error(`  - Failed to delete Auth user ${user.email}: ${authErr.message}`);
    } else {
      console.log(`  ✓ Auth user ${user.email} successfully deleted.`);
    }
  }

  console.log("\nCleanup script complete. Test data has been purged.");
  
  // Double-check stats output
  const { data: currentPayments } = await supabase.from("payments").select("amount");
  const totalAmount = currentPayments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;
  console.log(`Remaining DB Payments Total Vault: ${totalAmount} Kč`);
}

cleanupData().catch(console.error);
