import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useItems from '@common/hooks/useItems';
import { ClientsApiRoutes } from '@modules/clients/defs/api-routes';
import ClientMainContent from '@modules/clients/components/ClientProfile/ClientMainContent';
import { useTranslation } from 'react-i18next';
import { GetServerSideProps } from 'next';
import withAuth, { AUTH_MODE } from '@modules/auth/hocs/withAuth';
import withPermissions from '@modules/permissions/hocs/withPermissions';
import Namespaces from '@common/defs/namespaces';
import { CRUD_ACTION } from '@common/defs/types';
import Routes from '@common/defs/routes';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { User } from '@modules/users/defs/types';
import NotFound from '@common/components/pages/NotFound';
import { Skeleton, Box, Grid, useTheme } from '@mui/material';
import ClientSidebar from '@modules/clients/components/ClientProfile/ClientSidebar';

const ClientDetailsPage = () => {
  const theme = useTheme();
  const router = useRouter();
  const { id } = router.query;
  const { readOne } = useItems(ClientsApiRoutes);
  const [item, setItem] = useState<User>();
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation(['user']);

  useEffect(() => {
    if (id) {
      setLoading(true);
      readOne(Number(id))
        .then(({ data }) => {
          if (data && data.item) {
            // Structure data to match what ClientMainContent expects
            const item = data.item as User;
            const clientData = {
              ...item.user,
              profile: item.user.profile,
              client: {
                id: item.id,
                userId: item.userId,
                companyName: item.companyName,
                companySize: item.companySize,
                industry: item.industry,
                websiteUrl: item.websiteUrl,
                billingStreet: item.billingStreet,
                billingCity: item.billingCity,
                billingState: item.billingState,
                billingPostalCode: item.billingPostalCode,
                billingCountry: item.billingCountry,
                taxIdentifier: item.taxIdentifier,
                budget: item.budget,
                preferredCreators: item.preferredCreators,
                projectCount: item.projectCount,
                defaultProjectSettings: item.defaultProjectSettings,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
              },
            };
            setItem(clientData);
          }
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return (
      <>
        <Skeleton variant="rectangular" width="100%" height={500} />
      </>
    );
  }

  if (!item) {
    return <NotFound />;
  }

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
          <ClientSidebar
            user={item}
            profilePicture={item.profilePicture}
            handleUploadPicture={async () => {}}
            handleDeletePicture={async () => {}}
            readOnly
          />
        </Grid>
        <Grid
          item
          xs={12}
          md={8}
          sx={{ pl: { xs: 0, md: '0 !important' }, pt: { xs: 0, md: '0 !important' } }}
        >
          <ClientMainContent user={item} t={t} readOnly />
        </Grid>
      </Grid>
      {/* </Container> */}
    </Box>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const locale = context.locale || 'en';
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'topbar',
        'footer',
        'leftbar',
        'user',
        'common',
        'notifications',
      ])),
    },
  };
};

export default withAuth(
  withPermissions(ClientDetailsPage, {
    requiredPermissions: {
      entity: Namespaces.Clients,
      action: CRUD_ACTION.READ,
    },
    redirectUrl: Routes.Permissions.Forbidden,
  }),
  {
    mode: AUTH_MODE.LOGGED_IN,
    redirectUrl: Routes.Auth.Login,
  }
);
