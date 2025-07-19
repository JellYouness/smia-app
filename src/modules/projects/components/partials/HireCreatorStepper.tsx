import { Box, Typography, useTheme, CircularProgress } from '@mui/material';
import HireStepperBar, { StepKey } from './HireStepperBar';
import { useTranslation } from 'react-i18next';
import useProjects from '@modules/projects/hooks/useProjects';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Project } from '@modules/projects/defs/types';
import InviteCreatorsStep from './hire/InviteCreatorsStep';

interface HireCreatorStepperProps {
  active: StepKey;
  onStepChange?: (step: StepKey) => void;
}

const HireCreatorStepper = ({ active, onStepChange }: HireCreatorStepperProps) => {
  const { t } = useTranslation(['project', 'common']);
  const { readOne } = useProjects();
  const router = useRouter();
  const { id } = router.query;
  const [project, setProject] = useState<Project | null>(null);

  const [loading, setLoading] = useState(true);

  const fetchProject = async () => {
    if (!id) {
      return;
    }
    setLoading(true);
    const response = await readOne(Number(id));
    if (response.success && response.data) {
      setProject(response.data.item);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  if (loading) {
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
        {active === 'review' && <Typography>Review step coming soon…</Typography>}
        {active === 'hire' && <Typography>Hire step coming soon…</Typography>}
      </Box>
    </Box>
  );
};

export default HireCreatorStepper;
