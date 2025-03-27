import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, parseISO, isFuture } from 'date-fns';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Users, 
  XCircle,
  FileText,
  Download,
  Undo2,
  Star
} from 'lucide-react';
import SeminarRegistrationButton from './SeminarRegistrationButton';
import SeminarComments from './SeminarComments';
import SeminarAddRating from './components/SeminarAddRating';
import SeminarRatingTable from './components/SeminarRatingTable';
import { seminarsAPI } from '../../api/apiService';
import Comment from '../common/Comment';

export default function SeminarDetails({ 
  seminar, 
  onClose, 
  isRegistered, 
  onRegister, 
  onCancelRegistration, 
  onExportCalendar,
  registrationLoading = false,
  isHost = false
}) {
  if (!seminar) return null;

  const [ratings, setRatings] = useState([]);

  useEffect(() => {
    const fetchRatings = async () => {
      const ratings = await seminarsAPI.getRatings(seminar.id);
      setRatings(ratings);
    };
    fetchRatings();
  }, [seminar.id]);

  const handleRatingAdded = async (response) => {
    const ratings = await seminarsAPI.getRatings(seminar.id);
    setRatings(ratings);
  };


  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl sm:p-6 md:p-8 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="flex items-center gap-2 rounded-lg px-4 py-2.5 bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
            >
              <Undo2 className="h-5 w-5" />
              <span className="font-medium">Back</span>
            </button>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{seminar.title}</h2>
            <div className='flex items-center gap-2'>
              {seminar.double_points && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-gradient-to-r from-yellow-300 to-amber-500 text-yellow-900 dark:from-yellow-600 dark:to-amber-700 dark:text-yellow-100 shadow-sm border border-yellow-400 dark:border-yellow-700">
                  <Star className="h-3.5 w-3.5 mr-1" /> 
                  Double points 
                  <Star className="h-3.5 w-3.5 ml-1" />
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-5">
          <div className="col-span-1 md:col-span-8">
            <div className="prose dark:prose-invert max-w-none mb-6 sm:mb-8 text-gray-600 dark:text-gray-300 prose" 
                 dangerouslySetInnerHTML={{ __html: seminar.content }} />
            
            <div className="space-y-4 mb-6 sm:mb-8 bg-gray-50 dark:bg-gray-700/50 p-4 sm:p-6 rounded-xl">
              <div className="flex items-center text-gray-700 dark:text-gray-200">
                <Calendar className="h-5 w-5 mr-3 text-blue-500 flex-shrink-0" />
                <span className="font-medium">{seminar.formatted_date || format(parseISO(seminar.date), 'MMMM d, yyyy')}</span>
              </div>
              <div className="flex items-center text-gray-700 dark:text-gray-200">
                <Clock className="h-5 w-5 mr-3 text-blue-500 flex-shrink-0" />
                <span className="font-medium">{seminar.formatted_time || seminar.time}</span>
              </div>
              <div className="flex items-center text-gray-700 dark:text-gray-200">
                <MapPin className="h-5 w-5 mr-3 text-blue-500 flex-shrink-0" />
                <span className="font-medium break-words">{seminar.location}</span>
              </div>
              <div className="flex items-center text-gray-700 dark:text-gray-200">
                <User className="h-5 w-5 mr-3 text-blue-500 flex-shrink-0" />
                <span className="font-medium">Host: {seminar.host?.name || 'Unknown'}</span>
              </div>
              {seminar.capacity && (
                <div className="flex items-center text-gray-700 dark:text-gray-200">
                  <Users className="h-5 w-5 mr-3 text-blue-500 flex-shrink-0" />
                  <span className="font-medium">Capacity: {seminar.capacity}</span>
                </div>
              )}
            </div>

            {/* {
              JSON.stringify(seminar.ratings)
            } */}
            <SeminarRatingTable ratings={ratings} />
            <SeminarAddRating seminar={seminar} onRatingAdded={handleRatingAdded} />
          </div>
          
          <div className="col-span-1 md:col-span-4">
            {seminar.featured_image && (
              <div className="mb-6 sm:mb-8">
                <img 
                  src={seminar.featured_image} 
                  alt={seminar.title}
                  className="w-full h-auto rounded-2xl shadow-md object-cover" 
                />
              </div>
            )}
            
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
                <FileText className="h-5 w-5 mr-3 text-blue-500 flex-shrink-0" />
                Seminar Documents
              </h3>
              
              {seminar.documents && seminar.documents.length > 0 ? (
                <ul className="space-y-3">
                  {seminar.documents.map((doc) => (
                    <li key={doc.id}>
                      <a
                        href={doc.url}
                        download={doc.filename}
                        className="flex items-center p-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/70 rounded-lg transition-colors group"
                      >
                        <Download className="h-5 w-5 mr-3 text-blue-500 flex-shrink-0 group-hover:text-blue-600" />
                        <span className="text-gray-700 dark:text-gray-300 font-medium group-hover:text-gray-900 dark:group-hover:text-white break-words">
                          {doc.title}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No documents available for this seminar.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* <SeminarComments seminarId={seminar.id} isHost={isHost} /> */}
      <Comment postId={seminar.id} />
    </div>
  );
}