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
import Chat from './pages/Chat';

// Context Providers
import { AuthProvider, useAuth } from './store/AuthContext';
import { PostProvider } from './store/PostContext';
import { NotificationProvider } from './store/NotificationContext';
import { ChatProvider } from './store/ChatContext';
import { CommunityProvider } from './store/CommunityContext';
import { CommentProvider } from './store/CommentContext';

// Layout
import Layout from './components/layout/Layout';

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

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <NotificationProvider>
          <ChatProvider>
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
                        <Route path="chat" element={<Chat />} />
                        <Route path="*" element={<NotFound />} />
                      </Route>
                    </Routes>
                  </Router>
                </CommentProvider>
              </PostProvider>
            </CommunityProvider>
          </ChatProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

