import React, { useEffect, useState } from 'react';
import { Box, Typography, Divider, Skeleton } from '@mui/material';
import { useSavedProfiles } from '@modules/creators/hooks/useSavedProfiles';
import CreatorRow from '@modules/creators/components/CreatorRow';
import withPermissions from '@modules/permissions/hocs/withPermissions';
import Routes from '@common/defs/routes';
import { Any, CRUD_ACTION } from '@common/defs/types';
import withAuth, { AUTH_MODE } from '@modules/auth/hocs/withAuth';
import Namespaces from '@common/defs/namespaces';
import { useTranslation } from 'react-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const SavedCreatorsPage = () => {
  const { savedProfiles, loading, getSavedProfiles } = useSavedProfiles();
  const { t } = useTranslation(['user', 'common']);
  const [creators, setCreators] = useState<Any[]>([]);

  useEffect(() => {
    getSavedProfiles();
  }, []);

  useEffect(() => {
    // Each savedProfile has a .creator property
    setCreators(savedProfiles.map((sp: Any) => sp.creator));
  }, [savedProfiles]);

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" fontWeight={700} mb={3}>
        {t('user:saved_creators', 'Saved Creators')}
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Box>
        {loading && (
          <>
            <Skeleton variant="rounded" height={200} sx={{ mb: 2 }} />
            <Skeleton variant="rounded" height={200} sx={{ mb: 2 }} />
          </>
        )}
        {!loading &&
          creators &&
          creators.length > 0 &&
          creators.map((creator) =>
            creator ? <CreatorRow creator={creator} key={creator.id} /> : null
          )}
        {!loading && (!creators || creators.length === 0) && (
          <Typography variant="body1">
            {t('user:no_saved_creators', 'No saved creators.')}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
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
});

export default withAuth(
  withPermissions(SavedCreatorsPage, {
    requiredPermissions: {
      entity: Namespaces.Creators,
      action: CRUD_ACTION.READ,
    },
    redirectUrl: Routes.Permissions.Forbidden,
  }),
  {
    mode: AUTH_MODE.LOGGED_IN,
    redirectUrl: Routes.Auth.Login,
  }
);
