import axios from 'axios';

const AUTH_API_BASE_URL = 'https://todo-app.polandcentral.cloudapp.azure.com:5004/api';

// Create axios instance with default config
const authApi = axios.create({
  baseURL: AUTH_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


authApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    
    if (!error.response) {
      console.error('Network Error:', error.message);
      return Promise.reject(new Error('Network error. Please check your internet connection or contact support.'));
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: async (registerData: {
    username: string;
    displayName: string;
    email: string;
    profilePicture: File | null;
    password: string;
    gender: string;
    birthDate: string;
    bio: string;
  }) => {
    // Create FormData object for multipart/form-data request
    const formData = new FormData();
    
    // Add text fields to FormData
    formData.append('username', registerData.username);
    formData.append('displayName', registerData.displayName);
    formData.append('email', registerData.email);
    formData.append('password', registerData.password);
    formData.append('gender', registerData.gender);
    formData.append('birthDate', registerData.birthDate);
    formData.append('bio', registerData.bio || '');
    
    // Add profile picture if available
    if (registerData.profilePicture) {
      formData.append('profilePicture', registerData.profilePicture);
    }

    // Create a custom axios instance for this specific request with multipart/form-data
    // This is necessary because we need to override the Content-Type header
    // and ensure it's not being overridden by the interceptors
    const registerAxios = axios.create({
      baseURL: AUTH_API_BASE_URL,
    });
    
    // Make the request directly to the full URL to ensure proper handling
    return registerAxios.post('/Auth/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  login: async (emailOrUser: string, password: string) => {
    const requestData = {
      emailOrUser,
      password,
    };

    return authApi.post('/Auth/login', requestData);
  },
  
  getUserProfile: async (userId: string) => {
    // Fetch user profile data from the API using the correct endpoint
    return authApi.get(`/Auth?userId=${userId}`);
  }
};

export default authApi;