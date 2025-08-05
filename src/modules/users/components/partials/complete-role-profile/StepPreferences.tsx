import { Card, CardContent, Stack, Avatar, Typography, Grid, MenuItem, Fade } from '@mui/material';
import { Settings } from '@mui/icons-material';
import { RHFTextField, RHFSelect, RHFMultiSelect } from '@common/components/lib/react-hook-form';
import { TFunction } from 'i18next';

interface StepPreferencesProps {
  t: TFunction;
  isCreator: boolean;
}

const StepPreferences = ({ t, isCreator }: StepPreferencesProps) => {
  const projectTypeOptions = [
    'Web Development',
    'Mobile App Development',
    'UI/UX Design',
    'Graphic Design',
    'Video Production',
    'Content Creation',
    'Digital Marketing',
    'SEO',
    'Social Media Management',
    'Data Analysis',
    'Consulting',
    'Translation',
    'Voice Over',
    'Animation',
    '3D Modeling',
    'Game Development',
    'E-commerce',
  ];

  const timelineOptions = [
    { value: '1_2_weeks', label: '1-2 weeks' },
    { value: '1_month', label: '1 month' },
    { value: '2_3_months', label: '2-3 months' },
    { value: '3_6_months', label: '3-6 months' },
    { value: '6_months_plus', label: '6+ months' },
  ];

  const availabilityOptions = [
    { value: 'immediately', label: 'Immediately available' },
    { value: '1_2_weeks', label: 'Available in 1-2 weeks' },
    { value: '1_month', label: 'Available in 1 month' },
    { value: 'part_time', label: 'Part-time availability' },
    { value: 'weekends', label: 'Weekends only' },
    { value: 'evenings', label: 'Evenings only' },
  ];

  return (
    <Fade in timeout={500}>
      <Card elevation={0} sx={{ border: (theme) => `1px solid ${theme.palette.divider}` }}>
        <CardContent sx={{ p: 4 }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <Settings />
            </Avatar>
            <Typography variant="h5" fontWeight={600}>
              {isCreator ? t('creator:preferences') : t('client:project_preferences')}
            </Typography>
          </Stack>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {isCreator
              ? t('creator:preferences_description')
              : t('client:project_preferences_description')}
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <RHFMultiSelect
                name="preferredProjectTypes"
                label={
                  isCreator
                    ? t('creator:preferred_project_types')
                    : t('client:preferred_project_types')
                }
                placeholder={
                  isCreator
                    ? t('creator:select_preferred_project_types')
                    : t('client:select_preferred_project_types')
                }
                helperText={
                  isCreator
                    ? t('creator:preferred_project_types_help')
                    : t('client:preferred_project_types_help')
                }
                options={projectTypeOptions.map((type) => ({ value: type, label: type }))}
                chip
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFSelect
                name="preferredTimeline"
                label={isCreator ? t('creator:preferred_timeline') : t('client:preferred_timeline')}
                helperText={
                  isCreator
                    ? t('creator:preferred_timeline_help')
                    : t('client:preferred_timeline_help')
                }
              >
                {timelineOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </RHFSelect>
            </Grid>
            {isCreator && (
              <Grid item xs={12} md={6}>
                <RHFSelect
                  name="availability"
                  label={t('creator:availability')}
                  helperText={t('creator:availability_help')}
                >
                  {availabilityOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </RHFSelect>
              </Grid>
            )}
            {!isCreator && (
              <>
                <Grid item xs={12} md={6}>
                  <RHFTextField
                    name="defaultProjectSettings.defaultBudget"
                    label={t('client:default_budget')}
                    placeholder={t('client:enter_default_budget')}
                    helperText={t('client:default_budget_help')}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <RHFTextField
                    name="defaultProjectSettings.defaultTimeline"
                    label={t('client:default_timeline')}
                    placeholder={t('client:enter_default_timeline')}
                    helperText={t('client:default_timeline_help')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <RHFTextField
                    name="defaultProjectSettings.defaultRequirements"
                    label={t('client:default_requirements')}
                    multiline
                    rows={3}
                    placeholder={t('client:enter_default_requirements')}
                    helperText={t('client:default_requirements_help')}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </CardContent>
      </Card>
    </Fade>
  );
};

export default StepPreferences;
