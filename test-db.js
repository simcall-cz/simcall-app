const fs = require('fs');
const dotenv = require('dotenv');

// Use proper dotenv parsing
const envConfig = dotenv.parse(fs.readFileSync('.env.local'));
for (const k in envConfig) {
  process.env[k] = envConfig[k];
}

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data, error } = await supabase.from('scenarios').select('id, title, image_url');
  if (error) {
    console.error("Query Error:", error.message);
    return;
  }
  
  const withImages = data.filter(s => s.image_url);
  console.log(`\n=== DATABÁZE KONTROLA ===`);
  console.log(`Celkem scénářů v DB: ${data.length}`);
  console.log(`Scénářů s vyplněným image_url: ${withImages.length}`);
  if (withImages.length > 0) {
    console.log(`\nUkázka (první 3 s obrázkem):`);
    console.table(withImages.slice(0, 3));
  } else {
    console.log(`\nŽÁDNÝ scénář nemá image_url!`);
  }
}

check().catch(console.error);
