import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  IconButton,
  Avatar,
  Chip,
  CardMedia,
  Button,
  Divider,
  Paper,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Menu,
  MenuItem,
  Collapse,
  CircularProgress
} from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ChatIcon from "@mui/icons-material/Chat";
import ShareIcon from "@mui/icons-material/Share";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ImageIcon from "@mui/icons-material/Image";
import { usePost } from "../../store/PostContext";
import { useAuth } from "../../store/AuthContext";
import { useComment } from "../../store/CommentContext";
import CommentItem from "../comment/CommentItem";

// Define the Post type for the component
interface PostData {
  postId: string;
  content: string;
  createdAt: string;
  ceatorId: string; // Note: This is the API's spelling
  creatorName: string; // New field added from API response
  imageUrl?: string;
  likesCount: number;
  commentsCount: number;
  communityId: string;
  // Additional properties for UI display
  author?: {
    username: string;
    avatar?: string;
  };
  community?: {
    name: string;
  };
}

interface PostCardProps {
  post: PostData;
  communityName?: string; // Optional community name if not included in post
  authorName?: string; // Optional author name if not included in post
}

const PostCard = ({ post, communityName, authorName }: PostCardProps) => {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likesCount);
  const { likePost, updatePost, deletePost } = usePost();
  const { user } = useAuth();

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');

  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [editImage, setEditImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(post.imageUrl || null);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Menu state
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(menuAnchorEl);

  // Comment state
  const [showComments, setShowComments] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentCount, setCommentCount] = useState(post.commentsCount);
  const { commentsByPost, loading: commentsLoading, error: commentsError, fetchPostComments, addComment, removeComment } = useComment();

  // Get comments for this specific post
  const comments = commentsByPost[post.postId] || [];

  // File input reference
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if current user is the post creator
  const isCreator = user?.id === post.ceatorId;

  const handleLike = async () => {
    if (!user) return; // Don't proceed if user is not logged in

    try {
      const result = await likePost(post.postId);

      if (result.success) {
        // Update UI based on the action (like or unlike)
        if (result.action === 'Liked') {
          setLiked(true);
          setLikeCount(prev => prev + 1);
          showSnackbar('Post liked successfully', 'success');
        } else if (result.action === 'Unliked') {
          setLiked(false);
          setLikeCount(prev => Math.max(0, prev - 1));
          showSnackbar('Post unliked', 'success');
        }
      }
    } catch (error: any) {
      console.error('Failed to like/unlike post:', error);
      showSnackbar(error.message || 'Failed to like/unlike post', 'error');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!user) return Promise.reject('User not authenticated');

    try {
      const success = await removeComment(commentId);

      if (success) {
        // Decrement the comment count
        setCommentCount(prev => Math.max(0, prev - 1));
        showSnackbar('Comment deleted successfully', 'success');
      }

      return Promise.resolve();
    } catch (error) {
      console.error('Failed to delete comment:', error);
      showSnackbar('Failed to delete comment', 'error');
      return Promise.reject(error);
    }
  };

  const handleSave = () => {
    setSaved(!saved);
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Menu handlers
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  // Edit handlers
  const handleEditClick = () => {
    setEditDialogOpen(true);
    handleMenuClose();
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    // Reset form state
    setEditContent(post.content);
    setEditImage(null);
    setImagePreview(post.imageUrl || null);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setEditImage(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setEditImage(null);
    setImagePreview(null);
  };

  const handleEditSubmit = async () => {
    try {
      const updatedPost = await updatePost(post.postId, {
        content: editContent,
        image: editImage
      });

      showSnackbar('Post updated successfully', 'success');
      setEditDialogOpen(false);
    } catch (error: any) {
      console.error('Failed to update post:', error);

      // Check for specific error messages
      if (error.message?.includes('inappropriate or toxic content')) {
        showSnackbar('Your post contains inappropriate or toxic content and cannot be published', 'error');
      } else if (error.message?.includes('harmful content')) {
        showSnackbar('Your image contains harmful content and cannot be published', 'error');
      } else {
        showSnackbar(error.message || 'Failed to update post', 'error');
      }
    }
  };

  // Delete handlers
  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deletePost(post.postId);
      showSnackbar('Post deleted successfully', 'success');
      setDeleteDialogOpen(false);
    } catch (error: any) {
      console.error('Failed to delete post:', error);
      showSnackbar(error.message || 'Failed to delete post', 'error');
    }
  };

  // Format date to relative time (e.g., "2 hours ago")
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return "just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${days === 1 ? "day" : "days"} ago`;
    }
  };

  return (
    <>
      <Card sx={{
        mb: 4,
        borderRadius: 2,
        boxShadow: 3,
        maxWidth: '850px',
        mx: 'auto',
        overflow: 'hidden'
      }}>
        <Box sx={{ display: "flex" }}>
          {/* Like button column */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              p: 2,
              bgcolor: "background.default",
              borderRadius: "8px 0 0 8px",
              minWidth: '70px',
            }}
          >
            <IconButton
              onClick={handleLike}
              color={liked ? "primary" : "default"}
              disabled={!user} // Disable if not logged in
              sx={{
                p: 1.5,
                '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.08)' }
              }}
            >
              {liked ? (
                <ThumbUpIcon sx={{ fontSize: "28px" }} />
              ) : (
                <ThumbUpOutlinedIcon sx={{ fontSize: "28px" }} />
              )}
            </IconButton>
            <Typography variant="h6" fontWeight="bold" sx={{ my: 1 }}>
              {likeCount}
            </Typography>
          </Box>

          {/* Main content */}
          <Box sx={{ flexGrow: 1 }}>
            <CardContent sx={{ pb: 1, pt: 3, px: 3 }}>
              {/* Post metadata */}
              <Box sx={{ display: "flex", alignItems: "center", mb: 2, justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Chip
                    component={Link}
                    to={`/community/${post.communityId}`}
                    label={post.community?.name || communityName || 'Community'}
                    clickable
                    color="primary"
                    variant="outlined"
                    sx={{ mr: 2, textDecoration: "none", px: 1, height: 32 }}
                  />
                  <Typography variant="body1" color="text.secondary">
                    Posted by{" "}
                    <Link
                      to={`/profile/${post.ceatorId}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <Typography
                        component="span"
                        variant="body1"
                        color="primary"
                        sx={{ fontWeight: "medium" }}
                      >
                        u/{post.creatorName}
                      </Typography>
                    </Link>{" "}
                    {formatRelativeTime(post.createdAt)}
                  </Typography>
                </Box>

                {/* Post actions menu (only visible to creator) */}
                {isCreator && (
                  <Box>
                    <IconButton
                      aria-label="post actions"
                      aria-controls={menuOpen ? 'post-menu' : undefined}
                      aria-haspopup="true"
                      aria-expanded={menuOpen ? 'true' : undefined}
                      onClick={handleMenuOpen}
                      size="small"
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      id="post-menu"
                      anchorEl={menuAnchorEl}
                      open={menuOpen}
                      onClose={handleMenuClose}
                      MenuListProps={{
                        'aria-labelledby': 'post-actions-button',
                      }}
                    >
                      <MenuItem onClick={handleEditClick}>
                        <EditIcon fontSize="small" sx={{ mr: 1 }} />
                        Edit
                      </MenuItem>
                      <MenuItem onClick={handleDeleteClick}>
                        <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                        Delete
                      </MenuItem>
                    </Menu>
                  </Box>
                )}
              </Box>

              {/* Post link */}
              <Typography
                variant="h6"
                component={Link}
                to={`/post/${post.postId}`}
                sx={{
                  textDecoration: "none",
                  color: "text.primary",
                  display: "block",
                  mb: 2,
                  fontWeight: "medium",
                  lineHeight: 1.3,
                }}
              >
                View Post
              </Typography>

              {/* Post content */}
              <Typography
                variant="body1"
                sx={{ mb: 3, fontSize: "1.1rem", lineHeight: 1.6 }}
              >
                {post.content.length > 300
                  ? `${post.content.substring(0, 300)}...`
                  : post.content}
              </Typography>

              {/* Post image if available */}
              {post.imageUrl ? (
                <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden', mb: 3, maxHeight: 500, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <CardMedia
                    component="img"
                    image={post.imageUrl}
                    alt="Post image"
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      maxHeight: 500
                    }}
                  />
                </Paper>
              ) : null}
            </CardContent>

            <Divider />

            {/* Post actions */}
            <CardActions sx={{ justifyContent: "space-between", px: 3, py: 2, bgcolor: 'background.paper' }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  startIcon={<ChatBubbleOutlineIcon />}
                  onClick={() => {
                    setShowComments(!showComments);
                    if (!showComments && comments.length === 0) {
                      fetchPostComments(post.postId);
                    }
                  }}
                  variant="outlined"
                  endIcon={showComments ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                  sx={{
                    color: "text.secondary",
                    py: 1,
                    px: 2,
                    borderColor: 'divider',
                    borderRadius: 2,
                    "&:hover": {
                      bgcolor: "rgba(0, 0, 0, 0.04)",
                      color: 'primary.main',
                      borderColor: 'primary.main'
                    },
                  }}
                >
                  Comments ({post.commentsCount})
                </Button>
                <Button
                  startIcon={<ChatIcon />}
                  onClick={() => {
                    setShowCommentForm(!showCommentForm);
                    if (showCommentForm) {
                      setCommentText('');
                    }
                  }}
                  variant="outlined"
                  sx={{
                    color: "text.secondary",
                    py: 1,
                    px: 2,
                    borderColor: 'divider',
                    borderRadius: 2,
                    "&:hover": {
                      bgcolor: "rgba(0, 0, 0, 0.04)",
                      color: 'primary.main',
                      borderColor: 'primary.main'
                    },
                  }}
                >
                  Add Comment
                </Button>
              </Box>

              <Box>
                <IconButton
                  aria-label="share"
                  sx={{
                    mx: 1,
                    color: "text.secondary",
                    "&:hover": {
                      color: "primary.main",
                      backgroundColor: "action.hover",
                    },
                  }}
                >
                  <ShareIcon />
                </IconButton>
                <IconButton
                  onClick={handleSave}
                  aria-label="save"
                  sx={{
                    "&:hover": {
                      backgroundColor: "action.hover",
                    },
                  }}
                >
                  {saved ? (
                    <BookmarkIcon color="primary" />
                  ) : (
                    <BookmarkBorderIcon color="text.secondary" />
                  )}
                </IconButton>
              </Box>
            </CardActions>
          </Box>
        </Box>
      </Card>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Edit Post Dialog */}
      <Dialog open={editDialogOpen} onClose={handleEditDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>Edit Post</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="content"
            label="Post Content"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            sx={{ mb: 2 }}
          />

          {/* Image preview */}
          {imagePreview && (
            <Box sx={{ mb: 2, position: 'relative' }}>
              <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden', mb: 1, maxHeight: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ maxWidth: '100%', maxHeight: 300, objectFit: 'contain' }}
                />
              </Paper>
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={handleRemoveImage}
                startIcon={<DeleteIcon />}
              >
                Remove Image
              </Button>
            </Box>
          )}

          {/* Image upload */}
          {!imagePreview && (
            <Button
              variant="outlined"
              component="label"
              startIcon={<ImageIcon />}
              sx={{ mb: 2 }}
            >
              Upload Image
              <input
                type="file"
                hidden
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
              />
            </Button>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose}>Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Delete Post</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this post? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Comment Form */}
      <Collapse in={showCommentForm} timeout="auto" unmountOnExit>
        <Card sx={{ mt: 2, p: 2, borderRadius: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Add a Comment
          </Typography>
          {!user && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Please sign in to comment on this post.
            </Alert>
          )}
          <Box component="form" onSubmit={async (e) => {
            e.preventDefault();
            if (!commentText.trim() || !user) return;

            setSubmittingComment(true);

            try {
              const newComment = await addComment(post.postId, commentText);
              if (newComment) {
                setCommentText('');
                // Increment comment count
                setCommentCount(prev => prev + 1);
                // If comments are not currently shown, show them after adding a new one
                if (!showComments) {
                  setShowComments(true);
                }
                // Close the comment form after successful submission
                setShowCommentForm(false);
              }
            } catch (err: any) {
              console.error('Failed to create comment:', err);
              setSnackbarSeverity('error');

              // Check for toxic content error
              if (err.response?.data?.message === "The comment contains toxic content.") {
                setSnackbarMessage('Your comment contains inappropriate or toxic content and cannot be posted');
              } else {
                setSnackbarMessage('Failed to post your comment');
              }

              setSnackbarOpen(true);
            } finally {
              setSubmittingComment(false);
            }
          }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder={user ? "What are your thoughts?" : "Please sign in to comment"}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              variant="outlined"
              sx={{ mb: 2 }}
              disabled={!user || submittingComment}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={!commentText.trim() || !user || submittingComment}
                sx={{ px: 3, py: 1 }}
              >
                {submittingComment ? 'Posting...' : 'Post Comment'}
              </Button>
            </Box>
          </Box>
        </Card>
      </Collapse>

      {/* Comments List */}
      <Collapse in={showComments} timeout="auto" unmountOnExit>
        <Card sx={{ mt: 2, p: 2, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Comments ({commentCount})
          </Typography>

          {commentsError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {commentsError}
            </Alert>
          )}

          {/* Loading state */}
          {commentsLoading ? (
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
                    onReply={async (parentId, content) => {
                      if (!user) return Promise.reject('User not authenticated');

                      try {
                        await addComment(post.postId, content, parentId);
                        // Increment comment count for replies
                        setCommentCount(prev => prev + 1);
                        return Promise.resolve();
                      } catch (err: any) {
                        console.error('Failed to reply to comment:', err);

                        // Check for toxic content error
                        if (err.response?.data?.message === "The comment contains toxic content.") {
                          return Promise.reject('Your reply contains inappropriate or toxic content and cannot be posted');
                        }

                        return Promise.reject(err);
                      }
                    }}
                    onLike={async (commentId) => {
                      // API doesn't support liking comments yet, but we'll prepare the function
                      console.log('Like comment:', commentId);
                      // When API is available, implement the like functionality here
                      return Promise.resolve();
                    }}
                    onDelete={handleDeleteComment}
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
        </Card>
      </Collapse>
    </>
  );
};

export default PostCard;
