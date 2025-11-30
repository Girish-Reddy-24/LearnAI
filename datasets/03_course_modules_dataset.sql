-- Course Modules Dataset: 500 modules (10 modules per course)
-- Each course has structured learning modules with video content

DO $$
DECLARE
  v_course record;
  v_module_titles text[];
  v_video_urls text[] := ARRAY[
    'https://www.youtube.com/embed/rfscVS0vtbw',
    'https://www.youtube.com/embed/_uQrJ0TkZlc',
    'https://www.youtube.com/embed/YYXdXT2l-Gg',
    'https://www.youtube.com/embed/GwIo3gDZCVQ',
    'https://www.youtube.com/embed/aircAruvnKk',
    'https://www.youtube.com/embed/IHZwWFHWa-w',
    'https://www.youtube.com/embed/SqcY0GlETPk',
    'https://www.youtube.com/embed/w7ejDZ8SWv8',
    'https://www.youtube.com/embed/Tn6-PIqc4UM',
    'https://www.youtube.com/embed/ua-CiDNNj30',
    'https://www.youtube.com/embed/vmEHCJofslg',
    'https://www.youtube.com/embed/jG7vhMMXagQ',
    'https://www.youtube.com/embed/JMUxmLyrhSk',
    'https://www.youtube.com/embed/2IK3DFHRFfw',
    'https://www.youtube.com/embed/HXV3zeQKqGY',
    'https://www.youtube.com/embed/SpLIvfbM7gM',
    'https://www.youtube.com/embed/RBSGKlAvoiM'
  ];
  v_counter integer := 0;
BEGIN
  -- Generic module structure for all courses
  v_module_titles := ARRAY[
    'Introduction and Course Overview',
    'Fundamental Concepts and Theory',
    'Core Principles and Best Practices',
    'Hands-on Practice Session',
    'Advanced Topics and Techniques',
    'Real-world Applications',
    'Project Work and Implementation',
    'Performance Optimization',
    'Testing and Debugging',
    'Final Project and Course Wrap-up'
  ];

  FOR v_course IN SELECT id, title, category FROM courses ORDER BY created_at LOOP
    FOR i IN 1..10 LOOP
      INSERT INTO course_modules (
        course_id,
        title,
        description,
        content,
        order_index,
        duration,
        video_url,
        is_active
      ) VALUES (
        v_course.id,
        v_module_titles[i],
        'Module ' || i || ': ' || v_module_titles[i] || ' - Comprehensive coverage of key concepts with practical examples and exercises for ' || v_course.title,
        'Detailed content for ' || v_module_titles[i] || '. This module includes video lectures, code examples, exercises, and quizzes to reinforce learning.',
        i,
        (20 + floor(random() * 40))::integer || ' min',
        v_video_urls[1 + floor(random() * array_length(v_video_urls, 1))],
        true
      );
      v_counter := v_counter + 1;
    END LOOP;
  END LOOP;

  RAISE NOTICE 'Created % course modules', v_counter;
END $$;
