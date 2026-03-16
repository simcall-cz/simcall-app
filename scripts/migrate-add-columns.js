/**
 * Migrace: přidání nových sloupců do tabulek scenarios a feedback.
 *
 * Alternativně spusť tyto SQL příkazy přímo v Supabase SQL editoru:
 *
 * ALTER TABLE scenarios ADD COLUMN IF NOT EXISTS control_prompt TEXT;
 * ALTER TABLE scenarios ADD COLUMN IF NOT EXISTS tips TEXT[];
 * ALTER TABLE feedback ADD COLUMN IF NOT EXISTS summary_good TEXT;
 * ALTER TABLE feedback ADD COLUMN IF NOT EXISTS summary_improve TEXT;
 *
 * Spuštění: node scripts/migrate-add-columns.js
 */
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
  console.log("=== Migrace: přidání sloupců ===\n");

  // Supabase JS client nemůže přímo spouštět ALTER TABLE,
  // ale můžeme ověřit, zda sloupce existují, pokusem o select.

  // Test scenarios.tips
  const { error: e1 } = await supabase.from("scenarios").select("tips").limit(1);
  if (e1) {
    console.log("❌ Sloupec 'tips' v tabulce scenarios NEEXISTUJE.");
    console.log("   Spusť v Supabase SQL editoru:");
    console.log("   ALTER TABLE scenarios ADD COLUMN IF NOT EXISTS tips TEXT[];");
  } else {
    console.log("✅ scenarios.tips existuje");
  }

  // Test scenarios.control_prompt
  const { error: e2 } = await supabase.from("scenarios").select("control_prompt").limit(1);
  if (e2) {
    console.log("❌ Sloupec 'control_prompt' v tabulce scenarios NEEXISTUJE.");
    console.log("   Spusť v Supabase SQL editoru:");
    console.log("   ALTER TABLE scenarios ADD COLUMN IF NOT EXISTS control_prompt TEXT;");
  } else {
    console.log("✅ scenarios.control_prompt existuje");
  }

  // Test feedback.summary_good
  const { error: e3 } = await supabase.from("feedback").select("summary_good").limit(1);
  if (e3) {
    console.log("❌ Sloupec 'summary_good' v tabulce feedback NEEXISTUJE.");
    console.log("   Spusť v Supabase SQL editoru:");
    console.log("   ALTER TABLE feedback ADD COLUMN IF NOT EXISTS summary_good TEXT;");
  } else {
    console.log("✅ feedback.summary_good existuje");
  }

  // Test feedback.summary_improve
  const { error: e4 } = await supabase.from("feedback").select("summary_improve").limit(1);
  if (e4) {
    console.log("❌ Sloupec 'summary_improve' v tabulce feedback NEEXISTUJE.");
    console.log("   Spusť v Supabase SQL editoru:");
    console.log("   ALTER TABLE feedback ADD COLUMN IF NOT EXISTS summary_improve TEXT;");
  } else {
    console.log("✅ feedback.summary_improve existuje");
  }

  console.log("\n=== Hotovo ===");
}

run();
