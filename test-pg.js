const { Client } = require('pg');
const fs = require('fs');

const envText = fs.readFileSync('/Users/filipmojik/roman_filip/.env.local', 'utf8');
const passMatch = envText.match(/SUPABASE_DB_PASSWORD=([^\n\r]+)/);
if (!passMatch) { console.log('Password not found'); process.exit(1); }
const pass = passMatch[1].replace(/['\"]+/g, '');

const dbUrl = `postgresql://postgres:${pass}@db.ivd0hlbe9.supabase.co:5432/postgres`;
const client = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });

async function check() {
  await client.connect();
  const res = await client.query('SELECT id, image_url FROM scenarios LIMIT 5');
  console.log(res.rows);
  await client.end();
}
check().catch(console.error);
