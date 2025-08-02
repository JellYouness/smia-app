import { NextPage } from 'next';
import withAuth, { AUTH_MODE } from '@modules/auth/hocs/withAuth';
import Routes from '@common/defs/routes';
import { Box, Grid, Stack, Container, CircularProgress } from '@mui/material';
import useAuth from '@modules/auth/hooks/api/useAuth';
import { useTranslation } from 'react-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Skeleton from '@mui/material/Skeleton';
import ClientProfile from '@modules/clients/components/client-profile/ClientProfile';
import CreatorProfile from '@modules/creators/components/creator-profle/CreatorProfile';
import AdminProfile from '@modules/admins/components/admin-profile/AdminProfile';

const MyProfile: NextPage = () => {
  const { user, initialized } = useAuth();
  const { t } = useTranslation(['common', 'user']);
  // Determine user type based on userType field (more reliable than roles)
  const isClient = user?.userType === 'CLIENT' || user?.client;
  const isCreator = user?.userType === 'CREATOR' || user?.creator;
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

  return (
    <Box>
      {isClient && <ClientProfile user={user} t={t} />}
      {isCreator && <CreatorProfile user={user} t={t} />}
      {isAdmin && <AdminProfile user={user} t={t} />}
    </Box>
  );
};

export default withAuth(MyProfile, { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login });

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['user', 'common', 'topbar', 'notifications'])),
  },
});
