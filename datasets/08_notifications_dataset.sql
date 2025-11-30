-- Notifications Dataset: 1500 notifications
-- System notifications for students about courses, deadlines, achievements

DO $$
DECLARE
  v_user_id uuid;
  v_users uuid[];
  v_notification_types text[] := ARRAY[
    'course_enrollment',
    'quiz_available',
    'assignment_due',
    'grade_posted',
    'course_update',
    'achievement_unlocked',
    'new_content',
    'reminder',
    'certificate_ready',
    'discussion_reply'
  ];
  v_titles text[] := ARRAY[
    'Successfully Enrolled in Course',
    'New Quiz Available',
    'Assignment Due Soon',
    'Your Grade Has Been Posted',
    'Course Content Updated',
    'Achievement Unlocked!',
    'New Module Released',
    'Upcoming Deadline Reminder',
    'Certificate Ready for Download',
    'Someone Replied to Your Discussion'
  ];
  v_messages text[] := ARRAY[
    'You have successfully enrolled in the course. Start learning now!',
    'A new quiz is available for this course. Test your knowledge!',
    'Your assignment is due in 3 days. Make sure to submit on time.',
    'Your quiz grade has been posted. Check your progress dashboard.',
    'New content has been added to your course. Check it out!',
    'Congratulations! You''ve completed 50% of the course.',
    'A new module has been released in your course. Continue your learning journey.',
    'Don''t forget: You have an upcoming deadline in 2 days.',
    'Your course certificate is ready. Download it from your profile.',
    'A student has replied to your question in the discussion forum.'
  ];
  v_counter integer := 0;
  v_notification_date timestamp;
  v_is_read boolean;
  v_random_type integer;
BEGIN
  -- Get all user IDs (students, faculty, admins)
  SELECT array_agg(id) INTO v_users FROM profiles LIMIT 1200;

  -- Generate 1500 notifications
  FOR i IN 1..1500 LOOP
    v_user_id := v_users[1 + floor(random() * array_length(v_users, 1))];
    v_random_type := 1 + floor(random() * array_length(v_notification_types, 1));

    v_notification_date := CURRENT_TIMESTAMP - (random() * 90 || ' days')::interval;

    -- 60% of notifications are read
    v_is_read := random() < 0.6;

    INSERT INTO notifications (
      user_id,
      title,
      message,
      type,
      is_read,
      created_at
    ) VALUES (
      v_user_id,
      v_titles[v_random_type],
      v_messages[v_random_type],
      v_notification_types[v_random_type],
      v_is_read,
      v_notification_date
    );

    v_counter := v_counter + 1;
  END LOOP;

  RAISE NOTICE 'Created % notifications', v_counter;
END $$;
