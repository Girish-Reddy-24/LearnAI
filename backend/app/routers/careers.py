"""
Career and roadmap API endpoints.
Provides career path information and personalized roadmaps.
"""

from fastapi import APIRouter, HTTPException
from typing import List
from app.models import CareerPathResponse, StudentCareerRoadmapResponse
from app import db

router = APIRouter(prefix="/careers", tags=["Careers"])


@router.get("", response_model=List[CareerPathResponse])
async def get_all_career_paths():
    """
    Get all available career paths.

    Returns:
        List of career paths with details
    """
    career_paths = db.get_all_career_paths()
    return career_paths


@router.get("/{career_name}", response_model=CareerPathResponse)
async def get_career_path(career_name: str):
    """
    Get detailed information about a specific career path.

    Args:
        career_name: The career path name (e.g., "Data Scientist")

    Returns:
        Career path details including recommended courses, certifications, and skills

    Raises:
        HTTPException: 404 if career path not found
    """
    career = db.get_career_path_by_name(career_name)

    if not career:
        raise HTTPException(
            status_code=404,
            detail=f"Career path '{career_name}' not found"
        )

    return career


@router.get("/student/{student_id}/roadmap", response_model=StudentCareerRoadmapResponse)
async def get_student_career_roadmap(student_id: int):
    """
    Get a personalized career roadmap for a student.

    Analyzes the student's:
    - Target career goal
    - Current interests
    - Enrolled courses
    - Progress and skills

    Then provides a customized roadmap with:
    - Target career details
    - Current progress assessment
    - Recommended next steps
    - Skill gaps to fill
    - Suggested timeline

    Args:
        student_id: The student's ID

    Returns:
        Personalized career roadmap

    Raises:
        HTTPException: 404 if student not found or no career path defined
    """
    # Get student
    student = db.get_student_by_id(student_id)
    if not student:
        raise HTTPException(
            status_code=404,
            detail=f"Student with ID {student_id} not found"
        )

    # Get target career
    target_career = db.get_career_path_by_name(student['target_career'])
    if not target_career:
        raise HTTPException(
            status_code=404,
            detail=f"Career path '{student['target_career']}' not found. Student should update target career."
        )

    # Get student's current enrollments
    enrollments = db.get_student_enrollments(student_id)

    # Calculate progress toward career goal
    enrolled_course_titles = []
    completed_courses = []

    for enrollment in enrollments:
        course = db.get_course_by_id(enrollment['course_id'])
        if course:
            enrolled_course_titles.append(course['title'])
            if enrollment['completion_status'] == 'Completed':
                completed_courses.append(course['title'])

    # Calculate which recommended courses are completed
    recommended_courses = set(target_career['recommended_courses'])
    completed_recommended = [c for c in completed_courses if c in recommended_courses]
    in_progress_recommended = [c for c in enrolled_course_titles if c in recommended_courses and c not in completed_courses]
    not_started_recommended = [c for c in recommended_courses if c not in enrolled_course_titles]

    current_progress = {
        'completed_recommended_courses': completed_recommended,
        'in_progress_recommended_courses': in_progress_recommended,
        'not_started_recommended_courses': list(not_started_recommended),
        'completion_percentage': round((len(completed_recommended) / len(recommended_courses) * 100), 1) if recommended_courses else 0
    }

    # Determine skill gaps
    required_skills = set(target_career['recommended_skills'])
    student_interests = set(student.get('interests', []))
    skill_gaps = list(required_skills - student_interests)

    # Generate next steps
    next_steps = []

    if not_started_recommended:
        next_steps.append(f"Enroll in: {not_started_recommended[0]}")

    if in_progress_recommended:
        next_steps.append(f"Complete ongoing course: {in_progress_recommended[0]}")

    if skill_gaps:
        next_steps.append(f"Build skills in: {', '.join(skill_gaps[:3])}")

    if len(completed_recommended) >= len(recommended_courses) * 0.7:
        next_steps.append(f"Consider pursuing: {target_career['recommended_certs'][0]}")
        next_steps.append("Start working on capstone project or thesis")

    if not next_steps:
        next_steps.append("You're on track! Continue with your current courses.")
        next_steps.append("Consider taking advanced electives in your area of interest.")

    # Determine timeline
    courses_remaining = len(not_started_recommended) + len(in_progress_recommended)

    if courses_remaining == 0:
        timeline = "You've completed all recommended courses! Focus on certifications and practical projects."
    elif courses_remaining <= 2:
        timeline = "1-2 semesters remaining. Focus on completing final courses and building portfolio projects."
    elif courses_remaining <= 4:
        timeline = "2-3 semesters remaining. Stay consistent with coursework and start networking."
    else:
        timeline = "3-4 semesters remaining. Take 2-3 courses per semester and build foundational skills."

    return StudentCareerRoadmapResponse(
        student=student,
        target_career=target_career,
        current_progress=current_progress,
        next_steps=next_steps,
        skill_gaps=skill_gaps,
        recommended_timeline=timeline
    )
