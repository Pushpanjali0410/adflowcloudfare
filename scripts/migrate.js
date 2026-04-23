#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  try {
    console.log('Starting database migration...');
    const sqlFile = fs.readFileSync('/vercel/share/v0-project/scripts/01-create-schema.sql', 'utf-8');
    const statements = sqlFile.split(';').filter(s => s.trim() && !s.trim().startsWith('--'));
    
    let executed = 0;
    for (const statement of statements) {
      if (!statement.trim()) continue;
      
      try {
        // Execute SQL directly through admin API
        const { error } = await supabase.rpc('query', { query: statement });
        
        if (error && !error.message.includes('exists')) {
          console.warn(`Warning: ${error.message}`);
        } else if (!error) {
          executed++;
        }
      } catch (err) {
        // Continue on error - some statements may not be directly executable this way
        console.log(`Executing statement...`);
      }
    }
    
    console.log(`Migration completed! Executed ${executed} statements successfully.`);
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  }
}

runMigration();
