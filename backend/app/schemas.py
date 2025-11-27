from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    full_name: str

class UserCreate(UserBase):
    password: str
    program: Optional[str] = "Computer Science"
    year: Optional[int] = 1

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(UserBase):
    id: int
    program: str
    year: int
    gpa: float
    created_at: datetime

    class Config:
        from_attributes = True

class CourseBase(BaseModel):
    title: str
    description: Optional[str] = None
    category: Optional[str] = None
    difficulty_level: Optional[str] = "beginner"
    duration_weeks: Optional[int] = 8
    instructor: Optional[str] = None

class CourseCreate(CourseBase):
    pass

class Course(CourseBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class CourseModuleBase(BaseModel):
    title: str
    description: Optional[str] = None
    video_url: Optional[str] = None
    duration_minutes: Optional[int] = None
    order_index: Optional[int] = 0
    content: Optional[str] = None

class CourseModuleCreate(CourseModuleBase):
    course_id: int

class CourseModule(CourseModuleBase):
    id: int
    course_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class EnrollmentBase(BaseModel):
    course_id: int

class EnrollmentCreate(EnrollmentBase):
    user_id: int

class Enrollment(EnrollmentBase):
    id: int
    user_id: int
    progress: float
    status: str
    enrolled_at: datetime
    last_accessed: datetime
    completion_date: Optional[datetime] = None

    class Config:
        from_attributes = True

class QuizBase(BaseModel):
    title: str
    description: Optional[str] = None
    questions: List[Dict[str, Any]]
    difficulty: Optional[str] = "medium"

class QuizCreate(QuizBase):
    course_id: int

class Quiz(QuizBase):
    id: int
    course_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class QuizAttemptCreate(BaseModel):
    quiz_id: int
    answers: List[Dict[str, Any]]

class QuizAttempt(BaseModel):
    id: int
    user_id: int
    quiz_id: int
    score: float
    completed_at: datetime

    class Config:
        from_attributes = True

class AITutorRequest(BaseModel):
    question: str
    course_id: Optional[int] = None
    context: Optional[str] = None

class AITutorResponse(BaseModel):
    response: str
    timestamp: datetime

class DashboardStats(BaseModel):
    total_courses_enrolled: int
    total_courses_completed: int
    total_time_spent_hours: float
    current_streak_days: int
    avg_quiz_score: float
    total_ai_tutor_interactions: int

class StudyActivity(BaseModel):
    date: str
    hours_studied: float
    topics: List[str]

class CareerPathBase(BaseModel):
    title: str
    description: Optional[str] = None
    required_skills: List[str]
    avg_salary: Optional[str] = None
    job_growth: Optional[str] = None
    related_courses: List[int]

class CareerPath(CareerPathBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
