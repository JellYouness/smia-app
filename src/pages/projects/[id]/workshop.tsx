import withAuth from '@modules/auth/hocs/withAuth';
import { useRouter } from 'next/router';
import ProjectWorkshop from '@modules/projects/components/ProjectWorkshop';
import { NextPage } from 'next';
import { useMemo } from 'react';

const WorkshopPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const projectId = useMemo(() => (id ? Number(id) : undefined), [id]);
  if (!projectId) {
    return null;
  }
  return <ProjectWorkshop projectId={projectId} />;
};

export default withAuth(WorkshopPage);
