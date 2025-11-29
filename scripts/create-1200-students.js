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
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth',
  'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen',
  'Christopher', 'Nancy', 'Daniel', 'Lisa', 'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra',
  'Raj', 'Priya', 'Wei', 'Yuki', 'Mohammed', 'Fatima', 'Carlos', 'Maria', 'Dmitri', 'Olga',
  'Ahmed', 'Aisha', 'Luis', 'Ana', 'Kenji', 'Sakura', 'Ivan', 'Elena', 'Hassan', 'Leila'];

const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
  'Patel', 'Kumar', 'Singh', 'Chen', 'Wang', 'Kim', 'Ali', 'Ahmed', 'Silva', 'Santos',
  'Nguyen', 'Tran', 'Le', 'Pham', 'Hoang', 'Vu', 'Dang', 'Bui', 'Do', 'Ho'];

const randomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

console.log('Creating 1200 students...\n');

let successCount = 0;
let errorCount = 0;

async function createStudents() {
  for (let i = 1; i <= 1200; i++) {
    const firstName = randomElement(firstNames);
    const lastName = randomElement(lastNames);
    const fullName = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@slu.edu`;

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: 'Password123!',
        options: {
          data: {
            full_name: fullName,
          }
        }
      });

      if (error) {
        if (!error.message.includes('already registered')) {
          console.error(`❌ ${i}. Failed: ${email} - ${error.message}`);
          errorCount++;
        }
      } else {
        successCount++;
        if (i % 100 === 0) {
          console.log(`✓ ${i} students processed (${successCount} created)`);
        }
      }
    } catch (err) {
      console.error(`❌ ${i}. Error: ${email}`, err.message);
      errorCount++;
    }

    // Small delay to avoid rate limiting
    if (i % 50 === 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  console.log(`\n✨ Complete!`);
  console.log(`Created: ${successCount} students`);
  console.log(`Errors: ${errorCount}`);
  console.log(`\nAll students have password: Password123!`);
}

createStudents();
