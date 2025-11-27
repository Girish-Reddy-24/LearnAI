"""
Course-related API endpoints.
Handles course catalog and course details.
"""

from fastapi import APIRouter, HTTPException
from typing import List
from app.models import CourseResponse
from app import db

router = APIRouter(prefix="/courses", tags=["Courses"])


@router.get("", response_model=List[CourseResponse])
async def get_all_courses(active_only: bool = True):
    """
    Get all available courses.

    Args:
        active_only: If True, only return active courses (default: True)

    Returns:
        List of courses
    """
    courses = db.get_all_courses(active_only=active_only)
    return courses


@router.get("/{course_id}", response_model=CourseResponse)
async def get_course(course_id: int):
    """
    Get detailed information about a specific course.

    Args:
        course_id: The course ID

    Returns:
        Course details

    Raises:
        HTTPException: 404 if course not found
    """
    course = db.get_course_by_id(course_id)

    if not course:
        raise HTTPException(status_code=404, detail=f"Course with ID {course_id} not found")

    return course
