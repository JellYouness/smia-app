import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  LinearProgress,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  People,
  Star,
  Group,
  School,
  Work,
  RateReview,
  CheckCircle,
  Warning,
  Error,
  Refresh,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAdminDashboard } from '../hooks/useAdminDashboard';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';

const AdminDashboard = () => {
  const { t } = useTranslation(['admin', 'common']);
  const theme = useTheme();
  const router = useRouter();
  const { data: stats, isLoading, error, refetch } = useAdminDashboard();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_registration':
        return <People />;
      case 'project_created':
        return <Work />;
      case 'application_submitted':
        return <RateReview />;
      default:
        return <DashboardIcon />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'user_registration':
        return 'primary';
      case 'project_created':
        return 'success';
      case 'application_submitted':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getSystemHealthColor = (uptime: number) => {
    if (uptime >= 99.5) {
      return 'success';
    }
    if (uptime >= 95) {
      return 'warning';
    }
    return 'error';
  };

  const getSystemHealthIcon = (uptime: number) => {
    if (uptime >= 99.5) {
      return <CheckCircle />;
    }
    if (uptime >= 95) {
      return <Warning />;
    }
    return <Error />;
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
        <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
          {t('common:loading', 'Loading dashboard...')}
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error" variant="h6">
          {t('common:error_loading_dashboard', 'Error loading dashboard')}
        </Typography>
        <IconButton onClick={() => refetch()} sx={{ mt: 1 }}>
          <Refresh />
        </IconButton>
      </Box>
    );
  }

  if (!stats) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          {t('admin:no_data_available', 'No data available')}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" fontWeight="bold" color="primary">
          {t('admin:dashboard_title', 'Admin Dashboard')}
        </Typography>
        <Tooltip title={t('common:refresh', 'Refresh')}>
          <IconButton onClick={() => refetch()}>
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: `linear-gradient(135deg, ${alpha(
                theme.palette.primary.main,
                0.1
              )} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <People />
                </Avatar>
                <Typography variant="h4" fontWeight="bold">
                  {stats.totalUsers.toLocaleString()}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {t('admin:total_users', 'Total Users')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: `linear-gradient(135deg, ${alpha(
                theme.palette.success.main,
                0.1
              )} 0%, ${alpha(theme.palette.success.main, 0.05)} 100%)`,
              border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <Star />
                </Avatar>
                <Typography variant="h4" fontWeight="bold">
                  {stats.totalCreators.toLocaleString()}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {t('admin:total_creators', 'Total Creators')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: `linear-gradient(135deg, ${alpha(
                theme.palette.info.main,
                0.1
              )} 0%, ${alpha(theme.palette.info.main, 0.05)} 100%)`,
              border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                  <Group />
                </Avatar>
                <Typography variant="h4" fontWeight="bold">
                  {stats.totalClients.toLocaleString()}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {t('admin:total_clients', 'Total Clients')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: `linear-gradient(135deg, ${alpha(
                theme.palette.warning.main,
                0.1
              )} 0%, ${alpha(theme.palette.warning.main, 0.05)} 100%)`,
              border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                  <School />
                </Avatar>
                <Typography variant="h4" fontWeight="bold">
                  {stats.totalAmbassadors.toLocaleString()}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {t('admin:total_ambassadors', 'Total Ambassadors')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Projects and Applications */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                {t('admin:project_statistics', 'Project Statistics')}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2">
                  {t('admin:total_projects', 'Total Projects')}
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {stats.totalProjects.toLocaleString()}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2">
                  {t('admin:active_projects', 'Active Projects')}
                </Typography>
                <Typography variant="h6" fontWeight="bold" color="success.main">
                  {stats.activeProjects.toLocaleString()}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2">
                  {t('admin:completed_projects', 'Completed Projects')}
                </Typography>
                <Typography variant="h6" fontWeight="bold" color="primary.main">
                  {stats.completedProjects.toLocaleString()}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                {t('admin:applications', 'Applications')}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Chip
                  icon={<RateReview fontSize="small" />}
                  label={`${stats.pendingApplications} ${t(
                    'admin:pending_applications',
                    'Pending Applications'
                  )}`}
                  color="info"
                  variant="filled"
                  sx={{
                    fontSize: '1rem',
                    p: 1,
                  }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {t('admin:applications_description', 'Applications awaiting review and approval')}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  '&:hover': { textDecoration: 'underline' },
                }}
                onClick={() => router.push('/admin/applications')}
              >
                <Typography variant="body2" color="primary">
                  {t('admin:view_all_applications', 'View all applications')}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* System Health and Recent Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                {t('admin:system_health', 'System Health')}
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      color: getSystemHealthColor(stats.systemHealth.uptime),
                    }}
                  >
                    {getSystemHealthIcon(stats.systemHealth.uptime)}
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {t('admin:uptime', 'Uptime')}
                    </Typography>
                  </Box>
                  <Typography variant="h6" fontWeight="bold" sx={{ ml: 'auto' }}>
                    {stats.systemHealth.uptime}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={stats.systemHealth.uptime}
                  color={getSystemHealthColor(stats.systemHealth.uptime)}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">
                  {t('admin:active_connections', 'Active Connections')}
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {stats.systemHealth.activeConnections}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">
                  {t('admin:avg_response_time', 'Avg Response Time')}
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {stats.systemHealth.averageResponseTime}ms
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                {t('admin:recent_activity', 'Recent Activity')}
              </Typography>
              <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                {stats.recentActivity.map((activity) => (
                  <ListItem key={activity.id} sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          bgcolor: alpha(
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            theme.palette[getActivityColor(activity.type)]?.main ||
                              theme.palette.grey[500],
                            0.1
                          ),
                          color:
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            theme.palette[getActivityColor(activity.type)]?.main ||
                            theme.palette.grey[500],
                        }}
                      >
                        {getActivityIcon(activity.type)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={activity.description}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {activity.user
                              ? `${activity.user.firstName} ${activity.user.lastName}`
                              : 'System'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {dayjs(activity.timestamp).fromNow()}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
