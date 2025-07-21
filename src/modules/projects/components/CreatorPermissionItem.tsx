import {
  Box,
  Avatar,
  Typography,
  IconButton,
  Tooltip,
  CircularProgress,
  Paper,
  Chip,
  Stack,
} from '@mui/material';
import { Visibility, Edit, SwapHoriz } from '@mui/icons-material';
import { PROJECT_CREATOR_PERMISSION, ProjectCreator } from '../defs/types';
import { useState } from 'react';
import useProjects from '../hooks/useProjects';

interface Props {
  projectId: number;
  projectCreator: ProjectCreator;
}

const CreatorPermissionItem = ({ projectId, projectCreator }: Props) => {
  const creator = projectCreator.creator;
  const [loading, setLoading] = useState(false);
  const { updateCreatorPermission } = useProjects();
  const isEditor = projectCreator.permission === PROJECT_CREATOR_PERMISSION.EDITOR;

  const handleToggle = async () => {
    setLoading(true);
    try {
      await updateCreatorPermission(
        projectId,
        projectCreator.creatorId,
        isEditor ? PROJECT_CREATOR_PERMISSION.VIEWER : PROJECT_CREATOR_PERMISSION.EDITOR,
        { displayProgress: true, displaySuccess: true }
      );
    } finally {
      setLoading(false);
    }
  };

  if (!creator) {
    return null;
  }

  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        mt: 3,
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        background: 'linear-gradient(90deg, #f8fafc 70%, #e3f2fd 100%)',
        boxShadow: '0 2px 8px rgba(80,120,200,0.06)',
      }}
    >
      <Avatar
        src={creator.user?.profileImage}
        sx={{ width: 44, height: 44, mr: 1, bgcolor: '#e0e7ef', fontWeight: 700 }}
      >
        {!creator.user?.profileImage && creator.user?.firstName ? creator.user.firstName[0] : ''}
      </Avatar>
      <Box flex={1} minWidth={0}>
        <Typography variant="subtitle1" fontWeight={600} noWrap>
          {creator.user?.firstName} {creator.user?.lastName}
        </Typography>
        {creator.user?.email && (
          <Typography variant="caption" color="text.secondary" noWrap>
            {creator.user.email}
          </Typography>
        )}
      </Box>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Chip
          label={isEditor ? 'Editor' : 'Viewer'}
          color={isEditor ? 'primary' : 'default'}
          size="small"
          sx={{
            fontWeight: 600,
            letterSpacing: 1,
            px: 1.5,
            bgcolor: isEditor ? 'primary.main' : 'primary.light',
          }}
        />
        <Tooltip title={`Toggle to ${isEditor ? 'Viewer' : 'Editor'}`}>
          <span>
            <IconButton
              size="small"
              onClick={handleToggle}
              disabled={loading}
              sx={{
                bgcolor: '#f5f7fa',
                '&:hover': {
                  bgcolor: isEditor ? 'primary.main' : 'grey.300',
                  color: isEditor ? '#fff' : 'inherit',
                },
                transition: 'all 0.15s',
              }}
            >
              {loading ? <CircularProgress size={18} /> : <SwapHoriz fontSize="small" />}
            </IconButton>
          </span>
        </Tooltip>
      </Stack>
    </Paper>
  );
};

export default CreatorPermissionItem;
