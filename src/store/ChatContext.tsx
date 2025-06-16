import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
// import { getSignalRService } from '../services/signalRService';
// import type { SignalRMessage, SignalRUser } from '../services/signalRService';

/**
 * Message type definition
 * @property {string} id - Unique message identifier
 * @property {string} senderId - ID of the message sender
 * @property {string} receiverId - ID of the message receiver
 * @property {string} content - Message content
 * @property {string} timestamp - ISO timestamp of when the message was sent
 * @property {boolean} read - Whether the message has been read
 */
export type Message = {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
};

/**
 * Chat user type definition
 * @property {string} id - Unique user identifier
 * @property {string} username - User's display name
 * @property {string} avatar - URL to user's avatar image
 * @property {boolean} online - User's online status
 * @property {string} lastSeen - ISO timestamp of when user was last seen
 */
export type ChatUser = {
  id: string;
  username: string;
  avatar: string;
  online: boolean;
  lastSeen: string;
};

/**
 * Chat context type definition
 * Contains all the state and methods needed for chat functionality
 */
interface ChatContextType {
  messages: Message[];
  chatUsers: ChatUser[];
  unreadCount: number;
  activeChat: string | null;
  isConnected: boolean;
  connectionError: string | null;
  sendMessage: (receiverId: string, content: string) => Promise<boolean>;
  setActiveChat: (userId: string | null) => void;
  markChatAsRead: (userId: string) => void;
  connectSignalR: (userId: string, accessToken?: string) => Promise<boolean>;
  disconnectSignalR: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  // State management
  const [messages, setMessages] = useState<Message[]>([
    // TODO: Replace with API call to fetch messages
    // API Endpoint: GET /api/messages
    // Response: Array of Message objects
    {
      id: '1',
      senderId: 'waleed',
      receiverId: 'current-user',
      content: 'Hey, how are you?',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: false,
    },
    {
      id: '2',
      senderId: 'amr',
      receiverId: 'current-user',
      content: 'Check out this new feature!',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      read: false,
    },
  ]);

  const [chatUsers, setChatUsers] = useState<ChatUser[]>([
    // TODO: Replace with API call to fetch users
    // API Endpoint: GET /api/users
    // Response: Array of ChatUser objects
    {
      id: 'waleed',
      username: 'Waleed',
      avatar: 'https://images.pexels.com/photos/2269872/pexels-photo-2269872.jpeg?auto=compress&cs=tinysrgb&w=150',
      online: true,
      lastSeen: new Date().toISOString(),
    },
    {
      id: 'amr',
      username: 'Amr',
      avatar: 'https://images.pexels.com/photos/2269872/pexels-photo-2269872.jpeg?auto=compress&cs=tinysrgb&w=150',
      online: false,
      lastSeen: new Date(Date.now() - 900000).toISOString(),
    },
    {
      id: 'moaaz',
      username: 'Moaaz',
      avatar: 'https://images.pexels.com/photos/2269872/pexels-photo-2269872.jpeg?auto=compress&cs=tinysrgb&w=150',
      online: true,
      lastSeen: new Date().toISOString(),
    },
  ]);

  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const unreadCount = messages.filter(m => !m.read && m.receiverId === 'current-user').length;

  // SignalR event handlers - commented out for now
  /*
  const handleMessageReceived = useCallback((signalRMessage: SignalRMessage) => {
    // TODO: Implement real-time message handling
    // SignalR Hub Method: ReceiveMessage
    // Parameters: SignalRMessage object
    const newMessage: Message = {
      id: signalRMessage.id,
      senderId: signalRMessage.senderId,
      receiverId: signalRMessage.receiverId,
      content: signalRMessage.content,
      timestamp: signalRMessage.timestamp,
      read: signalRMessage.read,
    };

    setMessages(prev => {
      const exists = prev.some(msg => msg.id === newMessage.id);
      if (exists) return prev;
      return [...prev, newMessage];
    });
  }, []);

  const handleUserStatusChanged = useCallback((signalRUser: SignalRUser) => {
    // TODO: Implement real-time user status updates
    // SignalR Hub Method: UserStatusChanged
    // Parameters: SignalRUser object
    setChatUsers(prev => prev.map(user => 
      user.id === signalRUser.id 
        ? { 
            ...user, 
            online: signalRUser.online,
            lastSeen: signalRUser.online ? new Date().toISOString() : user.lastSeen
          }
        : user
    ));
  }, []);

  const handleConnectionStateChanged = useCallback((connected: boolean) => {
    // TODO: Implement connection state handling
    // SignalR Hub Event: ConnectionStateChanged
    setIsConnected(connected);
    if (connected) {
      setConnectionError(null);
    }
  }, []);
  */

  // Initialize SignalR service - commented out for now
  /*
  useEffect(() => {
    // TODO: Initialize SignalR connection
    // API Configuration:
    // - Hub URL: VITE_SIGNALR_HUB_URL environment variable
    // - Authentication: Bearer token from auth context
    // - Reconnection: Automatic with exponential backoff
    const hubUrl = import.meta.env.VITE_SIGNALR_HUB_URL || 'https://localhost:7000/chathub';
    
    try {
      const signalRService = getSignalRService(hubUrl);
      
      signalRService.setOnMessageReceived(handleMessageReceived);
      signalRService.setOnUserStatusChanged(handleUserStatusChanged);
      signalRService.setOnConnectionStateChanged(handleConnectionStateChanged);
    } catch (error) {
      console.error('Failed to initialize SignalR service:', error);
      setConnectionError('Failed to initialize chat service');
    }
  }, [handleMessageReceived, handleUserStatusChanged, handleConnectionStateChanged]);
  */

  const connectSignalR = async (userId: string, accessToken?: string): Promise<boolean> => {
    // TODO: Implement SignalR connection
    // API Endpoint: SignalR Hub Connection
    // Parameters:
    // - userId: string
    // - accessToken: string (optional)
    // Returns: Promise<boolean> indicating connection success
    setIsConnected(true);
    return true;
  };

  const disconnectSignalR = async (): Promise<void> => {
    // TODO: Implement SignalR disconnection
    // API Endpoint: SignalR Hub Disconnection
    // No parameters required
    setIsConnected(false);
  };

  const sendMessage = async (receiverId: string, content: string): Promise<boolean> => {
    // TODO: Implement message sending
    // API Endpoint: POST /api/messages
    // Request Body: { receiverId: string, content: string }
    // Response: { success: boolean, messageId: string }
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'current-user',
      receiverId,
      content,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setMessages(prev => [...prev, newMessage]);
    return true;
  };

  const markChatAsRead = (userId: string) => {
    // TODO: Implement marking messages as read
    // API Endpoint: PUT /api/messages/read
    // Request Body: { userId: string }
    // Response: { success: boolean }
    setMessages(prev =>
      prev.map(m =>
        m.senderId === userId && m.receiverId === 'current-user'
          ? { ...m, read: true }
          : m
      )
    );
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        chatUsers,
        unreadCount,
        activeChat,
        isConnected,
        connectionError,
        sendMessage,
        setActiveChat,
        markChatAsRead,
        connectSignalR,
        disconnectSignalR,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

