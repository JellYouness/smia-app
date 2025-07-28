import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useItems from '@common/hooks/useItems';
import { SystemAdministratorsApiRoutes } from '@modules/system-administrators/defs/api-routes';
import AdminDetailsCard from '@modules/users/components/partials/AdminDetailsCard';
import { SystemAdministrator } from '@modules/users/defs/types';

const AdminDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { readOne } = useItems(SystemAdministratorsApiRoutes);
  const [item, setItem] = useState<SystemAdministrator>();

  useEffect(() => {
    if (id) {
      readOne(Number(id)).then(({ data }) => {
        if (data && data.item) {
          setItem(data.item as SystemAdministrator);
        }
      });
    }
  }, [id]);

  if (!item) {
    return <div>Loading...</div>;
  }
  return <AdminDetailsCard admin={item} />;
};

export default AdminDetailsPage;
