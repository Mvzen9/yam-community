import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Avatar,
  Tabs,
  Tab,
  Chip,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

// Define the Community type
export interface Community {
  id: string;
  name: string;
  description: string;
  banner?: string; // This will be populated with bannerUrl from the API
  avatar?: string;
  memberCount: number;
  createdAt: string;
  isJoined?: boolean;
  isModerator?: boolean;
  rules?: { title: string; description: string }[];
  tags?: string[];
}

interface CommunityHeaderProps {
  community: Community;
  activeTab: number;
  onTabChange: (event: React.SyntheticEvent, newValue: number) => void;
  onJoin?: () => void;
  onLeave?: () => void;
  onGenerateInvite?: () => void;
  onDelete?: () => void;
}

const CommunityHeader = ({ 
  community, 
  activeTab, 
  onTabChange,
  onJoin,
  onLeave,
  onGenerateInvite,
  onDelete
}: CommunityHeaderProps) => {
  const [isJoined, setIsJoined] = useState(community.isJoined || false);
  const [openLeaveDialog, setOpenLeaveDialog] = useState(false);

  const handleJoinToggle = () => {
    if (isJoined) {
      // Show confirmation dialog before leaving
      setOpenLeaveDialog(true);
    } else if (!isJoined && onJoin) {
      onJoin();
    }
    // Only toggle locally if no callbacks provided
    if (!onJoin && !onLeave && !isJoined) {
      setIsJoined(true);
    }
  };
  
  const handleLeaveConfirm = () => {
    if (onLeave) {
      onLeave();
    } else {
      // Only toggle locally if no callback provided
      setIsJoined(false);
    }
    setOpenLeaveDialog(false);
  };

  // Format date to readable format
  const formatCreationDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <Box sx={{ mb: 3 }}>
      {/* Community banner */}
      {community.banner && (
        <Box
          sx={{
            height: 300,
            width: '100%',
            backgroundImage: `url(${community.banner})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '4px 4px 0 0',
          }}
        />
      )}

      {/* Community info */}
      <Paper 
        elevation={0} 
        sx={{
          p: 3,
          borderRadius: community.banner ? '0 0 4px 4px' : 4,
          position: 'relative',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
          <Avatar
            src={community.avatar}
            alt={community.name}
            sx={{
              width: 80,
              height: 80,
              mr: 2,
              border: '4px solid white',
              ...(community.banner && {
                mt: '-60px',
                position: 'relative',
              }),
            }}
          >
            {!community.avatar && community.name.charAt(0).toUpperCase()}
          </Avatar>

          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5" component="h1" gutterBottom>
                {community.name}
              </Typography>
              <Box>
                {community.isModerator ? (
                  <Button
                    startIcon={<SettingsIcon />}
                    variant="outlined"
                    sx={{ mr: 1 }}
                    onClick={onGenerateInvite}
                  >
                    Invite
                  </Button>
                ) : null}
                <Button
                  variant={isJoined ? 'outlined' : 'contained'}
                  color={isJoined ? 'error' : 'primary'}
                  startIcon={isJoined ? <ExitToAppIcon /> : <AddIcon />}
                  onClick={handleJoinToggle}
                >
                  {isJoined ? 'Leave Community' : 'Join'}
                </Button>
              </Box>
            </Box>

            <Typography variant="body2" color="text.secondary" gutterBottom>
              {community.memberCount.toLocaleString()} {community.memberCount === 1 ? 'member' : 'members'} • 
              Created {formatCreationDate(community.createdAt)}
            </Typography>

            <Typography variant="body1" paragraph>
              {community.description}
            </Typography>

            {community.tags && community.tags.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {community.tags.map((tag, index) => (
                  <Chip key={index} label={tag} size="small" />
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Community tabs */}
      <Box sx={{ mt: 2 }}>
        <Tabs
          value={activeTab}
          onChange={onTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Posts" />
          <Tab label="About" />
          <Tab label="Rules" />
        </Tabs>
        <Divider />
      </Box>
      
      {/* Leave Community Confirmation Dialog */}
      <Dialog
        open={openLeaveDialog}
        onClose={() => setOpenLeaveDialog(false)}
      >
        <DialogTitle>Leave Community</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to leave this community? You'll need an invite code to rejoin.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLeaveDialog(false)}>Cancel</Button>
          <Button onClick={handleLeaveConfirm} color="error">
            Leave
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CommunityHeader;