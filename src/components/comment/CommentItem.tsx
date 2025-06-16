import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Button,
  TextField,
  Divider,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ReplyIcon from '@mui/icons-material/Reply';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useAuth } from '../../store/AuthContext';

// Define the Comment type
export interface Author {
  id: string;
  username: string;
  avatar: string;
}

// Legacy Comment interface for backward compatibility
export interface Comment {
  id: string;
  content: string;
  author: Author;
  createdAt: string;
  upvotes?: number;
  downvotes?: number;
  likesCount?: number;
  replies: Comment[];
}

// New Comment interface matching API
export interface CommentData {
  commentId: string;
  content: string;
  createdAt: string;
  creatorId: string;
  postId: string;
  parentId?: string;
  likesCount: number;
  authorName?: string; // Added field from API response
  // Additional UI properties
  author?: Author;
  replies?: CommentData[];
}

interface CommentItemProps {
  comment: Comment | CommentData;
  depth?: number;
  maxDepth?: number;
  onReply?: (parentId: string, content: string) => Promise<void>;
  onLike?: (commentId: string) => Promise<void>;
  onDelete?: (commentId: string) => Promise<void>;
}

const CommentItem = ({ comment, depth = 0, maxDepth = 5, onReply, onLike, onDelete }: CommentItemProps) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(
    'likesCount' in comment 
      ? comment.likesCount || 0 
      : ((comment.upvotes || 0) - (comment.downvotes || 0))
  );
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [showReplies, setShowReplies] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Get the comment ID based on the type
  const commentId = 'commentId' in comment ? comment.commentId : comment.id;
  
  // Get the author information
  const authorId = 'creatorId' in comment ? comment.creatorId : (comment.author?.id || '');
  const authorName = 'authorName' in comment ? comment.authorName : (comment.author?.username || 'User');
  const authorAvatar = comment.author?.avatar || '';
  
  const handleLike = async () => {
    if (liked || !onLike) return; // Already liked or no handler
    
    try {
      await onLike(commentId);
      setLiked(true);
      setLikeCount(likeCount + 1);
    } catch (error) {
      console.error('Failed to like comment:', error);
    }
  };

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!replyContent.trim() || !onReply) return;
    
    try {
      await onReply(commentId, replyContent);
      setReplyContent('');
      setIsReplying(false);
    } catch (error: any) {
      console.error('Failed to submit reply:', error);
      
      // Check for toxic content error
      if (error.response?.data?.message === "The comment contains toxic content.") {
        alert('Your reply contains inappropriate or toxic content and cannot be posted');
      } else {
        alert('Failed to post your reply');
      }
    }
  };

  // Format date to relative time (e.g., "2 hours ago")
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    }
  };

  const toggleReplies = () => {
    setShowReplies(!showReplies);
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    
    try {
      await onDelete(commentId);
      // The comment will be removed from the UI by the parent component
    } catch (error) {
      console.error('Failed to delete comment:', error);
      alert('Failed to delete your comment');
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  return (
    <Box sx={{ mt: 2, bgcolor: 'background.paper', borderRadius: 2, p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
        {/* Like button */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mr: 2 }}>
          <IconButton
            size="small"
            onClick={handleLike}
            color={liked ? 'primary' : 'default'}
            disabled={!user || !onLike} // Disable if not logged in or no handler
            sx={{ 
              border: '1px solid', 
              borderColor: liked ? 'primary.main' : 'divider',
              '&:hover': {
                bgcolor: 'action.hover'
              }
            }}
          >
            {liked ? (
              <ThumbUpIcon fontSize="small" />
            ) : (
              <ThumbUpOutlinedIcon fontSize="small" />
            )}
          </IconButton>
          <Typography variant="body2" fontWeight="bold" sx={{ mt: 0.5 }}>
            {likeCount}
          </Typography>
        </Box>

        {/* Comment content */}
        <Box sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Avatar
              src={authorAvatar}
              alt={authorName}
              sx={{ width: 32, height: 32, mr: 1 }}
            />
            <Box>
              <Typography
                component={Link}
                to={`/profile/${authorId}`}
                variant="subtitle2"
                fontWeight="bold"
                sx={{ textDecoration: 'none', color: 'text.primary', '&:hover': { textDecoration: 'underline' } }}
              >
                {authorName}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                {formatRelativeTime(comment.createdAt)}
              </Typography>
            </Box>
          </Box>

          <Typography variant="body1" sx={{ mt: 1, mb: 2, pl: 0.5 }}>
            {comment.content}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <Button
              startIcon={<ReplyIcon />}
              size="small"
              onClick={() => setIsReplying(!isReplying)}
              sx={{ 
                color: 'text.secondary', 
                mr: 1,
                '&:hover': {
                  bgcolor: 'action.hover'
                }
              }}
            >
              Reply
            </Button>
            {/* Delete button - only show if user is the author */}
            {user && user.id === authorId && onDelete && (
              <Button
                startIcon={<DeleteIcon />}
                size="small"
                onClick={() => setDeleteDialogOpen(true)}
                sx={{ 
                  color: 'error.main', 
                  mr: 1,
                  '&:hover': {
                    bgcolor: 'error.light',
                    color: 'error.contrastText'
                  }
                }}
              >
                Delete
              </Button>
            )}
            {comment.replies && comment.replies.length > 0 && (
              <Button
                size="small"
                onClick={toggleReplies}
                sx={{ 
                  color: 'text.secondary',
                  '&:hover': {
                    bgcolor: 'action.hover'
                  }
                }}
              >
                {showReplies ? 'Hide replies' : `Show ${comment.replies.length} replies`}
              </Button>
            )}
          </Box>

          {/* Reply form */}
          {isReplying && (
            <Box 
              component="form" 
              onSubmit={handleReplySubmit} 
              sx={{ 
                mt: 2, 
                mb: 2, 
                p: 2, 
                bgcolor: 'background.default', 
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Reply to this comment
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={2}
                placeholder="Write a reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                variant="outlined"
                size="small"
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setIsReplying(false)}
                  sx={{ mr: 1 }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  type="submit"
                  disabled={!replyContent.trim()}
                  sx={{ px: 2 }}
                >
                  Post Reply
                </Button>
              </Box>
            </Box>
          )}

          {/* Nested replies */}
          {comment.replies && comment.replies.length > 0 && depth < maxDepth && (
            <Collapse in={showReplies}>
              <Box sx={{ 
                pl: 2, 
                borderLeft: 2, 
                borderColor: 'primary.light', 
                ml: 2, 
                mt: 2,
                pt: 1,
                pb: 1,
                position: 'relative'
              }}>
                {/* Visual indicator for reply thread */}
                <Box 
                  sx={{ 
                    position: 'absolute',
                    left: -8,
                    top: -8,
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    bgcolor: 'primary.light',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Typography variant="caption" color="white" sx={{ fontSize: '10px' }}>
                    {comment.replies.length}
                  </Typography>
                </Box>
                
                {comment.replies.map((reply) => (
                  <CommentItem
                    key={'commentId' in reply ? reply.commentId : reply.id}
                    comment={reply}
                    depth={depth + 1}
                    maxDepth={maxDepth}
                    onReply={onReply}
                    onLike={onLike}
                    onDelete={onDelete}
                  />
                ))}
              </Box>
            </Collapse>
          )}
        </Box>
      </Box>
      {/* Only show divider if not a nested reply */}
      {depth === 0 && <Divider sx={{ my: 2 }} />}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="delete-comment-dialog-title"
        aria-describedby="delete-comment-dialog-description"
      >
        <DialogTitle id="delete-comment-dialog-title">
          Delete Comment
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-comment-dialog-description">
            Are you sure you want to delete this comment? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CommentItem;