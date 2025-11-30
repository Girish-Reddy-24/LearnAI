-- Enrollments Dataset: 1500 enrollments
-- Students enrolled in multiple courses with progress tracking

DO $$
DECLARE
  v_student_id uuid;
  v_course_id uuid;
  v_students uuid[];
  v_courses uuid[];
  v_enrollment_date timestamp;
  v_progress integer;
  v_status text;
  v_grade numeric;
  v_counter integer := 0;
  v_random_student integer;
  v_random_course integer;
BEGIN
  -- Get all student IDs
  SELECT array_agg(id) INTO v_students FROM profiles WHERE role = 'student' LIMIT 1000;
  -- Get all course IDs
  SELECT array_agg(id) INTO v_courses FROM courses;

  -- Generate 1500 enrollments
  FOR i IN 1..1500 LOOP
    v_random_student := 1 + floor(random() * array_length(v_students, 1));
    v_random_course := 1 + floor(random() * array_length(v_courses, 1));

    v_student_id := v_students[v_random_student];
    v_course_id := v_courses[v_random_course];

    -- Check if enrollment already exists
    IF NOT EXISTS (
      SELECT 1 FROM enrollments
      WHERE student_id = v_student_id AND course_id = v_course_id
    ) THEN
      v_enrollment_date := CURRENT_DATE - (random() * 180)::integer;

      -- Determine status and progress
      CASE floor(random() * 10)
        WHEN 0, 1, 2, 3, 4, 5, 6 THEN  -- 70% active
          v_status := 'active';
          v_progress := floor(random() * 100)::integer;
          v_grade := NULL;
        WHEN 7, 8 THEN  -- 20% completed
          v_status := 'completed';
          v_progress := 100;
          v_grade := 60 + (random() * 40);  -- Grades between 60-100
        ELSE  -- 10% dropped
          v_status := 'dropped';
          v_progress := floor(random() * 50)::integer;
          v_grade := NULL;
      END CASE;

      INSERT INTO enrollments (
        student_id,
        course_id,
        enrolled_at,
        status,
        progress,
        grade
      ) VALUES (
        v_student_id,
        v_course_id,
        v_enrollment_date,
        v_status,
        v_progress,
        v_grade
      );

      v_counter := v_counter + 1;
    END IF;
  END LOOP;

  RAISE NOTICE 'Created % enrollments', v_counter;
END $$;
