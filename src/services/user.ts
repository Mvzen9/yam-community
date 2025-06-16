import axios from 'axios';

const USER_API_BASE_URL = 'http://1ac3-156-201-31-66.ngrok-free.app/api/User';

// Create axios instance with default config
const userApi = axios.create({
  baseURL: USER_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    // Add ngrok-skip-browser-warning header to bypass ngrok warning page
    'ngrok-skip-browser-warning': 'true'
  },
});

// Add request interceptor to include auth token
userApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle errors
userApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error('Network Error:', error.message);
      return Promise.reject(new Error('Network error. Please check your internet connection or contact support.'));
    }
    return Promise.reject(error);
  }
);

// Define interfaces for API responses
export interface UserSearchResult {
  id: string;
  userName: string;
  profilePictureUrl: string;
}

export interface UserProfile {
  displayName: string;
  bio: string;
  profilePictureUrl: string;
}

export const userAPI = {
  // Search for users by name
  searchUsers: async (name: string) => {
    return userApi.get(`/search?name=${encodeURIComponent(name)}`);
  },

  // Get user profile by ID
  getUserProfile: async (userId: string) => {
    return userApi.get(`/${userId}`);
  }
};

export default userApi;