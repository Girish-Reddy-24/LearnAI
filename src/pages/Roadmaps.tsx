import { useState, useEffect } from 'react';
import { Map, TrendingUp, DollarSign, MapPin, Briefcase, CheckCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface CareerRecommendation {
  id: string;
  job_title: string;
  company: string;
  location: string;
  salary_range: string;
  match_score: number;
  required_skills: string[];
}

export default function Roadmaps() {
  const { profile } = useAuth();
  const [careers, setCareers] = useState<CareerRecommendation[]>([]);
  const [pathways, setPathways] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'careers' | 'pathways'>('careers');

  useEffect(() => {
    if (profile) {
      loadCareerData();
    }
  }, [profile]);

  const loadCareerData = async () => {
    try {
      const [careersResult, pathwaysResult] = await Promise.all([
        supabase
          .from('career_recommendations')
          .select('*')
          .eq('student_id', profile?.id)
          .order('match_score', { ascending: false })
          .limit(12),
        supabase
          .from('learning_pathways')
          .select('*')
          .eq('student_id', profile?.id)
          .order('created_at', { ascending: false })
          .limit(6)
      ]);

      if (careersResult.data) setCareers(careersResult.data);
      if (pathwaysResult.data) setPathways(pathwaysResult.data);
    } catch (error) {
      console.error('Error loading career data:', error);
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Career Roadmaps</h1>
        <p className="text-gray-600">Explore career paths and personalized recommendations</p>
      </div>

      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab('careers')}
          className={`px-6 py-3 rounded-lg font-medium transition flex items-center ${
            activeTab === 'careers'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Briefcase className="w-4 h-4 mr-2" />
          Career Opportunities
        </button>
        <button
          onClick={() => setActiveTab('pathways')}
          className={`px-6 py-3 rounded-lg font-medium transition flex items-center ${
            activeTab === 'pathways'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Map className="w-4 h-4 mr-2" />
          Learning Pathways
        </button>
      </div>

      {activeTab === 'careers' ? (
        <>
          {careers.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
              <Briefcase className="w-20 h-20 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Career Recommendations</h2>
              <p className="text-gray-600">Complete courses to unlock personalized career recommendations</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {careers.map((career) => (
                <div
                  key={career.id}
                  className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-blue-100 p-3 rounded-xl">
                      <Briefcase className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex items-center bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {Math.round(career.match_score * 100)}% Match
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2">{career.job_title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{career.company}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>{career.location}</span>
                    </div>
                    <div className="flex items-center text-sm font-semibold text-green-600">
                      <DollarSign className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>{career.salary_range}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-700 mb-2">Required Skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {(career.required_skills || []).slice(0, 4).map((skill, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center">
                    View Details
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          {pathways.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
              <Map className="w-20 h-20 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Learning Pathways</h2>
              <p className="text-gray-600">Learning pathways will be created based on your goals</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pathways.map((pathway) => (
                <div
                  key={pathway.id}
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200 p-6 hover:shadow-lg transition"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-blue-600 p-3 rounded-xl">
                      <Map className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">{pathway.progress}%</div>
                      <div className="text-xs text-gray-600">Complete</div>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">{pathway.pathway_name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{pathway.description}</p>

                  {pathway.target_completion_date && (
                    <div className="flex items-center text-sm text-gray-600 mb-4">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      <span>
                        Target: {new Date(pathway.target_completion_date).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  <div className="bg-white rounded-lg p-3 mb-4">
                    <div className="text-xs text-gray-500 mb-1">Progress</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${pathway.progress}%` }}
                      />
                    </div>
                  </div>

                  <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium">
                    Continue Learning
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <div className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
        <div className="flex items-start gap-6">
          <div className="bg-white/20 p-4 rounded-xl">
            <Map className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-2">Your Career Journey</h3>
            <p className="text-blue-100 mb-4">
              Our AI analyzes your skills, interests, and learning progress to recommend the best career paths and opportunities for you.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-3xl font-bold mb-1">{careers.length}</div>
                <div className="text-sm text-blue-100">Career Opportunities</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-3xl font-bold mb-1">{pathways.length}</div>
                <div className="text-sm text-blue-100">Learning Pathways</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-3xl font-bold mb-1">
                  {Math.round(pathways.reduce((acc, p) => acc + p.progress, 0) / (pathways.length || 1))}%
                </div>
                <div className="text-sm text-blue-100">Avg Progress</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
