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
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Notification, NotificationType } from '../defs/types';
import { useMarkAsRead, useDeleteNotification } from '../hooks/useNotifications';

dayjs.extend(relativeTime);

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
  const { markAsRead, loading: markAsReadLoading } = useMarkAsRead();
  const { deleteNotification, loading: deleteLoading } = useDeleteNotification();

  const handleMarkAsRead = async () => {
    if (!notification.readAt) {
      await markAsRead(notification.id.toString(), onMarkAsRead);
    }
  };

  const handleDelete = async () => {
    await deleteNotification(notification.id.toString(), onDelete);
  };

  const getNotificationTitle = () => {
    return notification.data.title || notification.data.message || 'Notification';
  };

  const getNotificationMessage = () => {
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
              {dayjs(notification.createdAt).fromNow()}
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
