import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

// Create an axios instance with a base URL
const commentAPI: AxiosInstance = axios.create({
  baseURL: 'http://todo-app.polandcentral.cloudapp.azure.com:5003/api',
});

// Add a request interceptor to include the auth token in all requests
commentAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
commentAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors (e.g., unauthorized, server errors)
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Interface for comment data from API
export interface CommentData {
  replies: never[];
  commentId: string;
  content: string;
  createdAt: string;
  creatorId: string;
  authorName?: string; // Added field from API response
  postId: string;
  parentId?: string; // For replies
  likesCount?: number; // Added field from API response
}

// Interface for comment creation request
export interface CreateCommentRequest {
  content: string;
  postId: string;
  parentId?: string; // Optional for replies
}

/**
 * Create a new comment on a post
 * @param commentData The comment data to create
 * @returns The created comment data
 */
export const createComment = async (commentData: CreateCommentRequest): Promise<CommentData> => {
  const response = await commentAPI.post('/Comment', commentData);
  return response.data.data;
};

/**
 * Get comments for a specific post
 * @param postId The ID of the post to get comments for
 * @param pageIndex Optional page index for pagination
 * @param pageSize Optional page size for pagination
 * @returns Array of comments for the post
 */
export const getPostComments = async (postId: string, pageIndex?: number, pageSize?: number): Promise<CommentData[]> => {
  // Build query parameters
  let url = `/Comment?postId=${postId}`;
  if (pageIndex !== undefined) url += `&pageIndex=${pageIndex}`;
  if (pageSize !== undefined) url += `&pageSize=${pageSize}`;

  try {
    const response = await commentAPI.get(url);
    console.log('Comments API response:', response.data);
    // Check if the response has the expected structure
    if (response.data && response.data.data && response.data.data.items) {
      return response.data.data.items;
    } else {
      console.error('Unexpected API response format:', response.data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

/**
 * Update an existing comment
 * @param commentId The ID of the comment to update
 * @param content The new content for the comment
 * @returns The updated comment data
 */
export const updateComment = async (commentId: string, content: string): Promise<CommentData> => {
  const response = await commentAPI.put(`/Comment/${commentId}`, { content });
  return response.data.data;
};

/**
 * Delete a comment
 * @param commentId The ID of the comment to delete
 * @returns True if deletion was successful
 */
export const deleteComment = async (commentId: string): Promise<boolean> => {
  const response = await commentAPI.delete(`/Comment/${commentId}`);
  return response.data.code === 200;
};

export default {
  createComment,
  getPostComments,
  updateComment,
  deleteComment,
};