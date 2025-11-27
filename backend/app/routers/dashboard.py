"""
Dashboard API endpoints.
Provides aggregated data for student dashboards.
"""

from fastapi import APIRouter, HTTPException
from datetime import timedelta
from app.models import DashboardResponse, DashboardStats, CourseProgressItem, StudyActivityResponse
from app import db

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/{student_id}", response_model=DashboardResponse)
async def get_student_dashboard(student_id: int):
    """
    Get comprehensive dashboard data for a student.

    Returns aggregated statistics, study activity, course progress,
    and recent quiz results.

    Args:
        student_id: The student's ID

    Returns:
        Complete dashboard data

    Raises:
        HTTPException: 404 if student not found
    """
    # Get student
    student = db.get_student_by_id(student_id)
    if not student:
        raise HTTPException(status_code=404, detail=f"Student with ID {student_id} not found")

    # Get enrollments
    enrollments = db.get_student_enrollments(student_id)

    # Calculate statistics
    courses_enrolled = len(enrollments)
    courses_completed = sum(1 for e in enrollments if e['completion_status'] == 'Completed')

    # Calculate average quiz score
    quiz_results = db.get_student_quiz_results(student_id)
    if quiz_results:
        average_score = sum(q['score_percent'] for q in quiz_results) / len(quiz_results)
    else:
        average_score = 0.0

    # Calculate total study minutes
    study_activities = db.get_student_study_activities(student_id, days=30)
    total_study_minutes = sum(a['minutes_studied'] for a in study_activities)

    stats = DashboardStats(
        courses_enrolled=courses_enrolled,
        courses_completed=courses_completed,
        average_score=round(average_score, 1),
        total_study_minutes=total_study_minutes
    )

    # Get weekly study activity (last 7 days)
    weekly_activities = db.get_student_study_activities(student_id, days=7)

    # Enrich with course titles
    enriched_activities = []
    for activity in weekly_activities:
        course_title = None
        if activity.get('course_id'):
            course = db.get_course_by_id(activity['course_id'])
            if course:
                course_title = course['title']

        enriched_activities.append(StudyActivityResponse(
            date=activity['date'],
            minutes_studied=activity['minutes_studied'],
            course_title=course_title
        ))

    # Sort by date
    enriched_activities.sort(key=lambda x: x.date)

    # Get course progress
    course_progress = []
    for enrollment in enrollments:
        course = db.get_course_by_id(enrollment['course_id'])
        if course:
            course_progress.append(CourseProgressItem(
                course_title=course['title'],
                progress_percent=enrollment['progress_percent'],
                completion_status=enrollment['completion_status']
            ))

    # Get recent quiz results (last 5)
    recent_quizzes = []
    for result in quiz_results[:5]:
        course = db.get_course_by_id(result['course_id'])
        if course:
            recent_quizzes.append({
                **result,
                'course_title': course['title']
            })

    return DashboardResponse(
        student=student,
        stats=stats,
        weekly_study_activity=enriched_activities,
        course_progress=course_progress,
        recent_quiz_results=recent_quizzes
    )
