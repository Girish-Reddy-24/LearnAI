import { useState, useEffect } from 'react';
import { Award, Download, Share2, CheckCircle, Calendar, FileText } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface Certificate {
  id: string;
  course_id: string;
  issue_date: string;
  certificate_url: string;
  verification_code: string;
  courses: {
    title: string;
    category: string;
  };
}

export default function Certifications() {
  const { profile } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      loadCertificates();
    }
  }, [profile]);

  const loadCertificates = async () => {
    try {
      const { data, error } = await supabase
        .from('certifications')
        .select(`
          *,
          courses:course_id (
            title,
            category
          )
        `)
        .eq('student_id', profile?.id)
        .order('issue_date', { ascending: false });

      if (error) throw error;
      setCertificates(data || []);
    } catch (error) {
      console.error('Error loading certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (cert: Certificate) => {
    window.open(cert.certificate_url, '_blank');
  };

  const handleShare = (cert: Certificate) => {
    const shareText = `I just earned a certificate in ${cert.courses.title}! Verification code: ${cert.verification_code}`;
    if (navigator.share) {
      navigator.share({
        title: 'My Certificate',
        text: shareText,
        url: cert.certificate_url,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Certificate details copied to clipboard!');
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Certifications</h1>
        <p className="text-gray-600">Your earned certificates and achievements</p>
      </div>

      {certificates.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <Award className="w-20 h-20 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Certificates Yet</h2>
          <p className="text-gray-600 mb-6">Complete courses to earn certificates</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200 p-6 hover:shadow-lg transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="bg-blue-600 p-3 rounded-xl">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <div className="flex items-center text-green-600 text-sm font-medium">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Verified
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                {cert.courses.title}
              </h3>

              <div className="flex items-center text-sm text-gray-600 mb-4">
                <Calendar className="w-4 h-4 mr-1" />
                Issued {new Date(cert.issue_date).toLocaleDateString()}
              </div>

              <div className="bg-white rounded-lg p-3 mb-4">
                <div className="flex items-center text-xs text-gray-500 mb-1">
                  <FileText className="w-3 h-3 mr-1" />
                  Verification Code
                </div>
                <code className="text-sm font-mono text-gray-900 break-all">
                  {cert.verification_code}
                </code>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleDownload(cert)}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </button>
                <button
                  onClick={() => handleShare(cert)}
                  className="bg-white text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition border border-gray-300 flex items-center justify-center"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
        <div className="flex items-start gap-6">
          <div className="bg-white/20 p-4 rounded-xl">
            <Award className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-2">About Your Certificates</h3>
            <p className="text-blue-100 mb-4">
              All certificates are digitally verified and can be shared with employers. Each certificate includes a unique verification code that can be used to confirm its authenticity.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-3xl font-bold mb-1">{certificates.length}</div>
                <div className="text-sm text-blue-100">Certificates Earned</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-3xl font-bold mb-1">{new Set(certificates.map(c => c.courses.category)).size}</div>
                <div className="text-sm text-blue-100">Categories</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-3xl font-bold mb-1">100%</div>
                <div className="text-sm text-blue-100">Verified</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
