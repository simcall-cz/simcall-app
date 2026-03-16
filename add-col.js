require('dotenv').config({ path: '.env.local' });
const { Client } = require('pg');

async function run() {
  // Parse Supabase DB password from the env
  // Format: postgres://postgres.[project-ref]:[db-password]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres
  const dbUrl = process.env.DATABASE_URL || `postgresql://postgres:${process.env.SUPABASE_DB_PASSWORD}@db.ivd0hlbe9.supabase.co:5432/postgres`;
  
  const client = new Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    await client.query('ALTER TABLE scenarios ADD COLUMN IF NOT EXISTS image_url text;');
    console.log('Column image_url added successfully.');
  } catch (err) {
    console.error('Error adding column:', err);
  } finally {
    await client.end();
  }
}

run();
