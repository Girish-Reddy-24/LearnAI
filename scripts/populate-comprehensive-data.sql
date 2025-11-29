-- Comprehensive Data Population Script
-- This script populates all tables with realistic sample data

-- Note: Run this after getting actual IDs from the database
-- This is a template that will be executed via Supabase execute_sql

-- 1. ENROLLMENTS - Students enrolled in various courses with different progress levels
-- Sample enrollments will be created for students across multiple courses

-- 2. QUIZZES - Create quizzes for courses
INSERT INTO quizzes (course_id, title, description, questions, created_by) VALUES
(
  (SELECT id FROM courses WHERE title = 'Machine Learning Fundamentals' LIMIT 1),
  'ML Basics Quiz',
  'Test your understanding of machine learning fundamentals',
  '[
    {
      "question": "What is supervised learning?",
      "options": ["Learning with labeled data", "Learning without labels", "Reinforcement learning", "Unsupervised clustering"],
      "correct_answer": 0,
      "explanation": "Supervised learning uses labeled training data to learn patterns."
    },
    {
      "question": "Which algorithm is used for classification?",
      "options": ["K-means", "Decision Trees", "PCA", "DBSCAN"],
      "correct_answer": 1,
      "explanation": "Decision Trees are commonly used for classification tasks."
    },
    {
      "question": "What is overfitting?",
      "options": ["Model performs well on training data but poorly on test data", "Model underfits the data", "Model has high bias", "Model is too simple"],
      "correct_answer": 0,
      "explanation": "Overfitting occurs when a model learns the training data too well, including noise."
    }
  ]'::jsonb,
  (SELECT id FROM profiles WHERE role = 'student' LIMIT 1)
),
(
  (SELECT id FROM courses WHERE title = 'Python Programming for Data Science' LIMIT 1),
  'Python Fundamentals Quiz',
  'Test your Python programming knowledge',
  '[
    {
      "question": "What is a list comprehension?",
      "options": ["A way to create lists", "A type of loop", "A function", "A class"],
      "correct_answer": 0,
      "explanation": "List comprehensions provide a concise way to create lists."
    },
    {
      "question": "What does the enumerate() function do?",
      "options": ["Counts items", "Returns index and value pairs", "Sorts a list", "Filters items"],
      "correct_answer": 1,
      "explanation": "enumerate() returns both the index and value when iterating."
    }
  ]'::jsonb,
  (SELECT id FROM profiles WHERE role = 'student' LIMIT 1)
);

-- 3. CERTIFICATIONS - Industry certifications recommendations
INSERT INTO certifications (title, description, provider, url, job_relevance, related_courses) VALUES
('AWS Certified Machine Learning Specialty',
 'Validates expertise in building, training, and deploying machine learning models on AWS',
 'Amazon Web Services',
 'https://aws.amazon.com/certification/certified-machine-learning-specialty/',
 'Data Scientist, ML Engineer, Cloud Architect',
 ARRAY['Machine Learning Fundamentals', 'Deep Learning with TensorFlow']),

('Google Professional Data Engineer',
 'Demonstrates ability to design and build data processing systems',
 'Google Cloud',
 'https://cloud.google.com/certification/data-engineer',
 'Data Engineer, Big Data Developer',
 ARRAY['Data Engineering Essentials', 'Python Programming for Data Science']),

('Microsoft Certified: Azure AI Engineer Associate',
 'Validates skills in designing and implementing AI solutions using Azure',
 'Microsoft',
 'https://learn.microsoft.com/en-us/certifications/azure-ai-engineer/',
 'AI Engineer, Machine Learning Engineer',
 ARRAY['Machine Learning Fundamentals', 'Generative AI & Large Language Models']),

('Certified Kubernetes Administrator (CKA)',
 'Demonstrates skills in Kubernetes cluster administration',
 'Cloud Native Computing Foundation',
 'https://www.cncf.io/certification/cka/',
 'DevOps Engineer, Cloud Engineer',
 ARRAY['Data Engineering Essentials', 'Full Stack Web Development']),

('Tableau Desktop Specialist',
 'Validates foundational skills in visual analytics',
 'Tableau',
 'https://www.tableau.com/learn/certification/desktop-specialist',
 'Data Analyst, Business Intelligence Analyst',
 ARRAY['Data Analysis with SQL & Tableau']),

('Google UX Design Professional Certificate',
 'Comprehensive UX design skills for digital products',
 'Google',
 'https://grow.google/uxdesign/',
 'UX Designer, Product Designer, UI Developer',
 ARRAY['UI/UX Design Masterclass', 'Full Stack Web Development']);

-- 4. NOTIFICATIONS - Various notification types for students
-- These will be created dynamically based on actual student IDs

-- 5. LEARNING PATHWAYS - Career-focused learning paths
-- These will be created for each student with their specific goals

-- 6. CONTENT RECOMMENDATIONS - AI-powered course recommendations
-- These will be generated based on student progress and interests

-- 7. CAREER RECOMMENDATIONS - Personalized career guidance
-- These will be tailored to each student's learning path

-- 8. AUTO QUIZ GENERATION - Track AI-generated quizzes
-- These records track when quizzes are automatically generated from lessons

-- Note: The actual INSERT statements with student IDs will be generated dynamically
