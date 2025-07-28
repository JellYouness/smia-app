import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  TextField,
  Button,
  CircularProgress,
  Snackbar,
  Stack,
  Divider,
  Tooltip,
  Modal,
} from '@mui/material';
import {
  Edit as EditIcon,
  AttachMoney,
  CalendarToday,
  Edit as EditIcon2,
  CheckCircle,
  PlayArrow,
  Check,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import useProjectUpdates from '@modules/projects/hooks/useProjectUpdates';
import useProjects, { projectCacheKey } from '@modules/projects/hooks/useProjects';
import {
  Project,
  PROJECT_UPDATE_TYPE,
  ProjectUpdate,
  PROJECT_STATUS,
} from '@modules/projects/defs/types';
import useSWR from 'swr';
import dayjs from 'dayjs';
import UpsertProjectStepper from '../UpsertProjectStepper';
import StepperEmptyState from '../StepperEmptyState';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import RHFTextField from '@common/components/lib/react-hook-form/RHFTextField';
import Routes from '@common/defs/routes';
import { useRouter } from 'next/router';

interface KickoffProjectStepProps {
  projectId: number;
  project?: Project;
}

const KickoffProjectStep = ({ projectId, project: propProject }: KickoffProjectStepProps) => {
  const router = useRouter();
  const { t } = useTranslation(['project', 'common']);
  const { readOne } = useProjects();
  const { createOne, readAllByProject } = useProjectUpdates();
  const {
    data: projectData,
    isLoading: projectLoading,
    mutate,
  } = useSWR(projectCacheKey(projectId), () => readOne(projectId));
  const project = projectData?.data?.item || propProject;

  const [editOpen, setEditOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [kickoffUpdate, setKickoffUpdate] = useState<null | ProjectUpdate>(null);
  const [updatesLoading, setUpdatesLoading] = useState(true);

  useEffect(() => {
    fetchKickoffUpdate();
  }, [projectId, success]);

  const fetchKickoffUpdate = async () => {
    setUpdatesLoading(true);
    const res = await readAllByProject(projectId, 1, 1);
    if (res.success && res.data?.items?.length) {
      const kickoff = res.data.items.find((u) => u.type === PROJECT_UPDATE_TYPE.UPDATE);
      setKickoffUpdate(kickoff || null);
    } else {
      setKickoffUpdate(null);
    }
    setUpdatesLoading(false);
  };

  const MessageSchema = Yup.object().shape({
    message: Yup.string()
      .required(t('project:kickoff_message_required', 'Kick-off message is required'))
      .min(5, t('project:kickoff_message_too_short', 'Message is too short'))
      .max(1000, t('project:kickoff_message_too_long', 'Message is too long')),
  });

  const methods = useForm({
    resolver: yupResolver(MessageSchema),
    defaultValues: { message: '' },
  });

  const { handleSubmit, reset } = methods;

  const formatDate = (date?: string) => (date ? dayjs(date).format('MMM D, YYYY') : '');
  const formatBudget = (budget?: number) => (budget ? `$${Number(budget).toLocaleString()}` : '');

  const handleSend = async (data: { message: string }) => {
    setSending(true);
    setError(null);
    try {
      const res = await createOne({
        clientId: project?.clientId,
        projectId,
        body: data.message,
        type: PROJECT_UPDATE_TYPE.UPDATE,
      });
      if (res.success) {
        reset();
        setSuccess(true);
      } else {
        setError(t('project:send_update_failed', 'Failed to send update.'));
      }
    } catch (e) {
      setError(t('project:send_update_failed', 'Failed to send update.'));
    } finally {
      setSending(false);
    }
  };

  const handleModalClose = () => {
    setEditOpen(false);
    mutate();
  };

  const dataReady = !projectLoading && !updatesLoading;

  if (projectLoading || !project || !dataReady) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight={300}
      >
        <CircularProgress size={40} thickness={4} sx={{ mb: 2 }} />
        <Typography variant="body1">{t('project:loading_project_details_title')}</Typography>
      </Box>
    );
  }

  // Handle different project statuses
  if (project.status === PROJECT_STATUS.DRAFT) {
    return (
      <Box minHeight={500} display="flex" justifyContent="center" alignItems="center">
        <StepperEmptyState
          icon={<EditIcon2 />}
          title={t('project:draft_project_kickoff_title', 'Project is in Draft Mode')}
          description={t(
            'project:draft_project_kickoff_description',
            'Your project needs to be published before you can start managing media and kickoff the project. Complete your project setup to make it live.'
          )}
          buttonText={t('project:edit_project', 'Edit Project')}
          buttonIcon={<EditIcon2 />}
          onButtonClick={() => {
            router.push(Routes.Projects.UpdateOne.replace('{id}', projectId.toString()));
          }}
        />
      </Box>
    );
  }

  if (project.status === PROJECT_STATUS.COMPLETED) {
    return (
      <Box minHeight={500} display="flex" justifyContent="center" alignItems="center">
        <StepperEmptyState
          icon={<Check fontSize="large" />}
          title={t('project:completed_project_kickoff_title', 'Project Completed!')}
          description={t(
            'project:completed_project_kickoff_description',
            'Congratulations! This project has been successfully completed. You can view all the media content and project details in the workspace.'
          )}
          buttonText={t('project:go_to_workspace', 'Go to Workspace')}
          buttonIcon={<PlayArrow />}
          onButtonClick={() => {
            router.push(Routes.Projects.Workspace.replace('{id}', projectId.toString()));
          }}
        />
      </Box>
    );
  }

  if (project.status !== PROJECT_STATUS.IN_PROGRESS) {
    return (
      <Box minHeight={500} display="flex" justifyContent="center" alignItems="center">
        <StepperEmptyState
          icon={<EditIcon2 />}
          title={t('project:unknown_status_kickoff_title', 'Project Status Unknown')}
          description={t(
            'project:unknown_status_kickoff_description',
            'Unable to determine project status. Please contact support if this issue persists.'
          )}
          showButton={false}
        />
      </Box>
    );
  }

  return (
    <Box>
      {/* Project Brief Card */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box display="flex" alignItems="flex-start" justifyContent="space-between">
            <Box>
              <Typography variant="h6" fontWeight={600} sx={{ wordBreak: 'break-word' }}>
                {project.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
                {project.description}
              </Typography>
              <Stack
                direction="row"
                spacing={3}
                divider={<Divider orientation="vertical" flexItem />}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <AttachMoney fontSize="small" sx={{ color: 'success.main' }} />
                  <Typography variant="body2">{formatBudget(project.budget)}</Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <CalendarToday fontSize="small" sx={{ color: 'info.main' }} />
                  <Typography variant="body2">
                    {formatDate(project.startDate)} - {formatDate(project.endDate)}
                  </Typography>
                </Stack>
              </Stack>
            </Box>
            {kickoffUpdate && !updatesLoading && (
              <Tooltip title={t('project:edit_project', 'Edit project')}>
                <IconButton onClick={() => setEditOpen(true)} size="small" sx={{ ml: 2 }}>
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Kick-off Message Sender or Callout */}
      {updatesLoading && (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={120}>
          <CircularProgress size={32} />
        </Box>
      )}
      {!updatesLoading && kickoffUpdate ? (
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Typography variant="subtitle1" fontWeight={600} color="primary">
                {t('project:kickoff_posted_on', 'Kick-off posted on {{date}}', {
                  date: kickoffUpdate.createdAt ? formatDate(kickoffUpdate.createdAt) : '',
                })}
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
              {kickoffUpdate.body}
            </Typography>
            <Box display="flex" justifyContent="flex-end" mt={3}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => {
                  router.push(Routes.Projects.Workspace.replace('{id}', projectId.toString()));
                }}
              >
                {t('project:go_to_workspace', 'Go to Workspace')}
              </Button>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent>
            <Typography variant="subtitle1" fontWeight={600} mb={2}>
              {t('project:kickoff_message_label', 'Post your first project update')}
            </Typography>
            <FormProvider {...methods}>
              <RHFTextField
                name="message"
                label={t('project:kickoff_message_placeholder', 'Kick-off message')}
                multiline
                minRows={4}
                disabled={sending}
                sx={{ mb: 2 }}
              />
              <Box display="flex" justifyContent="flex-end">
                <Button variant="contained" onClick={handleSubmit(handleSend)} disabled={sending}>
                  {sending ? t('common:sending', 'Sending...') : t('project:send_kickoff', 'Send')}
                </Button>
              </Box>
            </FormProvider>
          </CardContent>
        </Card>
      )}

      {/* Success Snackbar */}
      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
        message={t('project:kickoff_sent_success', 'Kick-off message sent!')}
      />

      <Modal open={editOpen} onClose={handleModalClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 3,
            minWidth: 360,
            maxWidth: '95vw',
            maxHeight: '90vh',
            overflowY: 'auto',
          }}
        >
          <UpsertProjectStepper
            projectId={projectId}
            projectOwnerId={project?.clientId ?? 0}
            quickEdit
            onComplete={handleModalClose}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default KickoffProjectStep;
