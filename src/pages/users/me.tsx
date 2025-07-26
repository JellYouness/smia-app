import { NextPage } from 'next';
import withAuth, { AUTH_MODE } from '@modules/auth/hocs/withAuth';
import Routes from '@common/defs/routes';
import { Box, Grid, Stack, Container, CircularProgress, useTheme } from '@mui/material';
import useAuth from '@modules/auth/hooks/api/useAuth';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Skeleton from '@mui/material/Skeleton';
import { ClientSidebar, ClientMainContent, MainContent } from '@modules/users/components';
import AmbassadorMainContent from '@modules/ambassadors/components/AmbassadorMainContent';
import CreatorMainContent from '@modules/creators/components/CreatorProfle/CreatorMainContent';
import CreatorSidebar from '@modules/creators/components/CreatorProfle/CreatorSidebar';
import Sidebar from '@modules/users/components/Sidebar';
import CreatorAndAmbassadorMainContent from '@modules/creators/components/CreatorProfle/CreatorAndAmbassadorMainContent';

const MyProfile: NextPage = () => {
  const { user, initialized } = useAuth();
  const { t } = useTranslation(['common', 'user']);
  const theme = useTheme();
  const [profilePicture, setProfilePicture] = useState<string | null>(
    user?.profile?.profile_picture || null
  );

  // Update profile picture when user data changes
  useEffect(() => {
    if (user?.profile?.profile_picture) {
      setProfilePicture(user.profile.profile_picture);
    }
  }, [user?.profile?.profile_picture]);

  const handleUploadPicture = async (file: File) => {
    // Implementation for uploading profile picture
    console.log('Uploading file:', file);
  };

  const handleDeletePicture = async () => {
    // Implementation for deleting profile picture
    console.log('Deleting profile picture');
  };

  // Determine user type based on userType field (more reliable than roles)
  const isClient = user?.userType === 'CLIENT' || user?.client;
  const isCreator = user?.userType === 'CREATOR' || user?.creator;
  const isCreatorAndAmbassador = isCreator && user?.ambassador;
  const isAmbassador = user?.userType === 'AMBASSADOR' || user?.ambassador;
  const isAdmin =
    user?.userType === 'ADMIN' || user?.userType === 'SUPERADMIN' || user?.systemAdministrator;

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

  // Determine which components to use based on user type
  // const SidebarComponent = isClient ? ClientSidebar : Sidebar;
  // const MainContentComponent = isClient
  //   ? ClientMainContent
  //   : isCreator
  //   ? CreatorMainContent
  //   : isAmbassador
  //   ? AmbassadorMainContent
  //   : MainContent;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        maxWidth: { xs: '100%', md: '90%', lg: '80%' },
        margin: '0 auto',
        bgcolor: 'white',
        pt: 4,
        border: `2px solid ${theme.palette.divider}`,
      }}
    >
      {/* <Container maxWidth="xl"> */}
      <Grid container spacing={4}>
        <Grid
          item
          xs={12}
          md={4}
          sx={{
            borderRight: { xs: 'none', md: `1px solid ${theme.palette.divider}` },
            // pr: { xs: 0, md: 4 },
          }}
        >
          {/* <SidebarComponent
            user={user}
            profilePicture={profilePicture}
            handleUploadPicture={handleUploadPicture}
            handleDeletePicture={handleDeletePicture}
          /> */}
          {isClient && (
            <ClientSidebar
              user={user}
              profilePicture={profilePicture}
              handleUploadPicture={handleUploadPicture}
              handleDeletePicture={handleDeletePicture}
            />
          )}
          {isCreator && (
            <CreatorSidebar
              user={user}
              profilePicture={profilePicture}
              handleUploadPicture={handleUploadPicture}
              handleDeletePicture={handleDeletePicture}
            />
          )}
          {/* {isAmbassador && <AmbassadorSidebar user={user} t={t} />} */}
          {isAdmin && (
            <Sidebar
              user={user}
              profilePicture={profilePicture}
              handleUploadPicture={handleUploadPicture}
              handleDeletePicture={handleDeletePicture}
            />
          )}
        </Grid>
        <Grid
          item
          xs={12}
          md={8}
          sx={{ pl: { xs: 0, md: '0 !important' }, pt: { xs: 0, md: '0 !important' } }}
        >
          {/* Show profile completeness warning if not 100% */}
          {!isAdmin && user?.profile?.profileCompleteness !== 100 && (
            <Box sx={{ mt: 2, px: 2, mx: 'auto', maxWidth: 800 }}>
              <Stack
                direction="row"
                alignItems="center"
                spacing={2}
                sx={{
                  p: 2,
                  bgcolor: 'warning.light',
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.warning.main}`,
                }}
              >
                <Box sx={{ fontWeight: 600, color: 'warning.dark', flex: 1 }}>
                  {t('user:profile_completion_info')}
                </Box>
              </Stack>
            </Box>
          )}
          {/* <MainContentComponent user={user} t={t} /> */}
          {isClient && <ClientMainContent user={user} t={t} />}
          {isAdmin && <MainContent user={user} t={t} />}
          {isCreatorAndAmbassador && <CreatorAndAmbassadorMainContent user={user} t={t} />}
          {isCreator && !isCreatorAndAmbassador && <CreatorMainContent user={user} t={t} />}
          {isAmbassador && !isCreatorAndAmbassador && <AmbassadorMainContent user={user} t={t} />}
        </Grid>
      </Grid>
      {/* </Container> */}
    </Box>
  );
};

export default withAuth(MyProfile, { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login });

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['user', 'common', 'topbar', 'notifications'])),
  },
});
