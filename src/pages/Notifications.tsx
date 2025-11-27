import { Bell } from 'lucide-react';

export default function Notifications() {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
            <Bell className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-600">All caught up!</p>
          </div>
        </div>
      </div>

      <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
        <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">No Notifications</h2>
        <p className="text-gray-600">You don't have any notifications yet</p>
      </div>
    </div>
  );
}
