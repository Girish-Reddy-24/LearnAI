import { useState, useEffect } from 'react';
import { BookOpen, Brain, Award, TrendingUp, Clock, CheckCircle, Target, Calendar, Play } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { profile } = useAuth();
  const [stats, setStats] = useState({
    enrolledCourses: 0,
    completedCourses: 0,
    averageProgress: 0,
    upcomingDeadlines: 0,
  });
  const [myCourses, setMyCourses] = useState<any[]>([]);
  const [allEnrollments, setAllEnrollments] = useState<any[]>([]);
  const [upcomingMilestones, setUpcomingMilestones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState<'enrolled' | 'completed' | 'progress' | 'deadlines' | null>(null);

  useEffect(() => {
    if (profile) {
      loadDashboardData();
    }
  }, [profile]);

  const loadDashboardData = async () => {
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          *,
          courses:course_id (
            id,
            title,
            description,
            level,
            category,
            duration
          )
        `)
        .eq('student_id', profile?.id)
        .order('enrolled_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const completed = data.filter(e => e.status === 'completed').length;
        const avgProgress = data.length > 0
          ? data.reduce((acc, e) => acc + (e.progress_percent || 0), 0) / data.length
          : 0;

        setStats({
          enrolledCourses: data.length,
          completedCourses: completed,
          averageProgress: Math.round(avgProgress),
          upcomingDeadlines: data.filter(e => e.deadline).length,
        });
        setAllEnrollments(data);
        setMyCourses(data.slice(0, 3));

        const milestones = [
          { title: 'Complete Python Basics Module', dueDate: '2025-12-05', progress: 65, course: 'Python Programming' },
          { title: 'Submit ML Project Assignment', dueDate: '2025-12-10', progress: 30, course: 'Machine Learning' },
          { title: 'Pass React Final Assessment', dueDate: '2025-12-15', progress: 80, course: 'React Development' },
        ];
        setUpcomingMilestones(milestones);
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {profile?.full_name || 'Student'}!
        </h1>
        <p className="text-gray-600">Here's what's happening with your learning journey</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div
          onClick={() => setShowModal('enrolled')}
          className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm cursor-pointer hover:shadow-md hover:border-blue-300 transition">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <BookOpen className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.enrolledCourses}</h3>
          <p className="text-sm text-gray-600">Enrolled Courses</p>
        </div>

        <div
          onClick={() => setShowModal('completed')}
          className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm cursor-pointer hover:shadow-md hover:border-green-300 transition">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.completedCourses}</h3>
          <p className="text-sm text-gray-600">Completed Courses</p>
        </div>

        <div
          onClick={() => setShowModal('progress')}
          className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm cursor-pointer hover:shadow-md hover:border-orange-300 transition">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
            <TrendingUp className="w-6 h-6 text-orange-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.averageProgress}%</h3>
          <p className="text-sm text-gray-600">Average Progress</p>
        </div>

        <div
          onClick={() => setShowModal('deadlines')}
          className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm cursor-pointer hover:shadow-md hover:border-red-300 transition">
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
            <Clock className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.upcomingDeadlines}</h3>
          <p className="text-sm text-gray-600">Upcoming Deadlines</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">My Courses</h2>
              <button
                onClick={() => onNavigate('courses')}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View All
              </button>
            </div>

            {myCourses.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-4">No courses enrolled yet</p>
                <button
                  onClick={() => onNavigate('courses')}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition inline-flex items-center"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Your Journey
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {myCourses.map((enrollment) => (
                  <div key={enrollment.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {enrollment.courses?.title || 'Untitled Course'}
                        </h3>
                        <div className="flex gap-2">
                          {enrollment.courses?.level && (
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                              enrollment.courses.level === 'Beginner'
                                ? 'bg-green-100 text-green-700'
                                : enrollment.courses.level === 'Intermediate'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {enrollment.courses.level}
                            </span>
                          )}
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                            enrollment.status === 'completed'
                              ? 'bg-green-100 text-green-700'
                              : enrollment.status === 'active'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {enrollment.status}
                          </span>
                        </div>
                      </div>
                      <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                        Continue
                      </button>
                    </div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-semibold text-gray-900">{enrollment.progress_percent}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${enrollment.progress_percent}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Target className="w-5 h-5 text-orange-600" />
            <h2 className="text-xl font-bold text-gray-900">Upcoming Milestones</h2>
          </div>
          <div className="space-y-4">
            {upcomingMilestones.length === 0 ? (
              <p className="text-sm text-gray-600 text-center py-8">No upcoming milestones</p>
            ) : (
              upcomingMilestones.map((milestone, index) => (
                <div key={index} className="border-l-4 border-orange-400 pl-4 py-2">
                  <h4 className="font-medium text-gray-900 text-sm mb-1">{milestone.title}</h4>
                  <p className="text-xs text-gray-600 mb-2">{milestone.course}</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(milestone.dueDate).toLocaleDateString()}
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-orange-500 h-1.5 rounded-full"
                        style={{ width: `${milestone.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          onClick={() => onNavigate('ai-tutor')}
          className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl p-6 text-white shadow-lg cursor-pointer hover:shadow-xl transition"
        >
          <Brain className="w-12 h-12 mb-4 opacity-90" />
          <h3 className="text-xl font-bold mb-2">AI Tutor</h3>
          <p className="text-blue-100 mb-4 text-sm">
            Get instant help with your coursework from our AI-powered tutor
          </p>
          <button className="w-full bg-white text-blue-600 py-2 rounded-lg font-medium hover:bg-blue-50 transition">
            Start Chat
          </button>
        </div>

        <div
          onClick={() => onNavigate('certifications')}
          className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 cursor-pointer hover:shadow-md transition"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Award className="w-6 h-6 text-yellow-600" />
            <h3 className="text-lg font-bold text-gray-900">Certifications</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Boost your career with industry-recognized certifications
          </p>
          <button className="w-full bg-gray-100 text-gray-900 py-2 rounded-lg font-medium hover:bg-gray-200 transition">
            View Certifications
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(null)}>
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {showModal === 'enrolled' && 'All Enrolled Courses'}
                {showModal === 'completed' && 'Completed Courses'}
                {showModal === 'progress' && 'Course Progress'}
                {showModal === 'deadlines' && 'Upcoming Deadlines'}
              </h2>
              <button
                onClick={() => setShowModal(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              {showModal === 'enrolled' && (
                <div className="space-y-4">
                  {allEnrollments.length === 0 ? (
                    <p className="text-gray-600 text-center py-8">No enrolled courses yet</p>
                  ) : (
                    allEnrollments.map((enrollment) => (
                      <div key={enrollment.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">
                              {enrollment.courses?.title || 'Untitled Course'}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">{enrollment.courses?.description}</p>
                            <div className="flex gap-2">
                              {enrollment.courses?.difficulty_level && (
                                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                                  enrollment.courses.difficulty_level === 'beginner'
                                    ? 'bg-green-100 text-green-700'
                                    : enrollment.courses.difficulty_level === 'intermediate'
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-red-100 text-red-700'
                                }`}>
                                  {enrollment.courses.difficulty_level}
                                </span>
                              )}
                              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                                enrollment.status === 'completed'
                                  ? 'bg-green-100 text-green-700'
                                  : enrollment.status === 'active'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}>
                                {enrollment.status}
                              </span>
                              {enrollment.courses?.category && (
                                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-purple-100 text-purple-700">
                                  {enrollment.courses.category}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-semibold text-gray-900">{enrollment.progress_percent}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${enrollment.progress_percent}%` }}
                          ></div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {showModal === 'completed' && (
                <div className="space-y-4">
                  {allEnrollments.filter(e => e.status === 'completed').length === 0 ? (
                    <div className="text-center py-8">
                      <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600">No completed courses yet</p>
                      <p className="text-sm text-gray-500 mt-2">Keep learning to earn your first completion!</p>
                    </div>
                  ) : (
                    allEnrollments.filter(e => e.status === 'completed').map((enrollment) => (
                      <div key={enrollment.id} className="border border-green-200 bg-green-50 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircle className="w-5 h-5 text-green-600" />
                              <h3 className="font-semibold text-gray-900">
                                {enrollment.courses?.title || 'Untitled Course'}
                              </h3>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{enrollment.courses?.description}</p>
                            <div className="flex gap-2">
                              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-700">
                                Completed {new Date(enrollment.completed_at || enrollment.updated_at).toLocaleDateString()}
                              </span>
                              {enrollment.courses?.category && (
                                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-purple-100 text-purple-700">
                                  {enrollment.courses.category}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {showModal === 'progress' && (
                <div className="space-y-4">
                  {allEnrollments.length === 0 ? (
                    <p className="text-gray-600 text-center py-8">No courses to show progress for</p>
                  ) : (
                    allEnrollments.map((enrollment) => (
                      <div key={enrollment.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">
                              {enrollment.courses?.title || 'Untitled Course'}
                            </h3>
                            <div className="flex gap-2 mb-3">
                              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                                enrollment.status === 'completed'
                                  ? 'bg-green-100 text-green-700'
                                  : enrollment.status === 'active'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}>
                                {enrollment.status}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-bold text-gray-900">{enrollment.progress_percent}%</div>
                            <div className="text-xs text-gray-500">Complete</div>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                          <div
                            className={`h-3 rounded-full transition-all ${
                              enrollment.progress_percent === 100 ? 'bg-green-600' : 'bg-blue-600'
                            }`}
                            style={{ width: `${enrollment.progress_percent}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Started {new Date(enrollment.enrolled_at).toLocaleDateString()}</span>
                          {enrollment.progress_percent === 100 && (
                            <span className="text-green-600 font-medium">Completed!</span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {showModal === 'deadlines' && (
                <div className="space-y-4">
                  {allEnrollments.filter(e => e.deadline).length === 0 ? (
                    <div className="text-center py-8">
                      <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600">No upcoming deadlines</p>
                      <p className="text-sm text-gray-500 mt-2">You're all caught up!</p>
                    </div>
                  ) : (
                    allEnrollments
                      .filter(e => e.deadline)
                      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
                      .map((enrollment) => {
                        const daysUntil = Math.ceil((new Date(enrollment.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                        const isOverdue = daysUntil < 0;
                        const isUrgent = daysUntil <= 3 && daysUntil >= 0;

                        return (
                          <div key={enrollment.id} className={`border rounded-lg p-4 ${
                            isOverdue ? 'border-red-300 bg-red-50' : isUrgent ? 'border-orange-300 bg-orange-50' : 'border-gray-200'
                          }`}>
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 mb-1">
                                  {enrollment.courses?.title || 'Untitled Course'}
                                </h3>
                                <div className="flex items-center gap-2 text-sm">
                                  <Clock className={`w-4 h-4 ${
                                    isOverdue ? 'text-red-600' : isUrgent ? 'text-orange-600' : 'text-gray-600'
                                  }`} />
                                  <span className={`font-medium ${
                                    isOverdue ? 'text-red-600' : isUrgent ? 'text-orange-600' : 'text-gray-600'
                                  }`}>
                                    {isOverdue
                                      ? `Overdue by ${Math.abs(daysUntil)} days`
                                      : `Due in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}`}
                                  </span>
                                  <span className="text-gray-500">
                                    {new Date(enrollment.deadline).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-sm mb-2">
                              <span className="text-gray-600">Progress</span>
                              <span className="font-semibold text-gray-900">{enrollment.progress_percent}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all ${
                                  isOverdue ? 'bg-red-600' : isUrgent ? 'bg-orange-600' : 'bg-blue-600'
                                }`}
                                style={{ width: `${enrollment.progress_percent}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
