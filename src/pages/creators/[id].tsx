import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useItems from '@common/hooks/useItems';
import { CreatorsApiRoutes } from '@modules/creators/defs/api-routes';
import CreatorMainContent from '@modules/creators/components/CreatorMainContent';
import { useTranslation } from 'react-i18next';
import { GetServerSideProps } from 'next';
import withAuth, { AUTH_MODE } from '@modules/auth/hocs/withAuth';
import withPermissions from '@modules/permissions/hocs/withPermissions';
import Namespaces from '@common/defs/namespaces';
import { CRUD_ACTION } from '@common/defs/types';
import Routes from '@common/defs/routes';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const CreatorDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { readOne } = useItems(CreatorsApiRoutes);
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation(['user']);

  useEffect(() => {
    if (id) {
      setLoading(true);
      readOne(Number(id))
        .then(({ data }) => {
          if (data && data.item) {
            // Structure data to match what CreatorMainContent expects
            const item = data.item as any;
            const creatorData = {
              ...item.user,
              profile: item.user.profile,
              creator: {
                id: item.id,
                userId: item.userId,
                skills: item.skills,
                verificationStatus: item.verificationStatus,
                portfolio: item.portfolio,
                experience: item.experience,
                hourlyRate: item.hourlyRate,
                availability: item.availability,
                averageRating: item.averageRating,
                ratingCount: item.ratingCount,
                regionalExpertise: item.regionalExpertise,
                languages: item.languages,
                isJournalist: item.isJournalist,
                mediaTypes: item.mediaTypes,
                certifications: item.certifications,
                equipmentInfo: item.equipmentInfo,
                education: item.education,
                professionalBackground: item.professionalBackground,
                achievements: item.achievements,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
              },
            };
            setItem(creatorData);
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
    return <div>Creator not found</div>;
  }

  return <CreatorMainContent user={item} t={t} readOnly />;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const locale = context.locale || 'en';
  return {
    props: {
      ...(await serverSideTranslations(locale, ['topbar', 'footer', 'leftbar', 'user', 'common'])),
    },
  };
};

export default withAuth(
  withPermissions(CreatorDetailsPage, {
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
