"""
In-memory database for the learning platform.
In production, this would be replaced with a real database (PostgreSQL, MySQL, etc.)
or connected to Supabase.

This module provides simple CRUD operations and stores data in Python dictionaries.
"""

from datetime import datetime, date, timedelta
from typing import List, Optional, Dict, Any
import random


# ============================================
# IN-MEMORY DATA STORAGE
# ============================================

students: Dict[int, Dict[str, Any]] = {}
courses: Dict[int, Dict[str, Any]] = {}
enrollments: Dict[int, Dict[str, Any]] = {}
quiz_results: Dict[int, Dict[str, Any]] = {}
study_activities: Dict[int, Dict[str, Any]] = {}
recommendations: Dict[int, Dict[str, Any]] = {}
ai_session_logs: Dict[int, Dict[str, Any]] = {}
career_paths: Dict[int, Dict[str, Any]] = {}

# Auto-increment counters
next_id = {
    'students': 1,
    'courses': 1,
    'enrollments': 1,
    'quiz_results': 1,
    'study_activities': 1,
    'recommendations': 1,
    'ai_session_logs': 1,
    'career_paths': 1
}


# ============================================
# HELPER FUNCTIONS
# ============================================

def get_next_id(entity: str) -> int:
    """Get next auto-increment ID for an entity"""
    id_value = next_id[entity]
    next_id[entity] += 1
    return id_value


def get_student_by_id(student_id: int) -> Optional[Dict[str, Any]]:
    """Get student by ID"""
    return students.get(student_id)


def get_course_by_id(course_id: int) -> Optional[Dict[str, Any]]:
    """Get course by ID"""
    return courses.get(course_id)


def get_student_enrollments(student_id: int) -> List[Dict[str, Any]]:
    """Get all enrollments for a student"""
    return [e for e in enrollments.values() if e['student_id'] == student_id]


def get_student_quiz_results(student_id: int) -> List[Dict[str, Any]]:
    """Get all quiz results for a student"""
    return [q for q in quiz_results.values() if q['student_id'] == student_id]


def get_student_study_activities(student_id: int, days: int = 7) -> List[Dict[str, Any]]:
    """Get recent study activities for a student"""
    cutoff_date = date.today() - timedelta(days=days)
    return [
        a for a in study_activities.values()
        if a['student_id'] == student_id and a['date'] >= cutoff_date
    ]


def get_student_recommendations(student_id: int) -> List[Dict[str, Any]]:
    """Get all recommendations for a student"""
    return [r for r in recommendations.values() if r['student_id'] == student_id]


def get_all_courses(active_only: bool = True) -> List[Dict[str, Any]]:
    """Get all courses"""
    if active_only:
        return [c for c in courses.values() if c.get('is_active', True)]
    return list(courses.values())


def get_career_path_by_name(career_name: str) -> Optional[Dict[str, Any]]:
    """Get career path by name"""
    for career in career_paths.values():
        if career['career_name'].lower() == career_name.lower():
            return career
    return None


def get_all_career_paths() -> List[Dict[str, Any]]:
    """Get all career paths"""
    return list(career_paths.values())


def log_ai_session(student_id: int, session_type: str, input_summary: str, response_summary: str) -> Dict[str, Any]:
    """Log an AI interaction"""
    log_id = get_next_id('ai_session_logs')
    log = {
        'id': log_id,
        'student_id': student_id,
        'session_type': session_type,
        'input_summary': input_summary,
        'response_summary': response_summary,
        'created_at': datetime.now()
    }
    ai_session_logs[log_id] = log
    return log


# ============================================
# SEED DATA FUNCTIONS
# ============================================

