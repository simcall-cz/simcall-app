import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data: agents } = await supabase.from('agents').select('id, name');
  console.log("Agents:");
  console.log(agents);

  const { data: scenarios } = await supabase.from('scenarios').select('id, title, agent_id');
  console.log("Scenarios:");
  console.log(scenarios);
}
check();
