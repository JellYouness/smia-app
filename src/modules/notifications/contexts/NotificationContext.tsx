import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import Pusher from 'pusher-js';
import useAuth from '@modules/auth/hooks/api/useAuth';
import { Notification } from '../defs/types';

interface NotificationContextType {
  isConnected: boolean;
  unreadCount: number;
  updateUnreadCount: (count: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [pusher, setPusher] = useState<Pusher | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) {
      return;
    }

    // Initialize Pusher
    const pusherInstance = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY || '', {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'mt1',
      authEndpoint: `${process.env.NEXT_PUBLIC_API_URL}/broadcasting/auth`,
      auth: {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      },
    });

    pusherInstance.connection.bind('connected', () => {
      setIsConnected(true);
    });

    pusherInstance.connection.bind('disconnected', () => {
      setIsConnected(false);
    });

    // Subscribe to user-specific channel for notification events
    const userChannel = pusherInstance.subscribe(`private-user.${user.id}`);

    // Handle new notification received
    const handleNotificationReceived = (data: {
      notification: Notification;
      unread_count: number;
    }) => {
      window.dispatchEvent(
        new CustomEvent('notification:received', {
          detail: { notification: data.notification, unreadCount: data.unread_count },
        })
      );
      setUnreadCount(data.unread_count);
    };

    // Handle notification read
    const handleNotificationRead = (data: { notification_id: string; unread_count: number }) => {
      window.dispatchEvent(
        new CustomEvent('notification:read', {
          detail: { notificationId: data.notification_id, unreadCount: data.unread_count },
        })
      );
      setUnreadCount(data.unread_count);
    };

    // Handle notification deleted
    const handleNotificationDeleted = (data: { notification_id: string; unread_count: number }) => {
      window.dispatchEvent(
        new CustomEvent('notification:deleted', {
          detail: { notificationId: data.notification_id, unreadCount: data.unread_count },
        })
      );
      setUnreadCount(data.unread_count);
    };

    userChannel.bind('notification.received', handleNotificationReceived);
    userChannel.bind('notification.read', handleNotificationRead);
    userChannel.bind('notification.deleted', handleNotificationDeleted);

    setPusher(pusherInstance);

    return () => {
      userChannel.unbind('notification.received', handleNotificationReceived);
      userChannel.unbind('notification.read', handleNotificationRead);
      userChannel.unbind('notification.deleted', handleNotificationDeleted);
      pusherInstance.unsubscribe(`private-user.${user.id}`);
      pusherInstance.disconnect();
    };
  }, [user]);

  const updateUnreadCount = useCallback((count: number) => {
    setUnreadCount(count);
  }, []);

  const value: NotificationContextType = useMemo(
    () => ({
      isConnected,
      unreadCount,
      updateUnreadCount,
    }),
    [isConnected, unreadCount, updateUnreadCount]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
};
