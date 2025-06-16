import axios from 'axios';

const COMMUNITY_API_BASE_URL = 'http://todo-app.polandcentral.cloudapp.azure.com:5002/api';


const communityApi = axios.create({
  baseURL: COMMUNITY_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

communityApi.interceptors.request.use(
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


communityApi.interceptors.response.use(
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

export const communityAPI = {
  fetchUserCommunities: async () => {
    return communityApi.get('/Commuity');
  },

  createCommunity: async (communityData: {
    name: string;
    description: string;
    isPublic: boolean;
    banner?: File;
  }) => {
    // Create FormData object for multipart/form-data
    const formData = new FormData();
    formData.append('name', communityData.name);
    formData.append('description', communityData.description);
    formData.append('isPublic', String(communityData.isPublic || false));

    // Add banner image if provided
    if (communityData.banner) {
      formData.append('Banner', communityData.banner);
    }

    // Use axios with FormData - don't set Content-Type header, browser will set it automatically
    return axios.post(`${COMMUNITY_API_BASE_URL}/Commuity/create`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  },

  deleteCommunity: async (communityId: string) => {
    return communityApi.delete(`/Commuity/delete?communityId=${communityId}`);
  },

  modifyCommunity: async (communityId: string, communityData: {
    name: string;
    description: string;
    banner?: File;
  }) => {
    // Create FormData object for multipart/form-data
    const formData = new FormData();
    formData.append('name', communityData.name);
    formData.append('description', communityData.description);

    // Add banner image only if provided
    if (communityData.banner) {
      formData.append('Banner', communityData.banner);
    }

    // Use axios with FormData - don't set Content-Type header, browser will set it automatically
    return axios.put(`${COMMUNITY_API_BASE_URL}/Commuity?communityId=${communityId}`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  },

  generateInviteCode: async (communityId: string) => {
    return communityApi.post(`/Commuity/generate/${communityId}`);
  },

  joinCommunityWithCode: async (code: string) => {
    return communityApi.post(`/Commuity/join?code=${code}`);
  },

  leaveCommunity: async (communityId: string) => {
    return communityApi.post(`/Commuity/leave?communityId=${communityId}`);
  },
};

export default communityApi;