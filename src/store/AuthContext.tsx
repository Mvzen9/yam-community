import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { authAPI } from '../services/auth';

interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  displayName: string;
  bio: string;
  joinDate: string;
  followers: number;
  following: number;
  notifications: number;
  birthdate?: string;
  gender?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (emailOrUser: string, password: string) => Promise<void>;
  register: (registerData: {
    username: string;
    displayName: string;
    email: string;
    profilePicture: File | null;
    password: string;
    gender: string;
    birthDate: string;
    bio: string;
  }) => Promise<{ userId: string }>;
  sendVerificationCode: (email: string) => Promise<{ token: string, userId: string }>;
  verifyCode: (code: string, token: string, userData?: any) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load user data and token from localStorage
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch (err) {
        console.error('Failed to parse stored user data', err);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (emailOrUser: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authAPI.login(emailOrUser, password);
      const data = response.data;

      if (data.code === 200) {
        // Set token first so it's available for subsequent API calls
        setToken(data.token);
        localStorage.setItem('token', data.token);
        localStorage.setItem('tokenExpiration', data.expirationDate);
        localStorage.setItem('refreshTokenExpiration', data.refreshTokenExpirationDate);
        localStorage.setItem('refreshToken', data.refreshToken)

        try {
          // Fetch complete user profile using the userId from login response
          const profileResponse = await authAPI.getUserProfile(data.userId);
          const profileData = profileResponse.data;

          // Create user object from profile response
          const userData: User = {
            id: profileData.userId,
            username: profileData.username || emailOrUser,
            email: profileData.email || (emailOrUser.includes('@') ? emailOrUser : ''),
            displayName: profileData.displayName || emailOrUser,
            avatar: profileData.profilePictureUrl || '',
            bio: profileData.bio || '',
            joinDate: profileData.joinedAt || new Date().toISOString(),
            followers: profileData.friendsCount || 0,
            following: profileData.friendsCount || 0,
            notifications: 0,
            birthdate: profileData.birthDate,
            gender: profileData.gender,
          };

          // Store user data
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        } catch (profileErr) {
          console.error('Failed to fetch user profile after login:', profileErr);

          // Fallback to basic user data if profile fetch fails
          const basicUserData: User = {
            id: data.userId,
            username: emailOrUser,
            email: emailOrUser.includes('@') ? emailOrUser : '',
            displayName: emailOrUser,
            avatar: '',
            bio: '',
            joinDate: new Date().toISOString(),
            followers: 0,
            following: 0,
            notifications: 0,
          };

          setUser(basicUserData);
          localStorage.setItem('user', JSON.stringify(basicUserData));
        }
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Invalid credentials';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const register = async (registerData: {
    username: string;
    displayName: string;
    email: string;
    profilePicture: File | null;
    password: string;
    gender: string;
    birthDate: string;
    bio: string;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authAPI.register(registerData);
      const data = response.data;

      if (data.code === 200) {
        // Registration successful, but we don't set user and token yet
        // We'll wait for email verification to complete before setting these

        // Return the userId for potential use in verification flow
        return { userId: data.userId };
      } else {
        throw new Error(data.message || 'Registration failed');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to register. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiration');
    localStorage.removeItem('refreshTokenExpiration');
  };

  const sendVerificationCode = async (email: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://todo-app.polandcentral.cloudapp.azure.com:5004/api/Auth/send-code?usernameOrEmail=${email}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.code === 200) {
        return {
          token: data.token,
          userId: data.userId
        };
      } else {
        throw new Error(data.message || 'Failed to send verification code');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to send verification code';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async (code: string, tempToken: string, userData?: any) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://todo-app.polandcentral.cloudapp.azure.com:5004/api/Auth/verify?code=${code}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tempToken}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.code === 200) {
        // Update token with the permanent one
        setToken(data.token);

        // Save to localStorage for persistence
        localStorage.setItem('token', data.token);
        localStorage.setItem('tokenExpiration', data.expirationDate);

        // If we have user data with userId, fetch complete profile
        if (userData && userData.id) {
          try {
            // Fetch complete user profile using the userId
            const profileResponse = await authAPI.getUserProfile(userData.id);
            const profileData = profileResponse.data;

            // Create user object from profile response
            const completeUserData: User = {
              id: profileData.userId,
              username: profileData.username || userData.username,
              email: profileData.email || userData.email,
              displayName: profileData.displayName || userData.displayName,
              avatar: profileData.profilePictureUrl || userData.avatar || '',
              bio: profileData.bio || userData.bio || '',
              joinDate: profileData.joinedAt || userData.joinDate || new Date().toISOString(),
              followers: profileData.friendsCount || userData.followers || 0,
              following: profileData.friendsCount || userData.following || 0,
              notifications: userData.notifications || 0,
              birthdate: profileData.birthDate || userData.birthdate,
              gender: profileData.gender || userData.gender,
            };

            // Store user data
            setUser(completeUserData);
            localStorage.setItem('user', JSON.stringify(completeUserData));
          } catch (profileErr) {
            console.error('Failed to fetch user profile after verification:', profileErr);

            // Fallback to provided user data if profile fetch fails
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
          }
        } else if (userData) {
          // If we have user data but no ID, just use what we have
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        }
        // Note: If we don't have user data, it will be loaded on next app start
      } else {
        throw new Error(data.message || 'Verification failed');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Verification failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    login,
    register,
    sendVerificationCode,
    verifyCode,
    logout,
    loading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;