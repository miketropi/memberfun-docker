import { useState, useEffect, useRef } from 'react';
import { commentsAPI } from '../../api/apiService';
import { Star, Filter, Download, MessageSquare, ThumbsUp, Flag, Edit } from 'lucide-react';
import Gavatar from '../Gavatar';
import useUserStore from '../../store/userStore';

export default function SeminarComments({ seminarId, isHost = false }) {
  const { userData } = useUserStore();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editCommentId, setEditCommentId] = useState(null);
  const [filters, setFilters] = useState({
    date: 'all',
    type: 'all',
    rating: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);
  const commentFormRef = useRef(null);

  useEffect(() => {
    fetchComments();
  }, [seminarId, filters]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await commentsAPI.getComments({
        post_id: seminarId,
        ...filters
      });
      setComments(response?.comments);
      setError(null);
    } catch (err) {
      setError('Failed to load comments. Please try again later.');
      console.error('Error fetching comments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      if (editCommentId) {
        await commentsAPI.updateComment(editCommentId, newComment);
      } else {
        await commentsAPI.createComment({
          post_id: seminarId,
          content: newComment
        });
      }
      setNewComment('');
      setEditCommentId(null);
      fetchComments();
    } catch (err) {
      setError('Failed to post comment. Please try again later.');
      console.error('Error posting comment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await commentsAPI.deleteComment(commentId);
      fetchComments();
    } catch (err) {
      setError('Failed to delete comment. Please try again later.');
      console.error('Error deleting comment:', err);
    }
  };

  const handleExportComments = () => {
    // Implementation for exporting comments
    console.log('Exporting comments...');
  };

  // if (loading) {
  //   return (
  //     <div className="flex justify-center items-center h-32">
  //       <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
  //     </div>
  //   );
  // }

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border  p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
          <MessageSquare className="h-5 w-5 mr-2 text-blue-500" />
          Comments
        </h3>
        {/* <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <Filter className="h-4 w-4 mr-1" />
            Filters
          </button>
          {isHost && (
            <button
              onClick={handleExportComments}
              className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <Download className="h-4 w-4 mr-1" />
              Export
            </button>
          )}
        </div> */}
      </div>

      {showFilters && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date
              </label>
              <select
                value={filters.date}
                onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Types</option>
                <option value="feedback">Feedback</option>
                <option value="question">Questions</option>
                <option value="discussion">Discussion</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Rating
              </label>
              <select
                value={filters.rating}
                onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
                className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
                <option value="2">2+ Stars</option>
                <option value="1">1+ Stars</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <form ref={commentFormRef} onSubmit={handleSubmitComment} className="mb-6">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Leave a comment..."
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-3 focus:ring-blue-500 focus:border-blue-500"
          rows="3"
        />
        <div className="mt-2 flex justify-end">
          {
            editCommentId ? (
            <button
              type="button"
              onClick={() => {
                setEditCommentId(null)
                setNewComment('')
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 mr-2"
            >
              Cancel Edit
            </button>
            ) : ''
          }
          <button
            type="submit"
            disabled={submitting || !newComment.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Posting...' : editCommentId ? 'Update Comment' : 'Post Comment'}
          </button>
        </div>
      </form>

      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg">
          {error}
        </div>
      )}

      {
        (() => {
          if (loading) {
            return (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            );
          } else {
            return <>
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        {/* <img
                          src={comment.author.avatar || 'https://via.placeholder.com/40'}
                          alt={comment.author.name}
                          className="h-8 w-8 rounded-full mr-3"
                        /> */}
                        <Gavatar email={comment.author.email} size={40} className="h-8 w-8 rounded-full mr-3" />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {comment.author.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(comment.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      {isHost && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                    <div className="prose dark:prose-invert max-w-none mb-3">
                      {comment.content}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      {/* <button className="flex items-center hover:text-gray-700 dark:hover:text-gray-300">
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        Like
                      </button> */}
                      <button disabled className="flex bg-white items-center text-gray-400 dark:text-gray-600 cursor-not-allowed">
                        <Flag className="h-4 w-4 mr-1" />
                        Report
                      </button>
                      {/* { JSON.stringify(comment.author.id) }
                      { JSON.stringify(userData.id) } */}
                      {parseInt(comment.author.id) === userData.id && (
                        <button onClick={ (e) => {
                          e.preventDefault();
                          setNewComment(comment.content);
                          setEditCommentId(comment.id);
                          commentFormRef.current.scrollIntoView({ behavior: 'smooth' });
                        } } className="flex bg-white items-center hover:text-gray-700 dark:hover:text-gray-300">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </button>
                      )}
                      {/* {comment.rating && (
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          {comment.rating}/5
                        </div>
                      )} */}
                    </div>
                  </div>
                ))}
              </div>
            </>
          }
        })()
      }
    </div>
  );
} 