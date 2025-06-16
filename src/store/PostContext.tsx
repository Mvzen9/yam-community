import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { postAPI } from '../services/post';
import { useAuth } from './AuthContext';

interface Post {
  postId: string;
  content: string;
  createdAt: string;
  ceatorId: string; // Note: This is the API's spelling
  creatorName: string; // New field added from API response
  imageUrl?: string;
  likesCount: number;
  commentsCount: number;
  communityId: string;
}

interface PostContextType {
  posts: Post[];
  communityPosts: (communityId: string, params?: {
    pageSize?: number;
    pageNumber?: number;
    search?: string;
    sort?: 'asc' | 'desc';

  }) => Promise<{
    items: Post[];
    totalCount: number;
  }>;
  getPost: (postId: string) => Post | undefined;
  createPost: (communityId: string, postData: {
    content: string;
    image?: File;
  }) => Promise<Post>;
  updatePost: (postId: string, postData: {
    content: string;
    image?: File;
  }) => Promise<Post>;
  deletePost: (postId: string) => Promise<void>;
  likePost: (postId: string) => Promise<{
    success: boolean;
    action: string; // 'Liked' or 'Unliked'
  }>;
  loading: boolean;
  error: string | null;
  clearError: () => void;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export const usePost = () => {
  const context = useContext(PostContext);
  if (context === undefined) {
    throw new Error('usePost must be used within a PostProvider');
  }
  return context;
};

interface PostProviderProps {
  children: ReactNode;
}

export const PostProvider = ({ children }: PostProviderProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const clearError = () => setError(null);

  const communityPosts = async (communityId: string, params?: {
    pageSize?: number;
    pageNumber?: number;
    search?: string;
    sort?: 'asc' | 'desc';
  }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await postAPI.getCommunityPosts(communityId, params);
      const data = response.data;

      if (data.code === 200) {
        // Update the posts state with the fetched posts
        setPosts(data.data.items);
        return {
          items: data.data.items,
          totalCount: data.data.totalCount
        };
      } else {
        throw new Error(data.message || 'Failed to fetch community posts');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch community posts';
      setError(errorMessage);
      console.error('Error fetching community posts:', errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getPost = (postId: string) => {
    return posts.find(post => post.postId === postId);
  };

  const createPost = async (communityId: string, postData: {
    content: string;
    image?: File;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await postAPI.createPost(communityId, postData);
      const data = response.data;

      if (data.code === 200) {
        const newPost = data.data;
        setPosts(prevPosts => [newPost, ...prevPosts]);
        return newPost;
      } else {
        throw new Error(data.message || 'Failed to create post');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create post';
      setError(errorMessage);
      console.error('Error creating post:', errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updatePost = async (postId: string, postData: {
    content: string;
    image?: File;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await postAPI.modifyPost(postId, postData);
      const data = response.data;

      if (data.code === 200) {
        const updatedPost = data.data;
        setPosts(prevPosts => prevPosts.map(post =>
          post.postId === postId ? updatedPost : post
        ));
        return updatedPost;
      } else {
        throw new Error(data.message || 'Failed to update post');
      }
    } catch (err: any) {
      // Check for specific error messages
      if (err.response?.data?.message === "The post content contains toxic language.") {
        const errorMessage = 'Your post contains inappropriate or toxic content and cannot be published';
        setError(errorMessage);
        console.error('Error updating post:', errorMessage);
        throw new Error(errorMessage);
      } else if (err.response?.data?.message === "The image contains harmful content.") {
        const errorMessage = 'Your image contains harmful content and cannot be published';
        setError(errorMessage);
        console.error('Error updating post:', errorMessage);
        throw new Error(errorMessage);
      } else {
        // Generic error handling
        const errorMessage = err.response?.data?.message || err.message || 'Failed to update post';
        setError(errorMessage);
        console.error('Error updating post:', errorMessage);
        throw new Error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (postId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await postAPI.deletePost(postId);
      const data = response.data;

      if (data.code === 200) {
        setPosts(prevPosts => prevPosts.filter(post => post.postId !== postId));
      } else {
        throw new Error(data.message || 'Failed to delete post');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete post';
      setError(errorMessage);
      console.error('Error deleting post:', errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const likePost = async (postId: string) => {
    setError(null);

    try {
      const response = await postAPI.likePost(postId);
      const data = response.data;

      if (data.code === 200) {
        // Check if the action was a like or unlike based on the message
        const isLiked = data.message === 'Liked';
        const isUnliked = data.message === 'Unliked';

        // Update the post's like count in the local state
        setPosts(prevPosts => prevPosts.map(post => {
          if (post.postId === postId) {
            return {
              ...post,
              likesCount: isLiked ? post.likesCount + 1 : (isUnliked ? Math.max(0, post.likesCount - 1) : post.likesCount),
            };
          }
          return post;
        }));

        // Return an object with the success status and the action performed
        return {
          success: data.data, // Should be true if successful
          action: data.message // 'Liked' or 'Unliked'
        };
      } else {
        throw new Error(data.message || 'Failed to like/unlike post');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to like/unlike post';
      setError(errorMessage);
      console.error('Error liking/unliking post:', errorMessage);
      throw new Error(errorMessage);
    }
  };

  const value = {
    posts,
    communityPosts,
    getPost,
    createPost,
    updatePost,
    deletePost,
    likePost,
    loading,
    error,
    clearError,
  };

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
};

export default PostContext;