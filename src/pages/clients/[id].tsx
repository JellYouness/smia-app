import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useItems from '@common/hooks/useItems';
import { ClientsApiRoutes } from '@modules/clients/defs/api-routes';
import ClientDetailsCard from '@modules/clients/components/ClientDetailsCard';

const ClientDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { readOne } = useItems(ClientsApiRoutes);
  const [item, setItem] = useState<any>(null);

  useEffect(() => {
    if (id) {
      readOne(id).then(({ data }) => {
        if (data && data.item) setItem(data.item);
      });
    }
  }, [id]);

  if (!item) return <div>Loading...</div>;
  return <ClientDetailsCard client={item} />;
};

export default ClientDetailsPage;
