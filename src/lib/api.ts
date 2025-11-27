import { supabase } from './supabase';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const API_BASE_URL = 'http://localhost:8000';

export interface Student {
  student_id: string;
  name: string;
  email: string;
  program: string;
  year: number;
  gpa: number;
  enrollment_date: string;
}

export interface Course {
  course_id: string;
  title: string;
  description: string;
  category: string;
  difficulty_level: string;
  duration_weeks: number;
  instructor: string;
}

export interface Enrollment {
  enrollment_id: string;
  student_id: string;
  course_id: string;
  enrolled_date: string;
  progress: number;
  status: string;
  last_accessed?: string;
  completion_date?: string;
}

export interface DashboardStats {
  total_courses_enrolled: number;
  total_courses_completed: number;
  total_time_spent_hours: number;
  current_streak_days: number;
  avg_quiz_score: number;
  total_ai_tutor_interactions: number;
}

export interface StudyActivity {
  date: string;
  hours_studied: number;
  topics: string[];
}

export interface AITutorResponse {
  response: string;
  topic_detected?: string;
  suggested_resources?: string[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

export interface Quiz {
  quiz_id: string;
  topic: string;
  difficulty: string;
  questions: QuizQuestion[];
}

export interface CareerPath {
  career_id: string;
  title: string;
  description: string;
  required_skills: string[];
  avg_salary: string;
  job_growth: string;
  related_courses: string[];
}

class ApiService {
  private async fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API call failed for ${endpoint}:`, error);
      throw error;
    }
  }

  async getStudent(studentId: string): Promise<Student> {
    return this.fetchApi<Student>(`/api/students/${studentId}`);
  }

  async getAllStudents(): Promise<Student[]> {
    return this.fetchApi<Student[]>('/api/students/');
  }

  async getStudentEnrollments(studentId: string): Promise<Enrollment[]> {
    return this.fetchApi<Enrollment[]>(`/api/students/${studentId}/enrollments`);
  }

  async getDashboardStats(studentId: string): Promise<DashboardStats> {
    return this.fetchApi<DashboardStats>(`/api/dashboard/${studentId}/stats`);
  }

  async getStudyActivity(studentId: string, days: number = 30): Promise<StudyActivity[]> {
    return this.fetchApi<StudyActivity[]>(`/api/dashboard/${studentId}/study-activity?days=${days}`);
  }

  async getAllCourses(): Promise<Course[]> {
    return this.fetchApi<Course[]>('/api/courses/');
  }

  async getCourse(courseId: string): Promise<Course> {
    return this.fetchApi<Course>(`/api/courses/${courseId}`);
  }

  async getCoursesByCategory(category: string): Promise<Course[]> {
    return this.fetchApi<Course[]>(`/api/courses/category/${category}`);
  }

  async askAITutor(question: string, courseId?: string, context?: string): Promise<AITutorResponse> {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${SUPABASE_URL}/functions/v1/ai-tutor`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question, courseId, context }),
    });

    if (!response.ok) {
      throw new Error('Failed to get AI tutor response');
    }

    return await response.json();
  }

  async generateQuiz(courseId: string, topic: string, difficulty: string, numQuestions: number = 5): Promise<any> {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-quiz`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        courseId,
        topic,
        difficulty,
        numQuestions,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate quiz');
    }

    return await response.json();
  }

  async getResearchAssistance(query: string, category?: string): Promise<any> {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${SUPABASE_URL}/functions/v1/research-assistant`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, category }),
    });

    if (!response.ok) {
      throw new Error('Failed to get research assistance');
    }

    return await response.json();
  }

  async getRecommendations(): Promise<any> {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${SUPABASE_URL}/functions/v1/recommendations`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get recommendations');
    }

    return await response.json();
  }

  async getCareerPaths(): Promise<CareerPath[]> {
    return this.fetchApi<CareerPath[]>('/api/careers/paths');
  }

  async getCareerRecommendations(studentId: string): Promise<CareerPath[]> {
    return this.fetchApi<CareerPath[]>(`/api/careers/recommendations/${studentId}`);
  }

  async getCareerRoadmap(careerTitle: string): Promise<any> {
    return this.fetchApi(`/api/careers/roadmap/${encodeURIComponent(careerTitle)}`);
  }

  async healthCheck(): Promise<{ status: string; timestamp: string; version: string }> {
    return this.fetchApi('/health');
  }
}

export const apiService = new ApiService();
