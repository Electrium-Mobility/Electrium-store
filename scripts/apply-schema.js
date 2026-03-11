const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.argv[2];

if (!supabaseKey) {
  console.error('Please provide the Supabase service key as a command-line argument.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function applySchema() {
  try {
    const schema = fs.readFileSync('group_orders_schema.sql', 'utf8');
    const { error } = await supabase.rpc('exec', { sql: schema });
    if (error) {
      console.error('Error applying schema:', error);
    } else {
      console.log('Schema applied successfully');
    }
  } catch (err) {
    console.error('Error reading schema file:', err);
  }
}

applySchema();
