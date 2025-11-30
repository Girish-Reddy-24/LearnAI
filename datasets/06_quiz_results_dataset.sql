-- Quiz Results Dataset: 1200 quiz attempts
-- Students taking quizzes with realistic scores

DO $$
DECLARE
  v_student_id uuid;
  v_quiz_id uuid;
  v_enrolled_students record;
  v_quizzes uuid[];
  v_score numeric;
  v_passed boolean;
  v_time_taken integer;
  v_counter integer := 0;
  v_attempt_date timestamp;
BEGIN
  -- For each enrollment, generate quiz results
  FOR v_enrolled_students IN
    SELECT DISTINCT e.student_id, e.course_id, e.enrolled_at
    FROM enrollments e
    WHERE e.status IN ('active', 'completed')
    ORDER BY random()
    LIMIT 1200
  LOOP
    -- Get quizzes for this course
    SELECT array_agg(id) INTO v_quizzes
    FROM quizzes
    WHERE course_id = v_enrolled_students.course_id;

    IF v_quizzes IS NOT NULL AND array_length(v_quizzes, 1) > 0 THEN
      -- Take 1-3 random quizzes from the course
      FOR i IN 1..(1 + floor(random() * 3)) LOOP
        IF i <= array_length(v_quizzes, 1) THEN
          v_quiz_id := v_quizzes[i];

          -- Generate realistic score (bell curve around 75)
          v_score := GREATEST(0, LEAST(100,
            75 + (random() - 0.5) * 40 + (random() - 0.5) * 20
          ));

          -- Determine if passed (passing score is 70-78)
          v_passed := v_score >= (70 + (i * 2));

          -- Time taken (relative to quiz time limit)
          SELECT time_limit INTO v_time_taken FROM quizzes WHERE id = v_quiz_id;
          v_time_taken := floor(v_time_taken * (0.6 + random() * 0.4))::integer;

          -- Attempt date should be after enrollment
          v_attempt_date := v_enrolled_students.enrolled_at + (random() * 90 || ' days')::interval;

          INSERT INTO quiz_results (
            student_id,
            quiz_id,
            score,
            passed,
            time_taken,
            attempt_date,
            answers
          ) VALUES (
            v_enrolled_students.student_id,
            v_quiz_id,
            v_score,
            v_passed,
            v_time_taken,
            v_attempt_date,
            jsonb_build_object(
              '1', 'Option A',
              '2', 'Understanding of practical applications',
              '3', jsonb_build_array('Benefit 1', 'Benefit 2'),
              '4', 'true',
              '5', 'Real-world scenario explanation with detailed examples'
            )
          );

          v_counter := v_counter + 1;
        END IF;
      END LOOP;
    END IF;
  END LOOP;

  RAISE NOTICE 'Created % quiz results', v_counter;
END $$;
