import { useState } from 'react';
import { Map, CheckCircle2, Circle, Lock, Award, Clock, BookOpen } from 'lucide-react';
import { useRouter } from '../components/Router';

interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  courses: string[];
  duration: string;
  completed?: boolean;
}

interface CareerRoadmap {
  id: string;
  title: string;
  description: string;
  salary: string;
  demand: string;
  steps: RoadmapStep[];
  totalDuration: string;
}

const roadmaps: CareerRoadmap[] = [
  {
    id: 'ml-engineer',
    title: 'Machine Learning Engineer',
    description: 'Build intelligent systems that learn from data. Work on cutting-edge AI projects and deploy ML models at scale.',
    salary: '$120k - $180k',
    demand: 'Very High',
    totalDuration: '9-12 months',
    steps: [
      {
        id: 'step-1',
        title: 'Programming Foundations',
        description: 'Master Python programming and essential data science libraries',
        courses: ['Python Programming for Data Science'],
        duration: '8 weeks',
      },
      {
        id: 'step-2',
        title: 'Machine Learning Fundamentals',
        description: 'Learn core ML algorithms, model training, and evaluation',
        courses: ['Machine Learning Fundamentals'],
        duration: '12 weeks',
      },
      {
        id: 'step-3',
        title: 'Deep Learning & Neural Networks',
        description: 'Advanced neural networks, CNNs, RNNs, and modern architectures',
        courses: ['Deep Learning with TensorFlow'],
        duration: '14 weeks',
      },
      {
        id: 'step-4',
        title: 'Specialization: Generative AI',
        description: 'Master cutting-edge generative models and LLMs',
        courses: ['Generative AI & Large Language Models'],
        duration: '10 weeks',
      },
    ],
  },
  {
    id: 'data-engineer',
    title: 'Data Engineer',
    description: 'Design and build data infrastructure, pipelines, and systems that enable data-driven decision making.',
    salary: '$110k - $160k',
    demand: 'Very High',
    totalDuration: '7-10 months',
    steps: [
      {
        id: 'step-1',
        title: 'Programming & SQL Basics',
        description: 'Foundation in programming and database management',
        courses: ['Python Programming for Data Science', 'Data Analysis with SQL & Tableau'],
        duration: '10 weeks',
      },
      {
        id: 'step-2',
        title: 'Data Engineering Core',
        description: 'ETL pipelines, data warehousing, and big data tools',
        courses: ['Data Engineering Essentials'],
        duration: '10 weeks',
      },
      {
        id: 'step-3',
        title: 'Advanced Data Processing',
        description: 'Distributed systems, streaming, and real-time processing',
        courses: ['Machine Learning Fundamentals'],
        duration: '12 weeks',
      },
    ],
  },
  {
    id: 'data-analyst',
    title: 'Data Analyst',
    description: 'Extract insights from data, create visualizations, and help businesses make informed decisions.',
    salary: '$70k - $110k',
    demand: 'High',
    totalDuration: '5-7 months',
    steps: [
      {
        id: 'step-1',
        title: 'Data Analysis Foundations',
        description: 'SQL, statistical analysis, and data visualization',
        courses: ['Data Analysis with SQL & Tableau'],
        duration: '6 weeks',
      },
      {
        id: 'step-2',
        title: 'Python for Analysis',
        description: 'Data manipulation and analysis with Python',
        courses: ['Python Programming for Data Science'],
        duration: '8 weeks',
      },
      {
        id: 'step-3',
        title: 'Advanced Analytics',
        description: 'Predictive modeling and machine learning basics',
        courses: ['Machine Learning Fundamentals'],
        duration: '12 weeks',
      },
    ],
  },
  {
    id: 'uiux-designer',
    title: 'UI/UX Designer',
    description: 'Create beautiful, user-friendly interfaces and delightful user experiences for digital products.',
    salary: '$80k - $130k',
    demand: 'High',
    totalDuration: '4-6 months',
    steps: [
      {
        id: 'step-1',
        title: 'Design Fundamentals',
        description: 'UI/UX principles, wireframing, and prototyping',
        courses: ['UI/UX Design Masterclass'],
        duration: '8 weeks',
      },
      {
        id: 'step-2',
        title: 'Frontend Basics',
        description: 'Understanding web technologies and implementation',
        courses: ['Full Stack Web Development'],
        duration: '8 weeks (frontend modules)',
      },
      {
        id: 'step-3',
        title: 'Advanced Design Systems',
        description: 'Building scalable design systems and working with development teams',
        courses: ['UI/UX Design Masterclass'],
        duration: '4 weeks',
      },
    ],
  },
  {
    id: 'fullstack-developer',
    title: 'Full Stack Developer',
    description: 'Build complete web applications from frontend to backend, databases to deployment.',
    salary: '$90k - $150k',
    demand: 'Very High',
    totalDuration: '6-9 months',
    steps: [
      {
        id: 'step-1',
        title: 'Programming Foundations',
        description: 'Core programming concepts and Python basics',
        courses: ['Python Programming for Data Science'],
        duration: '8 weeks',
      },
      {
        id: 'step-2',
        title: 'Full Stack Development',
        description: 'Frontend, backend, databases, and deployment',
        courses: ['Full Stack Web Development'],
        duration: '16 weeks',
      },
      {
        id: 'step-3',
        title: 'UI/UX Skills',
        description: 'Design principles for better user experiences',
        courses: ['UI/UX Design Masterclass'],
        duration: '8 weeks',
      },
    ],
  },
];

