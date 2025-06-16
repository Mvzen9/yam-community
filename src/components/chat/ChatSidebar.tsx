import React, { useState, useEffect } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Badge,
  Paper,
  TextField,
  InputAdornment,
  useTheme,
  Divider,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useChat } from '../../store/ChatContext';
import type { ChatUser } from '../../store/ChatContext';
import AnimatedBox from '../animation/AnimatedBox';

interface ChatSidebarProps {
  selectedUser: ChatUser | null;
  onUserSelect: (user: ChatUser) => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ selectedUser, onUserSelect }) => {
  const theme = useTheme();
  const { chatUsers, messages } = useChat();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Filter users based on search query
  const filteredUsers = chatUsers.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get last message for each user
  const getLastMessage = (userId: string) => {
    const userMessages = messages.filter(
      msg => msg.senderId === userId || msg.receiverId === userId
    );
    return userMessages[userMessages.length - 1];
  };

  // Get unread count for each user
  const getUnreadCount = (userId: string) => {
    return messages.filter(
      msg => msg.senderId === userId && msg.receiverId === 'current-user' && !msg.read
    ).length;
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <Paper
      elevation={1}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 0,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRight: `1px solid ${theme.palette.divider}`,
      }}
    >
      {/* Header */}
      <AnimatedBox animation="slideInLeft">
        <Box sx={{ p: 1.5, borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: '1.1rem',
              background: 'linear-gradient(135deg, #9B4F2B 0%, #B67D62 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              mb: 1.5,
            }}
          >
            Messages
          </Typography>
          
          {/* Search */}
          <TextField
            fullWidth
            size="small"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.secondary', fontSize: '1.1rem' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: 'rgba(242, 226, 208, 0.2)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(242, 226, 208, 0.3)',
                },
                '&.Mui-focused': {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  '& fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                },
              },
              '& .MuiOutlinedInput-input': {
                fontSize: '0.875rem',
                py: 1,
              },
            }}
          />
        </Box>
      </AnimatedBox>

      {/* Chat List */}
      <Box 
        sx={{ 
          flex: 1, 
          overflow: 'auto',
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(155, 79, 43, 0.2)',
            borderRadius: '3px',
            '&:hover': {
              background: 'rgba(155, 79, 43, 0.3)',
            },
          },
        }}
      >
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress size={24} sx={{ color: 'primary.main' }} />
          </Box>
        ) : (
          <List sx={{ py: 0 }}>
            {filteredUsers.map((user, index) => {
              const lastMessage = getLastMessage(user.id);
              const unreadCount = getUnreadCount(user.id);
              const isSelected = selectedUser?.id === user.id;

              return (
                <AnimatedBox
                  key={user.id}
                  animation="slideInLeft"
                  delay={index * 0.05}
                >
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => onUserSelect(user)}
                      selected={isSelected}
                      sx={{
                        py: 1,
                        px: 1.5,
                        transition: 'all 0.3s ease',
                        borderRadius: 0,
                        '&:hover': {
                          backgroundColor: 'rgba(155, 79, 43, 0.08)',
                          transform: 'translateX(4px)',
                        },
                        '&.Mui-selected': {
                          backgroundColor: 'rgba(155, 79, 43, 0.12)',
                          borderRight: `3px solid ${theme.palette.primary.main}`,
                          '&:hover': {
                            backgroundColor: 'rgba(155, 79, 43, 0.16)',
                          },
                        },
                      }}
                    >
                      <ListItemAvatar>
                        <Badge
                          overlap="circular"
                          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                          variant="dot"
                          sx={{
                            '& .MuiBadge-badge': {
                              backgroundColor: user.online ? '#44b700' : 'transparent',
                              color: user.online ? '#44b700' : 'transparent',
                              border: user.online ? '2px solid white' : 'none',
                              '&::after': {
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                borderRadius: '50%',
                                animation: user.online ? 'ripple 1.2s infinite ease-in-out' : 'none',
                                border: '1px solid currentColor',
                                content: '""',
                              },
                            },
                            '@keyframes ripple': {
                              '0%': {
                                transform: 'scale(.8)',
                                opacity: 1,
                              },
                              '100%': {
                                transform: 'scale(2.4)',
                                opacity: 0,
                              },
                            },
                          }}
                        >
                          <Avatar
                            src={user.avatar}
                            alt={user.username}
                            sx={{
                              width: 40,
                              height: 40,
                              border: '2px solid rgba(155, 79, 43, 0.1)',
                              transition: 'all 0.3s ease',
                              ...(isSelected && {
                                border: '2px solid rgba(155, 79, 43, 0.3)',
                                transform: 'scale(1.05)',
                              }),
                              '&:hover': {
                                transform: 'scale(1.05)',
                                border: '2px solid rgba(155, 79, 43, 0.3)',
                              },
                            }}
                          />
                        </Badge>
                      </ListItemAvatar>
                      
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography
                              variant="subtitle2"
                              component="div"
                              sx={{
                                fontWeight: unreadCount > 0 ? 600 : 500,
                                fontSize: '0.9rem',
                                color: isSelected ? 'primary.main' : 'text.primary',
                              }}
                            >
                              {user.username}
                            </Typography>
                            {lastMessage && (
                              <Typography
                                variant="caption"
                                component="div"
                                sx={{
                                  color: 'text.secondary',
                                  fontSize: '0.7rem',
                                }}
                              >
                                {formatTime(lastMessage.timestamp)}
                              </Typography>
                            )}
                          </Box>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                            <Typography
                              variant="body2"
                              component="div"
                              sx={{
                                color: 'text.secondary',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                maxWidth: '140px',
                                fontSize: '0.8rem',
                                fontWeight: unreadCount > 0 ? 500 : 400,
                              }}
                            >
                              {lastMessage ? (
                                lastMessage.senderId === 'current-user' ? `You: ${lastMessage.content}` : lastMessage.content
                              ) : (
                                'No messages yet'
                              )}
                            </Typography>
                            {unreadCount > 0 && (
                              <Badge
                                badgeContent={unreadCount}
                                color="primary"
                                sx={{
                                  '& .MuiBadge-badge': {
                                    fontSize: '0.7rem',
                                    height: 16,
                                    minWidth: 16,
                                    background: 'linear-gradient(135deg, #9B4F2B 0%, #B67D62 100%)',
                                    animation: 'pulse 2s ease-in-out infinite',
                                  },
                                  '@keyframes pulse': {
                                    '0%': {
                                      transform: 'scale(1)',
                                    },
                                    '50%': {
                                      transform: 'scale(1.1)',
                                    },
                                    '100%': {
                                      transform: 'scale(1)',
                                    },
                                  },
                                }}
                              />
                            )}
                          </Box>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                  {index < filteredUsers.length - 1 && (
                    <Divider variant="inset" component="li" sx={{ ml: 8 }} />
                  )}
                </AnimatedBox>
              );
            })}
          </List>
        )}
        
        {!isLoading && filteredUsers.length === 0 && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '150px',
              color: 'text.secondary',
            }}
          >
            <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
              {searchQuery ? 'No users found' : 'No conversations yet'}
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default ChatSidebar;