def seed_students():
    """Create sample students"""
    sample_students = [
        {
            'id': get_next_id('students'),
            'name': 'Alice Johnson',
            'email': 'alice.johnson@silverleaf.edu',
            'program': 'MS in Information Systems',
            'interests': ['AI', 'Data Science', 'Cloud Computing'],
            'learning_style': 'Visual',
            'target_career': 'Data Scientist',
            'join_date': date(2023, 9, 1)
        },
        {
            'id': get_next_id('students'),
            'name': 'Bob Martinez',
            'email': 'bob.martinez@silverleaf.edu',
            'program': 'MS in Computer Science',
            'interests': ['Machine Learning', 'Deep Learning', 'NLP'],
            'learning_style': 'Hands-on',
            'target_career': 'ML Engineer',
            'join_date': date(2023, 9, 1)
        },
        {
            'id': get_next_id('students'),
            'name': 'Carol Chen',
            'email': 'carol.chen@silverleaf.edu',
            'program': 'MS in Data Analytics',
            'interests': ['Business Intelligence', 'Data Visualization', 'SQL'],
            'learning_style': 'Reading/Writing',
            'target_career': 'Business Analyst',
            'join_date': date(2024, 1, 15)
        },
        {
            'id': get_next_id('students'),
            'name': 'David Kim',
            'email': 'david.kim@silverleaf.edu',
            'program': 'MS in Software Engineering',
            'interests': ['Web Development', 'Cloud', 'DevOps'],
            'learning_style': 'Visual',
            'target_career': 'Full Stack Developer',
            'join_date': date(2023, 9, 1)
        },
        {
            'id': get_next_id('students'),
            'name': 'Emma Wilson',
            'email': 'emma.wilson@silverleaf.edu',
            'program': 'MS in Cybersecurity',
            'interests': ['Security', 'Networking', 'Ethical Hacking'],
            'learning_style': 'Hands-on',
            'target_career': 'Security Engineer',
            'join_date': date(2024, 1, 15)
        }
    ]

    for student in sample_students:
        students[student['id']] = student


def seed_courses():
    """Create sample courses"""
    sample_courses = [
        {
            'id': get_next_id('courses'),
            'title': 'Python Programming Fundamentals',
            'category': 'Programming',
            'difficulty': 'Beginner',
            'duration_hours': 40.0,
            'tags': ['Python', 'Programming', 'Fundamentals'],
            'description': 'Learn Python from scratch with hands-on projects',
            'is_active': True
        },
        {
            'id': get_next_id('courses'),
            'title': 'Machine Learning with Python',
            'category': 'Data Science',
            'difficulty': 'Intermediate',
            'duration_hours': 60.0,
            'tags': ['Machine Learning', 'Python', 'scikit-learn'],
            'description': 'Master ML algorithms and build predictive models',
            'is_active': True
        },
        {
            'id': get_next_id('courses'),
            'title': 'Deep Learning and Neural Networks',
            'category': 'AI',
            'difficulty': 'Advanced',
            'duration_hours': 80.0,
            'tags': ['Deep Learning', 'Neural Networks', 'TensorFlow', 'PyTorch'],
            'description': 'Build and train deep neural networks',
            'is_active': True
        },
        {
            'id': get_next_id('courses'),
            'title': 'Data Structures and Algorithms',
            'category': 'Programming',
            'difficulty': 'Intermediate',
            'duration_hours': 50.0,
            'tags': ['Algorithms', 'Data Structures', 'Problem Solving'],
            'description': 'Master fundamental algorithms and data structures',
            'is_active': True
        },
        {
            'id': get_next_id('courses'),
            'title': 'SQL and Database Management',
            'category': 'Database',
            'difficulty': 'Beginner',
            'duration_hours': 30.0,
            'tags': ['SQL', 'Database', 'PostgreSQL'],
            'description': 'Learn SQL queries and database design',
            'is_active': True
        },
        {
            'id': get_next_id('courses'),
            'title': 'Web Development with React',
            'category': 'Web Development',
            'difficulty': 'Intermediate',
            'duration_hours': 55.0,
            'tags': ['React', 'JavaScript', 'Frontend'],
            'description': 'Build modern web applications with React',
            'is_active': True
        },
        {
            'id': get_next_id('courses'),
            'title': 'Cloud Computing with AWS',
            'category': 'Cloud',
            'difficulty': 'Intermediate',
            'duration_hours': 45.0,
            'tags': ['AWS', 'Cloud', 'DevOps'],
            'description': 'Deploy and manage applications on AWS',
            'is_active': True
        },
        {
            'id': get_next_id('courses'),
            'title': 'Natural Language Processing',
            'category': 'AI',
            'difficulty': 'Advanced',
            'duration_hours': 70.0,
            'tags': ['NLP', 'AI', 'Text Processing'],
            'description': 'Process and analyze text data with NLP techniques',
            'is_active': True
        },
        {
            'id': get_next_id('courses'),
            'title': 'Data Visualization with Python',
            'category': 'Data Science',
            'difficulty': 'Beginner',
            'duration_hours': 25.0,
            'tags': ['Visualization', 'Python', 'Matplotlib', 'Seaborn'],
            'description': 'Create compelling data visualizations',
            'is_active': True
        },
        {
            'id': get_next_id('courses'),
            'title': 'Cybersecurity Fundamentals',
            'category': 'Security',
            'difficulty': 'Beginner',
            'duration_hours': 35.0,
            'tags': ['Security', 'Networking', 'Encryption'],
            'description': 'Learn the basics of cybersecurity',
            'is_active': True
        }
    ]

    for course in sample_courses:
        courses[course['id']] = course


