import {
  LayoutDashboard,
  BookOpen,
  Brain,
  FileQuestion,
  Bell,
  Award,
  Users,
  Settings,
  LogOut,
  Map,
  BookMarked
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const { profile, signOut } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['student', 'faculty', 'admin'] },
    { id: 'courses', label: 'My Courses', icon: BookOpen, roles: ['student', 'faculty', 'admin'] },
    { id: 'roadmaps', label: 'Career Roadmaps', icon: Map, roles: ['student'] },
    { id: 'ai-tutor', label: 'AI Tutor', icon: Brain, roles: ['student'] },
    { id: 'research-assistant', label: 'Research Assistant', icon: BookMarked, roles: ['student'] },
    { id: 'ai-quiz', label: 'AI Quiz', icon: FileQuestion, roles: ['student'] },
    { id: 'recommendations', label: 'Course Recommendations', icon: BookOpen, roles: ['student'] },
    { id: 'certifications', label: 'Certifications', icon: Award, roles: ['student'] },
    { id: 'notifications', label: 'Notifications', icon: Bell, roles: ['student', 'faculty', 'admin'] },
    { id: 'admin', label: 'Admin Panel', icon: Users, roles: ['admin'] },
    { id: 'settings', label: 'Settings', icon: Settings, roles: ['student', 'faculty', 'admin'] },
  ];

  const visibleItems = menuItems.filter(item =>
    profile && item.roles.includes(profile.role)
  );

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">LearnAI</h1>
            <p className="text-xs text-gray-500">Smart Learning</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-3 space-y-1">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 mb-4 px-2">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold text-gray-600">
              {profile?.full_name?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {profile?.full_name || 'User'}
            </p>
            <p className="text-xs text-gray-500 capitalize">{profile?.role}</p>
          </div>
        </div>
        <button
          onClick={signOut}
          className="w-full flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
