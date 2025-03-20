import { format, parseISO } from 'date-fns';
import { Calendar, MapPin, User, CheckCircle } from 'lucide-react';

export default function SeminarCard({ seminar, isRegistered, onClick, isPast = false }) {
  return (
    <tr 
      onClick={() => onClick(seminar)}
      className={`hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors ${isPast ? 'opacity-80' : ''}`}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          {seminar.featured_image ? (
            <img 
              className={`h-10 w-10 rounded-full object-cover mr-3 ${isPast ? 'filter grayscale' : ''}`} 
              src={seminar.featured_image} 
              alt="" 
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 mr-3" />
          )}
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {seminar.title}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex flex-col text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{seminar.formatted_date || format(parseISO(seminar.date), 'MMM d, yyyy')}</span>
          </div>
          <div className="flex items-center mt-1">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{seminar.location}</span>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
          <User className="h-4 w-4 mr-1" />
          <span>{seminar.host?.name || 'Unknown'}</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        { seminar.status ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
            Upcoming
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100">
            Past
          </span>
        )}
      </td>
    </tr>
  );
} 