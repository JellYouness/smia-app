import PageHeader from '@common/components/lib/partials/PageHeader';
import Routes from '@common/defs/routes';
import withAuth, { AUTH_MODE } from '@modules/auth/hocs/withAuth';
import useAuth from '@modules/auth/hooks/api/useAuth';
import { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'react-i18next';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { ROLE } from '@modules/permissions/defs/types';
import { useRouter } from 'next/router';
import Projects from '@modules/projects/defs/routes';
import { Add } from '@mui/icons-material';
import ClientDashboard from '@modules/clients/components/ClientDashboard';

const Index: NextPage = () => {
  const { t } = useTranslation(['home']);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [user]);

  const isClient = user?.rolesNames.includes(ROLE.CLIENT);

  console.log(user);

  return (
    <>
      {loading && (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight={200}
        >
          <CircularProgress />
          <Typography variant="body2" sx={{ mt: 2 }}>
            {t('home:loading', 'Loading...')}
          </Typography>
        </Box>
      )}
      {!loading && isClient && (
        <>
          <PageHeader
            title={`Hello, ${user?.firstName ?? ''}`}
            action={{
              label: t('home:createProject', 'Create a project'),
              onClick: () => router.push(Projects.CreateOne),
              permission: {
                entity: 'projects',
                action: 'create',
              },
              startIcon: <Add />,
            }}
          />
          <ClientDashboard user={user!} />
        </>
      )}
    </>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, [
      'topbar',
      'footer',
      'leftbar',
      'home',
      'project',
      'user',
      'common',
    ])),
  },
});
export default withAuth(Index, {
  mode: AUTH_MODE.LOGGED_IN,
  redirectUrl: Routes.Auth.Login,
});
