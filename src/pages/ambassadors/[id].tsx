import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useItems from '@common/hooks/useItems';
import AmbassadorsApiRoutes from '@modules/ambassadors/defs/api-routes';
import { useTranslation } from 'react-i18next';
import { GetServerSideProps } from 'next';
import withAuth, { AUTH_MODE } from '@modules/auth/hocs/withAuth';
import withPermissions from '@modules/permissions/hocs/withPermissions';
import Namespaces from '@common/defs/namespaces';
import { CRUD_ACTION } from '@common/defs/types';
import Routes from '@common/defs/routes';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { User } from '@modules/users/defs/types';
import CreatorProfile from '@modules/creators/components/creator-profle/CreatorProfile';

const AmbassadorDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { readOne } = useItems(AmbassadorsApiRoutes);
  const [item, setItem] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation(['user']);

  useEffect(() => {
    if (id) {
      setLoading(true);
      readOne(Number(id))
        .then(({ data }) => {
          if (data && data.item) {
            // Structure data to match what AmbassadorMainContent expects
            const item = data.item as User;
            setItem(item);
          }
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (!item) {
    return <div>Ambassador not found</div>;
  }

  return <CreatorProfile user={item.user as User} t={t} readOnly onlyAmbassador />;
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
  withPermissions(AmbassadorDetailsPage, {
    requiredPermissions: {
      entity: Namespaces.Ambassadors,
      action: CRUD_ACTION.READ,
    },
    redirectUrl: Routes.Permissions.Forbidden,
  }),
  {
    mode: AUTH_MODE.LOGGED_IN,
    redirectUrl: Routes.Auth.Login,
  }
);
