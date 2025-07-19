import React from 'react';
import {
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Typography,
  Box,
  Chip,
  Tooltip,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  CheckCircle as CheckCircleIcon,
  Delete as DeleteIcon,
  Schedule as ScheduleIcon,
  Payment as PaymentIcon,
  Message as MessageIcon,
  Announcement as AnnouncementIcon,
  Person as PersonIcon,
  Send as SendIcon,
  Verified as VerifiedIcon,
  Celebration as CelebrationIcon,
  Security as SecurityIcon,
  Folder as ProjectIcon,
  Update as UpdateIcon,
  Description as DescriptionIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { Notification, NotificationType } from '../defs/types';
import { useMarkAsRead, useDeleteNotification } from '../hooks/useNotifications';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead?: () => void;
  onDelete?: () => void;
}

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case NotificationType.PROJECT_INVITE:
    case NotificationType.PROJECT_UPDATE:
    case NotificationType.PROJECT_COMPLETED:
      return <ProjectIcon />;
    case NotificationType.PROPOSAL_RECEIVED:
      return <DescriptionIcon />;
    case NotificationType.PROPOSAL_ACCEPTED:
      return <ThumbUpIcon />;
    case NotificationType.PROPOSAL_REJECTED:
      return <ThumbDownIcon />;
    case NotificationType.MESSAGE_RECEIVED:
      return <MessageIcon />;
    case NotificationType.SYSTEM_ANNOUNCEMENT:
      return <AnnouncementIcon />;
    case NotificationType.PROFILE_UPDATE:
      return <PersonIcon />;
    case NotificationType.PAYMENT_RECEIVED:
    case NotificationType.PAYMENT_SENT:
      return <PaymentIcon />;
    case NotificationType.ACCOUNT_VERIFIED:
      return <VerifiedIcon />;
    case NotificationType.WELCOME:
      return <CelebrationIcon />;
    case NotificationType.REMINDER:
      return <ScheduleIcon />;
    case NotificationType.SECURITY_ALERT:
      return <SecurityIcon />;
    default:
      return <NotificationsIcon />;
  }
};

const getNotificationColor = (type: NotificationType) => {
  switch (type) {
    case NotificationType.PROJECT_INVITE:
    case NotificationType.PROPOSAL_RECEIVED:
    case NotificationType.MESSAGE_RECEIVED:
      return 'primary';
    case NotificationType.PROPOSAL_ACCEPTED:
    case NotificationType.ACCOUNT_VERIFIED:
    case NotificationType.PAYMENT_RECEIVED:
      return 'success';
    case NotificationType.PROPOSAL_REJECTED:
    case NotificationType.SECURITY_ALERT:
      return 'error';
    case NotificationType.SYSTEM_ANNOUNCEMENT:
    case NotificationType.WELCOME:
      return 'warning';
    default:
      return 'default';
  }
};

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onDelete,
}) => {
  const { t } = useTranslation(['notifications']);
  const { mutate: markAsRead, isPending: markAsReadLoading } = useMarkAsRead();
  const { mutate: deleteNotification, isPending: deleteLoading } = useDeleteNotification();

  const handleMarkAsRead = async () => {
    if (!notification.readAt) {
      markAsRead(notification.id.toString());
      if (onMarkAsRead) {
        onMarkAsRead();
      }
    }
  };

  const handleDelete = async () => {
    deleteNotification(notification.id.toString());
    if (onDelete) {
      onDelete();
    }
  };

  const getNotificationTitle = () => {
    // Handle message notifications specifically
    if (notification.type === NotificationType.MESSAGE_RECEIVED) {
      const senderName = notification.data.sender_name;
      const conversationName = notification.data.conversation_name;

      if (senderName) {
        return t('notifications:messages.new_message_from', { sender: senderName });
      }
      if (conversationName) {
        return t('notifications:messages.new_message_in', { conversation: conversationName });
      }
      return t('notifications:messages.new_message_received');
    }

    return notification.data.title || notification.data.message || 'Notification';
  };

  const getNotificationMessage = () => {
    // Handle message notifications specifically
    if (notification.type === NotificationType.MESSAGE_RECEIVED) {
      const messagePreview = notification.data.message_preview;
      if (messagePreview) {
        return messagePreview;
      }
    }

    return notification.data.message || notification.data.description || '';
  };

  return (
    <ListItem
      sx={{
        borderBottom: '1px solid',
        borderColor: 'divider',
        backgroundColor: notification.readAt ? 'transparent' : 'action.hover',
        '&:hover': {
          backgroundColor: 'action.selected',
        },
      }}
    >
      <ListItemIcon sx={{ minWidth: 40 }}>
        <Box
          sx={{
            color: `${getNotificationColor(notification.type)}.main`,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {getNotificationIcon(notification.type)}
        </Box>
      </ListItemIcon>

      <ListItemText
        primary={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: notification.readAt ? 400 : 600,
                color: notification.readAt ? 'text.secondary' : 'text.primary',
              }}
            >
              {getNotificationTitle()}
            </Typography>
            {!notification.readAt && (
              <Chip
                label="New"
                size="small"
                color="primary"
                sx={{ height: 20, fontSize: '0.75rem' }}
              />
            )}
          </Box>
        }
        secondary={
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              {getNotificationMessage()}
            </Typography>
            <Typography variant="caption" color="text.disabled">
              {formatDistanceToNow(new Date(notification.createdAt), {
                addSuffix: true,
              })}
            </Typography>
          </Box>
        }
      />

      <Box sx={{ display: 'flex', gap: 0.5 }}>
        {!notification.readAt && (
          <Tooltip title="Mark as read">
            <IconButton size="small" onClick={handleMarkAsRead} disabled={markAsReadLoading}>
              <CheckCircleIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title="Delete">
          <IconButton size="small" onClick={handleDelete} disabled={deleteLoading} color="error">
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </ListItem>
  );
};
