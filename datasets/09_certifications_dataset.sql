-- Certifications Dataset: 500 certifications issued
-- Certificates for students who completed courses

DO $$
DECLARE
  v_completed_enrollment record;
  v_counter integer := 0;
  v_certificate_url text;
BEGIN
  -- Generate certifications for completed enrollments with good grades
  FOR v_completed_enrollment IN
    SELECT e.student_id, e.course_id, e.grade, c.title, p.full_name
    FROM enrollments e
    JOIN courses c ON c.id = e.course_id
    JOIN profiles p ON p.id = e.student_id
    WHERE e.status = 'completed'
    AND e.grade >= 70
    ORDER BY random()
    LIMIT 500
  LOOP
    v_certificate_url := 'https://certificates.platform.edu/' ||
                        replace(lower(v_completed_enrollment.full_name), ' ', '-') || '-' ||
                        replace(lower(v_completed_enrollment.title), ' ', '-') ||
                        '-' || floor(random() * 1000000);

    INSERT INTO certifications (
      student_id,
      course_id,
      issue_date,
      certificate_url,
      verification_code
    ) VALUES (
      v_completed_enrollment.student_id,
      v_completed_enrollment.course_id,
      CURRENT_DATE - (random() * 180)::integer,
      v_certificate_url,
      'CERT-' || upper(substring(md5(random()::text), 1, 12))
    );

    v_counter := v_counter + 1;
  END LOOP;

  RAISE NOTICE 'Created % certifications', v_counter;
END $$;
