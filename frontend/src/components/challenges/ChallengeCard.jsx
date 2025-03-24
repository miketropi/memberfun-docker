import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Award, Clock, Tag } from 'lucide-react';
export default function ChallengeCard({ challenge }) {
  const {
    id,
    title,
    excerpt,
    featured_media,
    max_score,
    submission_deadline_enabled,
    submission_deadline,
    challenge_category
  } = challenge;

  const renderDeadline = () => {
    if (!submission_deadline_enabled) return null;
    
    const deadline = new Date(submission_deadline);
    const isExpired = deadline < new Date();
    
    return (
      <div className={`flex items-center gap-2 ${isExpired ? 'text-red-600' : 'text-gray-600'}`}>
        <span className="font-medium">Deadline:</span>
        <span>
          {isExpired ? 'Expired' : formatDistanceToNow(deadline, { addSuffix: true })}
        </span>
      </div>
    );
  };

  return (
    <Link 
      to={`/dashboard/challenges/${id}`} 
      className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
    >
      <div className="relative pt-[56.25%] overflow-hidden">
        {featured_media ? (
          <img
            src={featured_media.large}
            alt={title.rendered}
            className="absolute top-0 left-0 w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="absolute top-0 left-0 w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 
          className="text-xl font-semibold mb-4 line-clamp-2" 
          dangerouslySetInnerHTML={{ __html: title.rendered }} 
        />
        
        <div className="flex flex-wrap gap-2.5 mb-5">
          {max_score && (
            <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-full text-xs font-medium shadow-sm">
              <Award className="h-3.5 w-3.5" />
              {max_score} Points
            </div>
          )}
          
          {challenge_category && challenge_category.length > 0 && (
            <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/20 text-purple-700 dark:text-purple-300 px-3 py-1.5 rounded-full text-xs font-medium shadow-sm">
              <Tag className="h-3.5 w-3.5" />
              {challenge_category.map(category => category.name).join(', ')}
            </div>
          )}
          
          {submission_deadline_enabled && (
            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium shadow-sm ${
              new Date(submission_deadline) < new Date() 
                ? 'bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/20 text-red-700 dark:text-red-300' 
                : 'bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20 text-green-700 dark:text-green-300'
            }`}>
              <Clock className="h-3.5 w-3.5" />
              {new Date(submission_deadline) < new Date() 
                ? 'Expired' 
                : formatDistanceToNow(new Date(submission_deadline), { addSuffix: true })}
            </div>
          )}
        </div>
        
        <div 
          className="text-gray-600 line-clamp-3"
          dangerouslySetInnerHTML={{ __html: excerpt.rendered }}
        />
      </div>
    </Link>
  );
}; 