import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const users = [
  { email: 'alice.johnson@example.com', password: 'Password123!', full_name: 'Alice Johnson' },
  { email: 'bob.smith@example.com', password: 'Password123!', full_name: 'Bob Smith' },
  { email: 'carol.white@example.com', password: 'Password123!', full_name: 'Carol White' },
  { email: 'david.brown@example.com', password: 'Password123!', full_name: 'David Brown' },
  { email: 'emma.davis@example.com', password: 'Password123!', full_name: 'Emma Davis' },
  { email: 'frank.miller@example.com', password: 'Password123!', full_name: 'Frank Miller' },
  { email: 'grace.wilson@example.com', password: 'Password123!', full_name: 'Grace Wilson' },
  { email: 'henry.moore@example.com', password: 'Password123!', full_name: 'Henry Moore' },
  { email: 'iris.taylor@example.com', password: 'Password123!', full_name: 'Iris Taylor' },
];

async function createUsers() {
  console.log('Creating users...\n');

  for (const user of users) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: user.email,
        password: user.password,
        options: {
          data: {
            full_name: user.full_name,
          }
        }
      });

      if (error) {
        console.error(`❌ Failed to create ${user.email}:`, error.message);
      } else {
        console.log(`✅ Created user: ${user.email}`);
      }
    } catch (err) {
      console.error(`❌ Error creating ${user.email}:`, err);
    }
  }

  console.log('\n✨ User creation complete!');
  console.log('\nAll users have password: Password123!');
  console.log('\nNote: If email confirmation is enabled, users need to confirm their emails.');
}

createUsers();
