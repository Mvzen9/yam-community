import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Paper,
  Alert,
} from "@mui/material";
import PostCard from "../components/post/PostCard";
import CommentList from "../components/comment/CommentList";
import { usePost } from "../store/PostContext";
import { useCommunity } from "../store/CommunityContext";
import { useAuth } from "../store/AuthContext";
import { useComment } from "../store/CommentContext";

// Interface for post data with author and community info for display
interface PostWithDetails {
  postId: string;
  content: string;
  createdAt: string;
  ceatorId: string;
  creatorName: string; // New field added from API response
  imageUrl?: string;
  likesCount: number;
  commentsCount: number;
  communityId: string;
  // Additional UI properties
  author?: {
    username: string;
    avatar?: string;
  };
  community?: {
    name: string;
  };
}

const PostDetail = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { communityPosts } = usePost(); // Changed from getCommunityPosts to communityPosts
  const { userCommunities } = useCommunity();
  const { user } = useAuth();
  const { fetchPostComments } = useComment();
  
  const [post, setPost] = useState<PostWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!postId) {
      setError("Post ID is missing");
      setLoading(false);
      return;
    }

    console.log(`PostDetail: Fetching post with ID ${postId}`);

    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // We don't have a direct API to fetch a single post by ID,
        // so we'll need to find the post in the community posts
        // This is a workaround until a getPostById API is available
        
        // First, try to find the post in user's communities
        let foundPost = null;
        
        console.log(`Searching for post ${postId} in ${userCommunities.length} communities`);
        
        for (const community of userCommunities) {
          try {
            console.log(`Fetching posts for community ${community.id}`);
            const response = await communityPosts(community.id); // Changed from getCommunityPosts to communityPosts
            
            if (!response || !response.items) {
              console.error(`Invalid response format for community ${community.id}:`, response);
              continue;
            }
            
            const posts = response.items; // Get the items from the response
            console.log(`Found ${posts.length} posts in community ${community.id}`);
            
            foundPost = posts.find(p => p.postId === postId);
            
            if (foundPost) {
              console.log(`Found post ${postId} in community ${community.id}`);
              // Add community name for display
              foundPost = {
                ...foundPost,
                community: {
                  name: community.name
                }
              };
              break;
            }
          } catch (err) {
            console.error(`Error fetching posts for community ${community.id}:`, err);
            // Continue to next community
          }
        }
        
        if (foundPost) {
          console.log(`Setting post data:`, foundPost);
          setPost(foundPost);
          
          // Fetch comments for this post
          if (postId) {
            console.log(`Fetching comments for post ${postId}`);
            // Fetch comments for the post
            try {
              await fetchPostComments(postId);
              console.log('Comments fetched successfully');
            } catch (commentErr) {
              console.error('Error fetching comments:', commentErr);
              // Don't set error state here to still show the post even if comments fail to load
            }
          }
        } else {
          console.error(`Post ${postId} not found in any community`);
          setError("Post not found or you don't have access to this post");
        }
      } catch (error) {
        console.error("Error fetching post:", error);
        setError("Failed to load the post. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId, communityPosts, userCommunities, fetchPostComments]); // Changed from getCommunityPosts to communityPosts

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!loading && (error || !post)) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        {error ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        ) : (
          <Typography variant="h5" align="center">
            Post not found
          </Typography>
        )}
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {post && (
        <>
          <Paper elevation={0} sx={{ mb: 3, overflow: "hidden" }}>
            <PostCard 
              post={post} 
              communityName={post.community?.name} 
              authorName={user?.id === post.ceatorId ? user.username : undefined}
            />
          </Paper>

          <CommentList postId={post.postId} />
        </>
      )}
    </Container>
  );
};

export default PostDetail;
