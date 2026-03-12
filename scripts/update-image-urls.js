/**
 * Updates image_url for all 19 scenarios in Supabase.
 * Run: node scripts/update-image-urls.js
 */
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const updates = [
  { id: "scenario-eva-tomanova", image_url: "/scenarios/eva-email.png" },
  { id: "scenario-karin-horackova", image_url: "/scenarios/karin-h-doporuceni.png" },
  { id: "scenario-karin-pitrova", image_url: "/scenarios/karin-p-crm.png" },
  { id: "scenario-samuel-orel", image_url: "/scenarios/samuel-hovor.png" },
  { id: "scenario-milada-kejvalova", image_url: "/scenarios/milada-crm.png" },
  { id: "scenario-adam-kohout", image_url: "/scenarios/adam-email.png" },
  { id: "scenario-hildegarda-kovarova", image_url: "/scenarios/hildegarda-portal.png" },
  { id: "scenario-ruzena-ruzickova", image_url: "/scenarios/ruzena-facebook.png" },
  { id: "scenario-leos-musil", image_url: "/scenarios/leos-letak.png" },
  { id: "scenario-eduard-langer", image_url: "/scenarios/eduard-cold-email.png" },
  { id: "scenario-ilona-tykalova", image_url: "/scenarios/ilona-katastr.png" },
  { id: "scenario-leona-neumannova", image_url: "/scenarios/leona-inzerat.png" },
  { id: "scenario-miroslava-balounova", image_url: "/scenarios/miroslava-b2b.png" },
  { id: "scenario-ales-navratil", image_url: "/scenarios/ales-inzerat.png" },
  { id: "scenario-andrea-kohoutova", image_url: "/scenarios/andrea-k-developer.png" },
  { id: "scenario-agata-kralova", image_url: "/scenarios/agata-inzerat.png" },
  { id: "scenario-andrea-spackova", image_url: "/scenarios/eduard-cold-email.png" },
  { id: "scenario-marie-mrazkova", image_url: "/scenarios/eduard-cold-email.png" },
  { id: "scenario-frantiska-jelinkova", image_url: "/scenarios/frantiska-inzerat.png" },
];

async function run() {
  console.log("Updating image_url for 19 scenarios...\n");

  for (const { id, image_url } of updates) {
    const { error } = await supabase
      .from("scenarios")
      .update({ image_url })
      .eq("id", id);

    if (error) {
      console.error(`✗ ${id}: ${error.message}`);
    } else {
      console.log(`✓ ${id} → ${image_url}`);
    }
  }

  console.log("\nDone!");
}

run();
