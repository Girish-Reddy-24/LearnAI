/*
  # Update Schema to Match ERD Specifications

  1. Changes to Existing Tables
    - Update profiles table to match Student entity
    - Update courses and lessons tables
    - Update enrollments, quizzes, and other tables
    - Add all missing columns from ERD

  2. Security
    - All RLS policies remain intact
*/

-- Add missing columns to profiles (Student entity)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS date_of_birth date;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS registration_date date DEFAULT CURRENT_DATE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS status text DEFAULT 'active';
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_status_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_status_check CHECK (status IN ('active', 'inactive', 'graduated'));

-- Add current_learning_pathway_id (will be populated later)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'current_learning_pathway_id'
  ) THEN
    ALTER TABLE profiles ADD COLUMN current_learning_pathway_id uuid;
  END IF;
END $$;

-- Update courses table
ALTER TABLE courses ADD COLUMN IF NOT EXISTS level text;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS external_source text DEFAULT 'SLU Catalog';
ALTER TABLE courses DROP CONSTRAINT IF EXISTS courses_level_check;
ALTER TABLE courses ADD CONSTRAINT courses_level_check CHECK (level IN ('Beginner', 'Intermediate', 'Advanced'));

-- Update course_modules - add site column
ALTER TABLE course_modules ADD COLUMN IF NOT EXISTS site text;

-- Update enrollments table
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS enrollment_date date DEFAULT CURRENT_DATE;
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS grade float;
ALTER TABLE enrollments DROP CONSTRAINT IF EXISTS enrollments_grade_check;
ALTER TABLE enrollments ADD CONSTRAINT enrollments_grade_check CHECK (grade >= 0 AND grade <= 100);

-- Rename progress to progress_percent in enrollments if not already done
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'enrollments' AND column_name = 'progress'
  ) THEN
    ALTER TABLE enrollments RENAME COLUMN progress TO progress_percent;
  END IF;
END $$;

-- Update quiz_attempts/quiz_results table
ALTER TABLE IF EXISTS quiz_attempts RENAME TO quiz_results;
ALTER TABLE quiz_results ADD COLUMN IF NOT EXISTS time_taken_seconds int;
ALTER TABLE quiz_results ADD COLUMN IF NOT EXISTS feedback text;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'quiz_results' AND column_name = 'attempted_at'
  ) THEN
    ALTER TABLE quiz_results RENAME COLUMN attempted_at TO attempt_date;
  END IF;
END $$;

-- Update quizzes table
ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS generated_by text DEFAULT 'Instructor';
ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS total_questions int DEFAULT 0;
ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS difficulty_level text;
ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS auto_quiz_generation_id uuid;
ALTER TABLE quizzes DROP CONSTRAINT IF EXISTS quizzes_generated_by_check;
ALTER TABLE quizzes ADD CONSTRAINT quizzes_generated_by_check CHECK (generated_by IN ('AI', 'Instructor'));
ALTER TABLE quizzes DROP CONSTRAINT IF EXISTS quizzes_difficulty_level_check;
ALTER TABLE quizzes ADD CONSTRAINT quizzes_difficulty_level_check CHECK (difficulty_level IN ('Easy', 'Medium', 'Hard'));

-- Add lesson_id column to quizzes (keeping course_id for now for compatibility)
ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS lesson_id uuid;

-- Update learning_pathways table
ALTER TABLE learning_pathways ADD COLUMN IF NOT EXISTS ai_description text;
ALTER TABLE learning_pathways ADD COLUMN IF NOT EXISTS progress_percent float DEFAULT 0.0;
ALTER TABLE learning_pathways ADD COLUMN IF NOT EXISTS current_status text DEFAULT 'Active';
ALTER TABLE learning_pathways DROP CONSTRAINT IF EXISTS learning_pathways_current_status_check;
ALTER TABLE learning_pathways ADD CONSTRAINT learning_pathways_current_status_check CHECK (current_status IN ('Active', 'On hold', 'Completed'));

-- Update content_recommendations table
ALTER TABLE content_recommendations ADD COLUMN IF NOT EXISTS external_content_source text;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'content_recommendations' AND column_name = 'recommended_id'
  ) THEN
    ALTER TABLE content_recommendations RENAME COLUMN recommended_id TO lesson_id;
  END IF;
END $$;

-- Update career_recommendations table
ALTER TABLE career_recommendations ADD COLUMN IF NOT EXISTS recommended_url text;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'career_recommendations' AND column_name = 'external_career_source'
  ) THEN
    ALTER TABLE career_recommendations RENAME COLUMN external_career_source TO external_source;
  END IF;
END $$;

-- Update ai_tutor_sessions table
ALTER TABLE ai_tutor_sessions ADD COLUMN IF NOT EXISTS session_start timestamptz DEFAULT now();
ALTER TABLE ai_tutor_sessions ADD COLUMN IF NOT EXISTS session_end timestamptz;
ALTER TABLE ai_tutor_sessions ADD COLUMN IF NOT EXISTS topic_covered text;
ALTER TABLE ai_tutor_sessions ADD COLUMN IF NOT EXISTS session_rating int;
ALTER TABLE ai_tutor_sessions ADD COLUMN IF NOT EXISTS feedback_text text;
ALTER TABLE ai_tutor_sessions ADD COLUMN IF NOT EXISTS performance_metrics text;
ALTER TABLE ai_tutor_sessions DROP CONSTRAINT IF EXISTS ai_tutor_sessions_session_rating_check;
ALTER TABLE ai_tutor_sessions ADD CONSTRAINT ai_tutor_sessions_session_rating_check CHECK (session_rating >= 1 AND session_rating <= 5);

-- Update notifications table
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS notification_type text DEFAULT 'general';
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS scheduled_time timestamptz;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS sent_time timestamptz;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS related_course_id uuid;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS related_lesson_id uuid;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles(status);
CREATE INDEX IF NOT EXISTS idx_profiles_registration_date ON profiles(registration_date);
CREATE INDEX IF NOT EXISTS idx_enrollments_enrollment_date ON enrollments(enrollment_date);
CREATE INDEX IF NOT EXISTS idx_quiz_results_student ON quiz_results(student_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_quiz ON quiz_results(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_attempt_date ON quiz_results(attempt_date);
CREATE INDEX IF NOT EXISTS idx_notifications_scheduled_time ON notifications(scheduled_time);
CREATE INDEX IF NOT EXISTS idx_ai_tutor_session_start ON ai_tutor_sessions(session_start);
CREATE INDEX IF NOT EXISTS idx_courses_level ON courses(level);
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
