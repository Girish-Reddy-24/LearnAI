# Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Install Dependencies

```bash
cd backend
pip install fastapi uvicorn pydantic pydantic-settings python-dateutil
```

Or use the requirements file:
```bash
pip install -r requirements.txt
```

### Step 2: Run the Server

```bash
uvicorn app.main:app --reload
```

You should see:
```
==================================================
🚀 Starting AI-Integrated Learning Platform API
==================================================
✓ Database initialized with:
  - 5 students
  - 10 courses
  - 8 enrollments
  - 6 quiz results
  - 21 study activities
  - 4 recommendations
  - 3 career paths
✅ Server ready!
==================================================

INFO:     Uvicorn running on http://127.0.0.1:8000
```

### Step 3: Test the API

Open your browser to:
- **Interactive Docs**: http://localhost:8000/docs
- **API Documentation**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

## 📝 Quick Test Commands

### Test Health Check
```bash
curl http://localhost:8000/health
```

### Get Student Data
```bash
curl http://localhost:8000/students/1
```

### Get Dashboard
```bash
curl http://localhost:8000/dashboard/1
```

### Ask AI Tutor
```bash
curl -X POST http://localhost:8000/ai/tutor \
  -H "Content-Type: application/json" \
  -d '{"student_id": 1, "message": "Explain Python"}'
```

## 🎯 Next Steps

1. **Explore the API**: Use http://localhost:8000/docs
2. **Read the README**: Check `README.md` for detailed documentation
3. **Try Example Requests**: See `example_requests.md`
4. **Integrate with Frontend**: Connect to your React/Next.js app
5. **Add Real AI**: Connect to Google AI Studio (see README)

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Use a different port
uvicorn app.main:app --reload --port 8001
```

### Module Not Found
```bash
# Make sure you're in the backend directory
cd backend

# Reinstall dependencies
pip install -r requirements.txt
```

### Can't Access from Frontend
- Make sure CORS is enabled (it is by default)
- Check that both frontend and backend are running
- Verify the API URL in your frontend code

## 📚 Available Test Accounts

| Student ID | Name | Target Career | Enrolled Courses |
|------------|------|---------------|------------------|
| 1 | Alice Johnson | Data Scientist | 3 courses |
| 2 | Bob Martinez | ML Engineer | 3 courses |
| 3 | Carol Chen | Business Analyst | 2 courses |
| 4 | David Kim | Full Stack Developer | 0 courses |
| 5 | Emma Wilson | Security Engineer | 0 courses |

Use any of these student IDs to test the API!

## 🎓 What You Can Do

- ✅ View student profiles and progress
- ✅ Track enrollments and quiz results
- ✅ Get AI tutoring on any topic
- ✅ Generate custom quizzes
- ✅ Get research assistance for thesis work
- ✅ View personalized career roadmaps
- ✅ Analyze study activity and performance

## 🔗 Important URLs

- **Swagger UI**: http://localhost:8000/docs (Interactive API testing)
- **ReDoc**: http://localhost:8000/redoc (Clean documentation)
- **Health**: http://localhost:8000/health (Server status)
- **Root**: http://localhost:8000 (API info)

---

**Ready to build the future of education! 🎓✨**
