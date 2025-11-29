/*
  # Create Missing Tables from ERD Diagram

  1. New Tables
    - `learning_pathways`
      - `id` (uuid, primary key)
      - `student_id` (uuid, references profiles)
      - `pathway_name` (text)
      - `description` (text)
      - `is_generated` (boolean, AI-generated flag)
      - `career_source` (text)
      - `updated_at` (timestamptz)
      - `created_at` (timestamptz)
    
    - `content_recommendations`
      - `id` (uuid, primary key)
      - `student_id` (uuid, references profiles)
      - `recommended_id` (uuid, course or lesson)
      - `reason` (text)
      - `ai_confidence_score` (float)
      - `created_at` (timestamptz)
    
    - `career_recommendations`
      - `id` (uuid, primary key)
      - `recommended_career` (text)
      - `recommended_certification` (text)
      - `recommended_ai` (text)
      - `ai_confidence_score` (float)
      - `external_career_source` (text)
      - `notes` (text)
      - `student_id` (uuid, references profiles)
      - `created_at` (timestamptz)
    
    - `auto_quiz_generation`
      - `id` (uuid, primary key)
      - `lesson_id` (uuid, references course_modules)
      - `generated_at` (timestamptz)
      - `ai_model_version` (text)
      - `rules_applied` (text)
      - `question_count` (int)
      - `difficulty_distribution` (text)
      - `summary` (text)
      - `created_at` (timestamptz)
    
    - `lessons` (alias view for course_modules)
      - Create a view for backward compatibility

  2. Security
    - Enable RLS on all new tables
    - Add policies for authenticated users to manage their own data
*/

-- Learning Pathways Table
CREATE TABLE IF NOT EXISTS learning_pathways (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  pathway_name text NOT NULL,
  description text,
  is_generated boolean DEFAULT false,
  career_source text,
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE learning_pathways ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own learning pathways"
  ON learning_pathways FOR SELECT
  TO authenticated
  USING (auth.uid() = student_id);

CREATE POLICY "Users can create own learning pathways"
  ON learning_pathways FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Users can update own learning pathways"
  ON learning_pathways FOR UPDATE
  TO authenticated
  USING (auth.uid() = student_id)
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Users can delete own learning pathways"
  ON learning_pathways FOR DELETE
  TO authenticated
  USING (auth.uid() = student_id);

-- Content Recommendations Table
CREATE TABLE IF NOT EXISTS content_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  recommended_id uuid NOT NULL,
  reason text,
  ai_confidence_score float DEFAULT 0.0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE content_recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own content recommendations"
  ON content_recommendations FOR SELECT
  TO authenticated
  USING (auth.uid() = student_id);

CREATE POLICY "System can create content recommendations"
  ON content_recommendations FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Career Recommendations Table
CREATE TABLE IF NOT EXISTS career_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recommended_career text NOT NULL,
  recommended_certification text,
  recommended_ai text,
  ai_confidence_score float DEFAULT 0.0,
  external_career_source text,
  notes text,
  student_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE career_recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own career recommendations"
  ON career_recommendations FOR SELECT
  TO authenticated
  USING (auth.uid() = student_id);

CREATE POLICY "System can create career recommendations"
  ON career_recommendations FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Auto Quiz Generation Table
CREATE TABLE IF NOT EXISTS auto_quiz_generation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid REFERENCES course_modules(id) ON DELETE CASCADE NOT NULL,
  generated_at timestamptz DEFAULT now(),
  ai_model_version text,
  rules_applied text,
  question_count int DEFAULT 0,
  difficulty_distribution text,
  summary text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE auto_quiz_generation ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All authenticated users can view quiz generation data"
  ON auto_quiz_generation FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "System can create quiz generation records"
  ON auto_quiz_generation FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create a view for lessons (alias for course_modules)
CREATE OR REPLACE VIEW lessons AS
SELECT 
  id,
  course_id,
  title,
  description AS site,
  content,
  order_index,
  duration AS duration_minutes,
  video_url AS external_content_source,
  created_at
FROM course_modules;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_learning_pathways_student ON learning_pathways(student_id);
CREATE INDEX IF NOT EXISTS idx_content_recommendations_student ON content_recommendations(student_id);
CREATE INDEX IF NOT EXISTS idx_career_recommendations_student ON career_recommendations(student_id);
CREATE INDEX IF NOT EXISTS idx_auto_quiz_generation_lesson ON auto_quiz_generation(lesson_id);
