import { Card, CardContent, Stack, Avatar, Typography, Grid, MenuItem, Fade } from '@mui/material';
import { Person } from '@mui/icons-material';
import {
  RHFTextField,
  RHFSelect,
  RHFProfilePicture,
  RHFPhoneField,
  RHFAutocomplete,
} from '@common/components/lib/react-hook-form';
import { TFunction } from 'i18next';
import { Any } from '@common/defs/types';
import {
  SYSTEM_LANGUAGE_OPTIONS,
  TIMEZONE_OPTIONS,
  PHONE_FIELD_COUNTRIES,
  PHONE_FIELD_PREFERRED_COUNTRIES,
} from '@modules/creators/defs/enums';

const StepPersonal = ({ methods, t }: { methods: Any; t: TFunction }) => {
  return (
    <Fade in timeout={500}>
      <Card elevation={0} sx={{ border: (theme) => `1px solid ${theme.palette.divider}` }}>
        <CardContent sx={{ p: 4 }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <Person />
            </Avatar>
            <Typography variant="h5" fontWeight={600}>
              {t('user:personal_information')}
            </Typography>
          </Stack>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <RHFPhoneField
                name="phoneNumber"
                label={t('common:phone_number')}
                placeholder={t('user:enter_phone_number')}
                helperText={t('user:phone_number_help')}
                defaultCountry="FR"
                forceCallingCode
                focusOnSelectCountry={false}
                preferredCountries={PHONE_FIELD_PREFERRED_COUNTRIES}
                onlyCountries={PHONE_FIELD_COUNTRIES}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFSelect
                name="gender"
                label={t('common:gender')}
                helperText={t('user:gender_help')}
              >
                <MenuItem value="MALE">{t('common:male')}</MenuItem>
                <MenuItem value="FEMALE">{t('common:female')}</MenuItem>
                <MenuItem value="OTHER">{t('common:other')}</MenuItem>
              </RHFSelect>
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFTextField
                name="dateOfBirth"
                label={t('common:date_of_birth')}
                type="date"
                InputLabelProps={{ shrink: true }}
                helperText={t('user:date_of_birth_help')}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFAutocomplete
                name="preferredLanguage"
                label={t('common:preferred_language')}
                placeholder={t('user:enter_preferred_language')}
                helperText={t('user:preferred_language_help')}
                options={SYSTEM_LANGUAGE_OPTIONS}
                getOptionLabel={(option: { value: string; label: string } | string) => {
                  if (typeof option === 'string') {
                    const found = SYSTEM_LANGUAGE_OPTIONS.find(
                      (lang: { value: string; label: string }) => lang.value === option
                    );
                    return found ? found.label : option;
                  }
                  return option.label;
                }}
                isOptionEqualToValue={(option: { value: string; label: string }, value: Any) => {
                  if (typeof value === 'string') {
                    return option.value === value;
                  }
                  return option.value === (value as Any)?.value;
                }}
                onChange={(event, newValue) => {
                  if (typeof newValue === 'string') {
                    methods.setValue('preferredLanguage', newValue);
                  } else if (newValue && typeof newValue === 'object' && 'value' in newValue) {
                    methods.setValue('preferredLanguage', newValue.value);
                  } else {
                    methods.setValue('preferredLanguage', '');
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFAutocomplete
                name="timezone"
                label={t('common:timezone')}
                placeholder={t('user:enter_timezone')}
                helperText={t('user:timezone_help')}
                options={TIMEZONE_OPTIONS}
                getOptionLabel={(option: { value: string; label: string } | string) => {
                  if (typeof option === 'string') {
                    const found = TIMEZONE_OPTIONS.find(
                      (tz: { value: string; label: string }) => tz.value === option
                    );
                    return found ? found.label : option;
                  }
                  return option.label;
                }}
                isOptionEqualToValue={(option, value) => {
                  if (typeof value === 'string') {
                    return option.value === value;
                  }
                  return option.value === (value as Any)?.value;
                }}
                onChange={(event, newValue) => {
                  if (typeof newValue === 'string') {
                    methods.setValue('timezone', newValue);
                  } else if (newValue && typeof newValue === 'object' && 'value' in newValue) {
                    methods.setValue('timezone', (newValue as Any).value);
                  } else {
                    methods.setValue('timezone', '');
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFProfilePicture
                name="profilePicture"
                label={t('user:profile_picture')}
                helperText={t('user:profile_picture_help')}
                maxSize={5}
              />
            </Grid>
            <Grid item xs={12}>
              <RHFTextField
                name="bio"
                label={t('common:biography')}
                placeholder={t('user:enter_bio_placeholder')}
                multiline
                rows={4}
                helperText={t('user:bio_help_text')}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Fade>
  );
};

export default StepPersonal;
