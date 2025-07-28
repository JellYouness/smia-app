import {
  Box,
  Typography,
  useTheme,
  CircularProgress,
  Alert,
  IconButton,
  Collapse,
} from '@mui/material';
import HireStepperBar, { StepKey } from './HireStepperBar';
import { useTranslation } from 'react-i18next';
import useProjects, { projectCacheKey } from '@modules/projects/hooks/useProjects';
import { useRouter } from 'next/router';
import { Project, PROJECT_STATUS } from '@modules/projects/defs/types';
import InviteCreatorsStep from './hire/InviteCreatorsStep';
import ReviewProposalsStep from './hire/ReviewProposalsStep';
import HiredCreatorStep from './hire/HiredCreatorStep';
import KickoffProjectStep from './hire/KickoffProjectStep';
import StepperEmptyState from './StepperEmptyState';
import useSWR from 'swr';
import { useState } from 'react';
import { Close, Info, Home, Cancel, CheckCircle, PlayArrow } from '@mui/icons-material';
import Routes from '@common/defs/routes';

interface HireCreatorStepperProps {
  active: StepKey;
  onStepChange?: (step: StepKey) => void;
}

const HireCreatorStepper = ({ active, onStepChange }: HireCreatorStepperProps) => {
  const { t } = useTranslation(['project', 'common']);
  const { readOne } = useProjects();
  const router = useRouter();
  const { id } = router.query;
  const theme = useTheme();
  const [showDraftBanner, setShowDraftBanner] = useState(true);

  // Use SWR to get live project data
  const { data: projectData, isLoading } = useSWR(id ? projectCacheKey(Number(id)) : null, () =>
    readOne(Number(id))
  );

  const project = projectData?.data?.item;
  const isDraft = project?.status === PROJECT_STATUS.DRAFT;

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: 400,
          minHeight: 200,
          width: '100%',
          borderRadius: 2,
          p: 4,
        }}
      >
        <CircularProgress
          size={48}
          thickness={4}
          sx={{ mb: 3, color: (theme) => theme.palette.primary.main }}
        />
        <Typography variant="h6" sx={{ mb: 1, color: (theme) => theme.palette.text.primary }}>
          {t('project:loading_project_details_title')}
        </Typography>
        <Typography variant="body2" sx={{ color: (theme) => theme.palette.text.secondary }}>
          {t('project:loading_project_details_description')}
        </Typography>
      </Box>
    );
  }

  // Show cancelled project state
  if (project?.status === PROJECT_STATUS.CANCELLED) {
    return (
      <>
        <HireStepperBar
          active={active}
          onStepChange={onStepChange}
          proposalsCount={project?.proposalsCount ?? 0}
          hiresCount={project?.hiresCount ?? 0}
          disabled
        />

        <Box minHeight={500} display="flex" justifyContent="center" alignItems="center" mt={4}>
          <StepperEmptyState
            icon={<Cancel />}
            title={t('project:cancelled_project_title', 'Project Cancelled')}
            description={t(
              'project:cancelled_project_description',
              'This project has been cancelled and is no longer active. You can return to the dashboard to view other projects or create a new one.'
            )}
            buttonText={t('common:go_home', 'Go to Dashboard')}
            buttonIcon={<Home />}
            onButtonClick={() => {
              router.push(Routes.Common.Home);
            }}
          />
        </Box>
      </>
    );
  }

  // Show completed project state
  if (project?.status === PROJECT_STATUS.COMPLETED) {
    return (
      <>
        <HireStepperBar
          active={active}
          onStepChange={onStepChange}
          proposalsCount={project?.proposalsCount ?? 0}
          hiresCount={project?.hiresCount ?? 0}
          disabled
        />

        <Box minHeight={500} display="flex" justifyContent="center" alignItems="center" mt={4}>
          <StepperEmptyState
            icon={<CheckCircle />}
            title={t('project:completed_project_title', 'Project Completed!')}
            description={t(
              'project:completed_project_description',
              'Congratulations! This project has been successfully completed. You can view all the media content and project details in the workspace.'
            )}
            buttonText={t('project:go_to_workspace', 'Go to Workspace')}
            buttonIcon={<PlayArrow />}
            onButtonClick={() => {
              router.push(Routes.Projects.Workspace.replace('{id}', project.id.toString()));
            }}
          />
        </Box>
      </>
    );
  }

  return (
    <Box>
      {/* Draft Status Banner */}
      <Collapse in={isDraft && showDraftBanner}>
        <Alert
          severity="info"
          icon={<Info />}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => setShowDraftBanner(false)}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <Close fontSize="inherit" />
            </IconButton>
          }
          sx={{
            mb: 5,
            borderRadius: 1,
            background: `linear-gradient(135deg, ${theme.palette.info.light}15 0%, ${theme.palette.info.light}25 100%)`,
            border: `1px solid ${theme.palette.info.light}40`,
            '& .MuiAlert-icon': {
              color: theme.palette.info.main,
            },
            '& .MuiAlert-message': {
              color: theme.palette.info.dark,
              fontWeight: 500,
            },
            boxShadow: `0 4px 10px ${theme.palette.info.light}20`,
          }}
        >
          <Typography variant="body1" fontWeight={600} mb={0.5}>
            {t('project:draft_project_notice_title', 'Project is in Draft Mode')}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            {t(
              'project:draft_project_notice_description',
              'Your project is currently in draft status. To start managing media and kickoff the project, you need to make it live first.'
            )}
          </Typography>
        </Alert>
      </Collapse>

      <HireStepperBar
        active={active}
        onStepChange={onStepChange}
        proposalsCount={project?.proposalsCount ?? 0}
        hiresCount={project?.hiresCount ?? 0}
      />

      <Box sx={{ mt: 4 }}>
        {active === 'invite' && project && (
          <InviteCreatorsStep projectId={Number(id)} project={project as Project} />
        )}
        {active === 'review' && project && (
          <ReviewProposalsStep projectId={Number(id)} project={project as Project} />
        )}
        {active === 'hire' && project && (
          <HiredCreatorStep projectId={Number(id)} project={project as Project} />
        )}
        {active === 'kickoff' && project && (
          <KickoffProjectStep projectId={Number(id)} project={project as Project} />
        )}
      </Box>
    </Box>
  );
};

export default HireCreatorStepper;
