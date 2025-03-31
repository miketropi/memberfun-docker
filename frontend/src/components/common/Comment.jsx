import { useState, useEffect, useRef } from 'react';
import { commentsAPI } from '../../api/apiService';
import { MessageSquare, Edit, Flag, Reply } from 'lucide-react';
import Gavatar from '../Gavatar';
import useUserStore from '../../store/userStore';
import { format } from 'date-fns';

export default function Comment({ postId }) {
  const { userData } = useUserStore();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editCommentId, setEditCommentId] = useState(null);
  const commentFormRef = useRef(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  // max page
  const [maxPage, setMaxPage] = useState(1);
  const [replyCommentId, setReplyCommentId] = useState(null);
  const [editCommentId2, setEditCommentId2] = useState(null);

  useEffect(() => {
    fetchComments();
  }, [postId, page]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await commentsAPI.getComments({
        post_id: postId,
        per_page: perPage,
        page: page
      });

      // push new comments to the comments array
      setComments([...comments, ...response?.comments]);
      setMaxPage(response?.pages);
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
        const response = await commentsAPI.updateComment(editCommentId, newComment);
        setComments(comments.map(comment => comment.id === editCommentId ? { ...comment, content: newComment } : {...comment}));
      } else {
        const response = await commentsAPI.createComment({
          post_id: postId,
          content: newComment
        });
        // console.log(response);
        // return;
        // push new comment to the comments array
        setComments([{...response}, ...comments]);
      }
      setNewComment('');
      setEditCommentId(null);
      // fetchComments();
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

  const handleReplyComment = async (commentId, content) => {
    try {
      const response = await commentsAPI.replyComment(commentId, content);
      // fetchComments();

      // find and put the response in the comments array
      const newComments = [...comments].map(comment => comment.id === commentId ? { ...comment, children: [...comment.children, response] } : comment);
      console.log(newComments);
      setComments(newComments);
      
      setReplyCommentId(null);
    } catch (err) {
      setError('Failed to reply comment. Please try again later.');
      console.error('Error replying comment:', err);
    }
  };

  const handleEditComment = async (commentId, content) => {
    try {
      const response = await commentsAPI.updateComment(commentId, content);
      // const newComments = [...comments].map(comment => comment.id === commentId ? { ...comment, content: content } : comment);
      // update the comment in the comments array item is child or parent need recursive update
      // Recursively update comments and their children
      const updateCommentsRecursively = (comments, commentId, content) => {
        return comments.map(comment => {
          if (comment.id === commentId) {
            return { ...comment, content };
          } else if (comment.children && comment.children.length > 0) {
            return {
              ...comment,
              children: updateCommentsRecursively(comment.children, commentId, content)
            };
          }
          return comment;
        });
      };
      
      const newComments = updateCommentsRecursively(comments, commentId, content);

      // console.log(newComments);
      setComments(newComments);
      setEditCommentId2(null);
    } catch (err) {
      setError('Failed to edit comment. Please try again later.');
      console.error('Error editing comment:', err);
    }
  };

  /**
   * render comments recursive
   */
  const renderComments = (comments) => {
    return comments.map((comment) => {
      return (
        <div key={`comment-${comment.id}`}>
          {/* <CommentItem comment={comment} onReply={ cid => {
            setReplyCommentId(cid);
            setEditCommentId2(null);
          } } onEdit={ cid => {
            setEditCommentId2(cid);
            setReplyCommentId(null);
          } } /> */}
          {
            (() => {
              // return editCommentId2 === comment.id && (
              //   <CommentForm message={comment.content} onSubmit={ content => {
              //     handleEditComment( comment.id, content )
              //   } } onCancel={() => setEditCommentId2(null)} />
              // )
              return editCommentId2 === comment.id ? <>
                {/** ml if comment is child */}
                <div className={`${parseInt(comment.parent) > 0 ? 'ml-8 md:ml-12' : ''}`}>
                  <div className="mb-4 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800 flex items-center">
                    <Edit className="h-4 w-4 mr-2 text-blue-500" />
                    <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                      Editing your comment
                    </span>
                  </div>
                  <CommentForm 
                    message={comment.content} 
                    onSubmit={content => handleEditComment(comment.id, content)} 
                    onCancel={() => setEditCommentId2(null)} 
                  />
                </div>
              </> : (
                <CommentItem comment={comment} onReply={ cid => {
                  setReplyCommentId(cid);
                  setEditCommentId2(null);
                } } onEdit={ cid => {
                  setEditCommentId2(cid);
                  setReplyCommentId(null);
                } } />
              )
            })()
          }

          {comment?.children?.length > 0 && renderComments(comment.children)}
          
          {
            replyCommentId === comment.id && (
              <div className="ml-8 md:ml-12">
                <div className="mb-4">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Replying...
                  </span>
                </div>
                <CommentForm onSubmit={ content => {
                  handleReplyComment( comment.id, content )
                } } onCancel={() => setReplyCommentId(null)} />
              </div>
            )
          }
        </div>
      );
    });
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
          <MessageSquare className="h-5 w-5 mr-2 text-blue-500" />
          Leave a comment
        </h3>
      </div>

      <form ref={commentFormRef} onSubmit={handleSubmitComment} className="mb-6">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Leave a comment..."
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-3 focus:ring-blue-500 focus:border-blue-500"
          rows="3"
        />
        <div className="mt-2 flex justify-end">
          {editCommentId && (
            <button
              type="button"
              onClick={() => {
                setEditCommentId(null);
                setNewComment('');
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 mr-2"
            >
              Cancel Edit
            </button>
          )}
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
        renderComments(comments)
      }

      {
        /** load more comments button */
        comments.length > 0 && page < maxPage && (
          <button onClick={() => setPage(page + 1)} className="text-blue-500 hover:text-blue-600">
            Load more comments
          </button>
        )
      }

      {
        // comments.length > 0 && (
        //   <>
        //     <div className="space-y-4">
        //       {comments.map((comment) => (
        //         <>
        //           <div
        //             key={comment.id}
        //             className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
        //           >
        //             <div className="flex justify-between items-start mb-2">
        //               <div className="flex items-center">
        //                 <Gavatar email={comment.author.email} size={40} className="h-8 w-8 rounded-full mr-3" />
        //                 <div>
        //                   <div className="font-medium text-gray-900 dark:text-white">
        //                     {comment.author.name}
        //                   </div>
        //                   <div className="text-sm text-gray-500 dark:text-gray-400">
        //                     {
        //                       format(new Date(comment.date), 'dd/MM/yyyy HH:mm')
        //                     }
        //                   </div>
        //                 </div>

        //               </div>
        //               {/* {parseInt(comment.author.id) === userData.id && (
        //                 <button
        //                   onClick={() => handleDeleteComment(comment.id)}
        //                   className="text-red-500 hover:text-red-600"
        //                 >
        //                   Delete
        //                 </button>
        //               )} */}
        //             </div>
        //             <div className="prose dark:prose-invert max-w-none mb-3">
        //               {comment.content}
        //             </div>
        //             <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
        //               <button disabled className="flex bg-white items-center text-gray-400 dark:text-gray-600 cursor-not-allowed">
        //                 <Flag className="h-4 w-4 mr-1" />
        //                 Report
        //               </button>
        //               {parseInt(comment.author.id) === userData.id && (
        //                 <button
        //                   onClick={(e) => {
        //                     e.preventDefault();
        //                     setNewComment(comment.content);
        //                     setEditCommentId(comment.id);
        //                     commentFormRef.current.scrollIntoView({ behavior: 'smooth' });
        //                   }}
        //                   className="flex bg-white items-center hover:text-gray-700 dark:hover:text-gray-300"
        //                 >
        //                   <Edit className="h-4 w-4 mr-1" />
        //                   Edit
        //                 </button>
        //               )}
        //             </div>
        //           </div>
        //           {comment.children_count > 0 && (
        //             <ChildrenComments children={comment.children} />
        //           )}
        //         </>
        //       ))}

        //       {/* load more comments button */}
        //       {comments.length > 0 && page < maxPage && (
        //         <button
        //           onClick={() => setPage(page + 1)}
        //           className="text-blue-500 hover:text-blue-600"
        //         >
        //           Load more comments
        //         </button>
        //       )}
        //     </div>
        //   </>
        // )
      }

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

/**
 * Comment item component
 */
function CommentItem({ comment, onReply, onEdit }) {
  const { userData } = useUserStore();
  const isChild = parseInt(comment.parent) > 0;

  return (
    <div 
      key={comment.id} 
      className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 mb-4 ${
        isChild ? 'ml-8 md:ml-12' : ''
      }`}
    >
      <div className="flex flex-col space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <Gavatar email={comment.author.email} size={40} className="h-10 w-10 rounded-full mr-3" />
            <div>
              <div className="font-bold text-sm text-gray-900 dark:text-white">{comment.author.name}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {format(new Date(comment.date), 'dd MMM yyyy • HH:mm')}
              </div>
            </div>
          </div>
        </div>
        
        <div className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
          <div dangerouslySetInnerHTML={{ __html: comment.content }} />
        </div>

        {
          /** Buttons edit | reply */
          <div className="flex items-center space-x-2">
            {
              /** user is author of the comment */
              parseInt(comment.author.id) === userData.id && (
                <button onClick={() => onEdit(comment.id)} className="text-blue-500 hover:text-blue-600 text-xs flex items-center gap-1">
                  <Edit className="h-4 w-4" />
                  Edit
                </button>
              )
            }
            
            {
              /** allow reply if comment parent is 0 */
              parseInt(comment.parent) === 0 && (
                <button onClick={() => onReply(comment.id)} className="text-blue-500 hover:text-blue-600 text-xs flex items-center gap-1">
                  <Reply className="h-4 w-4" />
                  Reply { comment?.children?.length > 0 ? `(${comment?.children?.length})` : '' }
                </button>
              )
            }
          </div>
        }
      </div>
    </div>
  );
}

/**
 * Comment form component
 */
function CommentForm({ message = '', onSubmit, onCancel }) {
  const [newComment, setNewComment] = useState(message);
  const formRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    formRef.current.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      inputRef.current.focus();
    }, 100);
  }, []);

  return (
    <div className="mt-4" ref={formRef}>
      <textarea 
        value={newComment} 
        onChange={(e) => setNewComment(e.target.value)}
        className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white resize-none min-h-[100px]"
        placeholder="Write your comment here..."
        ref={inputRef}
      />
      <div className="mt-2 flex justify-end gap-2 my-4">
        <button 
          onClick={() => onSubmit(newComment)}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={newComment.trim() === ''}
        >
          <span>Submit</span>
        </button>
        <button 
          onClick={onCancel}
          className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
        >
          <span>Cancel</span>
        </button>
      </div>
    </div>
  );
}
