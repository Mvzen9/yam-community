import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import CommentItem from './CommentItem';
// Import types
import type { Comment, CommentData } from './CommentItem';
import { useAuth } from '../../store/AuthContext';
import { useComment } from '../../store/CommentContext';

interface CommentListProps {
  postId: string;
  initialComments?: Comment[];
}

const CommentList = ({ postId, initialComments = [] }: CommentListProps) => {
  const { user } = useAuth();
  const { commentsByPost, loading, error, addComment, fetchPostComments, editComment, removeComment } = useComment();
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  // Get comments for the current post
  const comments = commentsByPost[postId] || [];

  // Fetch comments when component mounts or postId changes
  useEffect(() => {
    console.log(`CommentList: Fetching comments for post ${postId}`);
    fetchPostComments(postId);
  }, [postId, fetchPostComments]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentText.trim() || !user) return;
    
    setSubmitting(true);
    
    try {
      await addComment(postId, commentText);
      setCommentText('');
    } catch (err) {
      console.error('Failed to create comment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle liking a comment
  const handleLikeComment = async (commentId: string) => {
    // API doesn't support liking comments yet, but we'll prepare the function
    console.log('Like comment:', commentId);
    // When API is available, implement the like functionality here
    return Promise.resolve();
  };
  
  // Handle replying to a comment
  const handleReplyComment = async (parentId: string, content: string) => {
    if (!user) return Promise.reject('User not authenticated');
    
    try {
      await addComment(postId, content, parentId);
      return Promise.resolve();
    } catch (err) {
      console.error('Failed to reply to comment:', err);
      return Promise.reject(err);
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Comments ({comments.length})
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {/* Comment form */}
      <Paper elevation={1} sx={{ p: 3, mb: 4, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Add a Comment
        </Typography>
        {!user && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Please sign in to comment on this post.
          </Alert>
        )}
        <Box component="form" onSubmit={handleCommentSubmit}>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder={user ? "What are your thoughts?" : "Please sign in to comment"}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            variant="outlined"
            sx={{ mb: 2 }}
            disabled={!user || submitting}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={!commentText.trim() || !user || submitting}
              sx={{ px: 3, py: 1 }}
            >
              {submitting ? 'Posting...' : 'Post Comment'}
            </Button>
          </Box>
        </Box>
      </Paper>
      
      <Divider sx={{ mb: 3 }} />
      
      {/* Comments header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">
          Discussion ({comments.length})
        </Typography>
      </Box>
      
      {/* Loading state */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        /* Comments list */
        comments.length > 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {comments.map((comment) => (
              <CommentItem 
                key={comment.commentId} 
                comment={comment} 
                onReply={handleReplyComment}
                onLike={handleLikeComment}
              />
            ))}
          </Box>
        ) : (
          <Paper elevation={0} sx={{ p: 4, borderRadius: 2, bgcolor: 'background.paper', textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              No comments yet. Be the first to comment!
            </Typography>
          </Paper>
        )
      )}
    </Box>
  );
};

export default CommentList;