"""
Student-related API endpoints.
Handles student profile and enrollment operations.
"""

from fastapi import APIRouter, HTTPException
from typing import List
from app.models import StudentResponse, EnrollmentResponse, QuizResultResponse, RecommendationResponse
from app import db

router = APIRouter(prefix="/students", tags=["Students"])


@router.get("/{student_id}", response_model=StudentResponse)
async def get_student(student_id: int):
    """
    Get student profile information.

    Args:
        student_id: The student's ID

    Returns:
        Student profile data

    Raises:
        HTTPException: 404 if student not found
    """
    student = db.get_student_by_id(student_id)

    if not student:
        raise HTTPException(status_code=404, detail=f"Student with ID {student_id} not found")

    return student


@router.get("/{student_id}/enrollments", response_model=List[EnrollmentResponse])
async def get_student_enrollments(student_id: int):
    """
    Get all enrollments for a student with course details.

    Args:
        student_id: The student's ID

    Returns:
        List of enrollments with course information

    Raises:
        HTTPException: 404 if student not found
    """
    # Verify student exists
    student = db.get_student_by_id(student_id)
    if not student:
        raise HTTPException(status_code=404, detail=f"Student with ID {student_id} not found")

    # Get enrollments
    enrollments = db.get_student_enrollments(student_id)

    # Enrich with course details
    enriched_enrollments = []
    for enrollment in enrollments:
        course = db.get_course_by_id(enrollment['course_id'])
        if course:
            enriched_enrollments.append({
                **enrollment,
                'course_title': course['title'],
                'course_category': course['category'],
                'course_difficulty': course['difficulty']
            })

    return enriched_enrollments


@router.get("/{student_id}/quiz-results", response_model=List[QuizResultResponse])
async def get_student_quiz_results(student_id: int):
    """
    Get all quiz results for a student.

    Args:
        student_id: The student's ID

    Returns:
        List of quiz results with course information

    Raises:
        HTTPException: 404 if student not found
    """
    # Verify student exists
    student = db.get_student_by_id(student_id)
    if not student:
        raise HTTPException(status_code=404, detail=f"Student with ID {student_id} not found")

    # Get quiz results
    quiz_results = db.get_student_quiz_results(student_id)

    # Enrich with course titles
    enriched_results = []
    for result in quiz_results:
        course = db.get_course_by_id(result['course_id'])
        if course:
            enriched_results.append({
                **result,
                'course_title': course['title']
            })

    # Sort by date descending
    enriched_results.sort(key=lambda x: x['date'], reverse=True)

    return enriched_results


@router.get("/{student_id}/recommendations", response_model=List[RecommendationResponse])
async def get_student_recommendations(student_id: int):
    """
    Get personalized recommendations for a student.

    Args:
        student_id: The student's ID

    Returns:
        List of recommendations

    Raises:
        HTTPException: 404 if student not found
    """
    # Verify student exists
    student = db.get_student_by_id(student_id)
    if not student:
        raise HTTPException(status_code=404, detail=f"Student with ID {student_id} not found")

    # Get recommendations
    recommendations = db.get_student_recommendations(student_id)

    # Sort by created date descending
    recommendations.sort(key=lambda x: x['created_at'], reverse=True)

    return recommendations
