import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import SubmissionForm from './SubmissionForm';

const ChallengeDetail = () => {
  const { id } = useParams();
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const response = await fetch(`/wp-json/wp/v2/challenges/${id}`);
        if (!response.ok) throw new Error('Failed to fetch challenge');
        const data = await response.json();
        setChallenge(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchSubmissions = async () => {
      try {
        const response = await fetch(`/wp-json/wp/v2/challenge-submissions?challenge=${id}`);
        if (!response.ok) throw new Error('Failed to fetch submissions');
        const data = await response.json();
        setSubmissions(data);
      } catch (err) {
        console.error('Error fetching submissions:', err);
      }
    };

    fetchChallenge();
    fetchSubmissions();
  }, [id]);

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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="mb-8">
        <h1 
          className="text-3xl font-bold mb-4" 
          dangerouslySetInnerHTML={{ __html: title.rendered }} 
        />
        
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          {max_score && (
            <div className="flex items-center gap-2">
              <span className="font-medium">Max Score:</span>
              <span>{max_score}</span>
            </div>
          )}
          
          {deadline && (
            <div className={`flex items-center gap-2 ${isExpired ? 'text-red-600' : ''}`}>
              <span className="font-medium">Deadline:</span>
              <span>
                {isExpired ? 'Expired' : formatDistanceToNow(deadline, { addSuffix: true })}
              </span>
            </div>
          )}
          
          {challenge_category && (
            <div className="flex items-center gap-2">
              <span className="font-medium">Category:</span>
              <span>{challenge_category.name}</span>
            </div>
          )}
        </div>
      </header>

      {featured_media && (
        <div className="mb-8">
          <img
            src={featured_media.source_url}
            alt={title.rendered}
            className="w-full h-auto rounded-lg shadow-md"
            loading="lazy"
          />
        </div>
      )}

      <div 
        className="prose prose-lg max-w-none mb-12"
        dangerouslySetInnerHTML={{ __html: content.rendered }}
      />

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
              <SubmissionForm challengeId={id} />
            </div>
          )}
        </div>
      )}

      {submissions.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Submissions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {submissions.map(submission => (
              <div key={submission.id} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-2">{submission.title.rendered}</h3>
                <div 
                  className="text-gray-600 mb-4"
                  dangerouslySetInnerHTML={{ __html: submission.content.rendered }}
                />
                {submission.meta.demo_url && (
                  <a
                    href={submission.meta.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    View Demo →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChallengeDetail; 