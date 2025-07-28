import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { Any } from '@common/defs/types';
import { useTranslation } from 'react-i18next';

interface SidebarProps {
  user: Any;
}

const Sidebar = ({ user }: SidebarProps) => {
  const { t } = useTranslation();
  return (
    <>
      <Stack spacing={3}>
        <Box sx={{ p: 3, textAlign: 'center' }}>
          {/* Email */}
          <Typography variant="body2" sx={{ mt: 1 }}>
            {user?.email}
          </Typography>
          {/* Role */}
          <Typography variant="body2" sx={{ mt: 1 }}>
            <strong>{t('user:role', 'Role')}:</strong> {user?.rolesNames?.join(', ')}
          </Typography>
          {/* Status */}
          <Typography variant="body2" sx={{ mt: 1 }}>
            <strong>{t('user:status', 'Status')}:</strong> {user?.status}
          </Typography>
          {/* Last Login */}
          <Typography variant="body2" sx={{ mt: 1 }}>
            <strong>{t('user:last_login', 'Last login')}:</strong>{' '}
            {user?.lastLogin ? user.lastLogin : t('user:never', 'Never')}
          </Typography>
        </Box>
      </Stack>
    </>
  );
};

export default Sidebar;
