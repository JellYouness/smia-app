import React, { useEffect } from 'react';
import {
  Menu,
  List,
  Typography,
  Box,
  Button,
  Divider,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useNotifications, useMarkAllAsRead } from '../hooks/useNotifications';
import { NotificationItem } from './NotificationItem';
import router from 'next/router';
import Routes from '@common/defs/routes';

interface NotificationDropdownProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  open: boolean;
  unreadCount: number;
  onUnreadCountChange: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  anchorEl,
  onClose,
  open,
  unreadCount,
  onUnreadCountChange,
}) => {
  const {
    data: notificationsData,
    isLoading,
    error,
    refetch: refetchNotifications,
  } = useNotifications();
  const { mutate: markAllAsRead, isPending: markAllLoading } = useMarkAllAsRead();

  const handleMarkAllAsRead = () => {
    markAllAsRead(undefined, {
      onSuccess: () => {
        refetchNotifications();
        onUnreadCountChange();
      },
    });
  };

  const handleNotificationAction = () => {
    refetchNotifications();
    onUnreadCountChange();
  };
  useEffect(() => {
    if (open) {
      refetchNotifications();
    }
  }, [open]);

  const notifications = notificationsData?.notifications || [];

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          mt: 1.5,
          minWidth: 400,
          maxWidth: 500,
          maxHeight: 600,
        },
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      {/* Header */}
      <Box sx={{ p: 2, pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Notifications
          </Typography>
          {unreadCount > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {unreadCount} unread
              </Typography>
              <Tooltip title="Mark all as read">
                <IconButton size="small" onClick={handleMarkAllAsRead} disabled={markAllLoading}>
                  <CheckCircleIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Box>
      </Box>

      <Divider />

      {/* Content */}
      <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
        {(() => {
          if (isLoading) {
            return (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress size={24} />
              </Box>
            );
          }
          if (error) {
            return (
              <Alert severity="error" sx={{ m: 2 }}>
                Failed to load notifications
              </Alert>
            );
          }
          if (notifications.length === 0) {
            return (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <NotificationsIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  No notifications
                </Typography>
              </Box>
            );
          }
          return (
            <List sx={{ p: 0 }}>
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={handleNotificationAction}
                  onDelete={handleNotificationAction}
                />
              ))}
            </List>
          );
        })()}
      </Box>

      {/* Footer */}
      {notifications.length > 0 && [
        <Divider key="footer-divider" />,
        <Box sx={{ p: 1.5 }} key="footer-box">
          <Button
            fullWidth
            variant="text"
            size="small"
            onClick={() => router.push(Routes.Notifications.Index)}
            sx={{ textTransform: 'none' }}
          >
            View all notifications
          </Button>
        </Box>,
      ]}
    </Menu>
  );
};
