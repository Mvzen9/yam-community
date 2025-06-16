import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { communityAPI } from '../services/community';
import { useAuth } from './AuthContext';

// Define the Community type
export interface Community {
  communityId: string;
  name: string;
  description: string;
  bannerUrl?: string; // Changed from banner array to bannerUrl string
  creatorId: string;
  isPublic: boolean;
  memberCount?: number;
  createdAt?: string;
  isJoined?: boolean;
  isModerator?: boolean;
  rules?: { title: string; description: string }[];
  tags?: string[];
}

interface CommunityContextType {
  userCommunities: Community[];
  loading: boolean;
  error: string | null;
  fetchUserCommunities: () => Promise<void>;
  createCommunity: (communityData: {
    name: string;
    description: string;
    banner?: File;
    isPublic: boolean;
  }) => Promise<Community>;
  deleteCommunity: (communityId: string) => Promise<void>;
  modifyCommunity: (communityId: string, communityData: {
    name: string;
    description: string;
    banner?: File;
  }) => Promise<Community>;
  generateInviteCode: (communityId: string) => Promise<string>;
  joinCommunityWithCode: (code: string) => Promise<void>;
  joinCommunity: (code: string) => Promise<void>; // Added for compatibility with JoinCommunity component
  leaveCommunity: (communityId: string) => Promise<void>;
  clearError: () => void;
}

const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

export const useCommunity = () => {
  const context = useContext(CommunityContext);
  if (context === undefined) {
    throw new Error('useCommunity must be used within a CommunityProvider');
  }
  return context;
};

interface CommunityProviderProps {
  children: ReactNode;
}

export const CommunityProvider = ({ children }: CommunityProviderProps) => {
  const [userCommunities, setUserCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  // Fetch user's communities when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchUserCommunities();
    }
  }, [isAuthenticated]);

  const clearError = () => setError(null);

  const fetchUserCommunities = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    setError(null);
    
    try {
      
      const token = localStorage.getItem('token');
   
      
      const response = await communityAPI.fetchUserCommunities();
   
      
      const data = response.data;
      
      if (data.code === 200) {
       
        setUserCommunities(data.data);
      } else {
        console.error('API returned non-200 code:', data);
        throw new Error(data.message || 'Failed to fetch communities');
      }
    } catch (err: any) {
      console.error('Error object:', err);
      console.error('Response data:', err.response?.data);
      console.error('Status code:', err.response?.status);
      
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch communities';
      setError(errorMessage);
      console.error('Error fetching communities:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createCommunity = async (communityData: {
    name: string;
    description: string;
    banner?: number[];
    isPublic: boolean;
  }): Promise<Community> => {
    setLoading(true);
    setError(null);
    
    try {
      // Always set isPublic to false as per requirements
      const requestData = {
        ...communityData,
        isPublic: false,
        banner: communityData.banner || [0], // Default banner if not provided
      };
      
      const response = await communityAPI.createCommunity(requestData);
      const data = response.data;
      
      if (data.code === 200) {
        // Add the new community to the list
        const newCommunity = data.data;
        setUserCommunities(prev => [...prev, newCommunity]);
        return newCommunity;
      } else {
        throw new Error(data.message || 'Failed to create community');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create community';
      setError(errorMessage);
      console.error('Error creating community:', errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteCommunity = async (communityId: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await communityAPI.deleteCommunity(communityId);
      const data = response.data;
      
      if (data.code === 200) {
        // Remove the deleted community from the list
        setUserCommunities(prev => prev.filter(community => community.communityId !== communityId));
      } else {
        throw new Error(data.message || 'Failed to delete community');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete community';
      setError(errorMessage);
      console.error('Error deleting community:', errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const modifyCommunity = async (communityId: string, communityData: {
    name: string;
    description: string;
    banner?: File;
  }): Promise<Community> => {
    setLoading(true);
    setError(null);
    
    try {
      // Pass the data directly to the API service which now handles FormData
      const response = await communityAPI.modifyCommunity(communityId, communityData);
      const data = response.data;
      
      if (data.code === 200) {
        // Update the modified community in the list
        const updatedCommunity = data.data;
        setUserCommunities(prev =>
          prev.map(community =>
            community.communityId === communityId ? updatedCommunity : community
          )
        );
        return updatedCommunity;
      } else {
        throw new Error(data.message || 'Failed to modify community');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to modify community';
      setError(errorMessage);
      console.error('Error modifying community:', errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const generateInviteCode = async (communityId: string): Promise<string> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await communityAPI.generateInviteCode(communityId);
      const data = response.data;
      
      if (data.code === 200) {
        return data.data; // Return the invite code
      } else {
        throw new Error(data.message || 'Failed to generate invite code');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to generate invite code';
      setError(errorMessage);
      console.error('Error generating invite code:', errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const joinCommunityWithCode = async (code: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await communityAPI.joinCommunityWithCode(code);
      const data = response.data;
      
      if (data.code === 200) {
        // Refresh communities list after joining
        await fetchUserCommunities();
      } else {
        throw new Error(data.message || 'Failed to join community');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to join community';
      setError(errorMessage);
      console.error('Error joining community:', errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const leaveCommunity = async (communityId: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await communityAPI.leaveCommunity(communityId);
      const data = response.data;
      
      if (data.code === 200) {
        // Remove the community from the user's list
        setUserCommunities(prev => prev.filter(community => community.communityId !== communityId));
      } else {
        throw new Error(data.message || 'Failed to leave community');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to leave community';
      setError(errorMessage);
      console.error('Error leaving community:', errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    userCommunities,
    loading,
    error,
    fetchUserCommunities,
    createCommunity,
    deleteCommunity,
    modifyCommunity,
    generateInviteCode,
    joinCommunityWithCode,
    joinCommunity: joinCommunityWithCode, // Alias for compatibility with JoinCommunity component
    leaveCommunity,
    clearError,
  };

  return <CommunityContext.Provider value={value}>{children}</CommunityContext.Provider>;
};

export default CommunityContext;