
"""
AI-powered feature endpoints.
Includes AI Tutor, Quiz Generator, Research Assistant, and Recommendations.
"""

from fastapi import APIRouter, HTTPException
from datetime import datetime
from typing import Any
from app.models import (
    AiTutorRequest, AiTutorResponse,
    QuizGeneratorRequest, QuizGeneratorResponse,
    ResearchAssistantRequest, ResearchAssistantResponse,
)
from app import db
from app.ai_service import (
    generate_ai_tutor_response,
    generate_quiz_questions,
    generate_research_assistance,
    generate_course_recommendations
)

router = APIRouter(prefix="/ai", tags=["AI Features"])


@router.post("/tutor", response_model=AiTutorResponse)
async def ai_tutor(request: AiTutorRequest):
    """
    Get help from the AI tutor.
    """
    try:
        ai_out = generate_ai_tutor_response(request.student_id, request.message)
        # persist session briefly
        db.add_ai_session(
            student_id=request.student_id,
            session_type='tutor',
            input_summary=request.message[:200],
            response_summary=ai_out.get('answer','')[:200]
        )
        return AiTutorResponse(
            student_id=request.student_id,
            message=request.message,
            ai_response=ai_out.get('answer',''),
            timestamp=datetime.now()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/quiz-generate", response_model=QuizGeneratorResponse)
async def quiz_generate(request: QuizGeneratorRequest):
    """
    Generate an automatic quiz for the given topic.
    """
    try:
        questions = generate_quiz_questions(request.topic, request.difficulty, request.num_questions)
        # convert to QuizQuestion models list
        quiz_questions = []
        for q in questions:
            # map option index of correct answer if possible
            correct_index = 0
            if isinstance(q.get('options'), list) and q.get('correct_answer') in q.get('options'):
                correct_index = q.get('options').index(q.get('correct_answer'))
            else:
                correct_index = 0
            quiz_questions.append({
                "question": q.get('question',''),
                "options": q.get('options',[]),
                "correct_answer": correct_index,
                "explanation": q.get('explanation','')
            })
        db.add_ai_session(
            student_id=request.student_id,
            session_type='quiz',
            input_summary=request.topic[:200],
            response_summary=f"Generated {len(quiz_questions)} questions"
        )
        return QuizGeneratorResponse(
            student_id=request.student_id,
            topic=request.topic,
            difficulty=request.difficulty,
            questions=quiz_questions,
            generated_at=datetime.now()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/research-assistant", response_model=ResearchAssistantResponse)
async def research_assistant(request: ResearchAssistantRequest):
    """
    Get research assistance for thesis/project work.
    """
    try:
        assistance = generate_research_assistance(request.research_description, help_type=request.help_type)
        db.add_ai_session(
            student_id=request.student_id,
            session_type='research',
            input_summary=f"{request.help_type}: {request.research_description[:100]}",
            response_summary=f"Provided {request.help_type} assistance"
        )

        return ResearchAssistantResponse(
            student_id=request.student_id,
            help_type=request.help_type,
            suggested_outline=assistance.get('suggested_outline', []),
            suggested_keywords=assistance.get('suggested_keywords', []),
            advice=assistance.get('advice', ''),
            references=assistance.get('references', []),
            generated_at=datetime.now()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/recommendations")
async def recommendations(payload: dict):
    """
    Provide course and certification recommendations based on student's career goal.
    Expected payload: { "goal": "data engineer", "level": "beginner" }
    """
    try:
        goal = payload.get("goal", "")
        level = payload.get("level", "beginner")
        if not goal:
            raise HTTPException(status_code=400, detail="Missing 'goal' in payload")
        recs = generate_course_recommendations(goal, level)
        # store minimal session
        db.add_ai_session(
            student_id=payload.get("student_id", 0),
            session_type='recommendations',
            input_summary=goal[:200],
            response_summary="Provided course recommendations"
        )
        return {"goal": goal, "recommendations": recs.get("recommendations", [])}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
