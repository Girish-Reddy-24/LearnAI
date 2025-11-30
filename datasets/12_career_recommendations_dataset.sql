-- Career Recommendations Dataset: 1000 career path suggestions
-- Personalized career guidance for students

DO $$
DECLARE
  v_student_id uuid;
  v_students uuid[];
  v_job_titles text[] := ARRAY[
    'Machine Learning Engineer',
    'Full Stack Developer',
    'Data Scientist',
    'DevOps Engineer',
    'Cloud Solutions Architect',
    'AI Research Scientist',
    'Backend Developer',
    'Frontend Developer',
    'Cybersecurity Analyst',
    'Product Manager',
    'Data Engineer',
    'Mobile App Developer',
    'UX/UI Designer',
    'Blockchain Developer',
    'Site Reliability Engineer',
    'Business Intelligence Analyst',
    'Software Architect',
    'QA Automation Engineer',
    'Technical Lead',
    'Research Engineer'
  ];
  v_companies text[] := ARRAY[
    'Google', 'Microsoft', 'Amazon', 'Meta', 'Apple',
    'Netflix', 'Tesla', 'SpaceX', 'Airbnb', 'Uber',
    'Stripe', 'Salesforce', 'Adobe', 'Intel', 'NVIDIA',
    'IBM', 'Oracle', 'Twitter', 'LinkedIn', 'GitHub',
    'Spotify', 'Dropbox', 'Slack', 'Zoom', 'Shopify'
  ];
  v_locations text[] := ARRAY[
    'San Francisco, CA', 'Seattle, WA', 'New York, NY',
    'Austin, TX', 'Boston, MA', 'Denver, CO',
    'Remote', 'Hybrid - Bay Area', 'London, UK',
    'Toronto, Canada', 'Singapore', 'Berlin, Germany'
  ];
  v_counter integer := 0;
  v_salary_min integer;
  v_salary_max integer;
  v_match_score numeric;
BEGIN
  SELECT array_agg(id) INTO v_students FROM profiles WHERE role = 'student' LIMIT 1000;

  FOR i IN 1..1000 LOOP
    v_student_id := v_students[i];

    -- Generate 1-3 career recommendations per student
    FOR j IN 1..(1 + floor(random() * 3)) LOOP
      v_salary_min := 70000 + (floor(random() * 10) * 10000);
      v_salary_max := v_salary_min + 40000 + (floor(random() * 8) * 10000);
      v_match_score := 0.65 + (random() * 0.35);

      INSERT INTO career_recommendations (
        student_id,
        job_title,
        company,
        location,
        salary_range,
        match_score,
        required_skills,
        recommended_at
      ) VALUES (
        v_student_id,
        v_job_titles[1 + floor(random() * array_length(v_job_titles, 1))],
        v_companies[1 + floor(random() * array_length(v_companies, 1))],
        v_locations[1 + floor(random() * array_length(v_locations, 1))],
        '$' || v_salary_min || ' - $' || v_salary_max,
        v_match_score,
        jsonb_build_array(
          'Python', 'Machine Learning', 'SQL', 'Cloud Computing',
          'Communication', 'Problem Solving', 'Team Collaboration'
        ),
        CURRENT_TIMESTAMP - (random() * 30 || ' days')::interval
      );

      v_counter := v_counter + 1;
    END LOOP;
  END LOOP;

  RAISE NOTICE 'Created % career recommendations', v_counter;
END $$;
