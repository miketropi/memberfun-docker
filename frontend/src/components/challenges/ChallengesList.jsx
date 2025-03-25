import React, { useState, useEffect } from 'react';
import { challengesAPI } from '../../api/apiService';
import CategoryFilter from './CategoryFilter';
import ChallengeCard from './ChallengeCard';
import Pagination from '../common/Pagination';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import { useNavigate, useLocation } from 'react-router-dom';
import ChallengeDetail from './ChallengeDetail';

const ChallengesList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [challenges, setChallenges] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChallenge, setSelectedChallenge] = useState(null);

  const getLocalPathname = () => {
    return location.pathname;
  }

  let localPathname = getLocalPathname();

  useEffect(() => {
    if (localPathname.includes('challenges')) {
      const challengeId = localPathname.split('/').pop();
      if(challengeId == 'challenges') {
        setSelectedChallenge(null);
        return;
      }
      setSelectedChallenge(challengeId);
    }

  }, [localPathname]);

  const fetchChallenges = async (page = 1, categoryId = null) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const params = {
        per_page: 12,
        page,
        ...(categoryId && { challenge_category: categoryId })
      };

      const response = await challengesAPI.getChallenges(params);
      setChallenges(response.data);
      // console.log(response.headers);
      // Update pagination from response headers
      setPagination({
        currentPage: page,
        totalPages: parseInt(response.headers['x-wp-totalpages']),
        total: parseInt(response.headers['x-wp-total'])
      });
    } catch (err) {
      setError(err.message || 'Failed to fetch challenges');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges(1, selectedCategory);
  }, [selectedCategory]);

  const handlePageChange = (page) => {
    fetchChallenges(page, selectedCategory);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  if (error) {
    return <ErrorMessage message={error} />;
  }

  const handleChallengeClick = (challengeId) => {
    navigate(`/dashboard/challenges/${challengeId}`);
  };

  return (
    <div className="w-full">

      {
        (() => {
          if(selectedChallenge) {
            return (
              <ChallengeDetail challengeId={selectedChallenge} />
            )
          } else {
            return <>
              <CategoryFilter
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
              />
              
              {isLoading ? (
                <LoadingSpinner />
              ) : (
                <>
                  <div className="overflow-x-auto mb-8">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Challenge
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Category
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Points
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Deadline
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                        {challenges.map(challenge => (
                          <tr key={challenge.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer" onClick={() => handleChallengeClick(challenge.id)}>
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                {challenge.featured_media && (
                                  <div className="h-12 w-12 rounded-full overflow-hidden mr-4 flex-shrink-0 border border-gray-200">
                                    <img src={challenge.featured_media.thumbnail} alt="" className="h-full w-full object-cover" />
                                  </div>
                                )}
                                <div className="font-medium text-gray-800 dark:text-gray-200" dangerouslySetInnerHTML={{ __html: challenge.title.rendered }} />
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                              {challenge.challenge_category && challenge.challenge_category.map(category => category.name).join(', ')}
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-blue-600 dark:text-blue-400">
                              {challenge.max_score} Points
                            </td>
                            <td className="px-6 py-4 text-sm">
                              {challenge.submission_deadline_enabled ? 
                                (new Date(challenge.submission_deadline) < new Date() ? 
                                  <span className="text-red-600 dark:text-red-400 font-medium">Expired</span> : 
                                  <span className="text-green-600 dark:text-green-400 font-medium">{new Date(challenge.submission_deadline).toLocaleDateString()}</span>) : 
                                <span className="text-gray-500 dark:text-gray-400">No deadline</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {pagination.totalPages > 1 && (
                    <Pagination
                      currentPage={pagination.currentPage}
                      totalPages={pagination.totalPages}
                      onPageChange={handlePageChange}
                    />
                  )}
                </>
              )}
            </>
          }
        })()
      }
    </div>
  );
};

export default ChallengesList; 