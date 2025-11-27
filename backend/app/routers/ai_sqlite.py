from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime
from typing import Optional

from app.database import get_db
from app import models_sqlite as models
from app import schemas

router = APIRouter(prefix="/api/ai", tags=["ai"])

def generate_ai_response(question: str, course_title: Optional[str] = None) -> str:
    course_context = f" In the context of {course_title}," if course_title else ""

    response = f"""Great question! Let me help you understand this better.

Regarding "{question}":

**Core Concept:**
This is an important concept to master.{course_context} Here's a comprehensive explanation:

1. **Foundation**: The fundamental idea relates to how we approach problem-solving in this domain. Think of it as building blocks - each concept builds upon previous knowledge.

2. **Practical Application**: In real-world scenarios, this translates to being able to analyze situations and apply the right techniques. When working on projects, you'll use these principles to make informed decisions.

3. **Key Points to Remember**:
   - Start with understanding the basic principles
   - Practice with varied examples
   - Connect concepts to real-world applications
   - Review and reinforce regularly

4. **Next Steps**:
   - Apply this concept to practice problems
   - Explore related topics to deepen understanding
   - Don't hesitate to ask follow-up questions

Would you like me to elaborate on any specific aspect or provide more examples?"""

    return response

@router.post("/tutor", response_model=schemas.AITutorResponse)
async def ai_tutor(
    request: schemas.AITutorRequest,
    user_id: int,
    db: AsyncSession = Depends(get_db)
):
    course_title = None
    if request.course_id:
        result = await db.execute(
            select(models.Course).where(models.Course.id == request.course_id)
        )
        course = result.scalar_one_or_none()
        if course:
            course_title = course.title

    ai_response = generate_ai_response(request.question, course_title)

    conversation_entry = [
        {"role": "user", "content": request.question, "timestamp": datetime.utcnow().isoformat()},
        {"role": "assistant", "content": ai_response, "timestamp": datetime.utcnow().isoformat()}
    ]

    if request.course_id:
        result = await db.execute(
            select(models.AITutorSession)
            .where(models.AITutorSession.user_id == user_id)
            .where(models.AITutorSession.course_id == request.course_id)
        )
        session = result.scalar_one_or_none()

        if session:
            existing_conv = session.conversation or []
            session.conversation = existing_conv + conversation_entry
            session.updated_at = datetime.utcnow()
        else:
            session = models.AITutorSession(
                user_id=user_id,
                course_id=request.course_id,
                conversation=conversation_entry
            )
            db.add(session)

        await db.commit()

    return schemas.AITutorResponse(
        response=ai_response,
        timestamp=datetime.utcnow()
    )

@router.post("/generate-quiz", response_model=schemas.Quiz)
async def generate_quiz(
    course_id: int,
    topic: str,
    difficulty: str,
    num_questions: int,
    user_id: int,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(models.Course).where(models.Course.id == course_id))
    course = result.scalar_one_or_none()

    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    questions = []
    for i in range(num_questions):
        questions.append({
            "question": f"What is the primary concept of {topic}?",
            "options": [
                f"Understanding {topic} fundamentals",
                f"Memorizing {topic} definitions",
                f"Avoiding {topic} entirely",
                f"Replacing {topic} methods"
            ],
            "correctAnswer": 0,
            "explanation": f"Understanding {topic} fundamentals is essential for mastery."
        })

    quiz = models.Quiz(
        course_id=course_id,
        title=f"{topic} - {difficulty.capitalize()} Level Quiz",
        description=f"Test your knowledge on {topic}",
        questions=questions,
        difficulty=difficulty,
        created_by=user_id
    )

    db.add(quiz)
    await db.commit()
    await db.refresh(quiz)

    return quiz

@router.get("/quizzes/{course_id}")
async def get_course_quizzes(course_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(models.Quiz).where(models.Quiz.course_id == course_id)
    )
    quizzes = result.scalars().all()
    return quizzes

@router.post("/quiz-attempt")
async def submit_quiz_attempt(
    attempt: schemas.QuizAttemptCreate,
    user_id: int,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(models.Quiz).where(models.Quiz.id == attempt.quiz_id))
    quiz = result.scalar_one_or_none()

    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")

    correct_answers = 0
    total_questions = len(quiz.questions)

    for i, answer in enumerate(attempt.answers):
        if i < total_questions:
            if answer.get("selectedAnswer") == quiz.questions[i].get("correctAnswer"):
                correct_answers += 1

    score = (correct_answers / total_questions * 100) if total_questions > 0 else 0

    quiz_attempt = models.QuizAttempt(
        user_id=user_id,
        quiz_id=attempt.quiz_id,
        score=score,
        answers=attempt.answers
    )

    db.add(quiz_attempt)
    await db.commit()
    await db.refresh(quiz_attempt)

    return {
        "score": score,
        "correct_answers": correct_answers,
        "total_questions": total_questions,
        "attempt_id": quiz_attempt.id
    }