def seed_enrollments():
    """Create sample enrollments"""
    # Student 1 (Alice) - Data Science focus
    enrollments[get_next_id('enrollments')] = {
        'id': next_id['enrollments'] - 1,
        'student_id': 1,
        'course_id': 1,  # Python Programming
        'progress_percent': 100.0,
        'completion_status': 'Completed',
        'last_accessed': datetime.now() - timedelta(days=30),
        'average_quiz_score': 92.5
    }

    enrollments[get_next_id('enrollments')] = {
        'id': next_id['enrollments'] - 1,
        'student_id': 1,
        'course_id': 2,  # Machine Learning
        'progress_percent': 75.0,
        'completion_status': 'In progress',
        'last_accessed': datetime.now() - timedelta(hours=2),
        'average_quiz_score': 88.0
    }

    enrollments[get_next_id('enrollments')] = {
        'id': next_id['enrollments'] - 1,
        'student_id': 1,
        'course_id': 9,  # Data Visualization
        'progress_percent': 45.0,
        'completion_status': 'In progress',
        'last_accessed': datetime.now() - timedelta(days=1),
        'average_quiz_score': 85.0
    }

    # Student 2 (Bob) - ML Engineer focus
    enrollments[get_next_id('enrollments')] = {
        'id': next_id['enrollments'] - 1,
        'student_id': 2,
        'course_id': 2,  # Machine Learning
        'progress_percent': 90.0,
        'completion_status': 'In progress',
        'last_accessed': datetime.now() - timedelta(hours=5),
        'average_quiz_score': 94.0
    }

    enrollments[get_next_id('enrollments')] = {
        'id': next_id['enrollments'] - 1,
        'student_id': 2,
        'course_id': 3,  # Deep Learning
        'progress_percent': 60.0,
        'completion_status': 'In progress',
        'last_accessed': datetime.now() - timedelta(hours=12),
        'average_quiz_score': 90.0
    }

    enrollments[get_next_id('enrollments')] = {
        'id': next_id['enrollments'] - 1,
        'student_id': 2,
        'course_id': 8,  # NLP
        'progress_percent': 30.0,
        'completion_status': 'In progress',
        'last_accessed': datetime.now() - timedelta(days=2),
        'average_quiz_score': 87.0
    }

    # Student 3 (Carol) - Business Analyst focus
    enrollments[get_next_id('enrollments')] = {
        'id': next_id['enrollments'] - 1,
        'student_id': 3,
        'course_id': 5,  # SQL
        'progress_percent': 100.0,
        'completion_status': 'Completed',
        'last_accessed': datetime.now() - timedelta(days=7),
        'average_quiz_score': 95.0
    }

    enrollments[get_next_id('enrollments')] = {
        'id': next_id['enrollments'] - 1,
        'student_id': 3,
        'course_id': 9,  # Data Visualization
        'progress_percent': 80.0,
        'completion_status': 'In progress',
        'last_accessed': datetime.now() - timedelta(hours=3),
        'average_quiz_score': 91.0
    }


