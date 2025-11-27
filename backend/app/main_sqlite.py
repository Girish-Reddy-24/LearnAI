from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.database import init_db
from app.routers import users, courses_sqlite, enrollments, ai_sqlite, dashboard_sqlite

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield

app = FastAPI(
    title="Learning Platform API",
    description="SQLite-based backend for Learning Management System",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(courses_sqlite.router)
app.include_router(enrollments.router)
app.include_router(ai_sqlite.router)
app.include_router(dashboard_sqlite.router)

@app.get("/")
async def root():
    return {
        "message": "Learning Platform API",
        "version": "1.0.0",
        "database": "SQLite",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "database": "SQLite",
        "timestamp": "2024-11-27"
    }
