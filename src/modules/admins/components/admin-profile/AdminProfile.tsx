import { Sidebar, MainContent } from '@modules/users/components';
import { Box, Grid } from '@mui/material';
import React from 'react';
import { User } from '@modules/users/defs/types';
import { useTheme } from '@mui/material/styles';
import { TFunction } from 'i18next';
import ProfileHeader from '@modules/admins/components/admin-profile/partials/ProfileHeader';

interface AdminProfileProps {
  user: User;
  t: TFunction;
}
const AdminProfile = ({ user, t }: AdminProfileProps) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        minHeight: '100vh',
        maxWidth: { xs: '100%', md: '90%', lg: '80%' },
        margin: '0 auto',
        pt: 4,
      }}
    >
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <ProfileHeader user={user} t={t} />
        </Grid>
        <Grid
          item
          xs={12}
          md={4}
          sx={{
            borderRight: { xs: 'none', md: `1px solid ${theme.palette.divider}` },
            borderBottom: `1px solid ${theme.palette.divider}`,
            pb: 2,
          }}
        >
          <Sidebar user={user} />
        </Grid>
        <Grid
          item
          xs={12}
          md={8}
          sx={{ pl: { xs: 0, md: '0 !important' }, pt: { xs: 0, md: '0 !important' } }}
        >
          <MainContent user={user} t={t} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminProfile;
