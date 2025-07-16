import { Project } from '@modules/projects/defs/types';
import useProjects from '@modules/projects/hooks/useProjects';
import { User } from '@modules/users/defs/types';
import { Box, Typography, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import { Add } from '@mui/icons-material';
import router from 'next/router';
import Routes from '@common/defs/routes';

interface ClientDashboardProps {
  user: User;
}

const ClientDashboard = ({ user }: ClientDashboardProps) => {
  const { t } = useTranslation(['clients']);
  const { readAllByClient } = useProjects();
  const [projects, setProjects] = useState<Project[]>([]);

  const fetchProjects = async () => {
    const response = await readAllByClient(user.id);
    // Do not setProjects, simulate empty state
  };

  useEffect(() => {
    fetchProjects();
  }, [user]);

  return (
    <Box
      sx={{
        mt: 5,
        width: '100%',
      }}
    >
      <Typography
        variant="h3"
        fontWeight={500}
        letterSpacing={0.5}
        color="text.primary"
        mt={6}
        mb={1}
      >
        {t('clients:projects', 'Projects')}
      </Typography>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        p={3}
        sx={{
          background: 'linear-gradient(to bottom, #f9fbfd 0%, #ffffff 100%)',
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          textAlign: 'center',
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
          <WorkOutlineIcon
            sx={{
              fontSize: 48,
              color: 'primary.main',
            }}
          />
        </Box>

        <Typography
          variant="body1"
          color="text.secondary"
          mb={3}
          sx={{
            lineHeight: 1.6,
          }}
        >
          {t(
            'clients:noProjectsDescription',
            'You currently have no job posts or contracts in progress'
          )}
        </Typography>

        <Button
          variant="outlined"
          color="primary"
          sx={{
            px: 4,
            py: 1.5,
            fontWeight: 600,
            fontSize: 16,
            textTransform: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
              transform: 'translateY(-1px)',
            },
            transition: 'all 0.2s ease',
          }}
          startIcon={<Add />}
          onClick={() => router.push(Routes.Projects.CreateOne)}
        >
          {t('clients:postJobButton', 'Post a job')}
        </Button>
      </Box>
    </Box>
  );
};

export default ClientDashboard;
