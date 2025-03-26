import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { 
  Clock, 
  Award,
  Tag,
  Undo2,
  FileText,
  ExternalLink,
  Play,
  Pencil,
  Trash2
} from 'lucide-react';
import SubmissionForm from './SubmissionForm';
import { challengesAPI, submissionsAPI } from '../../api/apiService';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import Popover from '../Popover';

const ChallengeDetail = ({ challengeId }) => {
  // const { id } = useParams();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);

  const fetchSubmissions = async () => {
    try {
      const response = await submissionsAPI.getSubmissions(challengeId);
      console.log('submissions', response);
      // if (!response.ok) throw new Error('Failed to fetch submissions');
      // const data = await response.json();
      setSubmissions(response);
    } catch (err) {
      console.error('Error fetching submissions:', err);
    }
  };

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const response = await challengesAPI.getChallenge(challengeId);
        // console.log('challenge', response);
        // if (!response.ok) throw new Error('Failed to fetch challenge');
        // const data = await response.json(); 
        setChallenge(response);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenge();
    fetchSubmissions();
  }, [challengeId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="h-64 bg-gray-200 rounded mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-gray-600">Challenge not found</div>
      </div>
    );
  }

  const {
    title,
    content,
    featured_media,
    max_score,
    submission_deadline_enabled,
    submission_deadline,
    challenge_category
  } = challenge;

  const deadline = submission_deadline_enabled ? new Date(submission_deadline) : null;
  const isExpired = deadline && deadline < new Date();

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl sm:p-6 md:p-8 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard/challenges')}
              className="flex items-center gap-2 rounded-lg px-4 py-2.5 bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
            >
              <Undo2 className="h-5 w-5" />
              <span className="font-medium">Back</span>
            </button>
            <h1 
              className="text-2xl font-semibold text-gray-900 dark:text-white" 
              dangerouslySetInnerHTML={{ __html: title.rendered }} 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-5">
          <div className="col-span-1 md:col-span-8">
            <div 
              className="prose dark:prose-invert max-w-none mb-6 sm:mb-8 text-gray-600 dark:text-gray-300 prose" 
              dangerouslySetInnerHTML={{ __html: content.rendered }}
            />
            
            <div className="space-y-4 mb-6 sm:mb-8 bg-gray-50 dark:bg-gray-700/50 p-4 sm:p-6 rounded-xl">
              {max_score && (
                <div className="flex items-center text-gray-700 dark:text-gray-200">
                  <Award className="h-5 w-5 mr-3 text-blue-500 flex-shrink-0" />
                  <span className="font-medium">Max Score: {max_score}</span>
                </div>
              )}
              
              {deadline && (
                <div className={`flex items-center text-gray-700 dark:text-gray-200 ${isExpired ? 'text-red-600' : ''}`}>
                  <Clock className="h-5 w-5 mr-3 text-blue-500 flex-shrink-0" />
                  <span className="font-medium">
                    {isExpired ? 'Expired' : formatDistanceToNow(deadline, { addSuffix: true })}
                  </span>
                </div>
              )}
              
              {challenge_category && (
                <div className="flex items-center text-gray-700 dark:text-gray-200">
                  <Tag className="h-5 w-5 mr-3 text-blue-500 flex-shrink-0" />
                  <span className="font-medium">
                    {challenge_category.map(category => category.name).join(', ')}
                  </span>
                </div>
              )}
            </div>

            {submissions.length > 0 && (
              <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="p-5 border-b border-gray-100 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-blue-500 flex-shrink-0" />
                    Submissions
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-750">
                      <tr>
                        <th style={{ width: '35%' }} className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title</th>
                        <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                        <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Author</th>
                        <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Demo URL</th>
                        <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description Video</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                      {submissions.map(submission => (
                        <tr key={submission.id} className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-750">
                          <td className="px-5 py-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              <h4 className="text-md font-bold text-gray-900 dark:text-white mb-2"> {submission.title} </h4>
                              <span className="text-sm text-gray-600 dark:text-gray-300"> {format(new Date(submission.date), 'MMMM d, yyyy • h:mm a')} </span>
                              <div className="flex space-x-2 mt-2">
                                <button 
                                  className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium rounded text-gray-700 bg-gray-100 hover:bg-blue-100 hover:text-blue-700 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-blue-800 dark:hover:text-blue-200 transition-all duration-200 shadow-sm"
                                  title="Edit submission"
                                >
                                  <Pencil className="h-3.5 w-3.5 mr-1.5" /> Edit
                                </button>
                                <button 
                                  className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium rounded text-gray-700 bg-gray-100 hover:bg-red-100 hover:text-red-700 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-red-900 dark:hover:text-red-200 transition-all duration-200 shadow-sm"
                                  title="Delete submission"
                                >
                                  <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Delete
                                </button>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <Popover width={400} content={ <div 
                              className="text-sm text-gray-600 dark:text-gray-300 prose prose-sm max-w-none px-4"
                              dangerouslySetInnerHTML={{ __html: submission.content }}
                            /> }>
                              <button className="flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                                <FileText className="h-4 w-4 mr-1" />
                              </button>
                            </Popover>
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <img 
                                src={submission.author?.gravatar} 
                                alt={submission.author?.display_name} 
                                className="h-6 w-6 rounded-full object-cover shadow-sm mr-2" 
                              />
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
                                {submission.author?.display_name || 'Anonymous'}
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                              {
                                submission.demo_url && (
                                  <a href={submission.demo_url} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="h-4 w-4 mr-1 inline-block" /> View Demo
                                  </a>
                                )
                              }
                            </div>
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                              {
                                submission.demo_video && (
                                  <a href={submission.demo_video} target="_blank" rel="noopener noreferrer">
                                    <Play className="h-4 w-4 mr-1 inline-block" /> Watch Video
                                  </a>
                                )
                              }
                            </div>
                          </td>
                          
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {!isExpired && (
              <div className="mb-12">
                <button
                  onClick={() => setShowSubmissionForm(!showSubmissionForm)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  {showSubmissionForm ? 'Cancel Submission' : 'Submit Solution'}
                </button>
                
                {showSubmissionForm && (
                  <div className="mt-6">
                    <SubmissionForm challengeId={challengeId} onSuccess={() => {
                      // setShowSubmissionForm(false);
                      console.log('submission success');
                      fetchSubmissions();
                    }} />
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="col-span-1 md:col-span-4">
            {featured_media && (
              <div className="mb-6 sm:mb-8">
                <img
                  src={featured_media.source_url}
                  alt={title.rendered}
                  className="w-full h-auto rounded-2xl shadow-md object-cover"
                  loading="lazy"
                />
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeDetail; 