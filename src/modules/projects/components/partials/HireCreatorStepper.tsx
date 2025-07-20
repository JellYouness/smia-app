import { Box, Typography, useTheme, CircularProgress } from '@mui/material';
import HireStepperBar, { StepKey } from './HireStepperBar';
import { useTranslation } from 'react-i18next';
import useProjects, { projectCacheKey } from '@modules/projects/hooks/useProjects';
import { useRouter } from 'next/router';
import { Project } from '@modules/projects/defs/types';
import InviteCreatorsStep from './hire/InviteCreatorsStep';
import ReviewProposalsStep from './hire/ReviewProposalsStep';
import HiredCreatorStep from './hire/HiredCreatorStep';
import useSWR from 'swr';

interface HireCreatorStepperProps {
  active: StepKey;
  onStepChange?: (step: StepKey) => void;
}

const HireCreatorStepper = ({ active, onStepChange }: HireCreatorStepperProps) => {
  const { t } = useTranslation(['project', 'common']);
  const { readOne } = useProjects();
  const router = useRouter();
  const { id } = router.query;

  // Use SWR to get live project data
  const { data: projectData, isLoading } = useSWR(id ? projectCacheKey(Number(id)) : null, () =>
    readOne(Number(id))
  );

  const project = projectData?.data?.item;

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

  return (
    <Box>
      <HireStepperBar
        active={active}
        onStepChange={onStepChange}
        proposalsCount={project?.proposalsCount ?? 0}
        hiresCount={project?.hiresCount ?? 0}
      />

      <Box sx={{ mt: 4 }}>
        {active === 'invite' && (
          <InviteCreatorsStep projectId={Number(id)} project={project as Project} />
        )}
        {active === 'review' && (
          <ReviewProposalsStep projectId={Number(id)} project={project as Project} />
        )}
        {active === 'hire' && (
          <HiredCreatorStep projectId={Number(id)} project={project as Project} />
        )}
      </Box>
    </Box>
  );
};

export default HireCreatorStepper;
