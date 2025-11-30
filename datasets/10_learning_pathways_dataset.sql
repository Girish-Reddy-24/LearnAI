-- Learning Pathways Dataset: 800 personalized learning paths
-- Custom learning journeys for students

DO $$
DECLARE
  v_student_id uuid;
  v_students uuid[];
  v_pathway_names text[] := ARRAY[
    'Full Stack Developer Path',
    'Data Science Specialist',
    'Machine Learning Engineer',
    'Cloud Architecture Track',
    'Cybersecurity Professional',
    'AI Engineer Pathway',
    'DevOps Expert Track',
    'Mobile App Developer',
    'Blockchain Developer Path',
    'Product Manager Track'
  ];
  v_pathway_desc text[] := ARRAY[
    'Become a complete full-stack developer with expertise in both frontend and backend technologies',
    'Master data analysis, visualization, and statistical modeling for data-driven decisions',
    'Build and deploy advanced machine learning models for real-world applications',
    'Design and implement scalable cloud infrastructure on major platforms',
    'Protect systems and networks from cyber threats with advanced security skills',
    'Develop cutting-edge AI solutions using latest deep learning techniques',
    'Streamline development and deployment with modern DevOps practices',
    'Create native mobile applications for iOS and Android platforms',
    'Build decentralized applications and smart contracts on blockchain',
    'Lead product development from ideation to launch with agile methodologies'
  ];
  v_counter integer := 0;
  v_random_pathway integer;
  v_courses_in_path uuid[];
  v_target_date date;
BEGIN
  -- Get student IDs
  SELECT array_agg(id) INTO v_students FROM profiles WHERE role = 'student' LIMIT 800;

  FOR i IN 1..800 LOOP
    v_student_id := v_students[i];
    v_random_pathway := 1 + floor(random() * array_length(v_pathway_names, 1));

    -- Get 3-6 random courses for the pathway
    SELECT array_agg(id) INTO v_courses_in_path
    FROM courses
    ORDER BY random()
    LIMIT (3 + floor(random() * 4))::integer;

    v_target_date := CURRENT_DATE + (90 + floor(random() * 180))::integer;

    INSERT INTO learning_pathways (
      student_id,
      pathway_name,
      description,
      courses,
      target_completion_date,
      progress
    ) VALUES (
      v_student_id,
      v_pathway_names[v_random_pathway],
      v_pathway_desc[v_random_pathway],
      array_to_json(v_courses_in_path)::jsonb,
      v_target_date,
      floor(random() * 100)::integer
    );

    v_counter := v_counter + 1;
  END LOOP;

  RAISE NOTICE 'Created % learning pathways', v_counter;
END $$;
