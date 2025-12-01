import { useState, useEffect } from 'react';
import { X, CheckCircle, Circle, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import AITutorModal from './AITutorModal';
import { supabase } from '../lib/supabase';

interface Module {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  videoUrl: string;
  description: string;
}

interface CoursePlayerProps {
  course: any;
  onClose: () => void;
}

export default function CoursePlayer({ course, onClose }: CoursePlayerProps) {
  const [currentModule, setCurrentModule] = useState(0);
  const [showAITutor, setShowAITutor] = useState(false);
  const [completedModules, setCompletedModules] = useState<Set<number>>(new Set());
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  const courseId = course.courses?.id || course.course_id;
  const enrollmentId = course.id;

  useEffect(() => {
    loadModules();
  }, [courseId]);

  const loadModules = async () => {
    if (!courseId) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('course_modules')
        .select('*')
        .eq('course_id', courseId)
        .eq('is_active', true)
        .order('order_index', { ascending: true });

      if (error) throw error;

      const formattedModules: Module[] = (data || []).map((module) => ({
        id: module.id,
        title: module.title,
        duration: module.duration || '30 min',
        completed: false,
        videoUrl: module.video_url || 'https://www.youtube.com/embed/rfscVS0vtbw',
        description: module.description || ''
      }));

      setModules(formattedModules);
    } catch (error) {
      console.error('Error loading modules:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevModule = () => {
    if (currentModule > 0) {
      setCurrentModule(currentModule - 1);
    }
  };

  const handleNextModule = () => {
    if (currentModule < modules.length - 1) {
      setCurrentModule(currentModule + 1);
    }
  };

  const handleMarkComplete = async () => {
    setCompletedModules(prev => {
      const newSet = new Set(prev);
      newSet.add(currentModule);
      return newSet;
    });

    await updateProgress();
  };

  const updateProgress = async () => {
    if (!enrollmentId || modules.length === 0) return;

    const completedCount = completedModules.size + 1;
    const progressPercent = Math.round((completedCount / modules.length) * 100);

    try {
      const { error } = await supabase
        .from('enrollments')
        .update({
          progress_percent: progressPercent,
          status: progressPercent === 100 ? 'completed' : 'active'
        })
        .eq('id', enrollmentId);

      if (error) {
        console.error('Error updating progress:', error);
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const currentModuleData = modules[currentModule];
  const isCurrentModuleCompleted = completedModules.has(currentModule);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4 text-center">Loading modules...</p>
        </div>
      </div>
    );
  }

  if (modules.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md">
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Modules Available</h3>
          <p className="text-gray-600 mb-4">This course doesn't have any modules yet. Check back later!</p>
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-7xl h-[90vh] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">{course.courses?.title || course.title}</h2>
            <p className="text-sm text-gray-600 mt-1">
              Module {currentModule + 1} of {modules.length}: {currentModuleData.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 flex flex-col">
            <div className="flex-1 bg-gray-900 relative">
              <iframe
                src={currentModuleData.videoUrl}
                title={currentModuleData.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />

              <button
                onClick={() => setShowAITutor(true)}
                className="absolute bottom-6 right-6 bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition flex items-center shadow-lg z-10"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Ask AI Tutor
              </button>
            </div>

            <div className="p-6 bg-white border-t border-gray-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{currentModuleData.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{currentModuleData.description}</p>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">Duration: {currentModuleData.duration}</span>
                    {isCurrentModuleCompleted && (
                      <span className="flex items-center text-sm text-green-600">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Completed
                      </span>
                    )}
                  </div>
                </div>
                {!isCurrentModuleCompleted && (
                  <button
                    onClick={handleMarkComplete}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition flex items-center flex-shrink-0"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark Complete
                  </button>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between max-w-4xl mx-auto">
                <button
                  onClick={handlePrevModule}
                  disabled={currentModule === 0}
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5 mr-1" />
                  Previous
                </button>

                <div className="text-sm text-gray-600">
                  {currentModule + 1} / {modules.length}
                </div>

                <button
                  onClick={handleNextModule}
                  disabled={currentModule === modules.length - 1}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="w-5 h-5 ml-1" />
                </button>
              </div>
            </div>
          </div>

          <div className="w-80 border-l border-gray-200 bg-white overflow-y-auto">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-semibold text-gray-900">Course Modules</h3>
            </div>
            <div className="p-4 space-y-2">
              {modules.map((module, index) => {
                const isCompleted = completedModules.has(index);
                return (
                  <button
                    key={module.id}
                    onClick={() => setCurrentModule(index)}
                    className={`w-full text-left p-3 rounded-lg transition ${
                      currentModule === index
                        ? 'bg-blue-50 border-2 border-blue-500'
                        : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 mb-1">
                          {index + 1}. {module.title}
                        </div>
                        <div className="text-xs text-gray-500">{module.duration}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {showAITutor && (
        <AITutorModal
          courseTitle={course.courses?.title || course.title}
          moduleTitle={currentModuleData.title}
          onClose={() => setShowAITutor(false)}
        />
      )}
    </div>
  );
}
