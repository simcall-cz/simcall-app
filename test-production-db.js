require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data, error } = await supabase.from('scenarios').select('id, image_url');
  if (error) {
    console.error("DB Error:", error);
    return;
  }
  
  const withImage = data.filter(d => d.image_url);
  console.log(`Total scenarios: ${data.length}`);
  console.log(`Scenarios with image_url: ${withImage.length}`);
  console.log("Sample with image:", withImage.slice(0, 3));
  console.log("Sample without image:", data.filter(d => !d.image_url).slice(0, 3));
}
run();
