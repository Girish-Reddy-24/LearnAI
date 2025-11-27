"""
FastAPI Main Application
AI-Integrated Learning Platform for Master's Students at Silver Leaf University

This is the main entry point for the backend API server.
It configures FastAPI, CORS, and includes all routers.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from contextlib import asynccontextmanager

from app.models import HealthResponse
from app import db
from app.routers import students, dashboard, courses, ai, careers


# ============================================
# LIFESPAN EVENT HANDLER
# ============================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan event handler for startup and shutdown.
    Initializes database on startup.
    """
    # Startup: Initialize database with seed data
    print("\n" + "="*50)
    print("🚀 Starting AI-Integrated Learning Platform API")
    print("="*50)
    db.initialize_database()
    print("✅ Server ready!")
    print("="*50 + "\n")

    yield

    # Shutdown
    print("\n👋 Shutting down server...")


# ============================================
# FASTAPI APP CONFIGURATION
# ============================================

app = FastAPI(
    title="AI-Integrated Learning Platform API",
    description="""
    Backend API for an AI-powered learning platform designed for Master's students.

    ## Features

    * **Student Management**: Profile, enrollments, progress tracking
    * **AI Tutor**: Get intelligent help with coursework
    * **Quiz Generator**: Generate custom quizzes on any topic
    * **Research Assistant**: Help with thesis and research projects
    * **Career Roadmaps**: Personalized career guidance
    * **Dashboard Analytics**: Study activity, progress, and performance metrics

    ## Technology Stack

    * FastAPI (Python web framework)
    * Pydantic (Data validation)
    * In-memory database (can be replaced with PostgreSQL/Supabase)

    ## Research Project

    This backend is part of a Master's research project:
    "AI-Integrated Learning Platform for Master's Students at Silver Leaf University"
    """,
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)


# ============================================
# CORS MIDDLEWARE
# ============================================

# Allow all origins for development
# In production, replace "*" with specific frontend URLs
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production: ["https://yourdomain.com"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================
# INCLUDE ROUTERS
# ============================================

app.include_router(students.router)
app.include_router(dashboard.router)
app.include_router(courses.router)
app.include_router(ai.router)
app.include_router(careers.router)


# ============================================
# ROOT AND HEALTH ENDPOINTS
# ============================================

@app.get("/", tags=["Root"])
async def root():
    """
    Root endpoint - API welcome message.
    """
    return {
        "message": "AI-Integrated Learning Platform API",
        "version": "1.0.0",
        "description": "Backend for Master's Research Project at Silver Leaf University",
        "docs": "/docs",
        "redoc": "/redoc",
        "health": "/health"
    }


@app.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    """
    Health check endpoint.
    Returns server status and current timestamp.
    """
    return HealthResponse(
        status="ok",
        timestamp=datetime.now(),
        version="1.0.0"
    )


# ============================================
# MAIN ENTRY POINT (for direct execution)
# ============================================

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
