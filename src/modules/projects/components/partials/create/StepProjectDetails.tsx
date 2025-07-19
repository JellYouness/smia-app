import { forwardRef, useImperativeHandle, useEffect } from 'react';
import { Box, Grid, styled, Typography, useTheme } from '@mui/material';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { RHFTextField } from '@common/components/lib/react-hook-form';
import { FormStepProps, FormStepRef } from '@common/components/lib/navigation/FormStepper';
import { LightbulbOutlined } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

interface FormValues {
  title: string;
  description: string;
}

const schema = (t: TFunction) =>
  Yup.object({
    title: Yup.string().required(t('common:field_required')),
    description: Yup.string().required(t('common:field_required')),
  });

const TipContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  padding: theme.spacing(2),
  backgroundColor:
    theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[100],
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(3),
}));

const StepProjectDetails = forwardRef<FormStepRef, FormStepProps>(({ next, data }, ref) => {
  const { t } = useTranslation(['project', 'common']);
  const theme = useTheme();

  const methods = useForm<FormValues>({
    resolver: yupResolver(schema(t)),
    defaultValues: {
      title: data?.title ?? '',
      description: data?.description ?? '',
    },
  });

  useEffect(() => {
    methods.reset({
      title: data?.title ?? '',
      description: data?.description ?? '',
    });
  }, [data, methods]);

  useImperativeHandle(ref, () => ({
    submit: async () => {
      await methods.handleSubmit((d) => next(d))();
    },
  }));

  return (
    <FormProvider {...methods}>
      <Box sx={{ p: 3 }}>
        <TipContainer>
          <LightbulbOutlined
            sx={{
              color: theme.palette.warning.main,
              mr: 2,
              mt: 0.5,
            }}
          />
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              {t('project:steps.step1.pro_tip')}
            </Typography>
            <Typography variant="body2">{t('project:steps.step1.tip')}</Typography>
          </Box>
        </TipContainer>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <RHFTextField
              name="title"
              label={t('project:steps.step1.title')}
              inputProps={{ maxLength: 60 }}
            />
          </Grid>
          <Grid item xs={12}>
            <RHFTextField
              name="description"
              label={t('project:steps.step1.description')}
              multiline
              rows={6}
              inputProps={{ maxLength: 500 }}
            />
          </Grid>
        </Grid>
      </Box>
    </FormProvider>
  );
});

export default StepProjectDetails;
