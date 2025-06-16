import React, { useState } from 'react';
import {
  Box,
  Paper,
  useTheme,
  useMediaQuery,
  Drawer,
  IconButton,
  AppBar,
  Toolbar,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ChatSidebar from '../components/chat/ChatSidebar';
import ChatWindow from '../components/chat/ChatWindow';
import type { Message, ChatUser } from '../store/ChatContext';
import AnimatedBox from '../components/animation/AnimatedBox';

const Chat: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const handleUserSelect = (user: ChatUser) => {
    setSelectedUser(user);
    if (isMobile) {
      setMobileDrawerOpen(false);
    }
  };

  const handleBackToList = () => {
    setSelectedUser(null);
    if (isMobile) {
      setMobileDrawerOpen(true);
    }
  };

  if (isMobile) {
    return (
      <Box
        sx={{
          height: '100vh',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        }}
      >
        {/* Mobile App Bar */}
        <AppBar
          position="static"
          elevation={1}
          sx={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            color: 'text.primary',
          }}
        >
          <Toolbar>
            {selectedUser ? (
              <>
                <IconButton
                  edge="start"
                  onClick={handleBackToList}
                  sx={{ mr: 2 }}
                >
                  <CloseIcon />
                </IconButton>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {selectedUser.username}
                </Typography>
              </>
            ) : (
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #9B4F2B 0%, #B67D62 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Messages
              </Typography>
            )}
          </Toolbar>
        </AppBar>

        {/* Mobile Content */}
        <Box sx={{ height: 'calc(100vh - 64px)' }}>
          {selectedUser ? (
            <ChatWindow selectedUser={selectedUser} onClose={handleBackToList} />
          ) : (
            <ChatSidebar selectedUser={selectedUser} onUserSelect={handleUserSelect} />
          )}
        </Box>
      </Box>
    );
  }

  // Desktop Layout
  return (
    <AnimatedBox
      animation="fadeIn"
      sx={{
        height: '100vh',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        p: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          height: '100%',
          display: 'flex',
          borderRadius: 2,
          overflow: 'hidden',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(242, 226, 208, 0.3)',
          boxShadow: '0 20px 40px rgba(155, 79, 43, 0.1)',
        }}
      >
        {/* Sidebar */}
        <Box
          sx={{
            width: 350,
            flexShrink: 0,
            borderRight: `1px solid ${theme.palette.divider}`,
          }}
        >
          <ChatSidebar selectedUser={selectedUser} onUserSelect={handleUserSelect} />
        </Box>

        {/* Chat Window */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <ChatWindow selectedUser={selectedUser} onClose={() => setSelectedUser(null)} />
        </Box>
      </Paper>
    </AnimatedBox>
  );
};

export default Chat;

