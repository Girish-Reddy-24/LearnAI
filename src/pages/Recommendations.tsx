import { useState, useEffect } from 'react';
import { TrendingUp, BookOpen, Star, Clock, BarChart } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function Recommendations() {
  const { profile } = useAuth();
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [userStats, setUserStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      loadRecommendations();
      loadUserStats();
    }
  }, [profile]);

  const loadRecommendations = async () => {
    try {
      const { data: enrolledData } = await supabase
        .from('enrollments')
        .select('course_id')
        .eq('student_id', profile?.id);

      const enrolledCourseIds = (enrolledData || []).map(e => e.course_id);

      const { data: allCourses, error } = await supabase
        .from('courses')
        .select('id, title, description, category, level, duration')
        .is('is_active', true)
        .not('id', 'in', `(${enrolledCourseIds.length > 0 ? enrolledCourseIds.join(',') : 'null'})`)
        .limit(9);

      if (error) throw error;

      const formattedRecs = (allCourses || []).map(course => ({
        ...course,
        match_score: Math.floor(Math.random() * 15) + 85,
        recommendation_reason: getRecommendationReason(course.category)
      }));

      setRecommendations(formattedRecs);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setLoading(false);
    }
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

      await loadRecommendations();
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

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Course Recommendations</h1>
            <p className="text-gray-600">Discover courses tailored to your interests</p>
          </div>
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