export default function Roadmaps() {
  const { navigate } = useRouter();
  const [selectedRoadmap, setSelectedRoadmap] = useState<string | null>(null);

  const selectedRoadmapData = roadmaps.find(r => r.id === selectedRoadmap);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Career Roadmaps</h1>
        <p className="text-gray-600">
          Follow structured learning paths designed to help you land your dream job
        </p>
      </div>

      {!selectedRoadmap ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roadmaps.map((roadmap) => (
            <div
              key={roadmap.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition cursor-pointer"
              onClick={() => setSelectedRoadmap(roadmap.id)}
            >
              <div className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
                  <Map className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{roadmap.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{roadmap.description}</p>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Average Salary</span>
                    <span className="font-semibold text-green-600">{roadmap.salary}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Job Demand</span>
                    <span className={`font-semibold ${
                      roadmap.demand === 'Very High' ? 'text-red-600' : 'text-orange-600'
                    }`}>
                      {roadmap.demand}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-semibold text-gray-900">{roadmap.totalDuration}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center text-sm text-gray-600">
                    <BookOpen className="w-4 h-4 mr-2" />
                    <span>{roadmap.steps.length} learning phases</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <button
            onClick={() => setSelectedRoadmap(null)}
            className="mb-6 text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to all roadmaps
          </button>

          <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl p-8 text-white mb-8">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-3">{selectedRoadmapData?.title}</h2>
                <p className="text-blue-100 mb-6 max-w-2xl">
                  {selectedRoadmapData?.description}
                </p>
                <div className="flex flex-wrap gap-6">
                  <div>
                    <div className="text-blue-200 text-sm mb-1">Average Salary</div>
                    <div className="text-xl font-bold">{selectedRoadmapData?.salary}</div>
                  </div>
                  <div>
                    <div className="text-blue-200 text-sm mb-1">Job Demand</div>
                    <div className="text-xl font-bold">{selectedRoadmapData?.demand}</div>
                  </div>
                  <div>
                    <div className="text-blue-200 text-sm mb-1">Total Duration</div>
                    <div className="text-xl font-bold">{selectedRoadmapData?.totalDuration}</div>
                  </div>
                </div>
              </div>
              <Award className="w-16 h-16 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Learning Path</h3>

            <div className="space-y-6">
              {selectedRoadmapData?.steps.map((step, index) => {
                const isCompleted = step.completed;
                const isLocked = index > 0 && !selectedRoadmapData.steps[index - 1].completed;

                return (
                  <div key={step.id} className="relative">
                    {index < selectedRoadmapData.steps.length - 1 && (
                      <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-gray-200"></div>
                    )}

                    <div className={`relative flex gap-4 p-6 rounded-xl border-2 transition ${
                      isCompleted
                        ? 'border-green-200 bg-green-50'
                        : isLocked
                        ? 'border-gray-200 bg-gray-50 opacity-60'
                        : 'border-blue-200 bg-blue-50'
                    }`}>
                      <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                        isCompleted
                          ? 'bg-green-500'
                          : isLocked
                          ? 'bg-gray-300'
                          : 'bg-blue-500'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle2 className="w-6 h-6 text-white" />
                        ) : isLocked ? (
                          <Lock className="w-6 h-6 text-white" />
                        ) : (
                          <Circle className="w-6 h-6 text-white" />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="text-sm font-medium text-gray-500 mb-1">
                              Phase {index + 1}
                            </div>
                            <h4 className="text-xl font-bold text-gray-900 mb-2">
                              {step.title}
                            </h4>
                            <p className="text-gray-600 mb-4">{step.description}</p>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="w-4 h-4 mr-1" />
                            {step.duration}
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="text-sm font-medium text-gray-700 mb-2">
                            Required Courses:
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {step.courses.map((course, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm text-gray-700"
                              >
                                {course}
                              </span>
                            ))}
                          </div>
                        </div>

                        {!isLocked && !isCompleted && (
                          <button
                            onClick={() => navigate('courses')}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                          >
                            Start Learning
                          </button>
                        )}

                        {isCompleted && (
                          <div className="flex items-center text-green-600 font-medium">
                            <CheckCircle2 className="w-5 h-5 mr-2" />
                            Completed
                          </div>
                        )}

                        {isLocked && (
                          <div className="flex items-center text-gray-500">
                            <Lock className="w-5 h-5 mr-2" />
                            Complete previous phase to unlock
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
              <div className="flex items-start gap-4">
                <Award className="w-12 h-12 text-yellow-600 flex-shrink-0" />
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">
                    Earn Your Certification
                  </h4>
                  <p className="text-gray-700 text-sm mb-4">
                    Complete all phases of this roadmap to earn an industry-recognized certification
                    and demonstrate your expertise to potential employers.
                  </p>
                  <button
                    onClick={() => navigate('certifications')}
                    className="bg-yellow-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-yellow-700 transition"
                  >
                    View Certification Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
