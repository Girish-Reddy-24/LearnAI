# AI-Integrated Learning Platform - Backend API

Backend REST API for an AI-powered learning platform designed for Master's students at Silver Leaf University.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Running the Server](#running-the-server)
- [API Documentation](#api-documentation)
- [Endpoints](#endpoints)
- [Data Models](#data-models)
- [AI Integration](#ai-integration)
- [Development](#development)
- [Production Deployment](#production-deployment)

## 🎯 Overview

This is the backend API for a Master's research project: **"AI-Integrated Learning Platform for Master's Students at Silver Leaf University"**

The backend provides:
- Student profile and progress management
- AI-powered tutoring and assistance
- Personalized quiz generation
- Research project guidance
- Career roadmap recommendations
- Learning analytics and dashboards

## ✨ Features

### Core Features
- ✅ Student profile management
- ✅ Course enrollment tracking
- ✅ Quiz results and analytics
- ✅ Study activity monitoring
- ✅ Personalized recommendations

### AI-Powered Features
- 🤖 **AI Tutor**: Intelligent responses to student questions
- 📝 **Quiz Generator**: Create custom quizzes on any topic
- 🔬 **Research Assistant**: Help with thesis structure, literature reviews, research questions
- 🎯 **Career Recommendations**: Personalized career path guidance

### Analytics & Insights
- 📊 Dashboard with key metrics
- 📈 Study activity tracking
- 🎓 Course progress visualization
- 📉 Performance analytics

## 🛠️ Tech Stack

- **Framework**: FastAPI 0.109.0
- **Language**: Python 3.10+
- **Data Validation**: Pydantic 2.5.3
- **Server**: Uvicorn
- **Database**: In-memory (Python dictionaries)
  - *Can be replaced with PostgreSQL, MySQL, or Supabase*

## 📁 Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app entry point
│   ├── models.py            # Pydantic request/response models
│   ├── db.py                # In-memory database & seed data
│   ├── ai_service.py        # AI service logic (placeholder)
│   └── routers/
│       ├── __init__.py
│       ├── students.py      # Student endpoints
│       ├── dashboard.py     # Dashboard endpoints
│       ├── courses.py       # Course endpoints
│       ├── ai.py            # AI feature endpoints
│       └── careers.py       # Career roadmap endpoints
├── requirements.txt         # Python dependencies
└── README.md               # This file
```

## 🚀 Installation

### Prerequisites

- Python 3.10 or higher
- pip (Python package manager)

### Step 1: Clone or navigate to the backend directory

```bash
cd backend
```

### Step 2: Create a virtual environment (recommended)

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate

# On Windows:
venv\Scripts\activate
```

### Step 3: Install dependencies

```bash
pip install -r requirements.txt
```

## ▶️ Running the Server

### Method 1: Using Uvicorn directly (recommended)

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Method 2: Using Python directly

```bash
python -m app.main
```

### Method 3: Using the main file

```bash
cd app
python main.py
```

### Server Information

- **API Base URL**: http://localhost:8000
- **Interactive Docs (Swagger)**: http://localhost:8000/docs
- **Alternative Docs (ReDoc)**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

## 📚 API Documentation

Once the server is running, visit:

- **Swagger UI**: http://localhost:8000/docs
  - Interactive API documentation
  - Test endpoints directly in the browser
  - View request/response schemas

- **ReDoc**: http://localhost:8000/redoc
  - Clean, readable API documentation
  - Better for reference and sharing

## 🔌 Endpoints

### Students

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/students/{student_id}` | Get student profile |
| GET | `/students/{student_id}/enrollments` | Get student enrollments |
| GET | `/students/{student_id}/quiz-results` | Get quiz results |
| GET | `/students/{student_id}/recommendations` | Get recommendations |

### Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard/{student_id}` | Get complete dashboard data |

### Courses

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/courses` | Get all courses |
| GET | `/courses/{course_id}` | Get course details |

### AI Features

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/ai/tutor` | Ask AI tutor a question |
| POST | `/ai/quiz-generator` | Generate quiz questions |
| POST | `/ai/research-assistant` | Get research assistance |

### Careers

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/careers` | Get all career paths |
| GET | `/careers/{career_name}` | Get career path details |
| GET | `/careers/student/{student_id}/roadmap` | Get personalized roadmap |

### System

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API welcome message |
| GET | `/health` | Health check |

## 📊 Data Models

### Sample Data Available

The backend comes pre-populated with:
- **5 Students** (Alice, Bob, Carol, David, Emma)
- **10 Courses** (Python, ML, Deep Learning, etc.)
- **8+ Enrollments** with progress tracking
- **Quiz results** and study activities
- **3 Career paths** (Data Scientist, ML Engineer, Full Stack Developer)

### Default Test Student

Use `student_id=1` (Alice Johnson) to test all endpoints:

```bash
# Get student profile
curl http://localhost:8000/students/1

# Get dashboard
curl http://localhost:8000/dashboard/1

# Get enrollments
curl http://localhost:8000/students/1/enrollments
```

## 🤖 AI Integration

### Current Implementation

AI features currently use **intelligent mock responses** based on keywords and patterns. This allows the backend to function fully without requiring external API keys.

### How AI Works Now

1. **AI Tutor**: Detects keywords in questions and returns detailed, relevant responses
2. **Quiz Generator**: Returns pre-defined quality questions based on topic
3. **Research Assistant**: Provides structured guidance based on help type

### Connecting to Google AI Studio / Gemini

To integrate real AI, update `app/ai_service.py`:

```python
# Install the package
pip install google-generativeai

# Add your API key
import google.generativeai as genai
genai.configure(api_key="YOUR_API_KEY")

# Replace mock functions with real AI calls
async def call_google_ai_studio(prompt: str) -> str:
    model = genai.GenerativeModel('gemini-pro')
    response = model.generate_content(prompt)
    return response.text
```

### Example API Calls

#### AI Tutor

```bash
curl -X POST http://localhost:8000/ai/tutor \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": 1,
    "message": "Explain how neural networks work"
  }'
```

#### Quiz Generator

```bash
curl -X POST http://localhost:8000/ai/quiz-generator \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": 1,
    "topic": "Python Programming",
    "difficulty": "medium",
    "num_questions": 5
  }'
```

#### Research Assistant

```bash
curl -X POST http://localhost:8000/ai/research-assistant \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": 1,
    "research_description": "I want to research AI in education",
    "help_type": "research_question"
  }'
```

## 💻 Development

### Code Style

- Follow PEP 8 style guide
- Use type hints for all functions
- Add docstrings to all public functions
- Keep functions focused and single-purpose

### Adding New Endpoints

1. Create/update router in `app/routers/`
2. Define Pydantic models in `app/models.py`
3. Add database functions in `app/db.py` if needed
4. Include router in `app/main.py`

### Testing Endpoints

Use the interactive Swagger UI at http://localhost:8000/docs to:
- Test all endpoints
- View request/response schemas
- See example values
- Debug responses

### Logging

The server logs all requests. Watch the console for:
- Incoming requests
- Response status codes
- Errors and exceptions
- Database operations

## 🚢 Production Deployment

### Environment Variables

Create a `.env` file:

```env
# Server
HOST=0.0.0.0
PORT=8000
ENVIRONMENT=production

# Database (when you switch from in-memory)
DATABASE_URL=postgresql://user:pass@localhost/dbname

# AI Service
GOOGLE_AI_API_KEY=your_api_key_here

# CORS (update with your frontend URL)
ALLOWED_ORIGINS=https://yourdomain.com
```

### Database Migration

To use a real database instead of in-memory:

1. **Install SQLAlchemy**:
   ```bash
   pip install sqlalchemy psycopg2-binary
   ```

2. **Replace `db.py`** with SQLAlchemy models and connections

3. **Create migration scripts** using Alembic:
   ```bash
   pip install alembic
   alembic init migrations
   ```

### Deploy Options

#### Option 1: Traditional Server (VM/VPS)

```bash
# Install dependencies
pip install -r requirements.txt

# Run with Gunicorn
pip install gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

#### Option 2: Docker

```dockerfile
FROM python:3.10-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

```bash
docker build -t learning-platform-api .
docker run -p 8000:8000 learning-platform-api
```

#### Option 3: Cloud Platforms

- **Heroku**: Use Procfile
- **Railway**: Auto-detects Python
- **AWS**: Use Elastic Beanstalk or Lambda
- **Google Cloud**: Use Cloud Run
- **Azure**: Use App Service

### Connecting to Supabase

To use Supabase as your database:

1. **Install Supabase client**:
   ```bash
   pip install supabase
   ```

2. **Update `db.py`** to use Supabase:
   ```python
   from supabase import create_client, Client

   supabase: Client = create_client(
       os.getenv("SUPABASE_URL"),
       os.getenv("SUPABASE_KEY")
   )
   ```

3. **Migrate data models** to Supabase tables

## 🔒 Security Considerations

For production:

1. **Add Authentication**: Implement JWT or OAuth2
2. **Rate Limiting**: Prevent abuse
3. **Input Validation**: Already handled by Pydantic
4. **HTTPS Only**: Use SSL certificates
5. **Environment Variables**: Never commit secrets
6. **CORS**: Restrict to specific origins
7. **API Keys**: Secure AI service credentials

## 📝 License

This project is part of academic research at Silver Leaf University.

## 👥 Contributors

- Master's Research Project
- Silver Leaf University
- Department of Information Systems

## 🆘 Support

For issues or questions:
1. Check the interactive docs at `/docs`
2. Review this README
3. Examine example responses in Swagger UI
4. Check server logs for errors

---

**Built with ❤️ for Master's students at Silver Leaf University**
