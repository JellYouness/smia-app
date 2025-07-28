import React, { useState } from 'react';
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
import { Visibility, Edit, SwapHoriz, Add, Block, PersonOffOutlined } from '@mui/icons-material';
import { PROJECT_CREATOR_PERMISSION, ProjectCreator } from '../defs/types';
import useProjects, { projectCacheKey } from '../hooks/useProjects';
import { mutate } from 'swr';

interface Props {
  projectId: number;
  projectCreator: ProjectCreator;
}

const CreatorPermissionItem = ({ projectId, projectCreator }: Props) => {
  const creator = projectCreator.creator;
  const [loading, setLoading] = useState(false);
  const { updateCreatorPermission, revokeCreatorPermission, removeCreatorFromProject } =
    useProjects();

  if (!creator) {
    return null;
  }

  // 1) Generic permission updater
  const handlePermission = async (perm: PROJECT_CREATOR_PERMISSION) => {
    setLoading(true);
    try {
      await updateCreatorPermission(projectId, projectCreator.creatorId, perm, {
        displayProgress: true,
        displaySuccess: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async () => {
    setLoading(true);
    try {
      await revokeCreatorPermission(projectId, projectCreator.creatorId, {
        displayProgress: true,
        displaySuccess: true,
      });
      mutate(projectCacheKey(projectId));
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    setLoading(true);
    try {
      await removeCreatorFromProject(projectId, projectCreator.creatorId, {
        displayProgress: true,
        displaySuccess: true,
      });
      mutate(projectCacheKey(projectId));
    } finally {
      setLoading(false);
    }
  };

  const mode = (() => {
    switch (projectCreator.permission) {
      case PROJECT_CREATOR_PERMISSION.EDITOR:
        return {
          label: 'Editor',
          chipColor: 'primary' as const,
          chipBg: 'primary.main',
          icon: <Edit fontSize="small" />,
        };
      case PROJECT_CREATOR_PERMISSION.VIEWER:
        return {
          label: 'Viewer',
          chipColor: 'default' as const,
          chipBg: 'primary.light',
          icon: <Visibility fontSize="small" />,
        };
      default:
        return {
          label: 'No Permission',
          chipColor: 'warning' as const,
          chipBg: 'warning.light',
          icon: <Add fontSize="small" />,
        };
    }
  })();

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
        sx={{
          width: 44,
          height: 44,
          mr: 1,
          bgcolor: '#e0e7ef',
          fontWeight: 700,
        }}
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
          label={mode.label}
          color={mode.chipColor}
          size="small"
          icon={mode.icon as React.ReactElement}
          sx={{
            fontWeight: 600,
            letterSpacing: 1,
            px: 1.5,
            bgcolor: mode.chipBg,
            color: mode.chipColor === 'default' ? 'text.primary' : undefined,
          }}
        />

        {projectCreator.permission == null ? (
          <>
            <Tooltip title="Grant Viewer Permission">
              <span>
                <IconButton
                  size="small"
                  onClick={() => handlePermission(PROJECT_CREATOR_PERMISSION.VIEWER)}
                  disabled={loading}
                  sx={{ bgcolor: '#f5f7fa', transition: 'all .15s' }}
                >
                  {loading ? <CircularProgress size={18} /> : <Visibility fontSize="small" />}
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Grant Editor Permission">
              <span>
                <IconButton
                  size="small"
                  onClick={() => handlePermission(PROJECT_CREATOR_PERMISSION.EDITOR)}
                  disabled={loading}
                  sx={{ bgcolor: '#f5f7fa', transition: 'all .15s' }}
                >
                  {loading ? <CircularProgress size={18} /> : <Edit fontSize="small" />}
                </IconButton>
              </span>
            </Tooltip>
          </>
        ) : (
          <>
            <Tooltip
              title={
                projectCreator.permission === PROJECT_CREATOR_PERMISSION.EDITOR
                  ? 'Demote to Viewer'
                  : 'Promote to Editor'
              }
            >
              <span>
                <IconButton
                  size="small"
                  onClick={() =>
                    handlePermission(
                      projectCreator.permission === PROJECT_CREATOR_PERMISSION.EDITOR
                        ? PROJECT_CREATOR_PERMISSION.VIEWER
                        : PROJECT_CREATOR_PERMISSION.EDITOR
                    )
                  }
                  disabled={loading}
                  sx={{
                    bgcolor: '#f5f7fa',
                    transition: 'all .15s',
                  }}
                >
                  {loading ? <CircularProgress size={18} /> : <SwapHoriz fontSize="small" />}
                </IconButton>
              </span>
            </Tooltip>

            <Tooltip title="Revoke Permission">
              <span>
                <IconButton
                  size="small"
                  onClick={handleRevoke}
                  disabled={loading}
                  sx={{
                    bgcolor: '#f5f7fa',
                    transition: 'all .15s',
                  }}
                >
                  {loading ? <CircularProgress size={18} /> : <Block fontSize="small" />}
                </IconButton>
              </span>
            </Tooltip>
          </>
        )}

        <Tooltip title="Remove Creator">
          <span>
            <IconButton
              size="small"
              onClick={handleRemove}
              disabled={loading}
              sx={{ bgcolor: '#f5f7fa', transition: 'all .15s' }}
            >
              {loading ? <CircularProgress size={18} /> : <PersonOffOutlined fontSize="small" />}
            </IconButton>
          </span>
        </Tooltip>
      </Stack>
    </Paper>
  );
};

export default CreatorPermissionItem;
