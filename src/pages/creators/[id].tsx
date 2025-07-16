import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useItems from '@common/hooks/useItems';
import { CreatorsApiRoutes } from '@modules/creators/defs/api-routes';
import CreatorDetailsCard from '@modules/creators/components/CreatorDetailsCard';

const CreatorDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { readOne } = useItems(CreatorsApiRoutes);
  const [item, setItem] = useState<any>(null);

  useEffect(() => {
    if (id) {
      readOne(id).then(({ data }) => {
        if (data && data.item) setItem(data.item);
      });
    }
  }, [id]);

  if (!item) return <div>Loading...</div>;
  return <CreatorDetailsCard creator={item} />;
};

export default CreatorDetailsPage;
