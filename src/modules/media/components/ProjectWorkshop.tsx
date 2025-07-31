import { Box, Typography, Button, Container, Paper } from '@mui/material';
import UpdatesPane from './UpdatesPane';
import BoardPane from './BoardPane';
import AssetsPane from './AssetsPane';
import PaneHeader from './PaneHeader';
import Splitter from './WorkspaceSplitter';
import ProjectStripe from './ProjectStripe';
import { useEffect, useState } from 'react';
import useWorkspaceLayout from '../hooks/useWorkspaceLayout';
import { MediaPost } from '../defs/types';
import useProjects, { projectCacheKey } from '@modules/projects/hooks/useProjects';
import { PROJECT_STATUS, PROJECT_CREATOR_STATUS } from '@modules/projects/defs/types';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { Lock, ArrowBack } from '@mui/icons-material';
import Routes from '@common/defs/routes';
import useAuth from '@modules/auth/hooks/api/useAuth';
import { ROLE } from '@modules/permissions/defs/types';

interface ProjectWorkshopProps {
  projectId: number;
}

const ProjectWorkshop = ({ projectId }: ProjectWorkshopProps) => {
  const { layout, toggle, drag, HIDDEN } = useWorkspaceLayout(projectId);
  const [selectedFilesPostId, setSelectedFilesPostId] = useState<number | null>(null);
  const router = useRouter();
  const { t } = useTranslation(['project', 'common']);
  const { readOne } = useProjects({ autoRefetchAfterMutation: false });
  const { user } = useAuth();

  // Fetch project data to check status
  const { data: projectData, isLoading: projectLoading } = useSWR(projectCacheKey(projectId), () =>
    readOne(projectId)
  );

  const project = projectData?.data?.item;

  useEffect(() => {
    const footer = document.querySelector('footer');
    if (footer) {
      footer.style.display = 'none';
    }

    return () => {
      const footer = document.querySelector('footer');
      if (footer) {
        footer.style.display = '';
      }
    };
  }, []);

  const getGridColumns = () => {
    const leftCol = layout.hideLeft ? `${HIDDEN}px` : `${layout.left}px`;
    const leftSplitter = layout.hideLeft ? '' : ' 4px';
    const rightSplitter = layout.hideRight ? '' : ' 4px';
    const rightCol = layout.hideRight ? `${HIDDEN}px` : `${layout.right}px`;

    return `${leftCol}${leftSplitter} 1fr${rightSplitter} ${rightCol}`;
  };

  // Check if project status allows access to workshop
  const isWorkshopAccessible =
    project?.status === PROJECT_STATUS.IN_PROGRESS || project?.status === PROJECT_STATUS.COMPLETED;

  // Check if user is a creator with ASSIGNED status for this project
  const isCreator = user?.userType === ROLE.CREATOR;
  const isProjectOwner = user?.client?.id === project?.clientId;
  const isAmbassador = user?.ambassador?.id === project?.ambassadorId;

  const isAssignedCreator =
    isCreator &&
    user?.creator?.id &&
    project?.projectCreators?.some(
      (pc) => pc.creatorId === user?.creator?.id && pc.status === PROJECT_CREATOR_STATUS.ASSIGNED
    );

  // Check if user has access to workshop
  const hasWorkshopAccess =
    isWorkshopAccessible && (isProjectOwner || isAmbassador || isAssignedCreator);

  // Show loading state while fetching project data
  if (projectLoading) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 64,
          left: 0,
          height: 'calc(100vh - 64px)',
          width: '100vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #F9FAFB 0%, #F2F4F8 25%, #E8F2FF 50%, #F9FAFB 100%)',
        }}
      >
        <Typography variant="h6" color="text.secondary">
          {t('project:loading_project_details_title', 'Loading project details...')}
        </Typography>
      </Box>
    );
  }

  // Show access denied if project status doesn't allow workshop access
  if (!isWorkshopAccessible) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 64,
          left: 0,
          height: 'calc(100vh - 64px)',
          width: '100vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #F9FAFB 0%, #F2F4F8 25%, #E8F2FF 50%, #F9FAFB 100%)',
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={0}
            sx={{
              p: 4,
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'rgba(32, 101, 209, 0.1)',
            }}
          >
            <Lock sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" fontWeight={600} gutterBottom>
              {t('project:workshop_access_denied_title', 'Workshop Access Restricted')}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {project?.status === PROJECT_STATUS.DRAFT
                ? t(
                    'project:workshop_draft_message',
                    'The project workshop is only available once the project is in progress or completed. This project is currently in draft status.'
                  )
                : t(
                    'project:workshop_access_denied_message',
                    'The project workshop is only available for projects that are in progress or completed.'
                  )}
            </Typography>
            <Button
              variant="contained"
              startIcon={<ArrowBack />}
              onClick={() => router.push(`/projects/${projectId}`)}
              sx={{ borderRadius: 2 }}
            >
              {t('project:back_to_project', 'Back to Project')}
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  // Show access denied if user doesn't have proper access rights
  if (!hasWorkshopAccess) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 64,
          left: 0,
          height: 'calc(100vh - 64px)',
          width: '100vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #F9FAFB 0%, #F2F4F8 25%, #E8F2FF 50%, #F9FAFB 100%)',
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={0}
            sx={{
              p: 4,
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'rgba(32, 101, 209, 0.1)',
            }}
          >
            <Lock sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" fontWeight={600} gutterBottom>
              {t('project:workshop_access_denied_title', 'Workshop Access Restricted')}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {isCreator
                ? t(
                    'project:workshop_creator_not_assigned_message',
                    'You need to be assigned to this project to access the workshop. Please contact the project owner to get assigned.'
                  )
                : t(
                    'project:workshop_access_denied_message',
                    'The project workshop is only available for projects that are in progress or completed.'
                  )}
            </Typography>
            <Button
              variant="contained"
              startIcon={<ArrowBack />}
              onClick={() => router.push(`/projects/${projectId}`)}
              sx={{ borderRadius: 2 }}
            >
              {t('project:back_to_project', 'Back to Project')}
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <>
      {/* Project Stripe */}
      {project && <ProjectStripe project={project} />}

      <Box
        sx={{
          position: 'fixed',
          top: 124, // Adjusted to account for the stripe (64 + 60)
          left: 0,
          height: 'calc(100vh - 124px)', // Adjusted height
          width: '100vw',
          display: 'grid',
          gridTemplateColumns: getGridColumns(),
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #F9FAFB 0%, #F2F4F8 25%, #E8F2FF 50%, #F9FAFB 100%)',
        }}
      >
        {/* Updates Pane */}
        <Box
          sx={{
            overflow: 'hidden',
            background:
              'linear-gradient(180deg, rgba(32, 101, 209, 0.02) 0%, rgba(32, 101, 209, 0.08) 100%)',
            backdropFilter: 'blur(10px)',
            borderRight: '1px solid',
            borderColor: 'rgba(32, 101, 209, 0.12)',
            boxShadow: (theme) => `inset -1px 0 0 ${theme.palette.primary.lighter}`,
          }}
        >
          <PaneHeader title="Updates" hidden={layout.hideLeft} onToggle={() => toggle('left')} />
          {!layout.hideLeft && (
            <Box
              sx={{
                height: 'calc(100% - 60px)',
                background: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(20px)',
                borderRadius: '12px 0 0 0',
                boxShadow: (theme) => theme.customShadows.z4,
                margin: '8px 0 0 8px',
              }}
            >
              <UpdatesPane projectId={projectId} />
            </Box>
          )}
        </Box>

        {/* Left Splitter */}
        {!layout.hideLeft && (
          <Splitter side="left" hidden={false} onDrag={(d) => drag('left', d)} />
        )}

        {/* Board Pane - The Star of the Show */}
        <Box
          sx={{
            minWidth: 0,
            overflow: 'hidden',
            background:
              'linear-gradient(145deg, rgba(255, 255, 255, 0.9) 0%, rgba(32, 101, 209, 0.03) 50%, rgba(255, 255, 255, 0.95) 100%)',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                'radial-gradient(circle at 50% 50%, rgba(32, 101, 209, 0.05) 0%, transparent 70%)',
              pointerEvents: 'none',
            },
          }}
        >
          <PaneHeader title="Board" hidden={false} onToggle={() => {}} />
          <Box
            sx={{
              height: 'calc(100% - 60px)',
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(20px)',
              borderRadius: '12px',
              boxShadow: (theme) => theme.customShadows.primary,
              margin: '8px',
              border: '1px solid',
              borderColor: 'rgba(32, 101, 209, 0.08)',
              position: 'relative',
              zIndex: 1,
            }}
          >
            <BoardPane
              projectId={projectId}
              onFilesClick={(post: MediaPost) => setSelectedFilesPostId(post.id)}
            />
          </Box>
        </Box>

        {/* Right Splitter */}
        {!layout.hideRight && (
          <Splitter side="right" hidden={false} onDrag={(d) => drag('right', d)} />
        )}

        {/* Assets Pane */}
        <Box
          sx={{
            overflow: 'hidden',
            background:
              'linear-gradient(180deg, rgba(118, 176, 241, 0.03) 0%, rgba(118, 176, 241, 0.12) 100%)',
            backdropFilter: 'blur(10px)',
            borderLeft: '1px solid',
            borderColor: 'rgba(118, 176, 241, 0.2)',
            boxShadow: (theme) => `inset 1px 0 0 ${theme.palette.primary.lighter}`,
          }}
        >
          <PaneHeader title="Files" hidden={layout.hideRight} onToggle={() => toggle('right')} />
          {!layout.hideRight && (
            <Box
              sx={{
                height: 'calc(100% - 60px)',
                background: 'rgba(255, 255, 255, 0.75)',
                backdropFilter: 'blur(20px)',
                borderRadius: '0 12px 0 0',
                boxShadow: (theme) => theme.customShadows.z8,
                margin: '8px 8px 0 0',
              }}
            >
              <AssetsPane selectedPostId={selectedFilesPostId} />
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};

export default ProjectWorkshop;
