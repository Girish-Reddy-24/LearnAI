-- Comprehensive Data Generation Script
-- Generates 1000-1500 rows for each table

-- ============================================
-- 1. GENERATE 1200 STUDENTS
-- ============================================

DO $$
DECLARE
  i INT;
  first_names TEXT[] := ARRAY['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth',
                               'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen',
                               'Christopher', 'Nancy', 'Daniel', 'Lisa', 'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra',
                               'Donald', 'Ashley', 'Steven', 'Kimberly', 'Paul', 'Emily', 'Andrew', 'Donna', 'Joshua', 'Michelle',
                               'Kenneth', 'Dorothy', 'Kevin', 'Carol', 'Brian', 'Amanda', 'George', 'Melissa', 'Edward', 'Deborah',
                               'Raj', 'Priya', 'Wei', 'Yuki', 'Mohammed', 'Fatima', 'Carlos', 'Maria', 'Dmitri', 'Olga'];
  last_names TEXT[] := ARRAY['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
                              'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
                              'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
                              'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
                              'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts',
                              'Patel', 'Kumar', 'Singh', 'Chen', 'Wang', 'Kim', 'Ali', 'Ahmed', 'Silva', 'Santos'];
  email_val TEXT;
  name_val TEXT;
  status_val TEXT;
  dob_val DATE;
BEGIN
  FOR i IN 1..1200 LOOP
    name_val := first_names[1 + (random() * (array_length(first_names, 1) - 1))::INT] || ' ' ||
                last_names[1 + (random() * (array_length(last_names, 1) - 1))::INT];
    email_val := lower(replace(name_val, ' ', '.')) || i || '@slu.edu';

    status_val := CASE
      WHEN random() < 0.85 THEN 'active'
      WHEN random() < 0.95 THEN 'inactive'
      ELSE 'graduated'
    END;

    dob_val := DATE '1995-01-01' + (random() * 3650)::INT;

    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_user_meta_data,
      is_super_admin,
      confirmation_token,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      email_val,
      crypt('Password123!', gen_salt('bf')),
      now(),
      now() - (random() * interval '180 days'),
      now(),
      jsonb_build_object('full_name', name_val),
      false,
      encode(gen_random_bytes(32), 'hex'),
      encode(gen_random_bytes(32), 'hex')
    )
    ON CONFLICT (email) DO NOTHING;

  END LOOP;

  RAISE NOTICE '1200 students generated';
END $$;

-- Update profiles with additional student data
UPDATE profiles SET
  date_of_birth = DATE '1995-01-01' + (random() * 3650)::INT,
  registration_date = CURRENT_DATE - (random() * 365)::INT,
  status = CASE
    WHEN random() < 0.85 THEN 'active'
    WHEN random() < 0.95 THEN 'inactive'
    ELSE 'graduated'
  END
WHERE date_of_birth IS NULL;
