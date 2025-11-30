# Learning Platform - Complete Datasets

## Overview
This folder contains comprehensive, cleaned datasets for the intelligent learning platform. All data is realistic, properly formatted, and ready for production use.

## Dataset Summary

| Dataset | Records | Description |
|---------|---------|-------------|
| **Profiles** | 1,200 | User accounts (1000 students, 150 faculty, 50 admins) |
| **Courses** | 50 | Comprehensive courses across tech domains |
| **Course Modules** | 500 | Learning modules with video content (10 per course) |
| **Enrollments** | ~1,500 | Student course enrollments with progress tracking |
| **Quizzes** | 200 | Assessment quizzes (4 per course) |
| **Quiz Results** | ~1,200 | Student quiz attempts and scores |
| **AI Tutor Sessions** | ~1,000 | AI tutoring conversations |
| **Notifications** | 1,500 | System notifications for users |
| **Certifications** | ~500 | Course completion certificates |
| **Learning Pathways** | 800 | Personalized learning paths |
| **Content Recommendations** | ~1,200 | AI-powered course suggestions |
| **Career Recommendations** | ~1,000 | Job and career path recommendations |
| **TOTAL** | **~8,650** | **Complete platform data** |

## Data Quality Features

✅ **Cleaned Data**: No duplicates, null values handled properly
✅ **Realistic**: Names, emails, dates, and relationships make sense
✅ **Consistent**: Foreign keys maintained, referential integrity preserved
✅ **Diverse**: Wide variety of courses, users, and interactions
✅ **Production-Ready**: Can be used directly in live applications

## Quick Start

### Option 1: Apply All Datasets at Once (Recommended)

```bash
# Navigate to the datasets folder
cd datasets

# Apply all datasets in order
psql -U your_username -d your_database -f 00_APPLY_ALL_DATASETS.sql
```

### Option 2: Apply Individual Datasets

```bash
# Apply in this order to maintain referential integrity
psql -U your_username -d your_database -f 01_profiles_dataset.sql
psql -U your_username -d your_database -f 02_courses_dataset.sql
psql -U your_username -d your_database -f 03_course_modules_dataset.sql
# ... and so on
```

### Option 3: Using Supabase

1. Open your Supabase Dashboard
2. Go to SQL Editor
3. Copy and paste the content of each file in order
4. Execute each script

## Dataset Details

### 1. Profiles (01_profiles_dataset.sql)
- **1,200 users** with realistic names and emails
- **Roles**: 1000 students, 150 faculty, 50 admins
- **Status**: Active (85%), Inactive (10%), Suspended (5%)
- **Registration dates**: Spread over 2 years

### 2. Courses (02_courses_dataset.sql)
- **50 courses** across multiple categories
- **Categories**:
  - Machine Learning (10)
  - Programming (10)
  - Web Development (10)
  - Data Science (8)
  - Cloud & DevOps (6)
  - Specialized Topics (6)
- **Levels**: Beginner, Intermediate, Advanced
- **Duration**: 6-16 weeks

### 3. Course Modules (03_course_modules_dataset.sql)
- **500 modules** (10 per course)
- **YouTube video links** for each module
- **Structured content**: Introduction → Advanced → Project
- **Duration**: 20-60 minutes per module

### 4. Enrollments (04_enrollments_dataset.sql)
- **~1,500 enrollments** with realistic distribution
- **Status**: Active (70%), Completed (20%), Dropped (10%)
- **Progress tracking**: 0-100%
- **Grades**: 60-100 for completed courses

### 5. Quizzes (05_quizzes_dataset.sql)
- **200 quizzes** (4 per course)
- **Question types**: Multiple choice, True/False, Short answer, Essay
- **Difficulty levels**: Easy, Medium, Hard
- **Time limits**: 30-75 minutes
- **Passing scores**: 70-78%

### 6. Quiz Results (06_quiz_results_dataset.sql)
- **~1,200 quiz attempts**
- **Realistic score distribution**: Bell curve around 75%
- **Pass/Fail tracking**
- **Time taken**: 60-100% of time limit
- **Answer storage**: JSONB format

