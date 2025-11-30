-- Quizzes Dataset: 200 quizzes (4 quizzes per course)
-- Each course has multiple quizzes for assessment

DO $$
DECLARE
  v_course record;
  v_faculty_id uuid;
  v_quiz_titles text[] := ARRAY[
    'Module Assessment Quiz',
    'Midterm Knowledge Check',
    'Practical Application Test',
    'Final Comprehensive Exam'
  ];
  v_counter integer := 0;
  v_difficulty text;
BEGIN
  FOR v_course IN SELECT id, title, instructor_id, difficulty_level FROM courses ORDER BY created_at LOOP
    FOR i IN 1..4 LOOP
      -- Set quiz difficulty based on course level and quiz number
      v_difficulty := CASE
        WHEN i = 1 THEN 'easy'
        WHEN i = 2 AND v_course.difficulty_level = 'beginner' THEN 'easy'
        WHEN i = 2 THEN 'medium'
        WHEN i = 3 THEN 'medium'
        WHEN i = 4 AND v_course.difficulty_level = 'advanced' THEN 'hard'
        ELSE 'medium'
      END;

      INSERT INTO quizzes (
        course_id,
        title,
        description,
        created_by,
        difficulty,
        time_limit,
        passing_score,
        total_points,
        questions
      ) VALUES (
        v_course.id,
        v_quiz_titles[i] || ' - ' || v_course.title,
        'Assessment quiz for evaluating your understanding of the key concepts covered in ' || v_course.title || '. Quiz ' || i || ' of 4.',
        v_course.instructor_id,
        v_difficulty,
        (30 + (i * 15))::integer,  -- 30, 45, 60, 75 minutes
        70 + (i * 2),  -- Increasing passing scores: 72, 74, 76, 78
        100,
        jsonb_build_array(
          jsonb_build_object(
            'id', 1,
            'question', 'What is the primary concept covered in this module?',
            'type', 'multiple_choice',
            'options', jsonb_build_array('Option A', 'Option B', 'Option C', 'Option D'),
            'correct_answer', 'Option A',
            'points', 10
          ),
          jsonb_build_object(
            'id', 2,
            'question', 'Explain the practical application of this concept.',
            'type', 'short_answer',
            'correct_answer', 'Sample answer demonstrating understanding',
            'points', 15
          ),
          jsonb_build_object(
            'id', 3,
            'question', 'Which of the following are key benefits? (Select all that apply)',
            'type', 'multiple_choice',
            'options', jsonb_build_array('Benefit 1', 'Benefit 2', 'Benefit 3', 'Benefit 4'),
            'correct_answer', jsonb_build_array('Benefit 1', 'Benefit 2'),
            'points', 10
          ),
          jsonb_build_object(
            'id', 4,
            'question', 'True or False: This concept is fundamental to the field.',
            'type', 'true_false',
            'correct_answer', 'true',
            'points', 5
          ),
          jsonb_build_object(
            'id', 5,
            'question', 'Describe a real-world scenario where you would apply this.',
            'type', 'essay',
            'points', 20
          )
        )
      );
      v_counter := v_counter + 1;
    END LOOP;
  END LOOP;

  RAISE NOTICE 'Created % quizzes', v_counter;
END $$;
