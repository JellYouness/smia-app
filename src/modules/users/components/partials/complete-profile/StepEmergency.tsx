import { Card, CardContent, Stack, Avatar, Typography, Grid, Fade } from '@mui/material';
import { ContactEmergency } from '@mui/icons-material';
import { RHFTextField, RHFPhoneField } from '@common/components/lib/react-hook-form';
import { TFunction } from 'i18next';

const StepEmergency = ({ methods, t }: { methods: any; t: TFunction }) => {
  return (
    <Fade in timeout={500}>
      <Card elevation={0} sx={{ border: (theme) => `1px solid ${theme.palette.divider}` }}>
        <CardContent sx={{ p: 4 }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
            <Avatar sx={{ bgcolor: 'error.main' }}>
              <ContactEmergency />
            </Avatar>
            <Typography variant="h5" fontWeight={600}>
              {t('user:emergency_contact')}
            </Typography>
          </Stack>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <RHFTextField
                name="emergencyContact.name"
                label={t('user:emergency_contact_name')}
                placeholder={t('user:enter_emergency_contact_name')}
                helperText={t('user:emergency_contact_name_help')}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFTextField
                name="emergencyContact.relationship"
                label={t('user:emergency_contact_relationship')}
                placeholder={t('user:enter_emergency_contact_relationship')}
                helperText={t('user:emergency_contact_relationship_help')}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFPhoneField
                name="emergencyContact.phone"
                label={t('user:emergency_contact_phone')}
                placeholder={t('user:enter_emergency_contact_phone')}
                helperText={t('user:emergency_contact_phone_help')}
                defaultCountry="FR"
                forceCallingCode
                focusOnSelectCountry={false}
                preferredCountries={['FR', 'US', 'GB', 'DE', 'ES', 'IT']}
                onlyCountries={[
                  'FR',
                  'US',
                  'GB',
                  'DE',
                  'ES',
                  'IT',
                  'CA',
                  'AU',
                  'JP',
                  'CN',
                  'IN',
                  'BR',
                  'MX',
                  'AR',
                  'CO',
                  'PE',
                  'CL',
                  'VE',
                  'EC',
                  'BO',
                  'PY',
                  'UY',
                  'GY',
                  'SR',
                  'GF',
                  'FK',
                ]}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFTextField
                name="emergencyContact.email"
                label={t('user:emergency_contact_email')}
                placeholder={t('user:enter_emergency_contact_email')}
                helperText={t('user:emergency_contact_email_help')}
                type="email"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Fade>
  );
};

export default StepEmergency;
