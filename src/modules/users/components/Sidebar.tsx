import React from 'react';
import { Box, Stack, Typography, Chip, Divider } from '@mui/material';
import { Person, AccessTime, CheckCircle, Cancel } from '@mui/icons-material';
import { Any } from '@common/defs/types';
import { useTranslation } from 'react-i18next';

interface SidebarProps {
  user: Any;
}

const Sidebar = ({ user }: SidebarProps) => {
  const { t } = useTranslation();

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return <CheckCircle fontSize="medium" color="primary" />;
      case 'inactive':
        return <Cancel fontSize="medium" color="error" />;
      default:
        return <Person fontSize="medium" color="primary" />;
    }
  };

  return (
    <Stack spacing={2}>
      {/* User Avatar and Email */}
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          {user?.email}
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* User Details */}
      <Stack
        spacing={2}
        flexDirection={{ xs: 'row', md: 'column' }}
        justifyContent={{ xs: 'space-around', md: 'flex-start' }}
        alignItems={{ xs: 'center', md: 'flex-start' }}
        sx={{
          ml: { xs: 0, md: '3rem !important' },
        }}
      >
        {/* Role */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Person fontSize="medium" color="primary" />
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              {t('user:role', 'Role')}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {user?.rolesNames?.join(', ') || t('user:no_role', 'No role assigned')}
            </Typography>
          </Box>
        </Box>

        {/* Status */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {getStatusIcon(user?.status)}
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              {t('user:status', 'Status')}
            </Typography>
            <Chip
              label={user?.status || t('user:unknown', 'Unknown')}
              color={getStatusColor(user?.status)}
              size="small"
              variant="outlined"
              sx={{
                fontWeight: 900,
                fontSize: '0.75rem',
              }}
            />
          </Box>
        </Box>

        {/* Last Login */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <AccessTime fontSize="medium" color="primary" />
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              {t('user:last_login', 'Last login')}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {user?.lastLogin ? user.lastLogin : t('user:never', 'Never')}
            </Typography>
          </Box>
        </Box>
      </Stack>
    </Stack>
  );
};

export default Sidebar;
