import { createContext, useContext, useState, ReactNode } from "react";
import { useAuth } from "./AuthContext";

export interface Notification {
  id: string;
  type: "system" | "interaction" | "update";
  message: string;
  read: boolean;
  timestamp: string;
  link?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (
    notification: Omit<Notification, "id" | "timestamp">
  ) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "interaction",
      message: "Waleed commented on your post",
      read: false,
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      link: "/post/1",
    },
    {
      id: "2",
      type: "system",
      message: "Welcome to YAM! Complete your profile to get started.",
      read: false,
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      link: user?.id ? `/profile/${user.id}` : undefined,
    },
    {
      id: "3",
      type: "update",
      message: "Amr started following you",
      read: false,
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      link: "/profile/amr",
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const addNotification = (
    notification: Omit<Notification, "id" | "timestamp">
  ) => {
    const newNotification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
