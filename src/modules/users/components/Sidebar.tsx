import React from 'react';
import { Box, Stack, Typography, Divider } from '@mui/material';
import { Any } from '@common/defs/types';
import UserProfileHeader from '@common/components/UserProfileHeader';
import { useTranslation } from 'react-i18next';

interface SidebarProps {
  user: Any;
  profilePicture: string | null;
  handleUploadPicture: (file: File) => Promise<void>;
  handleDeletePicture: () => Promise<void>;
}

const Sidebar = ({
  user,
  profilePicture,
  handleUploadPicture,
  handleDeletePicture,
}: SidebarProps) => {
  const { t } = useTranslation();
  return (
    <>
      <Stack spacing={3}>
        <Box sx={{ p: 3, textAlign: 'center' }}>
          {/* Profile Picture */}
          <UserProfileHeader
            profilePicture={profilePicture}
            firstName={user?.firstName}
            lastName={user?.lastName}
            city={user?.profile?.city}
            country={user?.profile?.country}
            onUploadPicture={handleUploadPicture}
            onDeletePicture={handleDeletePicture}
            userRole="admin"
            user={user}
          />
          <Divider sx={{ my: 2 }} />
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
