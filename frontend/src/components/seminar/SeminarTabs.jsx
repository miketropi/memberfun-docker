import { Calendar, Clock } from 'lucide-react';

export default function SeminarTabs({ activeTab, onTabChange }) {
  return (
    <div className="flex space-x-4">
      <button
        className={`px-6 py-3 rounded-lg transition-all duration-200 flex items-center gap-2 font-medium shadow-sm ${
          activeTab === 'upcoming'
            ? 'bg-blue-600 text-white shadow-md'
            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
        }`}
        onClick={() => onTabChange('upcoming')}
      >
        <Calendar className="w-4 h-4" />
        Upcoming
      </button>
      <button
        className={`px-6 py-3 rounded-lg transition-all duration-200 flex items-center gap-2 font-medium shadow-sm ${
          activeTab === 'past'
            ? 'bg-blue-600 text-white shadow-md'
            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
        }`}
        onClick={() => onTabChange('past')}
      >
        <Clock className="w-4 h-4" />
        Past
      </button> 
    </div>
  );
}