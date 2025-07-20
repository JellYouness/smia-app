import { Card, CardContent, Stack, Avatar, Typography, Grid, Fade } from '@mui/material';
import { LocationOn } from '@mui/icons-material';
import { RHFTextField } from '@common/components/lib/react-hook-form';
import { TFunction } from 'i18next';

const StepAddress = ({ methods, t }: { methods: any; t: TFunction }) => {
  return (
    <Fade in timeout={500}>
      <Card elevation={0} sx={{ border: (theme) => `1px solid ${theme.palette.divider}` }}>
        <CardContent sx={{ p: 4 }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
            <Avatar sx={{ bgcolor: 'secondary.main' }}>
              <LocationOn />
            </Avatar>
            <Typography variant="h5" fontWeight={600}>
              {t('common:address_information')}
            </Typography>
          </Stack>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <RHFTextField
                name="address"
                label={t('common:address')}
                placeholder={t('user:enter_address')}
                helperText={t('user:address_help')}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFTextField
                name="city"
                label={t('common:city')}
                placeholder={t('user:enter_city')}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFTextField
                name="state"
                label={t('common:state')}
                placeholder={t('user:enter_state')}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFTextField
                name="country"
                label={t('common:country')}
                placeholder={t('user:enter_country')}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFTextField
                name="postalCode"
                label={t('common:postal_code')}
                placeholder={t('user:enter_postal_code')}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Fade>
  );
};

export default StepAddress;
