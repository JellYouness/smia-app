import FormStepper, {
  FormStep,
  FormStepProps,
  FormStepRef,
  StepComponent,
} from '@common/components/lib/navigation/FormStepper';
import Routes from '@common/defs/routes';
import useProjects, { CreateOneInput } from '@modules/projects/hooks/useProjects';
import useProjectUpdates from '@modules/projects/hooks/useProjectUpdates';
import { PROJECT_UPDATE_TYPE, Project, PROJECT_STATUS } from '@modules/projects/defs/types';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

import { useEffect, useMemo, useState } from 'react';
import { Box, CircularProgress, Typography, Alert, Button } from '@mui/material';
import StepProjectResources from './create/StepProjectResources';
import StepProjectDetails from './create/StepProjectDetails';
import dayjs from 'dayjs';
import useAuth from '@modules/auth/hooks/api/useAuth';

enum CREATE_PROJECT_STEP_ID {
  DETAILS = 'details',
  RESOURCES = 'resources',
}

interface UpsertProjectStepperProps {
  projectId?: number;
  projectOwnerId: number;
  quickEdit?: boolean;
  onComplete?: () => void;
}

const isSameDay = (a?: string | Date, b?: string | Date) =>
  !!a && !!b && dayjs(a).isSame(dayjs(b), 'day');

