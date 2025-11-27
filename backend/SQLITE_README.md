# Learning Platform - SQLite Backend

A complete Python + FastAPI + SQLite backend for the Learning Management System.

## Features

- **SQLite Database** - Zero configuration, file-based database
- **FastAPI Framework** - Modern, fast Python web framework
- **Async Support** - Full async/await support with SQLAlchemy
- **RESTful API** - Complete REST endpoints for all features
- **Auto Documentation** - Interactive API docs at `/docs`

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Seed the Database

```bash
python -m app.seed_data
```

This will create:
- 5 sample courses (Python, ML, React, Database, Algorithms)
- 10 course modules with video links
- 3 career paths
- SQLite database file: `learning_platform.db`

### 3. Start the Server

```bash
uvicorn app.main_sqlite:app --reload
```

The API will be available at:
- API: http://localhost:8000
- Interactive Docs: http://localhost:8000/docs
- Alternative Docs: http://localhost:8000/redoc

## API Endpoints

### Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `GET /api/users/{user_id}` - Get user details
- `GET /api/users/` - Get all users

### Courses
- `GET /api/courses/` - Get all courses
- `GET /api/courses/{course_id}` - Get course details
- `GET /api/courses/{course_id}/modules` - Get course modules
- `GET /api/courses/category/{category}` - Filter by category
- `POST /api/courses/` - Create course
- `POST /api/courses/modules` - Create module

### Enrollments
- `POST /api/enrollments/` - Enroll in course
- `GET /api/enrollments/user/{user_id}` - Get user enrollments
- `PUT /api/enrollments/{enrollment_id}/progress` - Update progress

### AI Features
- `POST /api/ai/tutor` - Ask AI tutor
- `POST /api/ai/generate-quiz` - Generate quiz
- `GET /api/ai/quizzes/{course_id}` - Get course quizzes
- `POST /api/ai/quiz-attempt` - Submit quiz answers

### Dashboard
- `GET /api/dashboard/{user_id}/stats` - Get dashboard statistics
- `GET /api/dashboard/{user_id}/study-activity` - Get study activity

## Example Requests

### Register User
```bash
curl -X POST "http://localhost:8000/api/users/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "full_name": "John Doe",
    "password": "password123",
    "program": "Computer Science",
    "year": 2
  }'
```

### Login
```bash
curl -X POST "http://localhost:8000/api/users/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "password123"
  }'
```

### Get All Courses
```bash
curl "http://localhost:8000/api/courses/"
```

### Enroll in Course
```bash
curl -X POST "http://localhost:8000/api/enrollments/" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "course_id": 1
  }'
```

### Ask AI Tutor
```bash
curl -X POST "http://localhost:8000/api/ai/tutor?user_id=1" \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What is Python?",
    "course_id": 1
  }'
```

### Generate Quiz
```bash
curl -X POST "http://localhost:8000/api/ai/generate-quiz?user_id=1" \
  -H "Content-Type: application/json" \
  -d '{
    "course_id": 1,
    "topic": "Python Basics",
    "difficulty": "easy",
    "num_questions": 5
  }'
```

### Get Dashboard Stats
```bash
curl "http://localhost:8000/api/dashboard/1/stats"
```

## Database Schema

### Tables
- **users** - User accounts and profiles
- **courses** - Course catalog
- **course_modules** - Course content modules
- **enrollments** - User course enrollments
- **quizzes** - Generated quizzes
- **quiz_attempts** - Quiz submission history
- **ai_tutor_sessions** - AI conversation history
- **career_paths** - Career path recommendations

## Development

### VS Code Setup

1. Install Python extension
2. Install SQLite Viewer extension
3. Open `learning_platform.db` with SQLite Viewer to inspect data

### View Database
```bash
# Using sqlite3 CLI
sqlite3 learning_platform.db
.tables
.schema users
SELECT * FROM courses;
```

### Reset Database
```bash
# Delete database file
rm learning_platform.db

# Re-seed
python -m app.seed_data
```

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main_sqlite.py       # Main FastAPI app
│   ├── database.py           # Database configuration
│   ├── models_sqlite.py      # SQLAlchemy models
│   ├── schemas.py            # Pydantic schemas
│   ├── seed_data.py          # Database seeding script
│   └── routers/
│       ├── users.py          # User endpoints
│       ├── courses_sqlite.py # Course endpoints
│       ├── enrollments.py    # Enrollment endpoints
│       ├── ai_sqlite.py      # AI endpoints
│       └── dashboard_sqlite.py # Dashboard endpoints
├── requirements.txt
└── learning_platform.db      # SQLite database (created on first run)
```

## Migration to PostgreSQL/Supabase

When ready for production, simply change the database URL:

```python
# From SQLite:
SQLALCHEMY_DATABASE_URL = "sqlite+aiosqlite:///./learning_platform.db"

# To PostgreSQL:
SQLALCHEMY_DATABASE_URL = "postgresql+asyncpg://user:pass@host/db"
```

All models and queries will work without changes!

## Troubleshooting

**Module not found error:**
```bash
# Make sure you're in the backend directory
cd backend
python -m app.seed_data
```

**Port already in use:**
```bash
# Use a different port
uvicorn app.main_sqlite:app --reload --port 8001
```

**Database locked error:**
```bash
# Close any open connections
# Restart the server
```

## Testing with Frontend

Update your React `.env` file:

```env
VITE_API_URL=http://localhost:8000
```

Then update API calls to use local backend instead of Supabase.

## Next Steps

1. Add authentication middleware with JWT tokens
2. Implement real AI integration (OpenAI, Anthropic)
3. Add file upload for course materials
4. Implement real-time features with WebSockets
5. Add email notifications
6. Deploy to production with PostgreSQL
