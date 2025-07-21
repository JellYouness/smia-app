import withAuth, { AUTH_MODE } from '@modules/auth/hocs/withAuth';
import withPermissions from '@modules/permissions/hocs/withPermissions';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import useProjects, { projectCacheKey } from '@modules/projects/hooks/useProjects';
import useProjectUpdates from '@modules/projects/hooks/useProjectUpdates';
import { Box, Container, Divider, Typography, CircularProgress, Paper } from '@mui/material';
import { CRUD_ACTION } from '@common/defs/types';
import Namespaces from '@common/defs/namespaces';
import Routes from '@common/defs/routes';
import { useTranslation } from 'react-i18next';
import CreatorsPermissionsList from '@modules/projects/components/CreatorsPermissionsList';
import ProjectDetailsSection from '@modules/projects/components/ProjectDetailsSection';
import UpdatesTimeline from '@modules/projects/components/UpdatesTimeline';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import useSWR from 'swr';
import { useMemo, useState, useEffect } from 'react';
import CustomBreadcrumbs from '@common/components/lib/navigation/CustomBreadCrumbs';
import PageHeader from '@common/components/lib/partials/PageHeader';
import Labels from '@common/defs/labels';

const ProjectDetailsPage: NextPage = () => {
  const { t } = useTranslation(['project', 'common', 'user']);
  const router = useRouter();
  const { id } = router.query;
  const projectId = useMemo(() => (id ? Number(id) : undefined), [id]);
  const { readOne } = useProjects();
  const { readAllByProject } = useProjectUpdates();
  const { data: projectData, isLoading: projectLoading } = useSWR(
    projectId ? projectCacheKey(projectId) : null,
    () => readOne(projectId!)
  );
  const project = projectData?.data?.item;
  const [updates, setUpdates] = useState<any[]>([]);
  const [updatesLoading, setUpdatesLoading] = useState(true);

  useEffect(() => {
    if (!projectId) {
      return;
    }
    setUpdatesLoading(true);
    readAllByProject(projectId, 1, 'all').then((res) => {
      setUpdates(res.data?.items || []);
      setUpdatesLoading(false);
    });
  }, [projectId]);

  if (projectLoading || !project) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" minHeight={300}>
        <CircularProgress size={40} thickness={4} sx={{ mr: 2 }} />
        <Typography variant="body1">
          {t('project:loading_project_details_title', 'Loading project details...')}
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <PageHeader title={t(`project:${Labels.Projects.ReadOne}`)} />
      <CustomBreadcrumbs
        links={[
          { name: t('common:dashboard'), href: Routes.Common.Home },
          { name: project ? project.title : t(`project:${Labels.Projects.ReadOne}`) },
        ]}
      />

      {/* Project Details Section */}
      <ProjectDetailsSection project={project} />

      <Divider sx={{ my: 4 }} />

      {/* Team & Permissions List */}
      <Typography variant="h6" fontWeight={600} mb={2}>
        {t('project:team_and_permissions', 'Team & Permissions')}
      </Typography>
      <CreatorsPermissionsList projectId={project.id} creators={project.projectCreators || []} />

      <Divider sx={{ my: 4 }} />

      {/* Updates Timeline */}
      <Typography variant="h6" fontWeight={600} mb={2}>
        {t('project:updates_timeline', 'Project Updates')}
      </Typography>
      <Paper elevation={0} sx={{ maxHeight: 400, overflowY: 'auto', p: 2, background: '#fafbfc' }}>
        <UpdatesTimeline updates={updates} loading={updatesLoading} />
      </Paper>
    </Container>
  );
};

export const getStaticPaths = () => {
  return { paths: [], fallback: 'blocking' };
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, [
      'notifications',
      'topbar',
      'footer',
      'leftbar',
      'project',
      'common',
      'user',
      'client',
      'ambassador',
    ])),
  },
});

export default withAuth(
  withPermissions(ProjectDetailsPage, {
    requiredPermissions: {
      entity: Namespaces.Projects,
      action: CRUD_ACTION.READ,
    },
    redirectUrl: Routes.Permissions.Forbidden,
  }),
  {
    mode: AUTH_MODE.LOGGED_IN,
    redirectUrl: Routes.Auth.Login,
  }
);
