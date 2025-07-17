import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useItems from '@common/hooks/useItems';
import { AmbassadorsApiRoutes } from '@modules/ambassadors/defs/api-routes';
import AmbassadorMainContent from '@modules/ambassadors/components/AmbassadorMainContent';
import { useTranslation } from 'react-i18next';

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

export default AmbassadorDetailsPage;
