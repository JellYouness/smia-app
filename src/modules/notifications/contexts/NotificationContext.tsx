import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useUnreadCount } from '../hooks/useNotifications';
import { NotificationType } from '../defs/types';

interface NotificationContextType {
  unreadCount: number;
  refreshUnreadCount: () => void;
  showNotification: (type: NotificationType, message: string, data?: Record<string, any>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const { data: unreadCountData, refetch } = useUnreadCount();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (unreadCountData?.unreadCount !== undefined) {
      setUnreadCount(unreadCountData.unreadCount);
    }
  }, [unreadCountData]);

  const refreshUnreadCount = () => {
    refetch();
  };

  const showNotification = (
    type: NotificationType,
    message: string,
    data?: Record<string, any>
  ) => {
    // This could be used to show toast notifications or trigger other UI updates
    console.log('Notification:', { type, message, data });
    // TODO: Integrate with toast notification system
  };

  const value: NotificationContextType = useMemo(
    () => ({
      unreadCount,
      refreshUnreadCount,
      showNotification,
    }),
    [unreadCount, refreshUnreadCount, showNotification]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};
