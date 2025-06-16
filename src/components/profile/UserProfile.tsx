import { useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Button,
  Tabs,
  Tab,
  Divider,
  Paper,
  Grid,
  Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PostCard from '../post/PostCard';

// Define the User type
interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  joinDate: string;
  followers: number;
  following: number;
  posts: any[]; // Using any[] for simplicity, would use Post[] in a real app
  communities: { id: string; name: string }[];
  birthdate?: string; // Add birthdate
  gender?: string; // Add gender
}

interface UserProfileProps {
  user: User;
  isCurrentUser?: boolean;
}

const UserProfile = ({ user, isCurrentUser = false }: UserProfileProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
    // In a real app, this would call an API to follow/unfollow
  };

  // Format date to readable format
  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <Box>
      {/* Profile header */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
          <Avatar
            src={user.avatar}
            alt={user.displayName}
            sx={{ width: 120, height: 120, mr: 3 }}
          />
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="h4" component="h1">
                {user.displayName}
              </Typography>
              {isCurrentUser ? (
                <Button startIcon={<EditIcon />} variant="outlined">
                  Edit Profile
                </Button>
              ) : (
                <Button
                  variant={isFollowing ? 'outlined' : 'contained'}
                  color="primary"
                  onClick={handleFollowToggle}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </Button>
              )}
            </Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              u/{user.username} • Joined {formatJoinDate(user.joinDate)}
            </Typography>
            <Typography variant="body1" paragraph>
              {user.bio}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Typography variant="body2">
                <strong>{user.followers}</strong> Followers
              </Typography>
              <Typography variant="body2">
                <strong>{user.following}</strong> Following
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Profile tabs */}
      <Box sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Posts" />
          <Tab label="Comments" />
          <Tab label="Communities" />
          <Tab label="About" />
        </Tabs>
      </Box>

      {/* Tab content */}
      <Box>
        {/* Posts tab */}
        {activeTab === 0 && (
          <Box>
            {user.posts.length > 0 ? (
              user.posts.map((post) => <PostCard key={post.id} post={post} />)
            ) : (
              <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                No posts yet.
              </Typography>
            )}
          </Box>
        )}

        {/* Comments tab */}
        {activeTab === 1 && (
          <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            Comments will be displayed here.
          </Typography>
        )}

        {/* Communities tab */}
        {activeTab === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Communities
            </Typography>
            <Grid container spacing={1}>
              {user.communities.map((community) => (
                <Grid item key={community.id}>
                  <Chip label={community.name} clickable component="a" href={`/community/${community.id}`} />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* About tab */}
        {activeTab === 3 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              About
            </Typography>
            <Typography variant="body1" paragraph>
              {user.bio}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" gutterBottom>
              Joined
            </Typography>
            <Typography variant="body2" paragraph>
              {formatJoinDate(user.joinDate)}
            </Typography>
            {user.birthdate && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" gutterBottom>
                  Birthdate
                </Typography>
                <Typography variant="body2" paragraph>
                  {user.birthdate}
                </Typography>
              </>
            )}
            {user.gender && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" gutterBottom>
                  Gender
                </Typography>
                <Typography variant="body2" paragraph>
                  {user.gender}
                </Typography>
              </>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default UserProfile;