### 7. AI Tutor Sessions (07_ai_tutor_sessions_dataset.sql)
- **~1,000 tutoring sessions**
- **Conversation history**: Questions and AI responses
- **Topics covered**: Course-specific questions
- **Timestamps**: Realistic session dates

### 8. Notifications (08_notifications_dataset.sql)
- **1,500 notifications**
- **Types**: Enrollment, Quiz, Grade, Achievement, Reminder
- **Read status**: 60% read, 40% unread
- **Date range**: Last 90 days

### 9. Certifications (09_certifications_dataset.sql)
- **~500 certificates**
- **Issued to**: Students who completed courses with grade ≥70
- **Certificate URLs**: Unique for each student
- **Verification codes**: Secure alphanumeric codes

### 10. Learning Pathways (10_learning_pathways_dataset.sql)
- **800 personalized paths**
- **10 pathway types**: Full Stack, Data Science, ML Engineer, etc.
- **Course bundles**: 3-6 courses per pathway
- **Progress tracking**: 0-100%
- **Target dates**: 3-12 months

### 11. Content Recommendations (11_content_recommendations_dataset.sql)
- **~1,200 recommendations**
- **AI-powered**: Based on interests and learning patterns
- **Confidence scores**: 0.6-1.0
- **Reasons**: Personalized explanation for each recommendation

### 12. Career Recommendations (12_career_recommendations_dataset.sql)
- **~1,000 job recommendations**
- **20 job titles**: ML Engineer, Full Stack Dev, Data Scientist, etc.
- **25 companies**: Google, Microsoft, Amazon, Meta, etc.
- **Salary ranges**: $70K-$200K+
- **Match scores**: 0.65-1.0
- **Required skills**: JSONB array

## Data Relationships

```
profiles (users)
  ├── enrollments → courses
  │     ├── quiz_results → quizzes
  │     └── certifications
  ├── ai_tutor_sessions → courses
  ├── notifications
  ├── learning_pathways
  ├── content_recommendations → courses
  └── career_recommendations

courses
  ├── course_modules (videos)
  ├── quizzes
  └── instructor → profiles (faculty)
```

## Sample Queries

### Get student enrollment statistics
```sql
SELECT
  p.full_name,
  COUNT(e.id) as total_enrollments,
  AVG(e.progress) as avg_progress,
  COUNT(CASE WHEN e.status = 'completed' THEN 1 END) as completed_courses
FROM profiles p
LEFT JOIN enrollments e ON p.id = e.student_id
WHERE p.role = 'student'
GROUP BY p.id, p.full_name
ORDER BY completed_courses DESC
LIMIT 10;
```

### Get course popularity
```sql
SELECT
  c.title,
  c.category,
  COUNT(e.id) as total_students,
  AVG(e.progress) as avg_progress,
  AVG(e.grade) as avg_grade
FROM courses c
LEFT JOIN enrollments e ON c.id = e.course_id
GROUP BY c.id, c.title, c.category
ORDER BY total_students DESC;
```

### Get AI tutor usage
```sql
SELECT
  DATE_TRUNC('week', session_start) as week,
  COUNT(*) as total_sessions,
  COUNT(DISTINCT student_id) as unique_students
FROM ai_tutor_sessions
GROUP BY week
ORDER BY week DESC;
```

## Notes

- All timestamps are in UTC
- All IDs use UUID format
- JSON/JSONB fields are properly formatted
- No circular dependencies
- Foreign keys properly maintained
- Indexes automatically created on primary keys

## Support

If you encounter any issues with the datasets:
1. Ensure all tables exist in your database
2. Check that you're running scripts in order (profiles → courses → modules → etc.)
3. Verify no data exists that might conflict (consider truncating tables first)

## Data Generation Method

All data was generated using:
- PostgreSQL procedural functions (PL/pgSQL)
- Realistic distributions and patterns
- Random but consistent data generation
- Proper foreign key relationships
- Production-quality standards

---

**Ready to use!** Simply run `00_APPLY_ALL_DATASETS.sql` and your database will be fully populated with realistic, production-ready data.
