// SignalR service implementation - commented out for now
/*
import * as signalR from '@microsoft/signalr';

export type SignalRMessage = {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
};

export type SignalRUser = {
  id: string;
  username: string;
  avatar: string;
  online: boolean;
};

export class SignalRService {
  private connection: signalR.HubConnection | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // Start with 1 second

  // Event handlers
  private onMessageReceived: ((message: SignalRMessage) => void) | null = null;
  private onUserStatusChanged: ((user: SignalRUser) => void) | null = null;
  private onConnectionStateChanged: ((connected: boolean) => void) | null = null;

  constructor(hubUrl: string) {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext) => {
          if (retryContext.previousRetryCount < this.maxReconnectAttempts) {
            return Math.min(1000 * Math.pow(2, retryContext.previousRetryCount), 30000);
          }
          return null; // Stop retrying
        },
      })
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    if (!this.connection) return;

    // Handle incoming messages
    this.connection.on('ReceiveMessage', (message: SignalRMessage) => {
      if (this.onMessageReceived) {
        this.onMessageReceived(message);
      }
    });

    // Handle user status changes
    this.connection.on('UserStatusChanged', (user: SignalRUser) => {
      if (this.onUserStatusChanged) {
        this.onUserStatusChanged(user);
      }
    });

    // Handle connection state changes
    this.connection.onclose((error) => {
      this.isConnected = false;
      console.log('SignalR connection closed:', error);
      if (this.onConnectionStateChanged) {
        this.onConnectionStateChanged(false);
      }
    });

    this.connection.onreconnecting((error) => {
      console.log('SignalR reconnecting:', error);
      if (this.onConnectionStateChanged) {
        this.onConnectionStateChanged(false);
      }
    });

    this.connection.onreconnected((connectionId) => {
      this.isConnected = true;
      this.reconnectAttempts = 0;
      console.log('SignalR reconnected:', connectionId);
      if (this.onConnectionStateChanged) {
        this.onConnectionStateChanged(true);
      }
    });
  }

  async connect(userId: string, accessToken?: string): Promise<boolean> {
    if (!this.connection) return false;

    try {
      await this.connection.start();
      this.isConnected = true;
      this.reconnectAttempts = 0;

      // Join user to their personal group for receiving messages
      await this.connection.invoke('JoinUserGroup', userId);

      console.log('SignalR connected successfully');
      if (this.onConnectionStateChanged) {
        this.onConnectionStateChanged(true);
      }

      return true;
    } catch (error) {
      console.error('SignalR connection failed:', error);
      this.isConnected = false;
      if (this.onConnectionStateChanged) {
        this.onConnectionStateChanged(false);
      }
      return false;
    }
  }

  async disconnect(): Promise<void> {
    if (this.connection && this.isConnected) {
      try {
        await this.connection.stop();
        this.isConnected = false;
        console.log('SignalR disconnected');
        if (this.onConnectionStateChanged) {
          this.onConnectionStateChanged(false);
        }
      } catch (error) {
        console.error('Error disconnecting SignalR:', error);
      }
    }
  }

  async sendMessage(receiverId: string, content: string): Promise<boolean> {
    if (!this.connection || !this.isConnected) {
      console.error('SignalR not connected');
      return false;
    }

    try {
      await this.connection.invoke('SendMessage', receiverId, content);
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  }

  async markMessageAsRead(messageId: string): Promise<boolean> {
    if (!this.connection || !this.isConnected) {
      console.error('SignalR not connected');
      return false;
    }

    try {
      await this.connection.invoke('MarkMessageAsRead', messageId);
      return true;
    } catch (error) {
      console.error('Error marking message as read:', error);
      return false;
    }
  }

  async updateUserStatus(online: boolean): Promise<boolean> {
    if (!this.connection || !this.isConnected) {
      console.error('SignalR not connected');
      return false;
    }

    try {
      await this.connection.invoke('UpdateUserStatus', online);
      return true;
    } catch (error) {
      console.error('Error updating user status:', error);
      return false;
    }
  }

  // Event handler setters
  setOnMessageReceived(handler: (message: SignalRMessage) => void) {
    this.onMessageReceived = handler;
  }

  setOnUserStatusChanged(handler: (user: SignalRUser) => void) {
    this.onUserStatusChanged = handler;
  }

  setOnConnectionStateChanged(handler: (connected: boolean) => void) {
    this.onConnectionStateChanged = handler;
  }

  // Getters
  getConnectionState(): boolean {
    return this.isConnected;
  }

  getConnectionId(): string | null {
    return this.connection?.connectionId || null;
  }
}

// Singleton instance
let signalRService: SignalRService | null = null;

export const getSignalRService = (hubUrl?: string): SignalRService => {
  if (!signalRService && hubUrl) {
    signalRService = new SignalRService(hubUrl);
  }
  if (!signalRService) {
    throw new Error('SignalR service not initialized. Provide hubUrl on first call.');
  }
  return signalRService;
};

export const initializeSignalR = (hubUrl: string): SignalRService => {
  signalRService = new SignalRService(hubUrl);
  return signalRService;
};
*/

// Temporary mock implementation for development
export type SignalRMessage = {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
};

export type SignalRUser = {
  id: string;
  username: string;
  avatar: string;
  online: boolean;
};

// Mock service that does nothing
export const getSignalRService = (hubUrl?: string) => {
  return {
    connect: async () => true,
    disconnect: async () => {},
    sendMessage: async () => true,
    markMessageAsRead: async () => true,
    updateUserStatus: async () => true,
    setOnMessageReceived: () => {},
    setOnUserStatusChanged: () => {},
    setOnConnectionStateChanged: () => {},
    getConnectionState: () => true,
    getConnectionId: () => null,
  };
};

