# Quick Start Guide - SQLite Backend

## Option 1: Automatic Setup (Recommended)

```bash
cd backend
./start.sh
```

This script will:
1. Create a virtual environment
2. Install all dependencies
3. Seed the database with sample data
4. Start the FastAPI server

## Option 2: Manual Setup

### Step 1: Create Virtual Environment

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### Step 2: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 3: Seed Database

```bash
python -m app.seed_data
```

Expected output:
```
Initializing database...
Creating sample courses...
Created 5 courses
Creating course modules...
Created 10 course modules
Creating career paths...
Created 3 career paths

✅ Database seeded successfully!
```

### Step 4: Start Server

```bash
uvicorn app.main_sqlite:app --reload
```

### Step 5: Test the API

Open your browser to:
- **API Docs**: http://localhost:8000/docs
- **API Root**: http://localhost:8000

## Testing Endpoints

### 1. Register a User

```bash
curl -X POST "http://localhost:8000/api/users/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "full_name": "Test User",
    "password": "password123"
  }'
```

Response:
```json
{
  "id": 1,
  "email": "test@example.com",
  "full_name": "Test User",
  "program": "Computer Science",
  "year": 1,
  "gpa": 0.0,
  "created_at": "2024-11-27T..."
}
```

### 2. Login

```bash
curl -X POST "http://localhost:8000/api/users/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Response:
```json
{
  "user_id": 1,
  "email": "test@example.com",
  "full_name": "Test User",
  "message": "Login successful"
}
```

### 3. Get All Courses

```bash
curl "http://localhost:8000/api/courses/"
```

Response: Array of 5 courses (Python, ML, React, Database, Algorithms)

### 4. Get Course Modules

```bash
curl "http://localhost:8000/api/courses/1/modules"
```

Response: Array of modules for Python course with video URLs

### 5. Enroll in Course

```bash
curl -X POST "http://localhost:8000/api/enrollments/" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "course_id": 1
  }'
```

### 6. Ask AI Tutor

```bash
curl -X POST "http://localhost:8000/api/ai/tutor?user_id=1" \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What is Python?",
    "course_id": 1
  }'
```

### 7. Get Dashboard Stats

```bash
curl "http://localhost:8000/api/dashboard/1/stats"
```

## Using Interactive API Docs

1. Open http://localhost:8000/docs
2. Click on any endpoint
3. Click "Try it out"
4. Fill in parameters
5. Click "Execute"
6. View the response

## VS Code Setup

### Recommended Extensions

1. **Python** by Microsoft
2. **SQLite Viewer** by alexcvzz
3. **REST Client** by Huachao Mao
4. **Thunder Client** by Ranga Vadhineni (alternative to Postman)

### View Database

1. Install SQLite Viewer extension
2. Open `learning_platform.db` file
3. Browse tables and data visually

### Debug Configuration

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Python: FastAPI",
      "type": "python",
      "request": "launch",
      "module": "uvicorn",
      "args": [
        "app.main_sqlite:app",
        "--reload"
      ],
      "jinja": true,
      "justMyCode": true
    }
  ]
}
```

Press F5 to start debugging!

## Database Location

The SQLite database file is created at:
```
backend/learning_platform.db
```

You can:
- Open it with any SQLite client
- View it in VS Code with SQLite Viewer extension
- Query it with `sqlite3` command line tool

## Sample Data Included

After seeding, you'll have:

**5 Courses:**
1. Introduction to Python Programming
2. Advanced Machine Learning
3. Web Development with React
4. Database Design and SQL
5. Data Structures and Algorithms

**10 Course Modules:**
- Each with YouTube video links
- Descriptions and content
- Duration information

**3 Career Paths:**
1. Software Engineer
2. Machine Learning Engineer
3. Full Stack Developer

## Troubleshooting

### Port Already in Use

```bash
# Use a different port
uvicorn app.main_sqlite:app --reload --port 8001
```

### Module Not Found

```bash
# Make sure virtual environment is activated
source venv/bin/activate

# Reinstall dependencies
pip install -r requirements.txt
```

### Database Locked

```bash
# Stop the server
# Delete the database
rm learning_platform.db

# Re-seed
python -m app.seed_data
```

### Python Version Issues

Requires Python 3.8+. Check version:
```bash
python3 --version
```

## Next Steps

1. ✅ Backend is running on http://localhost:8000
2. 📝 Test all endpoints in `/docs`
3. 🔗 Connect your React frontend to this API
4. 🚀 Start building features!

## Connecting React Frontend

Update your React `.env` file:

```env
VITE_API_URL=http://localhost:8000
```

Update API service to point to local backend:

```typescript
// src/lib/api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
```

## API Base URL

All endpoints start with:
```
http://localhost:8000
```

Full endpoint example:
```
http://localhost:8000/api/courses/
```

## Support

Need help? Check:
1. Interactive docs at `/docs`
2. Server logs in terminal
3. SQLite database contents
4. FastAPI documentation: https://fastapi.tiangolo.com/
