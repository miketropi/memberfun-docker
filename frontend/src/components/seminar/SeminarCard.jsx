import { format, parseISO } from 'date-fns';
import { Calendar, MapPin, User, Star } from 'lucide-react';

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
            <div className='font-bold'>{seminar.title}</div>
            {seminar.double_points && (
              <span className="inline-flex mt-1 items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-gradient-to-r from-yellow-300 to-amber-500 text-yellow-900 dark:from-yellow-600 dark:to-amber-700 dark:text-yellow-100 shadow-sm border border-yellow-400 dark:border-yellow-700">
                <Star className="h-3.5 w-3.5 mr-1" />
                Double Points
                <Star className="h-3.5 w-3.5 ml-1" />
              </span>
            )}
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