import {
  Card,
  CardContent,
  Stack,
  Avatar,
  Typography,
  Grid,
  MenuItem,
  Box,
  Fade,
} from '@mui/material';
import { Person } from '@mui/icons-material';
import {
  RHFTextField,
  RHFSelect,
  RHFProfilePicture,
  RHFPhoneField,
  RHFAutocomplete,
} from '@common/components/lib/react-hook-form';
import { TFunction } from 'i18next';

// Timezone options
const timezoneOptions = [
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  { value: 'Europe/Paris', label: 'Europe/Paris (Central European Time)' },
  { value: 'Europe/London', label: 'Europe/London (Greenwich Mean Time)' },
  { value: 'America/New_York', label: 'America/New_York (Eastern Time)' },
  { value: 'America/Chicago', label: 'America/Chicago (Central Time)' },
  { value: 'America/Denver', label: 'America/Denver (Mountain Time)' },
  { value: 'America/Los_Angeles', label: 'America/Los_Angeles (Pacific Time)' },
  { value: 'Asia/Tokyo', label: 'Asia/Tokyo (Japan Standard Time)' },
  { value: 'Asia/Shanghai', label: 'Asia/Shanghai (China Standard Time)' },
  { value: 'Asia/Kolkata', label: 'Asia/Kolkata (India Standard Time)' },
  { value: 'Australia/Sydney', label: 'Australia/Sydney (Australian Eastern Time)' },
  { value: 'Africa/Cairo', label: 'Africa/Cairo (Eastern European Time)' },
  { value: 'Africa/Lagos', label: 'Africa/Lagos (West Africa Time)' },
  { value: 'America/Sao_Paulo', label: 'America/Sao_Paulo (Brasilia Time)' },
  { value: 'America/Mexico_City', label: 'America/Mexico_City (Central Time)' },
];

// Language options
const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'Français' },
  { value: 'es', label: 'Español' },
  { value: 'de', label: 'Deutsch' },
  { value: 'it', label: 'Italiano' },
  { value: 'pt', label: 'Português' },
  { value: 'ru', label: 'Русский' },
  { value: 'zh', label: '中文' },
  { value: 'ja', label: '日本語' },
  { value: 'ko', label: '한국어' },
  { value: 'ar', label: 'العربية' },
  { value: 'hi', label: 'हिन्दी' },
  { value: 'tr', label: 'Türkçe' },
  { value: 'nl', label: 'Nederlands' },
  { value: 'pl', label: 'Polski' },
  { value: 'sv', label: 'Svenska' },
  { value: 'da', label: 'Dansk' },
  { value: 'no', label: 'Norsk' },
  { value: 'fi', label: 'Suomi' },
];

export default function StepPersonal({ methods, t }: { methods: any; t: TFunction }) {
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
                options={languageOptions}
                getOptionLabel={(option) => {
                  if (typeof option === 'string') {
                    const found = languageOptions.find((lang) => lang.value === option);
                    return found ? found.label : option;
                  }
                  return option.label;
                }}
                isOptionEqualToValue={(option, value) => {
                  if (typeof value === 'string') {
                    return option.value === value;
                  }
                  return option.value === (value as any)?.value;
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
                options={timezoneOptions}
                getOptionLabel={(option) => {
                  if (typeof option === 'string') {
                    const found = timezoneOptions.find((tz) => tz.value === option);
                    return found ? found.label : option;
                  }
                  return option.label;
                }}
                isOptionEqualToValue={(option, value) => {
                  if (typeof value === 'string') {
                    return option.value === value;
                  }
                  return option.value === (value as any)?.value;
                }}
                onChange={(event, newValue) => {
                  if (typeof newValue === 'string') {
                    methods.setValue('timezone', newValue);
                  } else if (newValue && typeof newValue === 'object' && 'value' in newValue) {
                    methods.setValue('timezone', (newValue as any).value);
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
}
