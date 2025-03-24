import React, { useState, useEffect } from 'react';
import { challengesAPI } from '../../api/apiService';
import CategoryFilter from './CategoryFilter';
import ChallengeCard from './ChallengeCard';
import Pagination from '../common/Pagination';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const ChallengesList = () => {
  const [challenges, setChallenges] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <div className="">
      <CategoryFilter
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />
      
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {challenges.map(challenge => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
              />
            ))}
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
    </div>
  );
};

export default ChallengesList; 