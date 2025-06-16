import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme';
import './App.css';

// Pages
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import Community from './pages/Community';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import Verify from './pages/Verify';
import CreatePost from './pages/CreatePost';
import Search from './pages/Search';
import NotFound from './pages/NotFound';
import CreateCommunity from './pages/CreateCommunity';
import JoinCommunity from './pages/JoinCommunity';

import FriendRequests from './pages/friendRequests';

// Context Providers
import { AuthProvider, useAuth } from './store/AuthContext';
import { PostProvider } from './store/PostContext';
import { NotificationProvider } from './store/NotificationContext';

import { CommunityProvider } from './store/CommunityContext';
import { CommentProvider } from './store/CommentContext';

// Layout
import Layout from './components/layout/Layout';
import { useEffect } from 'react';
import axios from 'axios';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
interface RefreshTokenResponse {
  code: number;
  messasge: string; // Note: This matches the typo in your JSON
  userId: string;
  token: string;
  expirationDate: string; // This will be a string in ISO date format
  refreshTokenExpirationDate: string; // Also a string in ISO date format
}
function App() {


  useEffect(() => {
    // The function you want to run
    const myScript = async () => {
      try {
        const refreshToken = localStorage.getItem("refreshToken")
        const headers = {
          'Content-Type': 'application/json' // Assuming you're sending JSON data
        };
        const result = await axios.get<RefreshTokenResponse>(`https://todo-app.polandcentral.cloudapp.azure.com:5004/api/Auth/refresh-token?refreshToken=${refreshToken}`, { headers: headers })
        localStorage.setItem("token", result.data.token)
      } catch {
        localStorage.removeItem("token")

      }
    };

    // Run the script immediately on component mount
    myScript();

    // Set up the interval to run the script every 15 minutes
    // 15 minutes = 15 * 60 seconds * 1000 milliseconds
    const intervalId = setInterval(myScript, 60 * 1000);

    // This is the cleanup function.
    // It runs when the component unmounts.
    return () => {
      console.log('Clearing interval.');
      clearInterval(intervalId);
    };
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <NotificationProvider>
          <CommunityProvider>
            <PostProvider>
              <CommentProvider>
                <Router>
                  <Routes>
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/verify" element={<Verify />} />
                    {/* Protected routes */}
                    <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                      <Route index element={<Home />} />
                      <Route path="profile/:userId" element={<Profile />} />
                      <Route path="community/:communityId" element={<Community />} />
                      <Route path="create-post" element={<CreatePost />} />
                      <Route path="create-community" element={<CreateCommunity />} />
                      <Route path="community/join" element={<JoinCommunity />} />
                      <Route path="post/:postId" element={<PostDetail />} />
                      <Route path="search" element={<Search />} />
                      <Route path="requests" element={<FriendRequests />} />
                      <Route path="" element={<NotFound />} />
                    </Route>
                  </Routes>
                </Router>
              </CommentProvider>
            </PostProvider>
          </CommunityProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider >
  );
}

export default App;

