import { Search, Filter } from 'lucide-react';

export default function SeminarFilters({ filters, onFilterChange }) {
  return (
    <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search seminars..."
          value={filters.search}
          onChange={(e) => onFilterChange('search', e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
        />
      </div>
      {/* <div className="relative">
        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Filter by host..."
          value={filters.host}
          onChange={(e) => onFilterChange('host', e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
        />
      </div> */}
      <select
        value={filters.status}
        onChange={(e) => onFilterChange('status', e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
      >
        <option value="all">All Seminars</option>
        <option value="upcoming">Upcoming Only</option>
        {/* <option value="past">Past Only</option> */}
      </select>
    </div>
  );
} 