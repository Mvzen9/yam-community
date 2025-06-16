import axios from 'axios';

const POST_API_BASE_URL = 'https://todo-app.polandcentral.cloudapp.azure.com:5003/api';

const postApi = axios.create({
  baseURL: POST_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

postApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('No token found in localStorage');
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

postApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    
    if (!error.response) {
      console.error('Network Error:', error.message);
      return Promise.reject(new Error('Network error. Please check your internet connection or contact support.'));
    }
    
    console.error('Error response:', {
      status: error.response.status,
      statusText: error.response.statusText,
      data: error.response.data,
      url: error.config.url,
    });
    
    return Promise.reject(error);
  }
);

export const postAPI = {
  // 1. Create a Post
  createPost: async (communityId: string, postData: {
    content: string;
    image?: File;
  }) => {
    // Create FormData object for multipart/form-data
    const formData = new FormData();
    formData.append('Content', postData.content);
    
    // Add image if provided
    if (postData.image) {
      formData.append('Image', postData.image);
    }
    
    // Use axios with FormData - don't set Content-Type header, browser will set it automatically
    return axios.post(`${POST_API_BASE_URL}/Post?communityId=${communityId}`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  },
  
  // 2. Get Community Posts (The Main Feed)
  getCommunityPosts: async (communityId: string, params?: {
    pageSize?: number;
    pageNumber?: number;
    search?: string;
    sort?: 'asc' | 'desc';
  }) => {
    // Build query string from params
    const queryParams = new URLSearchParams();
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params?.pageNumber) queryParams.append('pageNumber', params.pageNumber.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.sort) queryParams.append('sort', params.sort);
    
    const queryString = queryParams.toString();
    const url = `/Post/${communityId}${queryString ? `?${queryString}` : ''}`;
    
    return postApi.get(url);
  },
  
  // 3. Modify a Post
  modifyPost: async (postId: string, postData: {
    content: string;
    image?: File;
  }) => {
    // Create FormData object for multipart/form-data
    const formData = new FormData();
    formData.append('Content', postData.content);
    
    // Add image if provided
    if (postData.image) {
      formData.append('Image', postData.image);
    }
    
    // Use axios with FormData - don't set Content-Type header, browser will set it automatically
    return axios.put(`${POST_API_BASE_URL}/Post?postId=${postId}`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  },
  
  // 4. Delete a Post
  deletePost: async (postId: string) => {
    return postApi.delete(`/Post/${postId}`);
  },
  
  // 5. Like a Post
  likePost: async (postId: string) => {
    return postApi.post(`/Post/like/${postId}`);
  },
  
  // 6. Get User Posts
  getUserPosts: async (userId: string, params?: {
    pageSize?: number;
    pageNumber?: number;
    sort?: 'asc' | 'desc';
  }) => {
    // Build query string from params
    const queryParams = new URLSearchParams();
    queryParams.append('userId', userId);
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params?.pageNumber) queryParams.append('pageNumber', params.pageNumber.toString());
    if (params?.sort) queryParams.append('sort', params.sort);
    
    const queryString = queryParams.toString();
    const url = `/Post?${queryString}`;
    
    return postApi.get(url);
  },
};

export default postApi;