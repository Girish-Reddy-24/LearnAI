-- Content Recommendations Dataset: 1200 personalized recommendations
-- AI-generated course recommendations for students

DO $$
DECLARE
  v_student_id uuid;
  v_course_id uuid;
  v_students uuid[];
  v_courses uuid[];
  v_reasons text[] := ARRAY[
    'Based on your interests in Machine Learning',
    'Students with similar learning patterns enjoyed this',
    'Recommended to complement your current courses',
    'Popular in your field of study',
    'Based on your recent course completions',
    'Trending course in your category',
    'Matches your skill level and goals',
    'Recommended by your instructors',
    'High completion rate among peers',
    'Next step in your learning pathway'
  ];
  v_counter integer := 0;
  v_random_student integer;
  v_random_course integer;
  v_confidence numeric;
BEGIN
  SELECT array_agg(id) INTO v_students FROM profiles WHERE role = 'student' LIMIT 1000;
  SELECT array_agg(id) INTO v_courses FROM courses;

  FOR i IN 1..1200 LOOP
    v_random_student := 1 + floor(random() * array_length(v_students, 1));
    v_random_course := 1 + floor(random() * array_length(v_courses, 1));

    v_student_id := v_students[v_random_student];
    v_course_id := v_courses[v_random_course];

    -- Check if recommendation already exists
    IF NOT EXISTS (
      SELECT 1 FROM content_recommendations
      WHERE student_id = v_student_id AND course_id = v_course_id
    ) THEN
      -- Confidence score between 0.6 and 1.0
      v_confidence := 0.6 + (random() * 0.4);

      INSERT INTO content_recommendations (
        student_id,
        course_id,
        recommendation_reason,
        confidence_score,
        recommended_at
      ) VALUES (
        v_student_id,
        v_course_id,
        v_reasons[1 + floor(random() * array_length(v_reasons, 1))],
        v_confidence,
        CURRENT_TIMESTAMP - (random() * 60 || ' days')::interval
      );

      v_counter := v_counter + 1;
    END IF;
  END LOOP;

  RAISE NOTICE 'Created % content recommendations', v_counter;
END $$;
