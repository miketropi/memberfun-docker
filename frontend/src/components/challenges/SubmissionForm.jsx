import React, { useState, useEffect } from 'react';
import { submissionsAPI } from '../../api/apiService';
import ErrorMessage from '../common/ErrorMessage';

const SubmissionForm = ({ challengeId, submissionId, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    demo_url: '',
    demo_video: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const fetchSubmission = async () => {
    const submission = await submissionsAPI.getSubmission(submissionId);
    // console.log(submission);

    setFormData({
      title: submission.__title.raw,
      content: submission.__content.raw,
      demo_url: submission.demo_url,
      demo_video: submission.demo_video
    });
  }

  useEffect(() => {
    if (submissionId) {
      fetchSubmission();
    }
  }, [submissionId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Title is required');
      return false;
    }
    if (!formData.content.trim()) {
      setError('Description is required');
      return false;
    }
    if (formData.demo_url && !isValidUrl(formData.demo_url)) {
      setError('Please enter a valid demo URL');
      return false;
    }
    if (formData.demo_video && !isValidUrl(formData.demo_video)) {
      setError('Please enter a valid video URL');
      return false;
    }
    return true;
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const submissionData = {
        title: formData.title,
        content: formData.content,
        status: 'publish',
        meta: {
          _submission_challenge_id: challengeId,
          _submission_demo_url: formData.demo_url,
          _submission_demo_video: formData.demo_video
        }
      };

      let response;
      if (submissionId) {
        response = await submissionsAPI.updateSubmission(submissionId, submissionData);
      } else {
        response = await submissionsAPI.createSubmission(submissionData);
      }

      if (response.status === 'success') {
        setSuccess(true);
        onSuccess?.();
      } else {
        setError(response.message || 'Failed to submit solution');
      }
    } catch (err) {
      setError(err.message || 'Failed to submit solution');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 text-center shadow-sm border border-green-100 dark:border-green-800">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="bg-green-100 dark:bg-green-800 rounded-full p-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Submission Successful!</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-2">Your solution has been submitted successfully, please wait for the review.</p>
          <button 
            onClick={() => setSuccess(false)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Submit Another Solution
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 border">
      <div className="mb-6">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Solution Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter a title for your solution"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
          Solution Description
        </label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          required
          rows="6"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Describe your solution in detail"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="demo_url" className="block text-sm font-medium text-gray-700 mb-2">
          Demo URL (Optional)
        </label>
        <input
          type="url"
          id="demo_url"
          name="demo_url"
          value={formData.demo_url}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="https://your-demo-url.com"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="demo_video" className="block text-sm font-medium text-gray-700 mb-2">
          Video URL (Optional)
        </label>
        <input
          type="url"
          id="demo_video"
          name="demo_video"
          value={formData.demo_video}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="https://your-video-url.com"
        />
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 text-green-700">
          Your solution has been submitted successfully!
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting 
          ? 'Submitting...' 
          : submissionId 
            ? 'Update Solution' 
            : 'Submit Solution'
        }
      </button>
    </form>
  );
};

export default SubmissionForm; 