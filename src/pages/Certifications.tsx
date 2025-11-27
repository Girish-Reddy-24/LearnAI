import { Award } from 'lucide-react';

export default function Certifications() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-xl flex items-center justify-center">
            <Award className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Certification Recommendations</h1>
            <p className="text-gray-600">Advance your career with industry-recognized certifications</p>
          </div>
        </div>
      </div>

      <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
        <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">No Certifications Available</h2>
        <p className="text-gray-600">Complete more courses to unlock certification recommendations</p>
      </div>
    </div>
  );
}