def seed_quiz_results():
    """Create sample quiz results"""
    # Recent quiz results for students
    quiz_data = [
        {'student_id': 1, 'course_id': 2, 'score': 88.0, 'days_ago': 1, 'difficulty': 'Medium'},
        {'student_id': 1, 'course_id': 2, 'score': 92.0, 'days_ago': 3, 'difficulty': 'Medium'},
        {'student_id': 1, 'course_id': 9, 'score': 85.0, 'days_ago': 2, 'difficulty': 'Easy'},
        {'student_id': 2, 'course_id': 2, 'score': 94.0, 'days_ago': 1, 'difficulty': 'Hard'},
        {'student_id': 2, 'course_id': 3, 'score': 90.0, 'days_ago': 2, 'difficulty': 'Hard'},
        {'student_id': 3, 'course_id': 9, 'score': 91.0, 'days_ago': 1, 'difficulty': 'Easy'},
    ]

    for quiz in quiz_data:
        quiz_results[get_next_id('quiz_results')] = {
            'id': next_id['quiz_results'] - 1,
            'student_id': quiz['student_id'],
            'course_id': quiz['course_id'],
            'score_percent': quiz['score'],
            'date': datetime.now() - timedelta(days=quiz['days_ago']),
            'difficulty_level': quiz['difficulty']
        }


def seed_study_activities():
    """Create sample study activities"""
    # Generate study activities for the past 7 days
    for student_id in [1, 2, 3]:
        for days_ago in range(7):
            study_date = date.today() - timedelta(days=days_ago)
            minutes = random.randint(30, 180)

            # Get a random enrolled course for this student
            student_enrollments = get_student_enrollments(student_id)
            if student_enrollments:
                course_id = random.choice(student_enrollments)['course_id']
            else:
                course_id = None

            study_activities[get_next_id('study_activities')] = {
                'id': next_id['study_activities'] - 1,
                'student_id': student_id,
                'date': study_date,
                'minutes_studied': minutes,
                'course_id': course_id
            }


def seed_recommendations():
    """Create sample recommendations"""
    recs = [
        {
            'student_id': 1,
            'type': 'course',
            'title': 'Deep Learning and Neural Networks',
            'reason': 'Based on your progress in Machine Learning and interest in AI'
        },
        {
            'student_id': 1,
            'type': 'certification',
            'title': 'AWS Certified Machine Learning - Specialty',
            'reason': 'Aligns with your Data Scientist career goal'
        },
        {
            'student_id': 2,
            'type': 'course',
            'title': 'Natural Language Processing',
            'reason': 'Complements your ML Engineer path and current coursework'
        },
        {
            'student_id': 3,
            'type': 'course',
            'title': 'Python Programming Fundamentals',
            'reason': 'Essential for advanced data analysis'
        },
    ]

    for rec in recs:
        recommendations[get_next_id('recommendations')] = {
            'id': next_id['recommendations'] - 1,
            'student_id': rec['student_id'],
            'type': rec['type'],
            'title': rec['title'],
            'reason': rec['reason'],
            'created_at': datetime.now() - timedelta(days=random.randint(1, 7))
        }


