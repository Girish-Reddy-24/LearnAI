from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.database import get_db
from app import models_sqlite as models
from app import schemas

router = APIRouter(prefix="/api/courses", tags=["courses"])

@router.get("/", response_model=List[schemas.Course])
async def get_all_courses(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(models.Course)
        .where(models.Course.is_active == True)
        .offset(skip)
        .limit(limit)
    )
    courses = result.scalars().all()
    return courses

@router.get("/{course_id}", response_model=schemas.Course)
async def get_course(course_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.Course).where(models.Course.id == course_id))
    course = result.scalar_one_or_none()

    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    return course

@router.get("/{course_id}/modules", response_model=List[schemas.CourseModule])
async def get_course_modules(course_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(models.CourseModule)
        .where(models.CourseModule.course_id == course_id)
        .order_by(models.CourseModule.order_index)
    )
    modules = result.scalars().all()
    return modules

@router.post("/", response_model=schemas.Course)
async def create_course(course: schemas.CourseCreate, db: AsyncSession = Depends(get_db)):
    db_course = models.Course(**course.dict())
    db.add(db_course)
    await db.commit()
    await db.refresh(db_course)
    return db_course

@router.post("/modules", response_model=schemas.CourseModule)
async def create_module(module: schemas.CourseModuleCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.Course).where(models.Course.id == module.course_id))
    course = result.scalar_one_or_none()

    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    db_module = models.CourseModule(**module.dict())
    db.add(db_module)
    await db.commit()
    await db.refresh(db_module)
    return db_module

@router.get("/category/{category}", response_model=List[schemas.Course])
async def get_courses_by_category(category: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(models.Course)
        .where(models.Course.category == category)
        .where(models.Course.is_active == True)
    )
    courses = result.scalars().all()
    return courses
