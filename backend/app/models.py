"""
Pydantic models for request/response validation.
These models define the structure of data flowing through the API.
"""

from datetime import datetime, date
from typing import List, Optional
from pydantic import BaseModel, Field, EmailStr


# ============================================
# STUDENT MODELS
# ============================================

class StudentBase(BaseModel):
    """Base student information"""
    name: str
    email: EmailStr
    program: str
    interests: List[str] = []
    learning_style: str
    target_career: str


class StudentResponse(StudentBase):
    """Student response with ID"""
    id: int
    join_date: date

    class Config:
        from_attributes = True


# ============================================
# COURSE MODELS
# ============================================

class CourseBase(BaseModel):
    """Base course information"""
    title: str
    category: str
    difficulty: str
    duration_hours: float
    tags: List[str] = []
    description: Optional[str] = None


class CourseResponse(CourseBase):
    """Course response with ID"""
    id: int
    is_active: bool = True

    class Config:
        from_attributes = True


# ============================================
# ENROLLMENT MODELS
# ============================================

class EnrollmentResponse(BaseModel):
    """Enrollment with course details"""
    id: int
    student_id: int
    course_id: int
    course_title: str
    course_category: str
    course_difficulty: str
    progress_percent: float
    completion_status: str
    last_accessed: datetime
    average_quiz_score: Optional[float] = None

    class Config:
        from_attributes = True


# ============================================
# QUIZ MODELS
# ============================================

class QuizResultResponse(BaseModel):
    """Quiz result information"""
    id: int
    student_id: int
    course_id: int
    course_title: str
    score_percent: float
    date: datetime
    difficulty_level: str

    class Config:
        from_attributes = True


# ============================================
# STUDY ACTIVITY MODELS
# ============================================

class StudyActivityResponse(BaseModel):
    """Study activity record"""
    date: date
    minutes_studied: int
    course_title: Optional[str] = None

    class Config:
        from_attributes = True


# ============================================
# RECOMMENDATION MODELS
# ============================================

class RecommendationResponse(BaseModel):
    """Recommendation information"""
    id: int
    student_id: int
    type: str
    title: str
    reason: str
    created_at: datetime

    class Config:
        from_attributes = True


# ============================================
# DASHBOARD MODELS
# ============================================

class CourseProgressItem(BaseModel):
    """Course progress for dashboard"""
    course_title: str
    progress_percent: float
    completion_status: str


class DashboardStats(BaseModel):
    """Dashboard statistics"""
    courses_enrolled: int
    courses_completed: int
    average_score: float
    total_study_minutes: int


class DashboardResponse(BaseModel):
    """Complete dashboard data"""
    student: StudentResponse
    stats: DashboardStats
    weekly_study_activity: List[StudyActivityResponse]
    course_progress: List[CourseProgressItem]
    recent_quiz_results: List[QuizResultResponse]


# ============================================
# AI TUTOR MODELS
# ============================================

class AiTutorRequest(BaseModel):
    """Request for AI tutor"""
    student_id: int
    message: str = Field(..., min_length=1, max_length=2000)


class AiTutorResponse(BaseModel):
    """Response from AI tutor"""
    student_id: int
    message: str
    ai_response: str
    timestamp: datetime


# ============================================
# QUIZ GENERATOR MODELS
# ============================================

class QuizQuestion(BaseModel):
    """Single quiz question"""
    question: str
    options: List[str]
    correct_answer: int
    explanation: str


class QuizGeneratorRequest(BaseModel):
    """Request for quiz generation"""
    student_id: int
    topic: str = Field(..., min_length=1, max_length=200)
    difficulty: str = Field(default="medium", pattern="^(easy|medium|hard)$")
    num_questions: int = Field(default=5, ge=1, le=20)


class QuizGeneratorResponse(BaseModel):
    """Response from quiz generator"""
    student_id: int
    topic: str
    difficulty: str
    questions: List[QuizQuestion]
    generated_at: datetime


# ============================================
# RESEARCH ASSISTANT MODELS
# ============================================

class ResearchAssistantRequest(BaseModel):
    """Request for research assistance"""
    student_id: int
    research_description: str = Field(..., min_length=10, max_length=2000)
    help_type: str = Field(..., pattern="^(research_question|literature_review|structure)$")


class ResearchAssistantResponse(BaseModel):
    """Response from research assistant"""
    student_id: int
    help_type: str
    suggested_outline: List[str]
    suggested_keywords: List[str]
    advice: str
    references: List[str]
    generated_at: datetime


# ============================================
# CAREER MODELS
# ============================================

class CareerPathResponse(BaseModel):
    """Career path information"""
    id: int
    career_name: str
    description: str
    average_salary_range: str
    recommended_courses: List[str]
    recommended_certs: List[str]
    recommended_skills: List[str]
    job_outlook: str

    class Config:
        from_attributes = True


class StudentCareerRoadmapResponse(BaseModel):
    """Personalized career roadmap for student"""
    student: StudentResponse
    target_career: CareerPathResponse
    current_progress: dict
    next_steps: List[str]
    skill_gaps: List[str]
    recommended_timeline: str


# ============================================
# AI SESSION LOG MODELS
# ============================================

class AiSessionLogResponse(BaseModel):
    """AI session log"""
    id: int
    student_id: int
    session_type: str
    input_summary: str
    response_summary: str
    created_at: datetime

    class Config:
        from_attributes = True


# ============================================
# HEALTH CHECK MODEL
# ============================================

class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    timestamp: datetime
    version: str = "1.0.0"
