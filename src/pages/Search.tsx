import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Divider,
  CircularProgress,
  Paper,
  InputBase,
  IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import GroupIcon from '@mui/icons-material/Group';
import PostCard from '../components/post/PostCard';
import { useCommunity } from '../store/CommunityContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`search-tabpanel-${index}`}
      aria-labelledby={`search-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `search-tab-${index}`,
    'aria-controls': `search-tabpanel-${index}`,
  };
}

const Search = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({
    posts: [],
    communities: [],
    users: [],
  });
  
  const { userCommunities, fetchUserCommunities, loading: communitiesLoading } = useCommunity();

  // Parse search query from URL and fetch communities
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q') || '';
    setSearchQuery(query);
    
    // Fetch user communities if not already loaded
    fetchUserCommunities();
    
    if (query) {
      performSearch(query);
    }
  }, [location.search, fetchUserCommunities]);

  const performSearch = (query: string) => {
    setLoading(true);
    
    // Filter communities based on search query
    const filteredCommunities = userCommunities.filter(community => 
      community.name.toLowerCase().includes(query.toLowerCase()) || 
      (community.description && community.description.toLowerCase().includes(query.toLowerCase()))
    );
    
    // In a real app, this would call an API to search for posts and users
    // For now, we're using real communities but mock posts and users
    setTimeout(() => {
      setResults({
        posts: [
          { id: '1', title: 'First post about ' + query, author: 'User1', votes: 42, commentCount: 5 },
          { id: '2', title: 'Another post mentioning ' + query, author: 'User2', votes: 21, commentCount: 3 },
        ],
        communities: filteredCommunities,
        users: [
          { id: '1', username: query + '_fan', postCount: 15 },
          { id: '2', username: 'the_real_' + query, postCount: 32 },
        ],
      });
      setLoading(false);
    }, 500);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      performSearch(searchQuery);
      // Update URL with search query
      const searchParams = new URLSearchParams(location.search);
      searchParams.set('q', searchQuery);
      window.history.pushState({}, '', `${location.pathname}?${searchParams.toString()}`);
    }
  };

  return (
    <Box>
      <Paper
        component="form"
        sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', mb: 3 }}
        elevation={1}
        onSubmit={handleSearch}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search posts, communities, users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          inputProps={{ 'aria-label': 'search' }}
        />
        <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
          <SearchIcon />
        </IconButton>
      </Paper>

      <Typography variant="h5" component="h1" gutterBottom>
        Search Results for "{searchQuery}"
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="search results tabs">
          <Tab label={`Posts (${results.posts.length})`} {...a11yProps(0)} />
          <Tab label={`Communities (${results.communities.length})`} {...a11yProps(1)} />
          <Tab label={`Users (${results.users.length})`} {...a11yProps(2)} />
        </Tabs>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TabPanel value={tabValue} index={0}>
            {results.posts.length > 0 ? (
              results.posts.map((post: any) => (
                <Box key={post.id} sx={{ mb: 2 }}>
                  <PostCard post={post} />
                </Box>
              ))
            ) : (
              <Typography>No posts found matching your search.</Typography>
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            {loading || communitiesLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <CircularProgress size={30} />
              </Box>
            ) : results.communities.length > 0 ? (
              results.communities.map((community: any) => (
                <Box key={community.communityId} sx={{ mb: 2 }}>
                  <Paper sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <GroupIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Box>
                        <Typography 
                          variant="h6" 
                          component={Link} 
                          to={`/community/${community.communityId}`}
                          sx={{ 
                            textDecoration: 'none', 
                            color: 'primary.main',
                            '&:hover': { textDecoration: 'underline' } 
                          }}
                        >
                          {community.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {community.description}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Box>
              ))
            ) : (
              <Typography>No communities found matching your search.</Typography>
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            {results.users.length > 0 ? (
              results.users.map((user: any) => (
                <Box key={user.id} sx={{ mb: 2 }}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h6">@{user.username}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user.postCount} posts
                    </Typography>
                  </Paper>
                </Box>
              ))
            ) : (
              <Typography>No users found matching your search.</Typography>
            )}
          </TabPanel>
        </>
      )}
    </Box>
  );
};

export default Search;