def seed_career_paths():
    """Create sample career paths"""
    careers = [
        {
            'id': get_next_id('career_paths'),
            'career_name': 'Data Scientist',
            'description': 'Analyze complex data to help organizations make better decisions',
            'average_salary_range': '$95,000 - $165,000',
            'recommended_courses': [
                'Python Programming Fundamentals',
                'Machine Learning with Python',
                'Data Visualization with Python',
                'SQL and Database Management'
            ],
            'recommended_certs': [
                'AWS Certified Machine Learning - Specialty',
                'Google Professional Data Engineer',
                'Microsoft Certified: Azure Data Scientist Associate'
            ],
            'recommended_skills': [
                'Python', 'R', 'SQL', 'Machine Learning', 'Statistics',
                'Data Visualization', 'Big Data', 'Deep Learning'
            ],
            'job_outlook': 'Excellent - 36% growth expected over next 10 years'
        },
        {
            'id': get_next_id('career_paths'),
            'career_name': 'ML Engineer',
            'description': 'Design and implement machine learning systems and algorithms',
            'average_salary_range': '$112,000 - $185,000',
            'recommended_courses': [
                'Machine Learning with Python',
                'Deep Learning and Neural Networks',
                'Natural Language Processing',
                'Cloud Computing with AWS'
            ],
            'recommended_certs': [
                'TensorFlow Developer Certificate',
                'AWS Certified Machine Learning - Specialty',
                'Google Professional ML Engineer'
            ],
            'recommended_skills': [
                'Python', 'TensorFlow', 'PyTorch', 'Deep Learning', 'MLOps',
                'Cloud Platforms', 'Docker', 'Kubernetes', 'Algorithm Design'
            ],
            'job_outlook': 'Excellent - 40% growth expected over next 10 years'
        },
        {
            'id': get_next_id('career_paths'),
            'career_name': 'Full Stack Developer',
            'description': 'Build complete web applications from frontend to backend',
            'average_salary_range': '$85,000 - $145,000',
            'recommended_courses': [
                'Python Programming Fundamentals',
                'Web Development with React',
                'SQL and Database Management',
                'Cloud Computing with AWS'
            ],
            'recommended_certs': [
                'AWS Certified Developer - Associate',
                'Meta Front-End Developer Professional Certificate',
                'Oracle Certified Professional: Java SE Programmer'
            ],
            'recommended_skills': [
                'JavaScript', 'React', 'Node.js', 'Python', 'SQL',
                'HTML/CSS', 'RESTful APIs', 'Git', 'Docker'
            ],
            'job_outlook': 'Very Good - 25% growth expected over next 10 years'
        }
    ]

    for career in careers:
        career_paths[career['id']] = career


def initialize_database():
    """Initialize the in-memory database with seed data"""
    seed_students()
    seed_courses()
    seed_enrollments()
    seed_quiz_results()
    seed_study_activities()
    seed_recommendations()
    seed_career_paths()

    print(f"✓ Database initialized with:")
    print(f"  - {len(students)} students")
    print(f"  - {len(courses)} courses")
    print(f"  - {len(enrollments)} enrollments")
    print(f"  - {len(quiz_results)} quiz results")
    print(f"  - {len(study_activities)} study activities")
    print(f"  - {len(recommendations)} recommendations")
    print(f"  - {len(career_paths)} career paths")


# ============================================
# SIMPLE PERSIST FUNCTIONS FOR AI SESSIONS & NOTIFICATIONS
# ============================================
def add_ai_session(student_id: int, session_type: str, input_summary: str, response_summary: str) -> Dict:
    """Store a simple AI session log"""
    sid = get_next_id('ai_session_logs')
    ai_session_logs[sid] = {
        'id': sid,
        'student_id': student_id,
        'session_type': session_type,
        'input_summary': input_summary,
        'response_summary': response_summary,
        'created_at': datetime.now()
    }
    return ai_session_logs[sid]


# Notifications storage (re-using 'study_activities' dict for simplicity)
notifications: Dict[int, Dict[str, Any]] = {}
next_id['notifications'] = next_id.get('notifications', max(next_id.values())+1)

def add_notification(student_id: int, title: str, message: str, due_date: Optional[date] = None) -> Dict:
    nid = get_next_id('notifications')
    notifications[nid] = {
        'id': nid,
        'student_id': student_id,
        'title': title,
        'message': message,
        'due_date': due_date,
        'created_at': datetime.now(),
        'is_read': False
    }
    return notifications[nid]

def get_notifications_for_student(student_id: int) -> List[Dict[str, Any]]:
    return [n for n in notifications.values() if n['student_id'] == student_id]
