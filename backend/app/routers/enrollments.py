from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from datetime import datetime

from app.database import get_db
from app import models_sqlite as models
from app import schemas

router = APIRouter(prefix="/api/enrollments", tags=["enrollments"])

@router.post("/", response_model=schemas.Enrollment)
async def create_enrollment(enrollment: schemas.EnrollmentCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(models.Enrollment)
        .where(models.Enrollment.user_id == enrollment.user_id)
        .where(models.Enrollment.course_id == enrollment.course_id)
    )
    existing = result.scalar_one_or_none()

    if existing:
        raise HTTPException(status_code=400, detail="Already enrolled in this course")

    db_enrollment = models.Enrollment(**enrollment.dict())
    db.add(db_enrollment)
    await db.commit()
    await db.refresh(db_enrollment)
    return db_enrollment

@router.get("/user/{user_id}", response_model=List[schemas.Enrollment])
async def get_user_enrollments(user_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(models.Enrollment).where(models.Enrollment.user_id == user_id)
    )
    enrollments = result.scalars().all()
    return enrollments

@router.put("/{enrollment_id}/progress")
async def update_progress(enrollment_id: int, progress: float, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(models.Enrollment).where(models.Enrollment.id == enrollment_id)
    )
    enrollment = result.scalar_one_or_none()

    if not enrollment:
        raise HTTPException(status_code=404, detail="Enrollment not found")

    enrollment.progress = progress
    enrollment.last_accessed = datetime.utcnow()

    if progress >= 100 and not enrollment.completion_date:
        enrollment.completion_date = datetime.utcnow()
        enrollment.status = "completed"

    await db.commit()
    await db.refresh(enrollment)
    return enrollment
