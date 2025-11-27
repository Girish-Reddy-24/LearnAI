import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { RouterProvider, useRouter } from './components/Router';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import AITutor from './pages/AITutor';
import AIQuiz from './pages/AIQuiz';
import Recommendations from './pages/Recommendations';
import Certifications from './pages/Certifications';
import Notifications from './pages/Notifications';
import Courses from './pages/Courses';
import Roadmaps from './pages/Roadmaps';
import ResearchAssistant from './pages/ResearchAssistant';
import Settings from './pages/Settings';
import AdminPanel from './pages/AdminPanel';
import Sidebar from './components/Sidebar';

function AppContent() {
  const { user, loading } = useAuth();
  const { currentRoute, navigate } = useRouter();
  const [currentPage, setCurrentPage] = useState('dashboard');

  useEffect(() => {
    if (user && currentRoute === 'login') {
      setCurrentPage('dashboard');
    }
  }, [user, currentRoute]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    if (currentRoute === 'register') {
      return <Register />;
    }
    if (currentRoute === 'forgot-password') {
      return <ForgotPassword />;
    }
    return <Login />;
  }

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'courses':
        return <Courses />;
      case 'roadmaps':
        return <Roadmaps />;
      case 'ai-tutor':
        return <AITutor />;
      case 'research-assistant':
        return <ResearchAssistant />;
      case 'ai-quiz':
        return <AIQuiz />;
      case 'recommendations':
        return <Recommendations />;
      case 'certifications':
        return <Certifications />;
      case 'notifications':
        return <Notifications />;
      case 'admin':
        return <AdminPanel />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <div className="flex-1 overflow-auto">
        {renderPage()}
      </div>
    </div>
  );
}

function App() {
  return (
    <RouterProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </RouterProvider>
  );
}

export default App;
