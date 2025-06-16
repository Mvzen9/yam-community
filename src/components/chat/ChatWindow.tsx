import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Badge,
  CircularProgress,
  Alert,
  useTheme,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import WifiIcon from '@mui/icons-material/Wifi';
import SignalWifiOffIcon from '@mui/icons-material/SignalWifiOff';
import type { ChatUser } from '../../store/ChatContext';
import { useChat } from '../../store/ChatContext';
import AnimatedBox from '../animation/AnimatedBox';

/**
 * ChatWindow component props
 * @property {ChatUser | null} selectedUser - The currently selected chat user
 * @property {() => void} onClose - Function to close the chat window
 */
interface ChatWindowProps {
  selectedUser: ChatUser | null;
  onClose: () => void;
}

/**
 * ChatWindow component
 * Displays the chat interface for a selected user
 * Handles message display, sending, and real-time updates
 */
const ChatWindow: React.FC<ChatWindowProps> = ({ selectedUser, onClose }) => {
  const theme = useTheme();
  const { 
    messages, 
    sendMessage, 
    markChatAsRead, 
    isConnected, 
    connectionError,
    connectSignalR 
  } = useChat();
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Filter messages for the selected user
  const chatMessages = useMemo(() => {
    if (!selectedUser) return [];
    return messages.filter(
      msg => (msg.senderId === selectedUser.id && msg.receiverId === 'current-user') ||
             (msg.senderId === 'current-user' && msg.receiverId === selectedUser.id)
    );
  }, [messages, selectedUser]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  useEffect(() => {
    if (selectedUser && !isLoading) {
      markChatAsRead(selectedUser.id);
      // Simulate loading state
      setIsLoading(true);
      const timer = setTimeout(() => setIsLoading(false), 500);
      return () => clearTimeout(timer);
    }
  }, [selectedUser?.id]); // Only depend on the user ID, not the entire user object

  // Auto-connect to SignalR when component mounts - commented out for now
  /*
  useEffect(() => {
    if (!isConnected && !connectionError) {
      // In a real app, you'd get the user ID and token from auth context
      connectSignalR('current-user');
    }
  }, [isConnected, connectionError, connectSignalR]);
  */

  const handleSendMessage = async () => {
    if (newMessage.trim() && selectedUser && !isSending) {
      setIsSending(true);
      try {
        // TODO: Implement API call to send message
        // API Endpoint: POST /api/messages
        // Request Body: { receiverId: string, content: string }
        const success = await sendMessage(selectedUser.id, newMessage.trim());
        if (success) {
          setNewMessage('');
          scrollToBottom();
        }
      } catch (error) {
        console.error('Failed to send message:', error);
      } finally {
        setIsSending(false);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!selectedUser) {
    return (
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'text.secondary',
          p: 3,
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Select a chat to start messaging
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isConnected ? (
            <>
              <WifiIcon color="success" />
              <Typography variant="body2" color="success.main">
                Connected to chat service
              </Typography>
            </>
          ) : (
            <>
              <SignalWifiOffIcon color="warning" />
              <Typography variant="body2" color="warning.main">
                {connectionError || 'Connecting to chat service...'}
              </Typography>
            </>
          )}
        </Box>
      </Box>
    );
  }

  return (
    <AnimatedBox animation="slideInRight" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Chat Header */}
      <Paper
        elevation={1}
        sx={{
          p: 1.5,
          borderRadius: 0,
          borderBottom: `1px solid ${theme.palette.divider}`,
          background: 'linear-gradient(135deg, rgba(155, 79, 43, 0.05) 0%, rgba(242, 226, 208, 0.1) 100%)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              variant="dot"
              sx={{
                '& .MuiBadge-badge': {
                  backgroundColor: selectedUser.online ? '#44b700' : 'transparent',
                  color: selectedUser.online ? '#44b700' : 'transparent',
                  border: selectedUser.online ? '2px solid white' : 'none',
                  '&::after': {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    animation: selectedUser.online ? 'ripple 1.2s infinite ease-in-out' : 'none',
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
                src={selectedUser.avatar}
                alt={selectedUser.username}
                sx={{
                  width: 40,
                  height: 40,
                  border: '2px solid rgba(155, 79, 43, 0.2)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    border: '2px solid rgba(155, 79, 43, 0.4)',
                  },
                }}
              />
            </Badge>
            <Box sx={{ ml: 1.5 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
                {selectedUser.username}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                  {selectedUser.online ? 'Online' : `Last seen ${formatTime(selectedUser.lastSeen)}`}
                </Typography>
                {isConnected ? (
                  <WifiIcon sx={{ fontSize: 12, color: 'success.main' }} />
                ) : (
                  <SignalWifiOffIcon sx={{ fontSize: 12, color: 'warning.main' }} />
                )}
              </Box>
            </Box>
          </Box>
          <IconButton size="small" sx={{ p: 0.5 }}>
            <MoreVertIcon sx={{ fontSize: '1.2rem' }} />
          </IconButton>
        </Box>
      </Paper>

      {/* Connection Error Alert */}
      {connectionError && (
        <Alert 
          severity="warning" 
          sx={{ 
            borderRadius: 0,
            py: 0.5,
            '& .MuiAlert-message': {
              fontSize: '0.75rem',
            },
          }}
        >
          {connectionError} - Messages will be sent when connection is restored.
        </Alert>
      )}

      {/* Messages Area */}
      <Box
        ref={messagesEndRef}
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 1.5,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
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
          chatMessages.map((message, index) => (
            <AnimatedBox
              key={message.id}
              animation="fadeIn"
              delay={index * 0.05}
              sx={{
                alignSelf: message.senderId === 'current-user' ? 'flex-end' : 'flex-start',
                maxWidth: '80%',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0.5,
                  p: 1,
                  borderRadius: 2,
                  backgroundColor: message.senderId === 'current-user'
                    ? 'rgba(155, 79, 43, 0.1)'
                    : 'rgba(242, 226, 208, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: message.senderId === 'current-user'
                      ? 'rgba(155, 79, 43, 0.15)'
                      : 'rgba(242, 226, 208, 0.4)',
                  },
                }}
              >
                <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                  {message.content}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    alignSelf: 'flex-end',
                    color: 'text.secondary',
                    fontSize: '0.7rem',
                  }}
                >
                  {formatTime(message.timestamp)}
                </Typography>
              </Box>
            </AnimatedBox>
          ))
        )}
      </Box>

      {/* Message Input */}
      <Paper
        elevation={1}
        sx={{
          p: 1,
          borderRadius: 0,
          borderTop: `1px solid ${theme.palette.divider}`,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            disabled={isSending}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: 'rgba(242, 226, 208, 0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(242, 226, 208, 0.2)',
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
          <IconButton
            color="primary"
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isSending}
            sx={{
              p: 0.75,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.1)',
                backgroundColor: 'rgba(155, 79, 43, 0.1)',
              },
            }}
          >
            {isSending ? (
              <CircularProgress size={20} sx={{ color: 'primary.main' }} />
            ) : (
              <SendIcon sx={{ fontSize: '1.2rem' }} />
            )}
          </IconButton>
        </Box>
      </Paper>
    </AnimatedBox>
  );
};

export default ChatWindow;

