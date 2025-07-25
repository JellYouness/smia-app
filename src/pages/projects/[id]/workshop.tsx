import withAuth from '@modules/auth/hocs/withAuth';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { useMemo } from 'react';
import ProjectWorkshop from '@modules/media/components/ProjectWorkshop';
import withPermissions from '@modules/permissions/hocs/withPermissions';
import Namespaces from '@common/defs/namespaces';
import { CRUD_ACTION } from '@common/defs/types';
import Routes from '@common/defs/routes';

const WorkshopPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const projectId = useMemo(() => (id ? Number(id) : undefined), [id]);
  if (!projectId) {
    return null;
  }
  return <ProjectWorkshop projectId={projectId} />;
};

export default withAuth(
  withPermissions(WorkshopPage, {
    requiredPermissions: {
      entity: Namespaces.Projects,
      action: CRUD_ACTION.READ,
    },
    redirectUrl: Routes.Permissions.Forbidden,
  })
);
