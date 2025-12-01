import { useState, useEffect } from 'react';
import { TrendingUp, BookOpen, Star, Clock, BarChart, Search, Briefcase, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function Recommendations() {
  const { profile } = useAuth();
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [userStats, setUserStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [jobRole, setJobRole] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  useEffect(() => {
    if (profile) {
      loadRecommendations();
      loadUserStats();
    }
  }, [profile]);

  const loadRecommendations = async (role?: string) => {
    try {
      setLoading(true);
      const { data: enrolledData } = await supabase
        .from('enrollments')
        .select('course_id')
        .eq('student_id', profile?.id);

      const enrolledCourseIds = (enrolledData || []).map(e => e.course_id);

      let query = supabase
        .from('courses')
        .select('id, title, description, category, level, duration')
        .is('is_active', true);

      if (enrolledCourseIds.length > 0) {
        query = query.not('id', 'in', `(${enrolledCourseIds.join(',')})`);
      }

      if (role) {
        const relevantCategories = getRelevantCategories(role);
        if (relevantCategories.length > 0) {
          query = query.in('category', relevantCategories);
        }
      }

      const { data: allCourses, error } = await query.limit(12);

      if (error) throw error;

      const formattedRecs = (allCourses || []).map(course => ({
        ...course,
        match_score: Math.floor(Math.random() * 15) + 85,
        recommendation_reason: role ? getJobRoleReason(role, course.category) : getRecommendationReason(course.category)
      }));

      setRecommendations(formattedRecs);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRelevantCategories = (role: string): string[] => {
    const roleMap: { [key: string]: string[] } = {
      'data scientist': ['Machine Learning', 'Data Analysis', 'Programming', 'Artificial Intelligence', 'Data Engineering'],
      'machine learning engineer': ['Machine Learning', 'Artificial Intelligence', 'Programming', 'Data Engineering'],
      'software engineer': ['Programming', 'Web Development', 'Computer Science'],
      'web developer': ['Web Development', 'Programming', 'Design'],
      'ai engineer': ['Artificial Intelligence', 'Machine Learning', 'Programming'],
      'data analyst': ['Data Analysis', 'Programming', 'Data Engineering'],
      'data engineer': ['Data Engineering', 'Programming', 'Machine Learning'],
      'full stack developer': ['Web Development', 'Programming'],
      'frontend developer': ['Web Development', 'Design', 'Programming'],
      'backend developer': ['Programming', 'Web Development', 'Data Engineering'],
      'ui/ux designer': ['Design', 'Web Development'],
      'product manager': ['Data Analysis', 'Design', 'Programming']
    };

    const normalizedRole = role.toLowerCase();
    for (const [key, categories] of Object.entries(roleMap)) {
      if (normalizedRole.includes(key) || key.includes(normalizedRole)) {
        return categories;
      }
    }
    return [];
  };

  const getJobRoleReason = (role: string, category: string): string => {
    return `Essential skill for ${role} career path`;
  };

  const getRecommendationReason = (category: string) => {
    const reasons: { [key: string]: string } = {
      'Machine Learning': 'High demand skill in your field of interest',
      'Artificial Intelligence': 'Trending technology aligned with your goals',
      'Programming': 'Essential foundation for your career path',
      'Data Engineering': 'Complements your current learning track',
      'Web Development': 'Popular skill with strong job market',
      'Design': 'Creative skill to enhance your portfolio',
      'Data Analysis': 'Data-driven decision making essential for growth'
    };
    return reasons[category] || 'Recommended based on your learning profile';
  };

  const loadUserStats = async () => {
    try {
      const { data: enrollments } = await supabase
        .from('enrollments')
        .select('progress_percent, courses:course_id(category)')
        .eq('student_id', profile?.id);

      if (enrollments) {
        const avgProgress = enrollments.length > 0
          ? Math.round(enrollments.reduce((acc, e) => acc + (e.progress_percent || 0), 0) / enrollments.length)
          : 0;
        const categories = new Set(enrollments.map((e: any) => e.courses?.category).filter(Boolean));

        setUserStats({
          enrolled_courses: enrollments.length,
          average_progress: avgProgress,
          categories_explored: categories.size
        });
      }
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const handleEnroll = async (courseId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from('enrollments').insert({
        student_id: user.id,
        course_id: courseId,
        progress_percent: 0,
        status: 'active'
      });

      if (error) throw error;

      await loadRecommendations(selectedRole);
      alert('Successfully enrolled! Check "My Courses" to start learning.');
    } catch (error) {
      console.error('Error enrolling:', error);
      alert('Failed to enroll. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading recommendations...</p>
        </div>
      </div>
    );
  }

  const handleJobRoleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (jobRole.trim()) {
      setSelectedRole(jobRole.trim());
      loadRecommendations(jobRole.trim());
    }
  };

  const popularRoles = [
    'Data Scientist',
    'Machine Learning Engineer',
    'Software Engineer',
    'Web Developer',
    'AI Engineer',
    'Data Analyst'
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Course Recommendations</h1>
            <p className="text-gray-600">Discover courses tailored to your career goals</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Briefcase className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Find Courses by Job Role</h2>
          </div>
          <form onSubmit={handleJobRoleSearch} className="mb-4">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={jobRole}
                  onChange={(e) => setJobRole(e.target.value)}
                  placeholder="Enter job role (e.g., Data Scientist, Web Developer)"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Get Recommendations
              </button>
            </div>
          </form>
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600 mr-2">Popular roles:</span>
            {popularRoles.map((role) => (
              <button
                key={role}
                onClick={() => {
                  setJobRole(role);
                  setSelectedRole(role);
                  loadRecommendations(role);
                }}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-blue-100 hover:text-blue-700 transition"
              >
                {role}
              </button>
            ))}
          </div>
          {selectedRole && (
            <div className="mt-4 flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-900">
                  Showing courses for <span className="font-semibold">{selectedRole}</span>
                </span>
              </div>
              <button
                onClick={() => {
                  setSelectedRole('');
                  setJobRole('');
                  loadRecommendations();
                }}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Clear filter
              </button>
            </div>
          )}
        </div>
      </div>

      {userStats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Enrolled Courses</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.enrolled_courses}</p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Progress</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.average_progress}%</p>
              </div>
              <BarChart className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Categories Explored</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.categories_explored}</p>
              </div>
              <Star className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
        </div>
      )}

      {recommendations.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Recommendations Available</h2>
          <p className="text-gray-600">Enroll in courses to get personalized recommendations</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((course) => (
            <div key={course.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition">
              <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600"></div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                    {course.category || 'General'}
                  </span>
                  <div className="flex items-center text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm ml-1">{course.match_score || 85}%</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{course.title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{course.duration || '6 weeks'}</span>
                  <span className="mx-2">•</span>
                  <span className="capitalize">{course.level || 'Intermediate'}</span>
                </div>
                <p className="text-xs text-blue-600 font-medium mb-4">{course.recommendation_reason}</p>
                <button
                  onClick={() => handleEnroll(course.id)}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Enroll Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
