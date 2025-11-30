-- Profiles Dataset: 1200 users (1000 students, 150 faculty, 50 admins)
-- Clean, realistic data for educational platform

-- Helper function to generate random dates
DO $$
DECLARE
  v_user_id uuid;
  v_email text;
  v_name text;
  v_role text;
  v_first_names text[] := ARRAY['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen', 'Daniel', 'Nancy', 'Matthew', 'Lisa', 'Anthony', 'Betty', 'Mark', 'Margaret', 'Donald', 'Sandra', 'Steven', 'Ashley', 'Paul', 'Emily', 'Andrew', 'Kimberly', 'Joshua', 'Donna', 'Kenneth', 'Michelle', 'Kevin', 'Carol', 'Brian', 'Amanda', 'George', 'Dorothy', 'Edward', 'Melissa', 'Ronald', 'Deborah', 'Timothy', 'Stephanie', 'Jason', 'Rebecca', 'Jeffrey', 'Sharon', 'Ryan', 'Laura', 'Jacob', 'Cynthia', 'Gary', 'Kathleen', 'Nicholas', 'Amy', 'Eric', 'Shirley', 'Jonathan', 'Angela', 'Stephen', 'Helen', 'Larry', 'Anna', 'Justin', 'Brenda', 'Scott', 'Pamela', 'Brandon', 'Nicole', 'Benjamin', 'Emma', 'Samuel', 'Samantha', 'Frank', 'Katherine', 'Gregory', 'Christine', 'Raymond', 'Debra', 'Alexander', 'Rachel', 'Patrick', 'Catherine', 'Jack', 'Carolyn', 'Dennis', 'Janet', 'Jerry', 'Ruth', 'Tyler', 'Maria', 'Aaron', 'Heather', 'Jose', 'Diane', 'Adam', 'Virginia', 'Henry', 'Julie', 'Nathan', 'Joyce', 'Douglas', 'Victoria', 'Zachary', 'Olivia', 'Peter', 'Kelly', 'Kyle', 'Christina', 'Walter', 'Lauren', 'Ethan', 'Joan', 'Jeremy', 'Evelyn', 'Harold', 'Judith', 'Keith', 'Megan', 'Christian', 'Cheryl', 'Roger', 'Andrea', 'Noah', 'Hannah', 'Gerald', 'Jacqueline', 'Carl', 'Martha', 'Terry', 'Gloria', 'Sean', 'Teresa', 'Austin', 'Ann', 'Arthur', 'Sara', 'Lawrence', 'Madison', 'Jesse', 'Frances', 'Dylan', 'Kathryn', 'Bryan', 'Janice', 'Joe', 'Jean', 'Jordan', 'Alice', 'Billy', 'Abigail', 'Bruce', 'Sophia', 'Albert', 'Grace', 'Willie', 'Denise', 'Gabriel', 'Amber', 'Logan', 'Doris', 'Alan', 'Marilyn', 'Juan', 'Danielle', 'Wayne', 'Beverly', 'Roy', 'Isabella', 'Ralph', 'Theresa', 'Randy', 'Diana', 'Eugene', 'Natalie', 'Vincent', 'Brittany', 'Russell', 'Charlotte', 'Louis', 'Marie', 'Philip', 'Kayla', 'Bobby', 'Alexis', 'Johnny', 'Lori'];
  v_last_names text[] := ARRAY['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts', 'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker', 'Cruz', 'Edwards', 'Collins', 'Reyes', 'Stewart', 'Morris', 'Morales', 'Murphy', 'Cook', 'Rogers', 'Gutierrez', 'Ortiz', 'Morgan', 'Cooper', 'Peterson', 'Bailey', 'Reed', 'Kelly', 'Howard', 'Ramos', 'Kim', 'Cox', 'Ward', 'Richardson', 'Watson', 'Brooks', 'Chavez', 'Wood', 'James', 'Bennett', 'Gray', 'Mendoza', 'Ruiz', 'Hughes', 'Price', 'Alvarez', 'Castillo', 'Sanders', 'Patel', 'Myers', 'Long', 'Ross', 'Foster', 'Jimenez'];
  v_counter integer := 0;
  v_registration_date timestamp;
  v_status text;
BEGIN
  -- Generate 1000 students
  FOR i IN 1..1000 LOOP
    v_name := v_first_names[1 + floor(random() * array_length(v_first_names, 1))] || ' ' ||
              v_last_names[1 + floor(random() * array_length(v_last_names, 1))];
    v_email := lower(replace(v_name, ' ', '.')) || i || '@student.edu';
    v_registration_date := CURRENT_DATE - (random() * 365 * 2)::integer;
    v_status := CASE
      WHEN random() < 0.85 THEN 'active'
      WHEN random() < 0.95 THEN 'inactive'
      ELSE 'suspended'
    END;

    INSERT INTO profiles (id, email, full_name, role, registration_date, status)
    VALUES (
      gen_random_uuid(),
      v_email,
      v_name,
      'student',
      v_registration_date,
      v_status
    );
  END LOOP;

  -- Generate 150 faculty members
  FOR i IN 1..150 LOOP
    v_name := 'Dr. ' || v_first_names[1 + floor(random() * array_length(v_first_names, 1))] || ' ' ||
              v_last_names[1 + floor(random() * array_length(v_last_names, 1))];
    v_email := lower(replace(replace(v_name, ' ', '.'), 'dr.', '')) || i || '@faculty.edu';
    v_registration_date := CURRENT_DATE - (random() * 365 * 5)::integer;

    INSERT INTO profiles (id, email, full_name, role, registration_date, status)
    VALUES (
      gen_random_uuid(),
      v_email,
      v_name,
      'faculty',
      v_registration_date,
      'active'
    );
  END LOOP;

  -- Generate 50 admins
  FOR i IN 1..50 LOOP
    v_name := v_first_names[1 + floor(random() * array_length(v_first_names, 1))] || ' ' ||
              v_last_names[1 + floor(random() * array_length(v_last_names, 1))];
    v_email := lower(replace(v_name, ' ', '.')) || '.admin' || i || '@platform.edu';
    v_registration_date := CURRENT_DATE - (random() * 365 * 3)::integer;

    INSERT INTO profiles (id, email, full_name, role, registration_date, status)
    VALUES (
      gen_random_uuid(),
      v_email,
      v_name,
      'admin',
      v_registration_date,
      'active'
    );
  END LOOP;

END $$;