const UpsertProjectStepper = ({
  projectId,
  projectOwnerId,
  quickEdit,
  onComplete,
}: UpsertProjectStepperProps) => {
  const { readOne, createOne, updateOne } = useProjects({ autoRefetchAfterMutation: false });
  const router = useRouter();
  const { t } = useTranslation(['project', 'common']);
  const { user, mutate } = useAuth();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(Boolean(projectId));
  const [redirecting, setRedirecting] = useState<boolean>(false);
  const [createdProjectId, setCreatedProjectId] = useState<number | null>(null);
  const [permissionCheckAttempts, setPermissionCheckAttempts] = useState(0);

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  // Poll for permission readiness
  useEffect(() => {
    if (redirecting && createdProjectId && user) {
      const checkPermission = () => {
        const hasProjectPermission = user.permissionsNames?.some(
          (permission: string) => permission === `projects.${createdProjectId}.read`
        );

        if (hasProjectPermission) {
          // Permission is ready, redirect now
          router.push({
            pathname: Routes.Projects.HireCreator.replace('{id}', createdProjectId.toString()),
            query: { step: 'invite' },
          });
        } else if (permissionCheckAttempts < 10) {
          // Try again in 1 second
          setPermissionCheckAttempts((prev) => prev + 1);
          setTimeout(() => {
            mutate(); // Refresh user data to get latest permissions
          }, 1000);
        }
      };

      const interval = setInterval(checkPermission, 1000);
      return () => clearInterval(interval);
    }
  }, [redirecting, createdProjectId, user, permissionCheckAttempts, router, mutate]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      if (!projectId) {
        return;
      }
      const res = await readOne(projectId);
      if (res.data) {
        setProject(res.data.item);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const steps = useMemo(
    (): FormStep<CREATE_PROJECT_STEP_ID>[] => [
      {
        id: CREATE_PROJECT_STEP_ID.DETAILS,
        label: t('project:steps.step1.step_title'),
        component: StepProjectDetails as unknown as StepComponent<FormStepRef, FormStepProps>,
      },
      {
        id: CREATE_PROJECT_STEP_ID.RESOURCES,
        label: t('project:steps.step2.step_title'),
        component: StepProjectResources as unknown as StepComponent<FormStepRef, FormStepProps>,
      },
    ],
    [t]
  );

  const isEdit = Boolean(project);
  const { createOne: createProjectUpdate, readAllByProject } = useProjectUpdates();

  const upsert = async (data: CreateOneInput, statusOverride?: PROJECT_STATUS) => {
    const payload: CreateOneInput = {
      ...data,
      clientId: projectOwnerId,
      status: statusOverride ?? project?.status ?? PROJECT_STATUS.IN_PROGRESS,
    };

    return isEdit
      ? updateOne(project!.id, payload, { displayProgress: true, displaySuccess: true })
      : createOne(payload, { displayProgress: true, displaySuccess: true });
  };

  const handleManualRedirect = () => {
    if (createdProjectId) {
      router.push({
        pathname: Routes.Projects.HireCreator.replace('{id}', createdProjectId.toString()),
        query: { step: 'invite' },
      });
    }
  };

  const onSubmit = async (data: CreateOneInput) => {
    const res = await upsert(data, PROJECT_STATUS.IN_PROGRESS);
    if (res.success) {
      if (isEdit && project) {
        const updatesRes = await readAllByProject(project.id, 1, 1);
        if (updatesRes.success && updatesRes.data?.items?.length) {
          const updates: string[] = [];
          if (data.title && data.title !== project.title) {
            updates.push(`Project title updated: '${project.title}' → '${data.title}'.`);
          }
          if (data.description && data.description !== project.description) {
            updates.push(
              `Project description updated:\nBefore: "${project.description || ''}"\nAfter: "${
                data.description || ''
              }"`
            );
          }

          const oldBudgetNum = parseFloat(String(project.budget ?? 0));
          const newBudgetNum = Number(data.budget ?? 0);

          if (!Number.isNaN(newBudgetNum) && newBudgetNum !== oldBudgetNum) {
            const fmt = (n: number) =>
              n.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              });

            updates.push(`Budget updated: $${fmt(oldBudgetNum)} → $${fmt(newBudgetNum)}.`);
          }

          const startChanged = !isSameDay(data.startDate, project.startDate);
          const endChanged = !isSameDay(data.endDate, project.endDate);
          if (startChanged && endChanged) {
            updates.push(
              `Timeline updated:\nStart: ${dayjs(project.startDate).format(
                'MMM D, YYYY'
              )} → ${dayjs(data.startDate).format('MMM D, YYYY')}\nEnd: ${dayjs(
                project.endDate
              ).format('MMM D, YYYY')} → ${dayjs(data.endDate).format('MMM D, YYYY')}`
            );
          } else if (startChanged) {
            updates.push(
              `Start date updated: ${dayjs(project.startDate).format('MMM D, YYYY')} → ${dayjs(
                data.startDate
              ).format('MMM D, YYYY')}.`
            );
          } else if (endChanged) {
            updates.push(
              `End date updated: ${dayjs(project.endDate).format('MMM D, YYYY')} → ${dayjs(
                data.endDate
              ).format('MMM D, YYYY')}.`
            );
          }
          if (updates.length) {
            await Promise.all(
              updates.map((body) =>
                createProjectUpdate({
                  clientId: projectOwnerId,
                  projectId: project.id,
                  body,
                  type: PROJECT_UPDATE_TYPE.UPDATE,
                })
              )
            );
          }
        }
      }
      if (!quickEdit) {
        // For new projects or when activating a draft, show redirecting state for debugging
        if (
          (!isEdit && res.data?.item?.id) ||
          (isEdit && project?.status === PROJECT_STATUS.DRAFT && res.data?.item?.id)
        ) {
          // Show redirecting state and start permission polling
          setRedirecting(true);
          setCreatedProjectId(res.data?.item?.id || null);
          setPermissionCheckAttempts(0);
        } else {
          router.push(Routes.Common.Home);
        }
      }
      if (onComplete) {
        onComplete();
      }
      return true;
    }
    return false;
  };

  const onSaveDraft = async (data: CreateOneInput) => {
    const res = await upsert(data, PROJECT_STATUS.DRAFT);
    if (res.success) {
      if (!quickEdit) {
        router.push(Routes.Common.Home);
      }
      if (onComplete) {
        onComplete();
      }
      return true;
    }
    return false;
  };

  const initialData = project
    ? {
        ...project,
        startDate: project.startDate,
        endDate: project.endDate,
      }
    : undefined;

  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="40vh"
        gap={3}
        sx={{
          width: '100%',
          py: 8,
        }}
      >
        <CircularProgress size={48} thickness={4} color="primary" />
        <Typography variant="h5" fontWeight={500} color="text.primary" sx={{ mt: 2 }}>
          {t('project:loading_project_form')}
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center" maxWidth={400}>
          {t('project:loading_project_form_description')}
        </Typography>
      </Box>
    );
  }

  if (redirecting) {
    const hasPermission = user?.permissionsNames?.some(
      (permission: string) => permission === `projects.${createdProjectId}.read`
    );

    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="40vh"
        gap={3}
        sx={{
          width: '100%',
          py: 8,
        }}
      >
        <CircularProgress size={48} thickness={4} color="primary" />
        <Typography variant="h5" fontWeight={500} color="text.primary" sx={{ mt: 2 }}>
          {t('project:project_created_successfully', 'Project Created Successfully!')}
        </Typography>
        <Typography variant="body1" fontWeight={600} mb={1}>
          {t('project:redirecting_to_invite', 'Redirecting to invite page...')}
        </Typography>
        <Button variant="outlined" onClick={handleManualRedirect} sx={{ mt: 2 }}>
          Manual Redirect to Invite Page
        </Button>
      </Box>
    );
  }

  return (
    <FormStepper<CreateOneInput, CREATE_PROJECT_STEP_ID>
      id={`upsert-project-${projectId ?? 'new'}`}
      steps={steps}
      onSubmit={onSubmit}
      {...(quickEdit ? {} : { onSaveDraft })}
      initialData={initialData as CreateOneInput}
    />
  );
};

export default UpsertProjectStepper;
