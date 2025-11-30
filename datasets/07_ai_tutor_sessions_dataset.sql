-- AI Tutor Sessions Dataset: 1000 tutoring sessions
-- Students asking questions and receiving AI help

DO $$
DECLARE
  v_student_id uuid;
  v_course_id uuid;
  v_enrolled_students record;
  v_questions text[] := ARRAY[
    'Can you explain the main concepts covered in this module?',
    'How do I apply this in a real-world project?',
    'What are the best practices for implementation?',
    'I''m stuck on this problem, can you help?',
    'What''s the difference between these two approaches?',
    'Can you provide more examples?',
    'How does this relate to what we learned earlier?',
    'What are common mistakes to avoid?',
    'Can you explain this concept in simpler terms?',
    'What resources would you recommend for further learning?',
    'How is this used in industry?',
    'What are the performance implications?',
    'Can you walk me through the implementation step by step?',
    'Why is this approach better than alternatives?',
    'What are the prerequisites for understanding this?'
  ];
  v_responses text[] := ARRAY[
    'Great question! Let me break this down for you...',
    'I''d be happy to explain that. Here''s a practical example...',
    'That''s an important concept. Let''s explore it together...',
    'I can help with that. Here''s how to approach it...',
    'Excellent question! The key difference is...',
    'Let me provide you with several examples...',
    'That''s a great connection to make. Here''s how they relate...',
    'Good thinking! Here are the main pitfalls to watch out for...',
    'Absolutely! Think of it this way...',
    'I recommend these resources for deeper understanding...',
    'In real-world applications, this is commonly used for...',
    'Performance-wise, you should consider...',
    'Let me guide you through the implementation process...',
    'The advantages of this approach include...',
    'Before diving in, you should be familiar with...'
  ];
  v_counter integer := 0;
  v_session_date timestamp;
  v_topic text;
BEGIN
  -- Generate sessions for enrolled students
  FOR v_enrolled_students IN
    SELECT e.student_id, e.course_id, e.enrolled_at, c.title
    FROM enrollments e
    JOIN courses c ON c.id = e.course_id
    WHERE e.status IN ('active', 'completed')
    ORDER BY random()
    LIMIT 1000
  LOOP
    -- Random number of questions in session (1-3)
    FOR i IN 1..(1 + floor(random() * 3)) LOOP
      v_session_date := v_enrolled_students.enrolled_at + (random() * 120 || ' days')::interval;

      v_topic := v_questions[1 + floor(random() * array_length(v_questions, 1))];

      INSERT INTO ai_tutor_sessions (
        student_id,
        course_id,
        session_start,
        conversation,
        topic_covered
      ) VALUES (
        v_enrolled_students.student_id,
        v_enrolled_students.course_id,
        v_session_date,
        jsonb_build_array(
          jsonb_build_object(
            'role', 'user',
            'content', v_topic,
            'timestamp', v_session_date
          ),
          jsonb_build_object(
            'role', 'assistant',
            'content', v_responses[1 + floor(random() * array_length(v_responses, 1))] ||
                      ' In the context of ' || v_enrolled_students.title ||
                      ', this concept is fundamental. Let me provide a detailed explanation with examples...',
            'timestamp', v_session_date + '30 seconds'::interval
          )
        ),
        substring(v_topic, 1, 100)
      );

      v_counter := v_counter + 1;
    END LOOP;
  END LOOP;

  RAISE NOTICE 'Created % AI tutor sessions', v_counter;
END $$;
