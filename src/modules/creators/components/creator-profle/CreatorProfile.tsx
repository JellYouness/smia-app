import { Box, Grid } from '@mui/material';
import { TFunction } from 'i18next';
import React from 'react';
import CreatorAndAmbassadorMainContent from './CreatorAndAmbassadorMainContent';
import CreatorMainContent from './CreatorMainContent';
import CreatorSidebar from './CreatorSidebar';
import { useTheme } from '@mui/material/styles';
import { User } from '@modules/users/defs/types';
import ProfileHeader from './partials/ProfileHeader';
import { Creator } from '@modules/creators/defs/types';

interface CreatorProfileProps {
  user: User;
  t: TFunction;
}

const CreatorProfile = ({ user, t }: CreatorProfileProps) => {
  const theme = useTheme();
  const isAmbassador = user?.ambassador;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        maxWidth: { xs: '100%', sm: '90%', lg: '80%' },
        margin: '0 auto',
        bgcolor: 'white',
      }}
    >
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <ProfileHeader user={user} creator={user?.creator as Creator} isUserProfile t={t} />
        </Grid>
        <Grid
          item
          xs={12}
          md={4}
          sx={{
            borderRight: { xs: 'none', md: `1px solid ${theme.palette.divider}` },
          }}
        >
          <CreatorSidebar user={user} />
        </Grid>
        <Grid
          item
          xs={12}
          md={8}
          sx={{ pl: { xs: 0, md: '0 !important' }, pt: { xs: 0, md: '0 !important' } }}
        >
          {isAmbassador ? (
            <CreatorAndAmbassadorMainContent user={user} t={t} />
          ) : (
            <CreatorMainContent user={user} t={t} />
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreatorProfile;
