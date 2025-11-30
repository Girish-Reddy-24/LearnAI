import { useState, useEffect } from 'react';
import { Bell, CheckCircle, Info, AlertCircle, Award, BookOpen, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

export default function Notifications() {
  const { profile } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    if (profile) {
      loadNotifications();
    }
  }, [profile]);

  const loadNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', profile?.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);

      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', profile?.id)
        .eq('is_read', false);

      setNotifications(prev =>
        prev.map(n => ({ ...n, is_read: true }))
      );
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'course_enrollment':
      case 'new_content':
        return <BookOpen className="w-5 h-5" />;
      case 'achievement_unlocked':
      case 'certificate_ready':
        return <Award className="w-5 h-5" />;
      case 'grade_posted':
      case 'quiz_available':
        return <CheckCircle className="w-5 h-5" />;
      case 'assignment_due':
      case 'reminder':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'course_enrollment':
      case 'new_content':
        return 'bg-blue-100 text-blue-600';
      case 'achievement_unlocked':
      case 'certificate_ready':
        return 'bg-yellow-100 text-yellow-600';
      case 'grade_posted':
      case 'quiz_available':
        return 'bg-green-100 text-green-600';
      case 'assignment_due':
      case 'reminder':
        return 'bg-orange-100 text-orange-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const filteredNotifications = filter === 'unread'
    ? notifications.filter(n => !n.is_read)
    : notifications;

  const unreadCount = notifications.filter(n => !n.is_read).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center relative">
              <Bell className="w-6 h-6 text-white" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
              <p className="text-gray-600">
                {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  filter === 'all'
                    ? 'bg-white text-gray-900 shadow'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  filter === 'unread'
                    ? 'bg-white text-gray-900 shadow'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Unread
              </button>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
              >
                Mark All Read
              </button>
            )}
          </div>
        </div>
      </div>

      {filteredNotifications.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
          <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {filter === 'unread' ? 'No Unread Notifications' : 'No Notifications'}
          </h2>
          <p className="text-gray-600">
            {filter === 'unread' ? 'All caught up!' : "You don't have any notifications yet"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-xl border p-4 transition hover:shadow-md ${
                !notification.is_read ? 'border-blue-200 bg-blue-50/30' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg flex-shrink-0 ${getColor(notification.type)}`}>
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {notification.title}
                        {!notification.is_read && (
                          <span className="ml-2 inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(notification.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      {!notification.is_read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Mark as read"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition"
                        title="Delete"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
