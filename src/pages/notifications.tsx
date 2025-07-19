import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  List,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Pagination,
  Stack,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import {
  useNotifications,
  useMarkAllAsRead,
  useNotificationTypes,
} from '@modules/notifications/hooks/useNotifications';
import { NotificationItem } from '@modules/notifications/components/NotificationItem';
import { NotificationFilters } from '@modules/notifications/defs/types';
import { useTranslation } from 'react-i18next';
import { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import withAuth, { AUTH_MODE } from '@modules/auth/hocs/withAuth';
import Routes from '@common/defs/routes';

const NotificationsPage: NextPage = () => {
  const { t } = useTranslation(['notifications']);
  const [filters, setFilters] = useState<NotificationFilters>({
    perPage: 20,
    page: 1,
  });

  const {
    data: notificationsData,
    isLoading,
    error,
    refetch: refetchNotifications,
  } = useNotifications(filters);
  const { data: typesData } = useNotificationTypes();
  const { mutate: markAllAsRead, isPending: markAllLoading } = useMarkAllAsRead();

  const notifications = notificationsData?.notifications || [];
  const pagination = notificationsData?.pagination;
  const unreadCount = notificationsData?.unreadCount || 0;
  const types = typesData?.data || [];

  const handleFilterChange = (key: keyof NotificationFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filters change
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleMarkAllAsRead = async () => {
    markAllAsRead();
  };

  const handleNotificationAction = () => {
    refetchNotifications();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <NotificationsIcon sx={{ fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            {t('notifications:title', 'Notifications')}
          </Typography>
          {unreadCount > 0 && <Chip label={`${unreadCount} unread`} color="primary" size="small" />}
        </Box>
        <Typography variant="body1" color="text.secondary">
          {t(
            'notifications:description',
            'Stay updated with all your notifications and activities'
          )}
        </Typography>
      </Box>

      {/* Filters and Actions */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>{t('notifications:filter_by_type', 'Type')}</InputLabel>
              <Select
                value={filters.type || ''}
                onChange={(e) => handleFilterChange('type', e.target.value || undefined)}
                label={t('notifications:filter_by_type', 'Type')}
              >
                <MenuItem value="">{t('notifications:all_types', 'All Types')}</MenuItem>
                {types.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>{t('notifications:filter_by_status', 'Status')}</InputLabel>
              <Select
                value={filters.read === undefined ? '' : filters.read.toString()}
                onChange={(e) =>
                  handleFilterChange(
                    'read',
                    e.target.value === '' ? undefined : e.target.value === 'true'
                  )
                }
                label={t('notifications:filter_by_status', 'Status')}
              >
                <MenuItem value="">{t('notifications:all_status', 'All')}</MenuItem>
                <MenuItem value="false">{t('notifications:unread', 'Unread')}</MenuItem>
                <MenuItem value="true">{t('notifications:read', 'Read')}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>{t('notifications:per_page', 'Per Page')}</InputLabel>
              <Select
                value={filters.perPage || 20}
                onChange={(e) => handleFilterChange('perPage', e.target.value)}
                label={t('notifications:per_page', 'Per Page')}
              >
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Stack direction="row" spacing={1}>
              {unreadCount > 0 && (
                <Button
                  variant="outlined"
                  startIcon={<CheckCircleIcon />}
                  onClick={handleMarkAllAsRead}
                  disabled={markAllLoading}
                  size="small"
                >
                  {t('notifications:mark_all_read', 'Mark All Read')}
                </Button>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Notifications List */}
      <Paper>
        {(() => {
          if (isLoading) {
            return (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            );
          }
          if (error) {
            return (
              <Alert severity="error" sx={{ m: 2 }}>
                {t('notifications:error_loading', 'Failed to load notifications')}
              </Alert>
            );
          }
          if (notifications.length === 0) {
            return (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <NotificationsIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                  {t('notifications:no_notifications', 'No notifications')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t(
                    'notifications:no_notifications_description',
                    "You don't have any notifications yet"
                  )}
                </Typography>
              </Box>
            );
          }
          return (
            <>
              <List sx={{ p: 0 }}>
                {notifications.map((notification, index) => (
                  <React.Fragment key={notification.id}>
                    <NotificationItem
                      notification={notification}
                      onMarkAsRead={handleNotificationAction}
                      onDelete={handleNotificationAction}
                    />
                    {index < notifications.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>

              {/* Pagination */}
              {pagination && pagination.lastPage > 1 && (
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                  <Pagination
                    count={pagination.lastPage}
                    page={pagination.currentPage}
                    onChange={(_, page) => handlePageChange(page)}
                    color="primary"
                    showFirstButton
                    showLastButton
                  />
                </Box>
              )}
            </>
          );
        })()}
      </Paper>
    </Container>
  );
};

export default withAuth(NotificationsPage, {
  mode: AUTH_MODE.LOGGED_IN,
  redirectUrl: Routes.Auth.Login,
});

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['notifications', 'common', 'topbar'])),
  },
});
