import { Star, User } from 'lucide-react';
import Gavatar from '../../Gavatar';

export default function SeminarRatingTable({ ratings = [] }) {
  if (!ratings || ratings.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No ratings yet
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-4">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-400" />
          Seminar Ratings
        </h3>
      </div>
      
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {ratings.map((rating, index) => (
          <div key={index} className="p-6">
            <div className="flex items-center mb-4">
              <Gavatar 
                email={rating.user_email} 
                size={40}
                className="h-10 w-10 rounded-full mr-4"
              />
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {rating.user_display_name}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(rating.rating_data).map(([key, value]) => (
                <div key={key} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400 capitalize mb-2">
                    {key}
                  </div>
                  <div className="flex items-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mr-2">
                      {value}
                    </div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < value
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

