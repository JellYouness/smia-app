import { forwardRef, useImperativeHandle, useEffect } from 'react';
import { Box, Grid, styled, Typography, useTheme } from '@mui/material';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import dayjs, { Dayjs } from 'dayjs';
import { RHFTextField } from '@common/components/lib/react-hook-form';
import RHFDatePicker from '@common/components/lib/react-hook-form/RHFDatePicker';
import { FormStepProps, FormStepRef } from '@common/components/lib/navigation/FormStepper';
import { AttachMoney, CalendarToday, LightbulbOutlined } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

interface FormValues {
  startDate: Dayjs;
  endDate: Dayjs;
  budget: number;
}

const SectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  paddingBottom: theme.spacing(1),
}));

const TipContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  padding: theme.spacing(2),
  backgroundColor:
    theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[100],
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(3),
}));

const schema = (t: TFunction) =>
  Yup.object({
    startDate: Yup.mixed()
      .test('is-dayjs', t('common:field_required'), (v) => dayjs.isDayjs(v) && v.isValid())
      .required(t('common:field_required')),

    endDate: Yup.mixed()
      .test('is-dayjs', t('common:field_required'), (v) => dayjs.isDayjs(v) && v.isValid())
      .test('end-after-start', t('common:end_after_start'), function (value) {
        const { startDate } = this.parent;
        if (!dayjs.isDayjs(value) || !dayjs.isDayjs(startDate)) {
          return true;
        }
        return value.isAfter(startDate);
      })
      .required(t('common:field_required')),

    budget: Yup.number()
      .typeError(t('common:field_valid_number'))
      .positive(t('common:field_positive'))
      .required(t('common:field_required')),
  });

const StepProjectResources = forwardRef<FormStepRef, FormStepProps>(({ next, data }, ref) => {
  const { t } = useTranslation(['project', 'common']);
  const theme = useTheme();

  const methods = useForm<FormValues>({
    resolver: yupResolver(schema(t)),
    defaultValues: {
      startDate: data?.startDate ? dayjs(data.startDate) : dayjs().startOf('day'),
      endDate: data?.endDate ? dayjs(data.endDate) : dayjs().add(30, 'day').endOf('day'),
      budget: data?.budget ?? 0,
    },
  });

  useEffect(() => {
    methods.reset(
      {
        startDate: data?.startDate ? dayjs(data.startDate) : dayjs().startOf('day'),
        endDate: data?.endDate ? dayjs(data.endDate) : dayjs().add(30, 'day').endOf('day'),
        budget: data?.budget ?? 0,
      },
      { keepDefaultValues: true }
    );
  }, [data, methods]);

  useImperativeHandle(ref, () => ({
    submit: async () => {
      await methods.handleSubmit((d) =>
        next({
          ...d,
          startDate: d.startDate.toISOString(),
          endDate: d.endDate.toISOString(),
        })
      )();
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
              fontSize: 20,
            }}
          />
          <Box>
            <Typography variant="subtitle2" gutterBottom fontWeight={500}>
              {t('project:steps.step2.pro_tip')}
            </Typography>
            <Typography variant="body2">{t('project:steps.step2.tip')}</Typography>
          </Box>
        </TipContainer>

        <Box mb={5}>
          <SectionHeader>
            <CalendarToday
              sx={{
                color: theme.palette.primary.main,
                mr: 1.5,
                fontSize: 18,
              }}
            />
            <Typography fontWeight={500}>{t('project:steps.step2.timeline_title')}</Typography>
          </SectionHeader>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <RHFDatePicker name="startDate" label={t('project:steps.step2.start_date')} />
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFDatePicker name="endDate" label={t('project:steps.step2.end_date')} />
            </Grid>
          </Grid>
        </Box>

        <Box mb={5}>
          <SectionHeader>
            <AttachMoney
              sx={{
                color: theme.palette.primary.main,
                mr: 1.5,
                fontSize: 18,
              }}
            />
            <Typography fontWeight={500}>{t('project:steps.step2.budget_title')}</Typography>
          </SectionHeader>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <RHFTextField
                name="budget"
                type="number"
                label={t('project:steps.step2.budget')}
                InputProps={{
                  inputProps: {
                    min: 0,
                    step: 50,
                  },
                  startAdornment: (
                    <Box
                      sx={{
                        mr: 1,
                        color: 'text.secondary',
                        fontWeight: 500,
                      }}
                    >
                      $
                    </Box>
                  ),
                }}
                sx={{
                  '& .MuiInputBase-root': {
                    paddingLeft: 2,
                  },
                }}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </FormProvider>
  );
});

export default StepProjectResources;
