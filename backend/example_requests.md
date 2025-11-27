# Example API Requests

This file contains example curl commands to test all API endpoints.

## Prerequisites

Make sure the server is running:
```bash
uvicorn app.main:app --reload
```

## Student Endpoints

### Get Student Profile
```bash
curl http://localhost:8000/students/1
```

Expected Response:
```json
{
  "name": "Alice Johnson",
  "email": "alice.johnson@silverleaf.edu",
  "program": "MS in Information Systems",
  "interests": ["AI", "Data Science", "Cloud Computing"],
  "learning_style": "Visual",
  "target_career": "Data Scientist",
  "id": 1,
  "join_date": "2023-09-01"
}
```

### Get Student Enrollments
```bash
curl http://localhost:8000/students/1/enrollments
```

### Get Quiz Results
```bash
curl http://localhost:8000/students/1/quiz-results
```

### Get Recommendations
```bash
curl http://localhost:8000/students/1/recommendations
```

## Dashboard Endpoint

### Get Complete Dashboard
```bash
curl http://localhost:8000/dashboard/1
```

## Course Endpoints

### Get All Courses
```bash
curl http://localhost:8000/courses
```

### Get Specific Course
```bash
curl http://localhost:8000/courses/1
```

## AI Feature Endpoints

### AI Tutor - Ask a Question
```bash
curl -X POST http://localhost:8000/ai/tutor \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": 1,
    "message": "Explain how machine learning works"
  }'
```

### AI Tutor - Python Question
```bash
curl -X POST http://localhost:8000/ai/tutor \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": 1,
    "message": "What are Python list comprehensions?"
  }'
```

### Generate Quiz - Python (Easy)
```bash
curl -X POST http://localhost:8000/ai/quiz-generator \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": 1,
    "topic": "Python Programming",
    "difficulty": "easy",
    "num_questions": 5
  }'
```

### Generate Quiz - Machine Learning (Medium)
```bash
curl -X POST http://localhost:8000/ai/quiz-generator \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": 1,
    "topic": "Machine Learning",
    "difficulty": "medium",
    "num_questions": 3
  }'
```

### Research Assistant - Research Question Help
```bash
curl -X POST http://localhost:8000/ai/research-assistant \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": 1,
    "research_description": "I want to research the impact of AI-powered learning platforms on student engagement and academic performance in graduate education",
    "help_type": "research_question"
  }'
```

### Research Assistant - Literature Review Help
```bash
curl -X POST http://localhost:8000/ai/research-assistant \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": 1,
    "research_description": "AI and machine learning in educational technology",
    "help_type": "literature_review"
  }'
```

### Research Assistant - Thesis Structure Help
```bash
curl -X POST http://localhost:8000/ai/research-assistant \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": 1,
    "research_description": "Master thesis on AI-integrated learning platforms",
    "help_type": "structure"
  }'
```

## Career Endpoints

### Get All Career Paths
```bash
curl http://localhost:8000/careers
```

### Get Specific Career Path
```bash
curl http://localhost:8000/careers/Data%20Scientist
```

### Get Personalized Career Roadmap
```bash
curl http://localhost:8000/careers/student/1/roadmap
```

## System Endpoints

### Root Endpoint
```bash
curl http://localhost:8000/
```

### Health Check
```bash
curl http://localhost:8000/health
```

## Testing with Different Students

### Student 2 (Bob Martinez - ML Engineer)
```bash
curl http://localhost:8000/students/2
curl http://localhost:8000/dashboard/2
curl http://localhost:8000/careers/student/2/roadmap
```

### Student 3 (Carol Chen - Business Analyst)
```bash
curl http://localhost:8000/students/3
curl http://localhost:8000/dashboard/3
curl http://localhost:8000/careers/student/3/roadmap
```

## Error Cases

### Student Not Found
```bash
curl http://localhost:8000/students/999
```

Expected Response:
```json
{
  "detail": "Student with ID 999 not found"
}
```

### Invalid Quiz Parameters
```bash
curl -X POST http://localhost:8000/ai/quiz-generator \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": 1,
    "topic": "Python",
    "difficulty": "medium",
    "num_questions": 25
  }'
```

Expected Response:
```json
{
  "detail": "Number of questions must be between 1 and 20"
}
```

### Invalid Research Help Type
```bash
curl -X POST http://localhost:8000/ai/research-assistant \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": 1,
    "research_description": "My research topic",
    "help_type": "invalid_type"
  }'
```

## Using Python Requests Library

If you prefer Python:

```python
import requests

# Get student
response = requests.get('http://localhost:8000/students/1')
print(response.json())

# AI Tutor
response = requests.post(
    'http://localhost:8000/ai/tutor',
    json={
        'student_id': 1,
        'message': 'Explain neural networks'
    }
)
print(response.json())

# Generate Quiz
response = requests.post(
    'http://localhost:8000/ai/quiz-generator',
    json={
        'student_id': 1,
        'topic': 'Python Programming',
        'difficulty': 'medium',
        'num_questions': 5
    }
)
print(response.json())
```

## Using JavaScript Fetch

For frontend integration:

```javascript
// Get student dashboard
fetch('http://localhost:8000/dashboard/1')
  .then(res => res.json())
  .then(data => console.log(data));

// AI Tutor
fetch('http://localhost:8000/ai/tutor', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    student_id: 1,
    message: 'How do I learn Python?'
  })
})
  .then(res => res.json())
  .then(data => console.log(data));

// Generate Quiz
fetch('http://localhost:8000/ai/quiz-generator', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    student_id: 1,
    topic: 'Machine Learning',
    difficulty: 'medium',
    num_questions: 5
  })
})
  .then(res => res.json())
  .then(data => console.log(data));
```

## Interactive Testing

The easiest way to test is through the Swagger UI:
1. Start the server
2. Open http://localhost:8000/docs
3. Click on any endpoint
4. Click "Try it out"
5. Fill in parameters
6. Click "Execute"
7. View the response
