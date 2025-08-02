import { Box, Grid } from '@mui/material';
import { TFunction } from 'i18next';
import React from 'react';
import ClientMainContent from './ClientMainContent';
import ClientSidebar from './ClientSidebar';
import { User } from '@modules/users/defs/types';
import ProfileHeader from './partials/ProfileHeader';

interface ClientProfileProps {
  user: User;
  t: TFunction;
  readOnly?: boolean;
}

const ClientProfile = ({ user, t, readOnly = false }: ClientProfileProps) => {
  // const theme = useTheme();
  return (
    <Box
      sx={{
        minHeight: '100vh',
        maxWidth: { xs: '100%', sm: '90%', lg: '80%' },
        margin: '0 auto',
      }}
    >
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <ProfileHeader user={user} t={t} isUserProfile />
        </Grid>
        <Grid
          item
          xs={12}
          md={4}
          sx={
            {
              // borderRight: { xs: 'none', md: `1px solid ${theme.palette.divider}` },
            }
          }
        >
          <ClientSidebar user={user} readOnly={readOnly} />
        </Grid>
        <Grid
          item
          xs={12}
          md={8}
          // sx={{ pl: { xs: 0, md: '0 !important' }, pt: { xs: 0, md: '0 !important' } }}
        >
          <ClientMainContent user={user} t={t} readOnly={readOnly} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ClientProfile;
