
from fastapi import APIRouter, HTTPException
from typing import List
from app import db

router = APIRouter(prefix="/notifications", tags=["Notifications"])

@router.post("/create")
async def create_notification(payload: dict):
    """
    Create a notification for a student.
    payload: { student_id: int, title: str, message: str, due_date: "YYYY-MM-DD" (optional) }
    """
    sid = payload.get("student_id")
    if not sid:
        raise HTTPException(status_code=400, detail="student_id required")
    title = payload.get("title","Reminder")
    message = payload.get("message","You have an upcoming item.")
    due = payload.get("due_date", None)
    n = db.add_notification(sid, title, message, due_date=due)
    return n

@router.get("/student/{student_id}", response_model=List[dict])
async def list_student_notifications(student_id: int):
    return db.get_notifications_for_student(student_id)
