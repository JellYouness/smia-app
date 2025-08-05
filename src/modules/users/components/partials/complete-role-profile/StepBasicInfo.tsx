import { Card, CardContent, Stack, Avatar, Typography, Grid, MenuItem, Fade } from '@mui/material';
import { Person, Business } from '@mui/icons-material';
import { RHFTextField, RHFSelect } from '@common/components/lib/react-hook-form';
import { TFunction } from 'i18next';

interface StepBasicInfoProps {
  t: TFunction;
  isCreator: boolean;
}

const budgetOptions = [
  { value: 'SMALL', label: 'SMALL - Under $1,000' },
  { value: 'MEDIUM', label: 'MEDIUM - $1,000 - $5,000' },
  { value: 'LARGE', label: 'LARGE - $5,000 - $10,000' },
  { value: 'ENTERPRISE', label: 'ENTERPRISE - $10,000 - $25,000' },
];

const projectCountOptions = [
  { value: '1_10', label: '1-10' },
  { value: '11_50', label: '11-50' },
  { value: '51_200', label: '51-200' },
  { value: '201_500', label: '201-500' },
  { value: '500_plus', label: '500+' },
];

const industryOptions = [
  { value: 'MEDIA', label: 'MEDIA' },
  { value: 'EDUCATION', label: 'EDUCATION' },
  { value: 'HEALTHCARE', label: 'HEALTHCARE' },
  { value: 'TECHNOLOGY', label: 'TECHNOLOGY' },
  { value: 'FINANCE', label: 'FINANCE' },
  { value: 'ENTERTAINMENT', label: 'ENTERTAINMENT' },
  { value: 'OTHER', label: 'OTHER' },
];

const companySizeOptions = [
  { value: 'INDIVIDUAL', label: 'INDIVIDUAL' },
  { value: 'SMALL', label: 'SMALL' },
  { value: 'MEDIUM', label: 'MEDIUM' },
  { value: 'LARGE', label: 'LARGE' },
  { value: 'ENTERPRISE', label: 'ENTERPRISE' },
];

const StepBasicInfo = ({ t, isCreator }: StepBasicInfoProps) => {
  return (
    <Fade in timeout={500}>
      <Card elevation={0} sx={{ border: (theme) => `1px solid ${theme.palette.divider}` }}>
        <CardContent sx={{ p: 4 }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              {isCreator ? <Person /> : <Business />}
            </Avatar>
            <Typography variant="h5" fontWeight={600}>
              {isCreator ? t('creator:basic_information') : t('client:company_information')}
            </Typography>
          </Stack>

          <Grid container spacing={3}>
            {isCreator ? (
              // Creator fields
              <>
                <Grid item xs={12} md={6}>
                  <RHFTextField
                    name="title"
                    label={t('creator:profile_title')}
                    placeholder={t('creator:enter_profile_title')}
                    helperText={t('creator:profile_title_help')}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <RHFTextField
                    name="hourlyRate"
                    label={t('creator:hourly_rate')}
                    type="number"
                    placeholder={t('creator:enter_hourly_rate')}
                    helperText={t('creator:hourly_rate_help')}
                    InputProps={{ inputProps: { min: 0 } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <RHFTextField
                    name="shortBio"
                    label={t('creator:short_bio')}
                    placeholder={t('creator:enter_short_bio')}
                    helperText={t('creator:short_bio_help')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <RHFTextField
                    name="bio"
                    label={t('creator:bio')}
                    multiline
                    rows={4}
                    placeholder={t('creator:enter_bio')}
                    helperText={t('creator:bio_help')}
                  />
                </Grid>
              </>
            ) : (
              // Client fields
              <>
                <Grid item xs={12} md={6}>
                  <RHFTextField
                    name="companyName"
                    label={t('client:company_name')}
                    placeholder={t('client:enter_company_name')}
                    helperText={t('client:company_name_help')}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <RHFSelect
                    name="companySize"
                    label={t('client:company_size')}
                    helperText={t('client:company_size_help')}
                  >
                    {companySizeOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                </Grid>
                <Grid item xs={12} md={6}>
                  <RHFSelect
                    name="industry"
                    label={t('client:industry')}
                    placeholder={t('client:enter_industry')}
                    helperText={t('client:industry_help')}
                  >
                    {industryOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                </Grid>
                <Grid item xs={12} md={6}>
                  <RHFTextField
                    name="websiteUrl"
                    label={t('client:website_url')}
                    placeholder={t('client:enter_website_url')}
                    helperText={t('client:website_url_help')}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <RHFSelect
                    name="budget"
                    label={t('client:budget')}
                    placeholder={t('client:enter_budget')}
                    helperText={t('client:budget_help')}
                  >
                    {budgetOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                </Grid>
                <Grid item xs={12} md={6}>
                  <RHFTextField
                    name="projectCount"
                    label={t('client:project_count')}
                    type="number"
                    placeholder={t('client:enter_project_count')}
                    helperText={t('client:project_count_help')}
                    InputProps={{ inputProps: { min: 0 } }}
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

export default StepBasicInfo;
