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
import { Box, CircularProgress, Typography } from '@mui/material';
import StepProjectResources from './create/StepProjectResources';
import StepProjectDetails from './create/StepProjectDetails';
import dayjs from 'dayjs';

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
  const { readOne, createOne, updateOne } = useProjects();
  const router = useRouter();
  const { t } = useTranslation(['project', 'common']);

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(Boolean(projectId));

  useEffect(() => {
    fetchProject();
  }, [projectId]);

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

  const onSubmit = async (data: CreateOneInput) => {
    const res = await upsert(data, PROJECT_STATUS.IN_PROGRESS);
    if (res.success) {
      if (isEdit && project) {
        const updatesRes = await readAllByProject(project.id, 1, 1);
        if (updatesRes.success && updatesRes.data?.items?.length) {
          const updates: string[] = [];
          if (data.title && data.title !== project.title) {
            updates.push(`Project title updated to ‘${data.title}’.`);
          }
          if (data.description && data.description !== project.description) {
            updates.push('Project description was revised.');
          }
          if (typeof data.budget === 'number' && data.budget !== project.budget) {
            updates.push(`Budget adjusted to $${data.budget}.`);
          }
          const startChanged = !isSameDay(data.startDate, project.startDate);
          const endChanged = !isSameDay(data.endDate, project.endDate);
          if (startChanged && endChanged) {
            updates.push(
              `Timeline updated: ${dayjs(data.startDate).format('MMM D, YYYY')} → ${dayjs(
                data.endDate
              ).format('MMM D, YYYY')}.`
            );
          } else if (startChanged) {
            updates.push(`Start date moved to ${dayjs(data.startDate).format('MMM D, YYYY')}.`);
          } else if (endChanged) {
            updates.push(`End date moved to ${dayjs(data.endDate).format('MMM D, YYYY')}.`);
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
        router.push(Routes.Common.Home);
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
