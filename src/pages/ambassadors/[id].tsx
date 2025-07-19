import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useItems from '@common/hooks/useItems';
import { AmbassadorsApiRoutes } from '@modules/ambassadors/defs/api-routes';
import AmbassadorMainContent from '@modules/ambassadors/components/AmbassadorMainContent';
import { useTranslation } from 'react-i18next';
import { GetServerSideProps } from 'next';
import withAuth, { AUTH_MODE } from '@modules/auth/hocs/withAuth';
import withPermissions from '@modules/permissions/hocs/withPermissions';
import Namespaces from '@common/defs/namespaces';
import { CRUD_ACTION } from '@common/defs/types';
import Routes from '@common/defs/routes';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const AmbassadorDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { readOne } = useItems(AmbassadorsApiRoutes);
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation(['user']);

  useEffect(() => {
    if (id) {
      setLoading(true);
      readOne(Number(id))
        .then(({ data }) => {
          if (data && data.item) {
            // Structure data to match what AmbassadorMainContent expects
            const item = data.item as any;
            const ambassadorData = {
              ...item.user,
              profile: item.user.profile,
              ambassador: {
                id: item.id,
                userId: item.userId,
                teamMembers: item.teamMembers,
                teamName: item.teamName,
                specializations: item.specializations,
                regionalExpertise: item.regionalExpertise,
                serviceOfferings: item.serviceOfferings,
                clientCount: item.clientCount,
                projectCapacity: item.projectCapacity,
                applicationStatus: item.applicationStatus,
                applicationDate: item.applicationDate,
                verificationDocuments: item.verificationDocuments,
                commissionRate: item.commissionRate,
                teamDescription: item.teamDescription,
                featuredWork: item.featuredWork,
                yearsInBusiness: item.yearsInBusiness,
                businessStreet: item.businessStreet,
                businessCity: item.businessCity,
                businessState: item.businessState,
                businessPostalCode: item.businessPostalCode,
                businessCountry: item.businessCountry,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
              },
            };
            setItem(ambassadorData);
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

  return <AmbassadorMainContent user={item} t={t} readOnly />;
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
