# Quick Start Guide - Apply Datasets

## 🚀 Three Ways to Load Your Data

### Method 1: Supabase Dashboard (Easiest)

1. Open your Supabase project dashboard
2. Navigate to **SQL Editor** (left sidebar)
3. Copy the content from each file in order:
   - `01_profiles_dataset.sql`
   - `02_courses_dataset.sql`
   - `03_course_modules_dataset.sql`
   - ... and so on through `12_career_recommendations_dataset.sql`
4. Paste and execute each script
5. Done! Check your database tables

### Method 2: Command Line (PostgreSQL)

```bash
# Navigate to project directory
cd /path/to/project/datasets

# Apply all datasets at once
psql -h your-host -U postgres -d your-database -f 00_APPLY_ALL_DATASETS.sql

# Or apply individually
psql -h your-host -U postgres -d your-database -f 01_profiles_dataset.sql
psql -h your-host -U postgres -d your-database -f 02_courses_dataset.sql
# ... continue for all files
```

### Method 3: Using Supabase CLI

```bash
# Make sure you're in the project directory
cd /path/to/project

# Apply datasets
supabase db execute -f datasets/00_APPLY_ALL_DATASETS.sql
```

## 📊 What You'll Get

After running the scripts, your database will have:

| Table | Records | What It Contains |
|-------|---------|------------------|
| `profiles` | 1,200 | Users (students, faculty, admins) |
| `courses` | 50 | Tech courses across categories |
| `course_modules` | 500 | Video lessons (10 per course) |
| `enrollments` | ~1,500 | Student course registrations |
| `quizzes` | 200 | Assessment quizzes |
| `quiz_results` | ~1,200 | Student quiz attempts |
| `ai_tutor_sessions` | ~1,000 | AI tutoring conversations |
| `notifications` | 1,500 | User notifications |
| `certifications` | ~500 | Completion certificates |
| `learning_pathways` | 800 | Personalized learning paths |
| `content_recommendations` | ~1,200 | Course suggestions |
| `career_recommendations` | ~1,000 | Job recommendations |

**Total: ~8,650 rows of clean, realistic data!**

## ✅ Verify Data Loaded Correctly

Run these queries in Supabase SQL Editor:

```sql
-- Check all tables have data
SELECT
  'profiles' as table_name,
  COUNT(*) as records
FROM profiles
UNION ALL
SELECT 'courses', COUNT(*) FROM courses
UNION ALL
SELECT 'course_modules', COUNT(*) FROM course_modules
UNION ALL
SELECT 'enrollments', COUNT(*) FROM enrollments
UNION ALL
SELECT 'quizzes', COUNT(*) FROM quizzes
UNION ALL
SELECT 'quiz_results', COUNT(*) FROM quiz_results
UNION ALL
SELECT 'ai_tutor_sessions', COUNT(*) FROM ai_tutor_sessions
UNION ALL
SELECT 'notifications', COUNT(*) FROM notifications
UNION ALL
SELECT 'certifications', COUNT(*) FROM certifications
UNION ALL
SELECT 'learning_pathways', COUNT(*) FROM learning_pathways
UNION ALL
SELECT 'content_recommendations', COUNT(*) FROM content_recommendations
UNION ALL
SELECT 'career_recommendations', COUNT(*) FROM career_recommendations;
```

Expected output:
```
table_name               | records
-------------------------|---------
profiles                 | 1200
courses                  | 50
course_modules           | 500
enrollments              | ~1500
quizzes                  | 200
quiz_results             | ~1200
ai_tutor_sessions        | ~1000
notifications            | 1500
certifications           | ~500
learning_pathways        | 800
content_recommendations  | ~1200
career_recommendations   | ~1000
```

## 🔍 Sample Data Queries

### Get Top Students
```sql
SELECT
  full_name,
  email,
  registration_date
FROM profiles
WHERE role = 'student'
ORDER BY registration_date
LIMIT 10;
```

### Get Popular Courses
```sql
SELECT
  c.title,
  c.category,
  COUNT(e.id) as enrollments
FROM courses c
LEFT JOIN enrollments e ON c.id = e.course_id
GROUP BY c.id, c.title, c.category
ORDER BY enrollments DESC
LIMIT 10;
```

### Get Recent AI Tutor Activity
```sql
SELECT
  p.full_name,
  c.title as course,
  a.topic_covered,
  a.session_start
FROM ai_tutor_sessions a
JOIN profiles p ON p.id = a.student_id
JOIN courses c ON c.id = a.course_id
ORDER BY a.session_start DESC
LIMIT 10;
```

## 🛠️ Troubleshooting

### Issue: "Table doesn't exist"
**Solution**: Make sure your database schema is created. Run migrations first:
```bash
# Check your migrations in supabase/migrations/
supabase db push
```

### Issue: "Foreign key constraint violation"
**Solution**: Run scripts in order (profiles → courses → modules → enrollments, etc.)

### Issue: "Duplicate key value violates unique constraint"
**Solution**: Tables might already have data. Clear them first:
```sql
-- CAREFUL: This deletes all data!
TRUNCATE TABLE
  career_recommendations,
  content_recommendations,
  learning_pathways,
  certifications,
  notifications,
  ai_tutor_sessions,
  quiz_results,
  quizzes,
  course_modules,
  enrollments,
  courses,
  profiles
CASCADE;
```

## 📝 Notes

- **Order matters**: Always apply in numerical order (01, 02, 03...)
- **Takes 2-3 minutes**: Be patient, generating 8,650+ rows takes time
- **Safe to re-run**: Scripts use random data, so re-running creates different data
- **Production-ready**: All data is cleaned and realistic

## 🎉 You're Done!

Your learning platform now has a complete dataset ready for:
- Testing features
- Development
- Demos
- Analytics
- Production use

Need help? Check `README.md` for detailed documentation.
