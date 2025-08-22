import { forwardRef, useImperativeHandle, useEffect } from 'react';
import { Box, Grid, styled, Typography, useTheme, Card, CardContent } from '@mui/material';
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
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(3),
  background: `linear-gradient(135deg, ${theme.palette.info.light}15 0%, ${theme.palette.info.light}25 100%)`,
  border: `1px solid ${theme.palette.info.light}40`,
  boxShadow: `0 4px 10px ${theme.palette.info.light}20`,
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
              color: theme.palette.info.main,
              mr: 2,
              mt: 0.5,
            }}
          />
          <Box>
            <Typography
              variant="subtitle2"
              gutterBottom
              sx={{ color: theme.palette.info.dark, fontWeight: 600 }}
            >
              {t('project:steps.step1.pro_tip')}
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.info.dark, opacity: 0.9 }}>
              {t('project:steps.step1.tip')}
            </Typography>
          </Box>
        </TipContainer>

        <Card elevation={2}>
          <CardContent sx={{ p: 4 }}>
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
          </CardContent>
        </Card>
      </Box>
    </FormProvider>
  );
});

export default StepProjectDetails;
