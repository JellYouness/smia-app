import { Box, Stack, Typography, Paper, Button } from '@mui/material';
import { GroupOutlined, Add } from '@mui/icons-material';
import { ProjectCreator } from '../defs/types';
import CreatorPermissionItem from './CreatorPermissionItem';
import { useRouter } from 'next/router';
import Routes from '../defs/routes';

interface Props {
  projectId: number;
  creators: ProjectCreator[];
}

const CreatorsPermissionsList = ({ projectId, creators }: Props) => {
  const router = useRouter();

  const handleInviteCreators = () => {
    router.push({
      pathname: Routes.HireCreator.replace('{id}', projectId.toString()),
      query: { step: 'invite' },
    });
  };

  if (!creators.length) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 4,
          textAlign: 'center',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e3f2fd 100%)',
          borderRadius: '16px',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <GroupOutlined
          sx={{
            fontSize: 48,
            color: 'text.secondary',
            mb: 2,
            opacity: 0.6,
          }}
        />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No Team Members Yet
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.8, mb: 3 }}>
          Start building your team by inviting creators to collaborate on this project.
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleInviteCreators}
          sx={{
            borderRadius: '12px',
            px: 3,
            py: 1.5,
            textTransform: 'none',
            fontWeight: 600,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            '&:hover': {
              boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
            },
          }}
        >
          Invite Creators
        </Button>
      </Paper>
    );
  }
  return (
    <Stack spacing={1.5}>
      {creators.map((pc) => (
        <CreatorPermissionItem key={pc.id} projectId={projectId} projectCreator={pc} />
      ))}
    </Stack>
  );
};

export default CreatorsPermissionsList;
