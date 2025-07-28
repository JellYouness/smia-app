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
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import useSWR from 'swr';
import { useMemo, useState, useEffect } from 'react';
import CustomBreadcrumbs from '@common/components/lib/navigation/CustomBreadCrumbs';
import PageHeader from '@common/components/lib/partials/PageHeader';
import Labels from '@common/defs/labels';
import {
  ProjectUpdate,
  PROJECT_UPDATE_TYPE,
  PROJECT_CREATOR_STATUS,
} from '@modules/projects/defs/types';
import ChatIcon from '@mui/icons-material/Chat';
import UpdatesTimeline from '@modules/media/components/UpdatesTimeline';
import useAuth from '@modules/auth/hooks/api/useAuth';
import { ROLE } from '@modules/permissions/defs/types';

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
  const [updates, setUpdates] = useState<ProjectUpdate[]>([]);
  const [updatesLoading, setUpdatesLoading] = useState(false);
  const { user } = useAuth();

  const isCreator = user?.userType === ROLE.CREATOR;
  const isProjectOwner = user?.client?.id === project?.clientId;

  console.log('isProjectOwner', isProjectOwner);

  const isAssignedCreator = useMemo(() => {
    if (!isCreator || !user?.creator?.id || !project?.projectCreators) {
      return false;
    }

    return project.projectCreators.some(
      (pc) => pc.creatorId === user?.creator?.id && pc.status === PROJECT_CREATOR_STATUS.ASSIGNED
    );
  }, [isCreator, user?.creator?.id, project?.projectCreators]);

  useEffect(() => {
    if (!projectId) {
      return;
    }
    setUpdatesLoading(true);
    readAllByProject(projectId, 1, 'all').then((res) => {
      setUpdates(
        res.data?.items.map((item) => ({
          ...item,
          type: PROJECT_UPDATE_TYPE.UPDATE,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          projectId,
        })) || []
      );
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
      <PageHeader
        title={t(`project:${Labels.Projects.ReadOne}`)}
        action={
          isProjectOwner || isAssignedCreator
            ? {
                label: t('project:open_project_chat', 'Chat'),
                onClick: () => router.push(`/projects/${project.id}/chat`),
                startIcon: <ChatIcon />,
              }
            : undefined
        }
      />
      <CustomBreadcrumbs
        links={[
          { name: t('common:dashboard'), href: Routes.Common.Home },
          { name: project ? project.title : t(`project:${Labels.Projects.ReadOne}`) },
        ]}
      />

      <ProjectDetailsSection project={project} isProjectOwner={isProjectOwner} />

      {isProjectOwner && (
        <>
          <Divider sx={{ my: 4 }} />
          <Typography variant="h6" fontWeight={600} mb={2}>
            {t('project:team_and_permissions', 'Team & Permissions')}
          </Typography>
          <CreatorsPermissionsList
            projectId={project.id}
            creators={project.projectCreators || []}
          />
        </>
      )}

      {isAssignedCreator && (
        <>
          <Divider sx={{ my: 4 }} />
          <Typography variant="h6" fontWeight={600} mb={2}>
            {t('project:updates_timeline', 'Project Updates')}
          </Typography>
          <Paper
            elevation={0}
            sx={{ maxHeight: 400, overflowY: 'auto', p: 2, background: '#fafbfc' }}
          >
            <UpdatesTimeline updates={updates} loading={updatesLoading} />
          </Paper>
        </>
      )}
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
