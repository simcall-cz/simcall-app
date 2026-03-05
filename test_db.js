const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
  const { data, error } = await supabase.from('payments').select('*').eq('status', 'pending');
  console.log("Pending payments:", data?.length);
  if (data?.length > 0) {
    console.log(data[0]);
  }
}
check();
