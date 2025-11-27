from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from datetime import datetime, timedelta
from typing import List

from app.database import get_db
from app import models_sqlite as models
from app import schemas

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

@router.get("/{user_id}/stats", response_model=schemas.DashboardStats)
async def get_dashboard_stats(user_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(models.Enrollment).where(models.Enrollment.user_id == user_id)
    )
    enrollments = result.scalars().all()

    total_enrolled = len(enrollments)
    total_completed = sum(1 for e in enrollments if e.status == "completed")

    result = await db.execute(
        select(models.QuizAttempt)
        .where(models.QuizAttempt.user_id == user_id)
    )
    quiz_attempts = result.scalars().all()

    avg_quiz_score = (
        sum(a.score for a in quiz_attempts) / len(quiz_attempts)
        if quiz_attempts else 0.0
    )

    result = await db.execute(
        select(func.count(models.AITutorSession.id))
        .where(models.AITutorSession.user_id == user_id)
    )
    ai_interactions = result.scalar() or 0

    recent_activity = []
    for enrollment in enrollments:
        if enrollment.last_accessed:
            recent_activity.append(enrollment.last_accessed)

    recent_activity.sort(reverse=True)

    current_streak = 0
    if recent_activity:
        current_date = datetime.utcnow().date()
        for i, activity_date in enumerate(recent_activity):
            activity_day = activity_date.date()
            expected_day = current_date - timedelta(days=i)
            if activity_day == expected_day:
                current_streak += 1
            else:
                break

    total_time_hours = sum(e.progress / 100 * 40 for e in enrollments)

    return schemas.DashboardStats(
        total_courses_enrolled=total_enrolled,
        total_courses_completed=total_completed,
        total_time_spent_hours=round(total_time_hours, 1),
        current_streak_days=current_streak,
        avg_quiz_score=round(avg_quiz_score, 1),
        total_ai_tutor_interactions=ai_interactions
    )

@router.get("/{user_id}/study-activity")
async def get_study_activity(
    user_id: int,
    days: int = 30,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(models.Enrollment)
        .where(models.Enrollment.user_id == user_id)
        .where(models.Enrollment.last_accessed >= datetime.utcnow() - timedelta(days=days))
    )
    enrollments = result.scalars().all()

    activity_by_date = {}
    for enrollment in enrollments:
        if enrollment.last_accessed:
            date_key = enrollment.last_accessed.strftime("%Y-%m-%d")
            if date_key not in activity_by_date:
                activity_by_date[date_key] = {
                    "date": date_key,
                    "hours_studied": 0.0,
                    "topics": []
                }

            activity_by_date[date_key]["hours_studied"] += 1.5

            result_course = await db.execute(
                select(models.Course).where(models.Course.id == enrollment.course_id)
            )
            course = result_course.scalar_one_or_none()
            if course:
                activity_by_date[date_key]["topics"].append(course.title)

    activities = list(activity_by_date.values())
    activities.sort(key=lambda x: x["date"], reverse=True)

    return activities
