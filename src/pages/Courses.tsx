import { useState, useEffect } from 'react';
import { BookOpen, TrendingUp, Calendar, Clock, Star, Play, Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import CoursePlayer from '../components/CoursePlayer';

const availableCourses = [
  {
    id: 'course-1',
    title: 'Machine Learning Fundamentals',
    description: 'Master the core concepts of machine learning including supervised, unsupervised learning, and neural networks. Build practical ML models using Python and popular libraries.',
    difficulty_level: 'intermediate',
    category: 'Machine Learning',
    duration: '12 weeks',
    rating: 4.8,
    students: 2543,
    modules: 48,
  },
  {
    id: 'course-2',
    title: 'Generative AI & Large Language Models',
    description: 'Explore the cutting-edge world of generative AI, transformers, and LLMs. Learn to build applications using GPT, DALL-E, and other generative models.',
    difficulty_level: 'advanced',
    category: 'Artificial Intelligence',
    duration: '10 weeks',
    rating: 4.9,
    students: 1876,
    modules: 42,
  },
  {
    id: 'course-3',
    title: 'Python Programming for Data Science',
    description: 'Learn Python from basics to advanced data manipulation, visualization, and analysis using NumPy, Pandas, and Matplotlib.',
    difficulty_level: 'beginner',
    category: 'Programming',
    duration: '8 weeks',
    rating: 4.7,
    students: 4521,
    modules: 36,
  },
  {
    id: 'course-4',
    title: 'Deep Learning with TensorFlow',
    description: 'Build advanced neural networks using TensorFlow and Keras. Cover CNNs, RNNs, GANs, and transfer learning for real-world applications.',
    difficulty_level: 'advanced',
    category: 'Machine Learning',
    duration: '14 weeks',
    rating: 4.8,
    students: 1923,
    modules: 52,
  },
  {
    id: 'course-5',
    title: 'Data Engineering Essentials',
    description: 'Master data pipelines, ETL processes, data warehousing, and big data technologies like Spark, Kafka, and Airflow.',
    difficulty_level: 'intermediate',
    category: 'Data Engineering',
    duration: '10 weeks',
    rating: 4.6,
    students: 1654,
    modules: 40,
  },
  {
    id: 'course-6',
    title: 'Full Stack Web Development',
    description: 'Build modern web applications from front to back using React, Node.js, Express, and MongoDB. Deploy production-ready applications.',
    difficulty_level: 'intermediate',
    category: 'Web Development',
    duration: '16 weeks',
    rating: 4.7,
    students: 3214,
    modules: 64,
  },
  {
    id: 'course-7',
    title: 'UI/UX Design Masterclass',
    description: 'Learn user-centered design principles, wireframing, prototyping, and user testing. Master tools like Figma and Adobe XD.',
    difficulty_level: 'beginner',
    category: 'Design',
    duration: '8 weeks',
    rating: 4.9,
    students: 2187,
    modules: 32,
  },
  {
    id: 'course-8',
    title: 'Data Analysis with SQL & Tableau',
    description: 'Master SQL for data querying and analysis, and create compelling data visualizations using Tableau for business insights.',
    difficulty_level: 'beginner',
    category: 'Data Analysis',
    duration: '6 weeks',
    rating: 4.6,
    students: 2943,
    modules: 28,
  },
];

export default function Courses() {
  const { profile } = useAuth();
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [view, setView] = useState<'my-courses' | 'available'>('my-courses');
  const [selectedCourse, setSelectedCourse] = useState<any>(null);

  const categories = ['All', 'Machine Learning', 'Artificial Intelligence', 'Programming', 'Data Engineering', 'Web Development', 'Design', 'Data Analysis'];

  useEffect(() => {
    loadEnrollments();
  }, [profile]);

  const loadEnrollments = async () => {
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          *,
          courses:course_id (
            id,
            title,
            description,
            difficulty_level,
            category,
            duration
          )
        `)
        .eq('student_id', profile?.id)
        .order('enrolled_at', { ascending: false });

      if (error) throw error;
      setEnrollments(data || []);
    } catch (error) {
      console.error('Error loading enrollments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (course: any) => {
    try {
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('id')
        .eq('title', course.title)
        .maybeSingle();

      if (courseError) throw courseError;

      if (!courseData) {
        console.error('Course not found in database');
        return;
      }

      const { error } = await supabase
        .from('enrollments')
        .insert([
          {
            student_id: profile?.id,
            course_id: courseData.id,
            status: 'active',
            progress: 0,
          }
        ]);

      if (error) throw error;
      await loadEnrollments();
      setView('my-courses');
    } catch (error) {
      console.error('Error enrolling in course:', error);
    }
  };

  const filteredCourses = availableCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const notEnrolled = !enrollments.some(e => e.course_id === course.id);
    return matchesSearch && matchesCategory && notEnrolled;
  });

  const getDeadlineStatus = (deadline: string) => {
    if (!deadline) return null;
    const date = new Date(deadline);
    const now = new Date();
    const daysUntil = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntil < 0) return { text: 'Overdue', color: 'text-red-600' };
    if (daysUntil <= 7) return { text: `${daysUntil} days left`, color: 'text-orange-600' };
    return { text: date.toLocaleDateString(), color: 'text-gray-600' };
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Courses</h1>
        <p className="text-gray-600">Start your learning journey and achieve your career goals</p>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setView('my-courses')}
          className={`px-6 py-2 rounded-lg font-medium transition ${
            view === 'my-courses'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          My Courses
        </button>
        <button
          onClick={() => setView('available')}
          className={`px-6 py-2 rounded-lg font-medium transition ${
            view === 'available'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Available Courses
        </button>
      </div>

      {view === 'my-courses' ? (
        <>
          {enrollments.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No Courses Enrolled</h2>
              <p className="text-gray-600 mb-6">Start your learning journey by enrolling in courses</p>
              <button
                onClick={() => setView('available')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition inline-flex items-center"
              >
                <Play className="w-4 h-4 mr-2" />
                Browse Available Courses
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {enrollments.map((enrollment) => {
                const deadline = enrollment.deadline ? getDeadlineStatus(enrollment.deadline) : null;
                return (
                  <div key={enrollment.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {enrollment.courses?.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {enrollment.courses?.description}
                          </p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {enrollment.courses?.difficulty_level && (
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                enrollment.courses.difficulty_level === 'beginner'
                                  ? 'bg-green-100 text-green-700'
                                  : enrollment.courses.difficulty_level === 'intermediate'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-red-100 text-red-700'
                              }`}>
                                {enrollment.courses.difficulty_level}
                              </span>
                            )}
                            {enrollment.courses?.category && (
                              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                                {enrollment.courses.category}
                              </span>
                            )}
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
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
                      </div>

                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-gray-600 flex items-center">
                            <TrendingUp className="w-4 h-4 mr-1" />
                            Progress
                          </span>
                          <span className="font-semibold text-gray-900">{enrollment.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-blue-600 h-3 rounded-full transition-all"
                            style={{ width: `${enrollment.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      {deadline && (
                        <div className="flex items-center text-sm mb-4">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="text-gray-600 mr-1">Deadline:</span>
                          <span className={`font-medium ${deadline.color}`}>{deadline.text}</span>
                        </div>
                      )}

                      <button
                        onClick={() => setSelectedCourse(enrollment)}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                      >
                        Continue Learning
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredCourses.map((course) => (
              <div key={course.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition">
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{course.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{course.description}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        course.difficulty_level === 'beginner'
                          ? 'bg-green-100 text-green-700'
                          : course.difficulty_level === 'intermediate'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {course.difficulty_level}
                      </span>
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                        {course.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-1 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium">{course.rating}</span>
                    </div>
                    <div className="flex items-center">
                      <BookOpen className="w-4 h-4 mr-1" />
                      <span>{course.modules} modules</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{course.duration}</span>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 mb-4">
                    {course.students.toLocaleString()} students enrolled
                  </div>

                  <button
                    onClick={() => handleEnroll(course)}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition inline-flex items-center justify-center"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Enroll Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {selectedCourse && (
        <CoursePlayer
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
        />
      )}
    </div>
  );
}
