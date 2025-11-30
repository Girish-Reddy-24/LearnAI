-- Master Script to Apply All Datasets
-- This will populate the database with comprehensive, cleaned datasets
-- Total: ~8000+ rows across all tables

-- IMPORTANT: Run this script in order
-- Estimated time: 2-3 minutes

\echo '=================================================='
\echo 'STARTING DATA POPULATION'
\echo 'This will create realistic data for all tables'
\echo '=================================================='
\echo ''

-- STEP 1: Profiles (1200 users)
\echo 'Step 1/12: Creating 1200 user profiles (students, faculty, admins)...'
\i 01_profiles_dataset.sql

-- STEP 2: Courses (50 courses)
\echo 'Step 2/12: Creating 50 comprehensive courses...'
\i 02_courses_dataset.sql

-- STEP 3: Course Modules (500 modules)
\echo 'Step 3/12: Creating 500 course modules with video links...'
\i 03_course_modules_dataset.sql

-- STEP 4: Enrollments (1500 enrollments)
\echo 'Step 4/12: Creating 1500 course enrollments...'
\i 04_enrollments_dataset.sql

-- STEP 5: Quizzes (200 quizzes)
\echo 'Step 5/12: Creating 200 assessment quizzes...'
\i 05_quizzes_dataset.sql

-- STEP 6: Quiz Results (1200 attempts)
\echo 'Step 6/12: Creating 1200 quiz attempt records...'
\i 06_quiz_results_dataset.sql

-- STEP 7: AI Tutor Sessions (1000 sessions)
\echo 'Step 7/12: Creating 1000 AI tutoring sessions...'
\i 07_ai_tutor_sessions_dataset.sql

-- STEP 8: Notifications (1500 notifications)
\echo 'Step 8/12: Creating 1500 user notifications...'
\i 08_notifications_dataset.sql

-- STEP 9: Certifications (500 certificates)
\echo 'Step 9/12: Creating 500 course completion certificates...'
\i 09_certifications_dataset.sql

-- STEP 10: Learning Pathways (800 pathways)
\echo 'Step 10/12: Creating 800 personalized learning pathways...'
\i 10_learning_pathways_dataset.sql

-- STEP 11: Content Recommendations (1200 recommendations)
\echo 'Step 11/12: Creating 1200 course recommendations...'
\i 11_content_recommendations_dataset.sql

-- STEP 12: Career Recommendations (1000 recommendations)
\echo 'Step 12/12: Creating 1000 career path recommendations...'
\i 12_career_recommendations_dataset.sql

\echo ''
\echo '=================================================='
\echo 'DATA POPULATION COMPLETE!'
\echo '=================================================='
\echo ''
\echo 'Summary of created records:'
\echo '  - Profiles: 1,200 (1000 students, 150 faculty, 50 admins)'
\echo '  - Courses: 50'
\echo '  - Course Modules: 500'
\echo '  - Enrollments: ~1,500'
\echo '  - Quizzes: 200'
\echo '  - Quiz Results: ~1,200'
\echo '  - AI Tutor Sessions: ~1,000'
\echo '  - Notifications: 1,500'
\echo '  - Certifications: ~500'
\echo '  - Learning Pathways: 800'
\echo '  - Content Recommendations: ~1,200'
\echo '  - Career Recommendations: ~1,000'
\echo ''
\echo 'Total: ~8,650 records'
\echo '=================================================='
