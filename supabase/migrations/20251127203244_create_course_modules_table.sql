/*
  # Create course modules table
  
  1. New Tables
    - `course_modules`
      - `id` (uuid, primary key)
      - `course_id` (uuid, foreign key to courses)
      - `title` (text) - Module title
      - `description` (text) - Module description
      - `video_url` (text) - YouTube embed URL or video link
      - `duration` (text) - Estimated duration (e.g., "15 min")
      - `order_index` (integer) - Order of module in course
      - `content` (text, nullable) - Additional text content
      - `resources` (jsonb, nullable) - Additional resources, links, etc.
      - `is_active` (boolean) - Whether module is published
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Security
    - Enable RLS on `course_modules` table
    - Add policy for authenticated users to read active modules
    - Add policy for admins to manage modules
*/

-- Create course_modules table
CREATE TABLE IF NOT EXISTS course_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  video_url text,
  duration text,
  order_index integer NOT NULL DEFAULT 0,
  content text,
  resources jsonb DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index for efficient querying
CREATE INDEX IF NOT EXISTS course_modules_course_id_idx ON course_modules(course_id);
CREATE INDEX IF NOT EXISTS course_modules_order_idx ON course_modules(course_id, order_index);

-- Enable RLS
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;

-- Policy: Authenticated users can view active modules
CREATE POLICY "Users can view active modules"
  ON course_modules
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Policy: Admins can insert modules
CREATE POLICY "Admins can insert modules"
  ON course_modules
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Policy: Admins can update modules
CREATE POLICY "Admins can update modules"
  ON course_modules
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Policy: Admins can delete modules
CREATE POLICY "Admins can delete modules"
  ON course_modules
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
