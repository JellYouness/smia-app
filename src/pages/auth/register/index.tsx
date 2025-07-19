import { NextPage } from 'next';
import withAuth, { AUTH_MODE } from '@modules/auth/hocs/withAuth';
import Routes from '@common/defs/routes';
import { Card, Grid, Typography, Button, Box } from '@mui/material';
import { Business, Person } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const RegisterSelectionPage: NextPage = () => {
  const router = useRouter();
  const { t } = useTranslation(['auth', 'common']);

  const handleClientRegistration = () => {
    router.push(Routes.Auth.RegisterClient);
  };

  const handleCreatorRegistration = () => {
    router.push(Routes.Auth.RegisterCreator);
  };

  return (
    <>
      <Typography
        component="h1"
        variant="h2"
        sx={{
          marginTop: 2,
          marginBottom: 4,
          textAlign: 'center',
          fontWeight: 'bold',
        }}
      >
        {t('auth:choose_registration_type')}
      </Typography>

      <Grid container spacing={4} sx={{ maxWidth: '800px', margin: 'auto' }}>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              p: 4,
              textAlign: 'center',
              cursor: 'pointer',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              '&:hover': {
                boxShadow: (theme) => theme.customShadows.z8,
                transform: 'translateY(-4px)',
                transition: 'all 0.3s ease',
              },
            }}
            onClick={handleClientRegistration}
          >
            <Box>
              <Business sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
              <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
                {t('auth:client')}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {t('auth:client_description')}
              </Typography>
            </Box>
            <Button variant="contained" size="large" fullWidth onClick={handleClientRegistration}>
              {t('auth:register_as_client')}
            </Button>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card
            sx={{
              p: 4,
              textAlign: 'center',
              cursor: 'pointer',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              '&:hover': {
                boxShadow: (theme) => theme.customShadows.z8,
                transform: 'translateY(-4px)',
                transition: 'all 0.3s ease',
              },
            }}
            onClick={handleCreatorRegistration}
          >
            <Box>
              <Person sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
              <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
                {t('auth:creator')}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {t('auth:creator_description')}
              </Typography>
            </Box>
            <Button variant="contained" size="large" fullWidth onClick={handleCreatorRegistration}>
              {t('auth:register_as_creator')}
            </Button>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="body2" color="text.secondary">
          {t('auth:already_have_account')}{' '}
          <Button
            variant="text"
            onClick={() => router.push(Routes.Auth.Login)}
            sx={{ textTransform: 'none' }}
          >
            {t('auth:sign_in')}
          </Button>
        </Typography>
      </Box>
    </>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['auth', 'common', 'topbar', 'notifications'])),
    },
  };
};

export default withAuth(RegisterSelectionPage, {
  mode: AUTH_MODE.LOGGED_OUT,
  redirectUrl: Routes.Common.Home,
});
