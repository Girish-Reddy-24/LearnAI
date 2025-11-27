import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const users = [
  { email: 'alice.johnson@example.com', password: 'Password123!', full_name: 'Alice Johnson', role: 'student' },
  { email: 'bob.smith@example.com', password: 'Password123!', full_name: 'Bob Smith', role: 'student' },
  { email: 'carol.white@example.com', password: 'Password123!', full_name: 'Carol White', role: 'student' },
  { email: 'david.brown@example.com', password: 'Password123!', full_name: 'David Brown', role: 'student' },
  { email: 'emma.davis@example.com', password: 'Password123!', full_name: 'Emma Davis', role: 'student' },
  { email: 'frank.miller@example.com', password: 'Password123!', full_name: 'Frank Miller', role: 'faculty' },
  { email: 'grace.wilson@example.com', password: 'Password123!', full_name: 'Grace Wilson', role: 'faculty' },
  { email: 'henry.moore@example.com', password: 'Password123!', full_name: 'Henry Moore', role: 'student' },
  { email: 'iris.taylor@example.com', password: 'Password123!', full_name: 'Iris Taylor', role: 'student' },
];

async function createUsers() {
  console.log('Creating users...\n');

  for (const user of users) {
    try {
      const { data, error } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: {
          full_name: user.full_name,
          role: user.role
        }
      });

      if (error) {
        console.error(`❌ Failed to create ${user.email}:`, error.message);
      } else {
        console.log(`✅ Created user: ${user.email} (${user.role})`);
      }
    } catch (err) {
      console.error(`❌ Error creating ${user.email}:`, err);
    }
  }

  console.log('\n✨ User creation complete!');
  console.log('\nAll users have password: Password123!');
}

createUsers();
