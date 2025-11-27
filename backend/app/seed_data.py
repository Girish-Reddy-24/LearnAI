import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import AsyncSessionLocal, init_db
from app import models_sqlite as models
from datetime import datetime

async def seed_database():
    print("Initializing database...")
    await init_db()

    async with AsyncSessionLocal() as db:
        print("Creating sample courses...")

        courses_data = [
            {
                "title": "Introduction to Python Programming",
                "description": "Learn Python from scratch with hands-on projects",
                "category": "Programming",
                "difficulty_level": "beginner",
                "duration_weeks": 8,
                "instructor": "Dr. Sarah Johnson",
                "is_active": True
            },
            {
                "title": "Advanced Machine Learning",
                "description": "Master ML algorithms and neural networks",
                "category": "AI/ML",
                "difficulty_level": "advanced",
                "duration_weeks": 12,
                "instructor": "Prof. Michael Chen",
                "is_active": True
            },
            {
                "title": "Web Development with React",
                "description": "Build modern web applications with React",
                "category": "Web Development",
                "difficulty_level": "intermediate",
                "duration_weeks": 10,
                "instructor": "Emily Rodriguez",
                "is_active": True
            },
            {
                "title": "Database Design and SQL",
                "description": "Master relational databases and SQL queries",
                "category": "Database",
                "difficulty_level": "beginner",
                "duration_weeks": 6,
                "instructor": "David Park",
                "is_active": True
            },
            {
                "title": "Data Structures and Algorithms",
                "description": "Essential CS fundamentals for technical interviews",
                "category": "Computer Science",
                "difficulty_level": "intermediate",
                "duration_weeks": 10,
                "instructor": "Dr. Lisa Anderson",
                "is_active": True
            }
        ]

        courses = []
        for course_data in courses_data:
            course = models.Course(**course_data)
            db.add(course)
            courses.append(course)

        await db.commit()
        print(f"Created {len(courses)} courses")

        print("Creating course modules...")
        modules_data = [
            {
                "course_id": 1,
                "title": "Python Basics - Variables and Data Types",
                "description": "Learn about Python variables, strings, numbers, and basic operations",
                "video_url": "https://www.youtube.com/watch?v=rfscVS0vtbw",
                "duration_minutes": 45,
                "order_index": 1,
                "content": "Introduction to Python syntax and basic data types"
            },
            {
                "course_id": 1,
                "title": "Control Flow - If Statements and Loops",
                "description": "Master conditional statements and loops in Python",
                "video_url": "https://www.youtube.com/watch?v=DZwmZ8Usvnk",
                "duration_minutes": 50,
                "order_index": 2,
                "content": "Understanding if/else, for loops, and while loops"
            },
            {
                "course_id": 1,
                "title": "Functions and Modules",
                "description": "Create reusable code with functions and modules",
                "video_url": "https://www.youtube.com/watch?v=9Os0o3wzS_I",
                "duration_minutes": 55,
                "order_index": 3,
                "content": "Defining functions, parameters, return values, and importing modules"
            },
            {
                "course_id": 2,
                "title": "Introduction to Neural Networks",
                "description": "Understanding the basics of artificial neural networks",
                "video_url": "https://www.youtube.com/watch?v=aircAruvnKk",
                "duration_minutes": 60,
                "order_index": 1,
                "content": "Neural network architecture, activation functions, and forward propagation"
            },
            {
                "course_id": 2,
                "title": "Deep Learning with TensorFlow",
                "description": "Build deep learning models using TensorFlow",
                "video_url": "https://www.youtube.com/watch?v=tPYj3fFJGjk",
                "duration_minutes": 90,
                "order_index": 2,
                "content": "TensorFlow basics, building models, training, and evaluation"
            },
            {
                "course_id": 3,
                "title": "React Fundamentals",
                "description": "Learn React components, props, and state",
                "video_url": "https://www.youtube.com/watch?v=Ke90Tje7VS0",
                "duration_minutes": 75,
                "order_index": 1,
                "content": "JSX, components, props, state management"
            },
            {
                "course_id": 3,
                "title": "React Hooks",
                "description": "Master useState, useEffect, and custom hooks",
                "video_url": "https://www.youtube.com/watch?v=TNhaISOUy6Q",
                "duration_minutes": 60,
                "order_index": 2,
                "content": "Using hooks for state and side effects"
            },
            {
                "course_id": 4,
                "title": "SQL Basics",
                "description": "Learn SQL SELECT, INSERT, UPDATE, and DELETE",
                "video_url": "https://www.youtube.com/watch?v=HXV3zeQKqGY",
                "duration_minutes": 50,
                "order_index": 1,
                "content": "Basic SQL queries and CRUD operations"
            },
            {
                "course_id": 4,
                "title": "Database Design",
                "description": "Normalization, relationships, and schema design",
                "video_url": "https://www.youtube.com/watch?v=ztHopE5Wnpc",
                "duration_minutes": 65,
                "order_index": 2,
                "content": "ER diagrams, normalization forms, foreign keys"
            },
            {
                "course_id": 5,
                "title": "Big O Notation",
                "description": "Understand time and space complexity",
                "video_url": "https://www.youtube.com/watch?v=Mo4vesaut8g",
                "duration_minutes": 40,
                "order_index": 1,
                "content": "Analyzing algorithm efficiency"
            }
        ]

        for module_data in modules_data:
            module = models.CourseModule(**module_data)
            db.add(module)

        await db.commit()
        print(f"Created {len(modules_data)} course modules")

        print("Creating career paths...")
        career_paths_data = [
            {
                "title": "Software Engineer",
                "description": "Design and develop software applications",
                "required_skills": ["Python", "JavaScript", "Git", "Data Structures", "Algorithms"],
                "avg_salary": "$110,000 - $160,000",
                "job_growth": "22% (Much faster than average)",
                "related_courses": [1, 3, 5]
            },
            {
                "title": "Machine Learning Engineer",
                "description": "Build and deploy ML models for production",
                "required_skills": ["Python", "TensorFlow", "Statistics", "Deep Learning", "MLOps"],
                "avg_salary": "$130,000 - $180,000",
                "job_growth": "31% (Much faster than average)",
                "related_courses": [1, 2]
            },
            {
                "title": "Full Stack Developer",
                "description": "Develop both frontend and backend applications",
                "required_skills": ["React", "Node.js", "SQL", "REST APIs", "JavaScript"],
                "avg_salary": "$100,000 - $150,000",
                "job_growth": "20% (Much faster than average)",
                "related_courses": [3, 4]
            }
        ]

        for career_data in career_paths_data:
            career = models.CareerPath(**career_data)
            db.add(career)

        await db.commit()
        print(f"Created {len(career_paths_data)} career paths")

        print("\n✅ Database seeded successfully!")
        print("\nSample Data Created:")
        print(f"  - {len(courses)} courses")
        print(f"  - {len(modules_data)} course modules")
        print(f"  - {len(career_paths_data)} career paths")
        print("\nYou can now start the API server with:")
        print("  uvicorn app.main_sqlite:app --reload")

if __name__ == "__main__":
    asyncio.run(seed_database())
