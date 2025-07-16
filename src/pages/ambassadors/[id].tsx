import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useItems from '@common/hooks/useItems';
import { AmbassadorsApiRoutes } from '@modules/ambassadors/defs/api-routes';
import AmbassadorDetailsCard from '@modules/ambassadors/components/AmbassadorDetailsCard';

const AmbassadorDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { readOne } = useItems(AmbassadorsApiRoutes);
  const [item, setItem] = useState<any>(null);

  useEffect(() => {
    if (id) {
      readOne(id).then(({ data }) => {
        if (data && data.item) setItem(data.item);
      });
    }
  }, [id]);

  if (!item) return <div>Loading...</div>;
  return <AmbassadorDetailsCard ambassador={item} />;
};

export default AmbassadorDetailsPage;
