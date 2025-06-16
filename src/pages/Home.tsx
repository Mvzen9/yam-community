import { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Tabs, Tab } from '@mui/material';
import PostCard from '../components/post/PostCard';

// Mock data for posts - in a real app, this would come from an API/store
const mockPosts = [
  {
    id: '1',
    title: 'Welcome to YAM Social Media Platform',
    content: 'this is the first post in the platform, and we are happy to have you here.',
    author: { id: '1', username: 'admin', avatar: '' },
    community: { id: '1', name: 'bta3a' },
    upvotes: 42,
    downvotes: 5,
    commentCount: 7,
    createdAt: new Date().toISOString(),
    image: '/src/assets/posts/mmmmm.jpg',
  },
  {
    id: '2',
    title: 'whats after the graduation project?',
    content: '',
    author: { id: '2', username: 'reactdev', avatar: '' },
    community: { id: '1', name: 'Technology' },
    upvotes: 28,
    downvotes: 2,
    commentCount: 12,
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    image: '/src/assets/posts/mili.jpg',
  },
  {
    id: '3',
    title: 'The future of web development',
    content: 'Web development is constantly evolving with new frameworks and tools being released regularly.',
    author: { id: '3', username: 'webguru', avatar: '' },
    community: { id: '1', name: 'Technology' },
    upvotes: 15,
    downvotes: 3,
    commentCount: 5,
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    image: '',
  },
];

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [feedType, setFeedType] = useState('for-you');
  const [posts, setPosts] = useState(mockPosts);

  // Simulate loading posts
  useEffect(() => {
    setLoading(true);
    // In a real app, this would be an API call
    setTimeout(() => {
      setPosts(mockPosts);
      setLoading(false);
    }, 500);
  }, [feedType]);

  const handleFeedChange = (_event: React.SyntheticEvent, newValue: string) => {
    setFeedType(newValue);
  };

  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs
          value={feedType}
          onChange={handleFeedChange}
          aria-label="feed type tabs"
          indicatorColor="secondary"
          textColor="secondary"
        >
          <Tab label="For You" value="for-you" />
          <Tab label="Popular" value="popular" />
          <Tab label="Latest" value="latest" />
        </Tabs>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress color="secondary" />
        </Box>
      ) : posts.length > 0 ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </Box>
      ) : (
        <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', my: 4 }}>
          No posts found. Join some communities to see posts in your feed!
        </Typography>
      )}
    </Box>
  );
};

export default Home;