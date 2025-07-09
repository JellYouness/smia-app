import { NextPage } from 'next';
import withAuth, { AUTH_MODE } from '@modules/auth/hocs/withAuth';
import Routes from '@common/defs/routes';
import {
  Box,
  Grid,
  Typography,
  Button,
  Stack,
  Paper,
  Container,
  CircularProgress,
  useTheme,
} from '@mui/material';
import useAuth from '@modules/auth/hooks/api/useAuth';
import { Edit } from '@mui/icons-material';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import ApiRoutes from '@common/defs/api-routes';
import Skeleton from '@mui/material/Skeleton';
import { Any } from '@common/defs/types';
import { Sidebar, MainContent } from '@modules/users/components';

const MyProfile: NextPage = () => {
  const { user, initialized } = useAuth();
  const { t } = useTranslation(['common', 'user']);
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [profilePicture, setProfilePicture] = useState<string | null>(
    user?.profile?.profile_picture || null
  );

  // Update profile picture when user data changes
  useEffect(() => {
    if (user?.profile?.profile_picture) {
      setProfilePicture(user.profile.profile_picture);
    }
  }, [user?.profile?.profile_picture]);

  // Get the mutate function from SWR to update user data
  const { mutate } = useSWR(ApiRoutes.Auth.Me);

  const handleUploadPicture = async (file: File) => {
    // Implementation for uploading profile picture
    console.log('Uploading file:', file);
  };

  const handleDeletePicture = async () => {
    // Implementation for deleting profile picture
    console.log('Deleting profile picture');
  };

  const handleEditProfile = () => {
    router.push(Routes.Users.EditProfile);
  };

  // Show loading state while auth is initializing
  if (!initialized) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: 'grey.50',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Show loading state if user data is not available yet
  if (!user) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', py: 4 }}>
        <Container maxWidth="xl">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
            </Grid>
            <Grid item xs={12} md={8}>
              <Stack spacing={3}>
                <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
                <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
                <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'white', py: 4 }}>
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          <Grid
            item
            xs={12}
            md={4}
            sx={{ borderRight: `1px solid ${theme.palette.divider}`, pr: 4 }}
          >
            <Sidebar
              user={user}
              profilePicture={profilePicture}
              handleUploadPicture={handleUploadPicture}
              handleDeletePicture={handleDeletePicture}
            />
          </Grid>
          <Grid item xs={12} md={8} sx={{ pl: '0 !important' }}>
            <MainContent user={user} t={t} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default withAuth(MyProfile, { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login });

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['user', 'common', 'topbar'])),
  },
});
