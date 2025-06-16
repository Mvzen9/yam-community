import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Snackbar,
  Alert,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CommunityHeader, { type Community as CommunityType } from '../components/community/CommunityHeader';
import PostCard from '../components/post/PostCard';
import { useCommunity } from '../store/CommunityContext';
import { useAuth } from '../store/AuthContext';
import { usePost } from '../store/PostContext';

const CommunityPage = () => {
  const { communityId } = useParams<{ communityId: string }>();
  const navigate = useNavigate();
  const { userCommunities, loading: communityLoading, error: communityError, fetchUserCommunities, generateInviteCode, joinCommunityWithCode, leaveCommunity, deleteCommunity, modifyCommunity } = useCommunity();
  const { user } = useAuth();
  const { communityPosts, loading: postsLoading, error: postsError } = usePost();
  
  const [community, setCommunity] = useState<CommunityType | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  
  // Pagination and filtering state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Dialog states
  const [openJoinDialog, setOpenJoinDialog] = useState(false);
  const [openInviteDialog, setOpenInviteDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openModifyDialog, setOpenModifyDialog] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [joinCode, setJoinCode] = useState('');
  
  // Modify community form state
  const [modifyFormData, setModifyFormData] = useState({
    name: '',
    description: ''
  });
  const [modifyBannerFile, setModifyBannerFile] = useState<File | null>(null);
  const [modifyBannerPreview, setModifyBannerPreview] = useState<string | null>(null);
  
  // Snackbar states
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  
  const handleJoinCommunity = async () => {
    try {
      await joinCommunityWithCode(joinCode);
      setOpenJoinDialog(false);
      setJoinCode('');
      showSnackbar('Successfully joined community', 'success');
      // Refresh community data
      await fetchUserCommunities();
    } catch (error: any) {
      showSnackbar(error.message || 'Failed to join community', 'error');
    }
  };
  
  const handleLeaveCommunity = async () => {
    if (!communityId) return;
    
    try {
      await leaveCommunity(communityId);
      showSnackbar('Successfully left community', 'success');
      navigate('/');
    } catch (error: any) {
      showSnackbar(error.message || 'Failed to leave community', 'error');
    }
  };
  
  const handleGenerateInviteCode = async () => {
    if (!communityId) return;
    
    try {
      const code = await generateInviteCode(communityId);
      setInviteCode(code);
      setOpenInviteDialog(true);
    } catch (error: any) {
      showSnackbar(error.message || 'Failed to generate invite code', 'error');
    }
  };
  
  const handleDeleteCommunity = async () => {
    if (!communityId) return;
    
    try {
      await deleteCommunity(communityId);
      setOpenDeleteDialog(false);
      showSnackbar('Community deleted successfully', 'success');
      navigate('/');
    } catch (error: any) {
      showSnackbar(error.message || 'Failed to delete community', 'error');
    }
  };
  
  const handleOpenModifyDialog = () => {
    if (!community) return;
    
    // Initialize form with current community data
    // Exclude isPublic as per requirements
    setModifyFormData({
      name: community.name,
      description: community.description
    });
    
    // Set banner preview if available
    if (community.banner) {
      setModifyBannerPreview(community.banner);
    } else {
      setModifyBannerPreview(null);
    }
    
    setOpenModifyDialog(true);
  };
  
  const handleModifyInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setModifyFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleModifyBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setModifyBannerFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setModifyBannerPreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleRemoveModifyBanner = () => {
    setModifyBannerFile(null);
    setModifyBannerPreview(null);
  };
  
  const handleModifyCommunity = async () => {
    if (!communityId) return;
    
    try {
      await modifyCommunity(communityId, {
        name: modifyFormData.name,
        description: modifyFormData.description,
        banner: modifyBannerFile
      });
      
      setOpenModifyDialog(false);
      showSnackbar('Community updated successfully', 'success');
      
      // Refresh community data
      await fetchUserCommunities();
    } catch (error: any) {
      if (error.response && error.response.data) {
        showSnackbar(error.response.data.message, 'error');
      } else {
        showSnackbar(error.message || 'Failed to update community', 'error');
      }
    }
  };
  
  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };
  
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Function to fetch posts for the community
  const fetchPosts = async () => {
    if (!communityId) return;
    
    try {
      setLoading(true);
      const result = await communityPosts(communityId, {
        pageSize,
        pageNumber: page,
        search: searchTerm,
        sort: sortOrder
      });
      
      setPosts(result.items);
      setTotalPosts(result.totalCount);
    } catch (error) {
      console.error('Error fetching posts:', error);
      showSnackbar('Failed to load posts', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to first page when searching
    fetchPosts();
  };

  // Handle sort change
  const handleSortChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setSortOrder(e.target.value as 'asc' | 'desc');
  };

  useEffect(() => {
    // Fetch user communities if not already loaded
    if (userCommunities.length === 0) {
      fetchUserCommunities();
    }
  }, []);
  
  useEffect(() => {
    const fetchCommunityAndPosts = async () => {
      if (!communityId || communityLoading) return;
      
      setLoading(true);
      
      try {
        // Find the community in the user's communities
        const foundCommunity = userCommunities.find(c => c.communityId === communityId);
        
        if (foundCommunity) {
          // Convert to the format expected by CommunityHeader
          const communityData: CommunityType = {
            id: foundCommunity.communityId,
            name: foundCommunity.name,
            description: foundCommunity.description,
            // Use the bannerUrl directly from the API response
            banner: foundCommunity.bannerUrl,
            memberCount: foundCommunity.memberCount || 0,
            createdAt: foundCommunity.createdAt || new Date().toISOString(),
            isJoined: true, // User is a member since it's in their communities list
            isModerator: foundCommunity.creatorId === user?.id, // User is creator
            tags: foundCommunity.tags,
          };
          
          setCommunity(communityData);
          
          // Fetch posts for this community
          await fetchPosts();
        } else {
          // Community not found in user's communities
          setCommunity(null);
        }
      } catch (error) {
        console.error('Error fetching community:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunityAndPosts();
  }, [communityId, userCommunities, user?.id, communityLoading]);

  // Refetch posts when pagination, search, or sort changes
  useEffect(() => {
    if (community) {
      fetchPosts();
    }
  }, [page, pageSize, sortOrder]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!community) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h5" align="center">
          Community not found
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {community && (
        <CommunityHeader 
          community={community} 
          activeTab={activeTab} 
          onTabChange={handleTabChange}
          onJoin={() => setOpenJoinDialog(true)}
          onLeave={handleLeaveCommunity}
          onGenerateInvite={handleGenerateInviteCode}
          onDelete={() => setOpenDeleteDialog(true)}
          onModify={handleOpenModifyDialog}
        />
      )}
      
      {/* Tab content */}
      {community && activeTab === 0 && (
        <Box>
          {/* Search and filter controls */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, mt: 2 }}>
            <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex', width: '60%' }}>
              <TextField
                fullWidth
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton type="submit" edge="end">
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                size="small"
              />
            </Box>
            
            <FormControl sx={{ width: '30%' }} size="small">
              <InputLabel id="sort-label">Sort</InputLabel>
              <Select
                labelId="sort-label"
                value={sortOrder}
                label="Sort"
                onChange={handleSortChange}
              >
                <MenuItem value="desc">Newest First</MenuItem>
                <MenuItem value="asc">Oldest First</MenuItem>
              </Select>
            </FormControl>
          </Box>
          
          {postsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : posts.length > 0 ? (
            <>
              {posts.map((post) => (
                <PostCard 
                  key={post.postId} 
                  post={{
                    postId: post.postId,
                    content: post.content,
                    createdAt: post.createdAt,
                    ceatorId: post.ceatorId,
                    imageUrl: post.imageUrl, // Ensure imageUrl is passed correctly
                    likesCount: post.likesCount,
                    commentsCount: post.commentsCount,
                    communityId: post.communityId,
                    author: {
                      username: 'User', // We don't have username in the API response
                      avatar: '',
                    },
                    community: {
                      name: community.name,
                    }
                  }} 
                />
              ))}
              
              {/* Pagination */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination 
                  count={Math.ceil(totalPosts / pageSize)} 
                  page={page} 
                  onChange={handlePageChange} 
                  color="primary" 
                />
              </Box>
            </>
          ) : (
            <Paper elevation={0} sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                No posts in this community yet.
              </Typography>
            </Paper>
          )}
        </Box>
      )}

      {community && activeTab === 1 && (
        <Paper elevation={0} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            About {community.name}
          </Typography>
          <Typography variant="body1" paragraph>
            {community.description}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Created on {new Date(community.createdAt).toLocaleDateString()}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {community.memberCount} members
          </Typography>
          
          {community.isModerator && (
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button variant="outlined" onClick={handleOpenModifyDialog}>
                Edit Community
              </Button>
              <Button variant="outlined" color="error" onClick={() => setOpenDeleteDialog(true)}>
                Delete Community
              </Button>
              <Button variant="outlined" onClick={handleGenerateInviteCode}>
                Generate Invite Code
              </Button>
            </Box>
          )}
        </Paper>
      )}
      
      {/* Join Dialog */}
      <Dialog open={openJoinDialog} onClose={() => setOpenJoinDialog(false)}>
        <DialogTitle>Join Community</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the invite code to join this community.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="code"
            label="Invite Code"
            type="text"
            fullWidth
            variant="outlined"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenJoinDialog(false)}>Cancel</Button>
          <Button onClick={handleJoinCommunity} variant="contained" color="primary">
            Join
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Invite Code Dialog */}
      <Dialog open={openInviteDialog} onClose={() => setOpenInviteDialog(false)}>
        <DialogTitle>Invite Code</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Share this code with others to invite them to your community.
          </DialogContentText>
          <TextField
            margin="dense"
            id="inviteCode"
            label="Invite Code"
            type="text"
            fullWidth
            variant="outlined"
            value={inviteCode}
            InputProps={{
              readOnly: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenInviteDialog(false)}>Close</Button>
          <Button 
            onClick={() => {
              navigator.clipboard.writeText(inviteCode);
              showSnackbar('Invite code copied to clipboard', 'success');
            }} 
            variant="contained" 
            color="primary"
          >
            Copy
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Delete Community</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this community? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDeleteCommunity} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Modify Community Dialog */}
      <Dialog open={openModifyDialog} onClose={() => setOpenModifyDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Community</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            name="name"
            label="Community Name"
            type="text"
            fullWidth
            variant="outlined"
            value={modifyFormData.name}
            onChange={handleModifyInputChange}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            margin="dense"
            id="description"
            name="description"
            label="Description"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={modifyFormData.description}
            onChange={handleModifyInputChange}
            sx={{ mb: 2 }}
          />
          
          {/* Banner Upload */}
          <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
            Community Banner
          </Typography>
          
          {!modifyBannerPreview ? (
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ height: 100, borderStyle: 'dashed' }}
            >
              Upload Banner Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleModifyBannerUpload}
              />
            </Button>
          ) : (
            <Box sx={{ position: 'relative', mb: 2 }}>
              <img 
                src={modifyBannerPreview} 
                alt="Banner preview" 
                style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '4px' }} 
              />
              <Button 
                variant="contained" 
                color="error" 
                size="small"
                onClick={handleRemoveModifyBanner}
                sx={{ position: 'absolute', top: 8, right: 8 }}
              >
                Remove
              </Button>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModifyDialog(false)}>Cancel</Button>
          <Button onClick={handleModifyCommunity} color="primary" variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={6000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CommunityPage;