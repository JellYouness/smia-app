import { Box, Grid, Paper } from '@mui/material';
import { TFunction } from 'i18next';
import React from 'react';
import CreatorAndAmbassadorMainContent from './CreatorAndAmbassadorMainContent';
import CreatorMainContent from './CreatorMainContent';
import CreatorSidebar from './CreatorSidebar';
import { User } from '@modules/users/defs/types';
import ProfileHeader from './partials/ProfileHeader';
import { Creator } from '@modules/creators/defs/types';
import { AmbassadorMainContent } from '@modules/users/components';

interface CreatorProfileProps {
  user: User;
  t: TFunction;
  readOnly?: boolean;
  onlyAmbassador?: boolean;
}

const CreatorProfile = ({ user, t, readOnly = false, onlyAmbassador }: CreatorProfileProps) => {
  // const theme = useTheme();
  const isAmbassador = user?.ambassador;

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
          <ProfileHeader
            user={user}
            creator={user?.creator as Creator}
            isUserProfile={!readOnly}
            t={t}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <CreatorSidebar user={user} readOnly={readOnly} />
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, borderRadius: 2 }} elevation={6}>
            {/* eslint-disable-next-line no-nested-ternary */}
            {isAmbassador && !onlyAmbassador ? (
              <CreatorAndAmbassadorMainContent user={user} t={t} readOnly={readOnly} />
            ) : onlyAmbassador ? (
              <AmbassadorMainContent user={user} t={t} readOnly={readOnly} />
            ) : (
              <CreatorMainContent user={user} t={t} readOnly={readOnly} />
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreatorProfile;
