"""
AI-powered feature endpoints.
Includes AI Tutor, Quiz Generator, and Research Assistant.
"""

from fastapi import APIRouter, HTTPException
from datetime import datetime
from app.models import (
    AiTutorRequest, AiTutorResponse,
    QuizGeneratorRequest, QuizGeneratorResponse,
    ResearchAssistantRequest, ResearchAssistantResponse,
    QuizQuestion
)
from app import db
from app.ai_service import (
    generate_ai_tutor_response,
    generate_quiz_questions,
    generate_research_assistance
)

router = APIRouter(prefix="/ai", tags=["AI Features"])


@router.post("/tutor", response_model=AiTutorResponse)
async def ai_tutor(request: AiTutorRequest):
    """
    Get help from the AI tutor.

    The AI tutor provides intelligent responses to student questions
    about course material, concepts, and problem-solving.

    Args:
        request: AI tutor request with student_id and message

    Returns:
        AI-generated response

    Raises:
        HTTPException: 404 if student not found
    """
    # Verify student exists
    student = db.get_student_by_id(request.student_id)
    if not student:
        raise HTTPException(
            status_code=404,
            detail=f"Student with ID {request.student_id} not found"
        )

    # Generate AI response
    ai_response = generate_ai_tutor_response(request.student_id, request.message)

    # Log the interaction
    db.log_ai_session(
        student_id=request.student_id,
        session_type='tutor',
        input_summary=request.message[:200],
        response_summary=ai_response[:200]
    )

    return AiTutorResponse(
        student_id=request.student_id,
        message=request.message,
        ai_response=ai_response,
        timestamp=datetime.now()
    )


@router.post("/quiz-generator", response_model=QuizGeneratorResponse)
async def generate_quiz(request: QuizGeneratorRequest):
    """
    Generate a quiz on a specific topic.

    The AI generates relevant quiz questions based on the topic,
    difficulty level, and number of questions requested.

    Args:
        request: Quiz generator request with topic, difficulty, and num_questions

    Returns:
        Generated quiz questions

    Raises:
        HTTPException: 404 if student not found, 400 for invalid parameters
    """
    # Verify student exists
    student = db.get_student_by_id(request.student_id)
    if not student:
        raise HTTPException(
            status_code=404,
            detail=f"Student with ID {request.student_id} not found"
        )

    # Validate num_questions
    if request.num_questions < 1 or request.num_questions > 20:
        raise HTTPException(
            status_code=400,
            detail="Number of questions must be between 1 and 20"
        )

    # Generate quiz questions
    questions = generate_quiz_questions(
        topic=request.topic,
        difficulty=request.difficulty,
        num_questions=request.num_questions
    )

    # Convert to Pydantic models
    quiz_questions = [
        QuizQuestion(
            question=q['question'],
            options=q['options'],
            correct_answer=q['correct_answer'],
            explanation=q['explanation']
        )
        for q in questions
    ]

    # Log the interaction
    db.log_ai_session(
        student_id=request.student_id,
        session_type='quiz_helper',
        input_summary=f"Generated {request.num_questions} {request.difficulty} questions on {request.topic}",
        response_summary=f"Successfully generated {len(quiz_questions)} questions"
    )

    return QuizGeneratorResponse(
        student_id=request.student_id,
        topic=request.topic,
        difficulty=request.difficulty,
        questions=quiz_questions,
        generated_at=datetime.now()
    )


@router.post("/research-assistant", response_model=ResearchAssistantResponse)
async def research_assistant(request: ResearchAssistantRequest):
    """
    Get research assistance for thesis/project work.

    The AI research assistant helps with:
    - Refining research questions
    - Structuring literature reviews
    - Organizing thesis structure

    Args:
        request: Research assistant request with research description and help type

    Returns:
        Structured research guidance

    Raises:
        HTTPException: 404 if student not found, 400 for invalid help_type
    """
    # Verify student exists
    student = db.get_student_by_id(request.student_id)
    if not student:
        raise HTTPException(
            status_code=404,
            detail=f"Student with ID {request.student_id} not found"
        )

    # Validate help_type
    valid_help_types = ['research_question', 'literature_review', 'structure']
    if request.help_type not in valid_help_types:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid help_type. Must be one of: {', '.join(valid_help_types)}"
        )

    # Generate research assistance
    assistance = generate_research_assistance(
        research_description=request.research_description,
        help_type=request.help_type
    )

    # Log the interaction
    db.log_ai_session(
        student_id=request.student_id,
        session_type='research',
        input_summary=f"{request.help_type}: {request.research_description[:100]}",
        response_summary=f"Provided {request.help_type} assistance"
    )

    return ResearchAssistantResponse(
        student_id=request.student_id,
        help_type=request.help_type,
        suggested_outline=assistance['suggested_outline'],
        suggested_keywords=assistance['suggested_keywords'],
        advice=assistance['advice'],
        references=assistance['references'],
        generated_at=datetime.now()
    )
