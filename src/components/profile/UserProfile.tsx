import { useEffect, useState } from 'react';
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
import useAddFriend from '../../hooks/useAddFriend';
import useGetProfile from '../../hooks/useGetProfile';
import { ProfielResponseObject } from "../../hooks/useGetProfile";
import useGetRelationStatus from '../../hooks/useGetRelationStatus';
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
  user: ProfielResponseObject;
  isCurrentUser?: boolean;
  posts: any[],
  communities: any[];
}


const UserProfile = ({ user, isCurrentUser = false, posts, communities }: UserProfileProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const [friendStatus, setFriendStatus] = useState<string>('none');
  const useSendRequest = useAddFriend()

  const profileData = useGetProfile(user.userId).data;
  const { data, isSuccess } = useGetRelationStatus()
  useEffect(() => {
    setFriendStatus(data?.relationship!);
  }, [isSuccess])
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleFollowToggle = () => {
    useSendRequest.mutate({ email: profileData?.email }, {
      onSuccess: () => {
        setFriendStatus("requested");
      }
    });
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
            src={user.profilePictureUrl}
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
                friendStatus == "none" ?
                  <Button
                    variant={'contained'}
                    color="primary"
                    onClick={handleFollowToggle}
                  >
                    {'Add Friends'}
                  </Button> :
                  <Button
                    variant={'outlined'}
                    color='primary'
                    // Use the 'sx' prop to make the button non-interactive
                    sx={{
                      // This is the key: it tells the browser to ignore all mouse events
                      pointerEvents: 'none',

                      // This ensures the cursor doesn't change to a hand icon
                      cursor: 'default',
                    }}
                  >
                    {friendStatus === 'friends' ? 'Friends' : 'Requested'}
                  </Button>
              )}
            </Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              u/{user.username} • Joined {formatJoinDate(user.joinedAt)}
            </Typography>
            <Typography variant="body1" paragraph>
              {user.bio}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Typography variant="body2">
                <strong>{user.friendsCount}</strong> Friends
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
            {posts.length > 0 ? (
              posts.map((post) => <PostCard key={post.id} post={post} />)
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
              {communities.map((community) => (
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
              {formatJoinDate(user.joinedAt)}
            </Typography>


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