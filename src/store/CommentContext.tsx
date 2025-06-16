import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CommentData, createComment, getPostComments, updateComment, deleteComment } from '../services/comment';
import { useAuth } from './AuthContext';

interface CommentContextType {
  commentsByPost: { [postId: string]: CommentData[] };
  currentPostId: string | null;
  loading: boolean;
  error: string | null;
  fetchPostComments: (postId: string) => Promise<CommentData[]>;
  addComment: (postId: string, content: string, parentId?: string) => Promise<CommentData | null>;
  editComment: (commentId: string, content: string) => Promise<CommentData | null>;
  removeComment: (commentId: string) => Promise<boolean>;
}

const CommentContext = createContext<CommentContextType | undefined>(undefined);

export const useComment = () => {
  const context = useContext(CommentContext);
  if (context === undefined) {
    throw new Error('useComment must be used within a CommentProvider');
  }
  return context;
};

interface CommentProviderProps {
  children: ReactNode;
}

export const CommentProvider: React.FC<CommentProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [commentsByPost, setCommentsByPost] = useState<{ [postId: string]: CommentData[] }>({});
  const [currentPostId, setCurrentPostId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPostComments = async (postId: string, pageIndex?: number, pageSize?: number): Promise<CommentData[]> => {
    setLoading(true);
    setError(null);
    setCurrentPostId(postId);

    try {
      const fetchedComments = await getPostComments(postId, pageIndex, pageSize);

      // Process comments to add author information for UI display
      const processedComments = fetchedComments.map(comment => ({
        ...comment,
        author: {
          id: comment.creatorId,
          username: comment.authorName || 'User', // Use authorName from API response if available
          avatar: '',
        },
        createdAt: comment.createdAt, // Add createdAt from API response
        replies: [], // Initialize empty replies array
      }));

      // Store comments by postId instead of overwriting the global state
      setCommentsByPost(prev => ({
        ...prev,
        [postId]: processedComments
      }));

      return processedComments;
    } catch (err) {
      console.error('Failed to fetch comments:', err);
      setError('Failed to load comments');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (postId: string, content: string, parentId?: string): Promise<CommentData | null> => {
    if (!user) {
      setError('You must be logged in to comment');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const commentData = {
        content,
        postId,
        parentId,
      };

      const newComment = await createComment(commentData);

      // Add author information for UI display
      const commentWithAuthor = {
        ...newComment,
        author: {
          id: user.id,
          username: user.username,
          avatar: user.avatar || '',
        },
        replies: [],
      };

      // If it's a top-level comment, add it to the comments list for the current post
      if (!parentId) {
        setCommentsByPost(prev => {
          const currentComments = prev[postId] || [];
          return {
            ...prev,
            [postId]: [commentWithAuthor, ...currentComments]
          };
        });
      } else {
        // If it's a reply, add it to the parent comment's replies
        setCommentsByPost(prev => {
          const currentComments = prev[postId] || [];
          return {
            ...prev,
            [postId]: currentComments.map(comment => {
              if (comment.commentId === parentId) {
                const replies = comment.replies || [];
                return {
                  ...comment,
                  replies: [...replies, commentWithAuthor],
                };
              }
              return comment;
            })
          };
        });
      }

      return commentWithAuthor;
    } catch (err: any) {
      console.error('Failed to add comment:', err);

      // Check for toxic content error
      if (err.response?.data?.message === "The comment contains toxic content.") {
        setError('Your comment contains inappropriate or toxic content and cannot be posted');
      } else {
        setError('Failed to post your comment');
      }

      throw err; // Rethrow to allow component-level handling
    } finally {
      setLoading(false);
    }
  };

  const editComment = async (commentId: string, content: string): Promise<CommentData | null> => {
    if (!user) {
      setError('You must be logged in to edit a comment');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const updatedComment = await updateComment(commentId, content);

      // Update the comment in the state for all posts that might contain this comment
      setCommentsByPost(prev => {
        const updatedCommentsByPost = { ...prev };

        // Loop through all posts to find and update the comment
        Object.keys(updatedCommentsByPost).forEach(pid => {
          updatedCommentsByPost[pid] = updatedCommentsByPost[pid].map(comment => {
            if (comment.commentId === commentId) {
              return { ...comment, content };
            }

            // Check if it's in replies
            if (comment.replies && comment.replies.length > 0) {
              const updatedReplies = comment.replies.map(reply =>
                reply.commentId === commentId ? { ...reply, content } : reply
              );
              return { ...comment, replies: updatedReplies };
            }

            return comment;
          });
        });

        return updatedCommentsByPost;
      });

      return updatedComment;
    } catch (err: any) {
      console.error('Failed to edit comment:', err);

      // Check for toxic content error
      if (err.response?.data?.message === "The comment contains toxic content.") {
        setError('Your comment contains inappropriate or toxic content and cannot be posted');
      } else {
        setError('Failed to update your comment');
      }

      throw err; // Rethrow to allow component-level handling
    } finally {
      setLoading(false);
    }
  };

  const removeComment = async (commentId: string): Promise<boolean> => {
    if (!user) {
      setError('You must be logged in to delete a comment');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const success = await deleteComment(commentId);

      if (success) {
        // Remove the comment from all posts that might contain it
        setCommentsByPost(prev => {
          const updatedCommentsByPost = { ...prev };

          // Loop through all posts to find and remove the comment
          Object.keys(updatedCommentsByPost).forEach(pid => {
            // First check if it's a top-level comment
            const filteredComments = updatedCommentsByPost[pid].filter(comment => comment.commentId !== commentId);

            // If the length is the same, it might be a reply
            if (filteredComments.length === updatedCommentsByPost[pid].length) {
              updatedCommentsByPost[pid] = updatedCommentsByPost[pid].map(comment => {
                if (comment.replies && comment.replies.length > 0) {
                  return {
                    ...comment,
                    replies: comment.replies.filter(reply => reply.commentId !== commentId),
                  };
                }
                return comment;
              });
            } else {
              updatedCommentsByPost[pid] = filteredComments;
            }
          });

          return updatedCommentsByPost;
        });
      }

      return success;
    } catch (err) {
      console.error('Failed to delete comment:', err);
      setError('Failed to delete your comment');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    commentsByPost,
    currentPostId,
    loading,
    error,
    fetchPostComments,
    addComment,
    editComment,
    removeComment,
  };

  return <CommentContext.Provider value={value}>{children}</CommentContext.Provider>;
};

export default CommentContext;