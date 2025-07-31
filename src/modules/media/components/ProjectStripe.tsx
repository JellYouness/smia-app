import { Box, Typography, Button, Chip, CircularProgress } from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Refresh,
  PlayArrow,
  ArrowForwardIos,
  Warning,
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import useProjects, { projectCacheKey } from '@modules/projects/hooks/useProjects';
import useAuth from '@modules/auth/hooks/api/useAuth';
import { PROJECT_STATUS, Project } from '@modules/projects/defs/types';

import { useState } from 'react';
import { mutate } from 'swr';
import ConfirmDialog from '@common/components/lib/feedbacks/ConfirmDialog';

interface ProjectStripeProps {
  project: Project;
}

const ProjectStripe = ({ project }: ProjectStripeProps) => {
  const router = useRouter();
  const { t } = useTranslation(['project', 'common']);
  const { patchOne } = useProjects({ autoRefetchAfterMutation: false });
  const { user } = useAuth();
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const isProjectOwner = user?.client?.id === project.clientId;
  const isInProgress = project.status === PROJECT_STATUS.IN_PROGRESS;
  const isCompleted = project.status === PROJECT_STATUS.COMPLETED;
  const isCancelled = project.status === PROJECT_STATUS.CANCELLED;

  const handleProjectClick = () => {
    router.push(`/projects/${project.id}`);
  };

  const handleMarkAsCompleted = async () => {
    setLoadingAction('complete');
    try {
      mutate(
        projectCacheKey(project.id),
        { data: { item: { ...project, status: PROJECT_STATUS.COMPLETED } } },
        false
      );
      await patchOne(project.id, { status: PROJECT_STATUS.COMPLETED });
      mutate(projectCacheKey(project.id));
    } catch (error) {
      console.error('Failed to mark project as completed:', error);
      mutate(projectCacheKey(project.id));
    } finally {
      setLoadingAction(null);
    }
  };

  const handleCancelProject = async () => {
    setShowCancelDialog(false);
    setLoadingAction('cancel');
    try {
      mutate(
        projectCacheKey(project.id),
        { data: { item: { ...project, status: PROJECT_STATUS.CANCELLED } } },
        false
      );
      await patchOne(project.id, { status: PROJECT_STATUS.CANCELLED });
      mutate(projectCacheKey(project.id));
    } catch (error) {
      console.error('Failed to cancel project:', error);
      mutate(projectCacheKey(project.id));
    } finally {
      setLoadingAction(null);
    }
  };

  const handleCancelClick = () => {
    setShowCancelDialog(true);
  };

  const handleReactivateProject = async () => {
    setLoadingAction('reactivate');
    try {
      mutate(
        projectCacheKey(project.id),
        { data: { item: { ...project, status: PROJECT_STATUS.IN_PROGRESS } } },
        false
      );
      await patchOne(project.id, { status: PROJECT_STATUS.IN_PROGRESS });
      mutate(projectCacheKey(project.id));
    } catch (error) {
      console.error('Failed to reactivate project:', error);
      mutate(projectCacheKey(project.id));
    } finally {
      setLoadingAction(null);
    }
  };

  const getStatusConfig = () => {
    switch (project.status) {
      case PROJECT_STATUS.IN_PROGRESS:
        return {
          label: 'In Progress',
          color: '#10B981',
          bgColor: 'rgba(16, 185, 129, 0.1)',
          dotColor: '#10B981',
        };
      case PROJECT_STATUS.COMPLETED:
        return {
          label: 'Completed',
          color: '#059669',
          bgColor: 'rgba(5, 150, 105, 0.1)',
          dotColor: '#059669',
        };
      case PROJECT_STATUS.CANCELLED:
        return {
          label: 'Cancelled',
          color: '#6B7280',
          bgColor: 'rgba(107, 114, 128, 0.1)',
          dotColor: '#6B7280',
        };
      default:
        return {
          label: 'Unknown',
          color: '#6B7280',
          bgColor: 'rgba(107, 114, 128, 0.1)',
          dotColor: '#6B7280',
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 64,
        left: 0,
        right: 0,
        height: 60,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        px: 4,
        gap: 3,
      }}
    >
      {/* Project Info Section */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          flex: 1,
          minWidth: 0,
          cursor: 'pointer',
          py: 1,
          px: 2,
          borderRadius: 2,
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.02)',
          },
        }}
        onClick={handleProjectClick}
      >
        {/* Project Title */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: '#111827',
            fontSize: '1.125rem',
            letterSpacing: '-0.025em',
            lineHeight: 1.4,
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            minWidth: 0,
          }}
        >
          {project.title}
        </Typography>

        {/* Navigate Icon */}
        <ArrowForwardIos
          sx={{
            fontSize: 14,
            color: '#9CA3AF',
            flexShrink: 0,
          }}
        />

        {/* Status Indicator */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            backgroundColor: statusConfig.bgColor,
            px: 2,
            py: 0.75,
            borderRadius: 2,
            flexShrink: 0,
          }}
        >
          <Box
            sx={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: statusConfig.dotColor,
              flexShrink: 0,
            }}
          />
          <Typography
            variant="caption"
            sx={{
              fontWeight: 500,
              color: statusConfig.color,
              fontSize: '0.75rem',
              letterSpacing: '0.025em',
            }}
          >
            {t(`project:${project.status.toLowerCase()}`, statusConfig.label)}
          </Typography>
        </Box>
      </Box>

      {/* Action Buttons */}
      {isProjectOwner && (
        <Box sx={{ display: 'flex', gap: 1.5, flexShrink: 0 }}>
          {isInProgress && (
            <>
              <Button
                variant="contained"
                size="small"
                startIcon={
                  loadingAction === 'complete' ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    <CheckCircle sx={{ fontSize: 16 }} />
                  )
                }
                onClick={handleMarkAsCompleted}
                disabled={loadingAction !== null}
                sx={{
                  backgroundColor: '#059669',
                  color: 'white',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  textTransform: 'none',
                  borderRadius: 2,
                  px: 2.5,
                  py: 1,
                  minWidth: 'auto',
                  boxShadow: 'none',
                  '&:hover': {
                    backgroundColor: '#047857',
                    boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)',
                  },
                  '&:disabled': {
                    backgroundColor: '#E5E7EB',
                    color: '#9CA3AF',
                  },
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                {loadingAction === 'complete'
                  ? t('common:loading', 'Loading...')
                  : t('project:mark_as_completed', 'Complete')}
              </Button>

              <Button
                variant="outlined"
                size="small"
                startIcon={
                  loadingAction === 'cancel' ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    <Cancel sx={{ fontSize: 16 }} />
                  )
                }
                onClick={handleCancelClick}
                disabled={loadingAction !== null}
                sx={{
                  borderColor: '#D1D5DB',
                  color: '#6B7280',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  textTransform: 'none',
                  borderRadius: 2,
                  px: 2.5,
                  py: 1,
                  minWidth: 'auto',
                  '&:hover': {
                    borderColor: '#9CA3AF',
                    backgroundColor: 'rgba(107, 114, 128, 0.04)',
                    color: '#374151',
                  },
                  '&:disabled': {
                    borderColor: '#E5E7EB',
                    color: '#D1D5DB',
                  },
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                {loadingAction === 'cancel'
                  ? t('common:loading', 'Loading...')
                  : t('project:cancel_project', 'Cancel')}
              </Button>
            </>
          )}

          {(isCompleted || isCancelled) && (
            <Button
              variant="contained"
              size="small"
              startIcon={
                loadingAction === 'reactivate' ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <PlayArrow sx={{ fontSize: 16 }} />
                )
              }
              onClick={handleReactivateProject}
              disabled={loadingAction !== null}
              sx={{
                backgroundColor: '#3B82F6',
                color: 'white',
                fontWeight: 500,
                fontSize: '0.875rem',
                textTransform: 'none',
                borderRadius: 2,
                px: 2.5,
                py: 1,
                minWidth: 'auto',
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: '#2563EB',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                },
                '&:disabled': {
                  backgroundColor: '#E5E7EB',
                  color: '#9CA3AF',
                },
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              {loadingAction === 'reactivate'
                ? t('common:loading', 'Loading...')
                : t('project:reactivate_project', 'Reactivate')}
            </Button>
          )}
        </Box>
      )}

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        open={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Warning sx={{ color: '#DC2626', fontSize: 20 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#DC2626' }}>
              {t('project:cancel_project_warning_title', 'Cancel Project')}
            </Typography>
          </Box>
        }
        content={
          <Box sx={{ mt: 1 }}>
            <Typography variant="body1" sx={{ mb: 2, color: '#374151' }}>
              {t(
                'project:cancel_project_warning_message',
                'Are you sure you want to cancel this project? This action is irreversible and will result in:'
              )}
            </Typography>
            <Box component="ul" sx={{ pl: 2, mb: 2 }}>
              <Typography component="li" variant="body2" sx={{ mb: 1, color: '#6B7280' }}>
                {t(
                  'project:cancel_project_warning_access',
                  'Loss of access to the media management workspace'
                )}
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1, color: '#6B7280' }}>
                {t(
                  'project:cancel_project_warning_reactivate',
                  'Inability to reactivate or reopen the project'
                )}
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1, color: '#6B7280' }}>
                {t(
                  'project:cancel_project_warning_media',
                  'All media content and project data will be permanently lost'
                )}
              </Typography>
              <Typography component="li" variant="body2" sx={{ color: '#6B7280' }}>
                {t(
                  'project:cancel_project_warning_creators',
                  'All creator assignments and collaborations will be terminated'
                )}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#DC2626', fontWeight: 500 }}>
              {t(
                'project:cancel_project_warning_final',
                'This action cannot be undone. Please confirm that you understand these consequences.'
              )}
            </Typography>
          </Box>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={handleCancelProject}
            disabled={loadingAction === 'cancel'}
            startIcon={
              loadingAction === 'cancel' ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <Cancel />
              )
            }
            sx={{
              fontWeight: 500,
              textTransform: 'none',
              px: 3,
            }}
          >
            {loadingAction === 'cancel'
              ? t('common:loading', 'Loading...')
              : t('project:confirm_cancel_project', 'Yes, Cancel Project')}
          </Button>
        }
      />
    </Box>
  );
};

export default ProjectStripe;
