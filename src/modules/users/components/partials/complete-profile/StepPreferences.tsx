import {
  Card,
  CardContent,
  Stack,
  Avatar,
  Typography,
  Grid,
  Fade,
  MenuItem,
  Box,
} from '@mui/material';
import { Settings } from '@mui/icons-material';
import { RHFSelect, RHFTextField } from '@common/components/lib/react-hook-form';
import { TFunction } from 'i18next';

const StepPreferences = ({ methods, t }: { methods: any; t: TFunction }) => {
  return (
    <Fade in timeout={500}>
      <Card elevation={0} sx={{ border: (theme) => `1px solid ${theme.palette.divider}` }}>
        <CardContent sx={{ p: 4 }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
            <Avatar sx={{ bgcolor: 'info.main' }}>
              <Settings />
            </Avatar>
            <Typography variant="h5" fontWeight={600}>
              {t('user:preferences')}
            </Typography>
          </Stack>
          <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
            {t('user:preferences_help')}
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <RHFSelect
                name="preferences.theme"
                label={t('user:theme_preference')}
                helperText={t('user:theme_preference_help')}
              >
                <MenuItem value="light">
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Box
                      sx={{ width: 16, height: 16, bgcolor: '#fff', border: '1px solid #ccc' }}
                    />
                    <Typography>{t('user:light_theme')}</Typography>
                  </Stack>
                </MenuItem>
                <MenuItem value="dark">
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Box sx={{ width: 16, height: 16, bgcolor: '#333' }} />
                    <Typography>{t('user:dark_theme')}</Typography>
                  </Stack>
                </MenuItem>
                <MenuItem value="auto">
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        bgcolor: 'transparent',
                        border: '1px solid #ccc',
                      }}
                    />
                    <Typography>{t('user:auto_theme')}</Typography>
                  </Stack>
                </MenuItem>
              </RHFSelect>
            </Grid>
            <Grid item xs={12} md={4}>
              <RHFTextField
                name="preferences.language"
                label={t('user:language_preference')}
                placeholder={t('user:enter_language_preference')}
                helperText={t('user:language_preference_help')}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <RHFTextField
                name="preferences.timezone"
                label={t('user:timezone_preference')}
                placeholder={t('user:enter_timezone_preference')}
                helperText={t('user:timezone_preference_help')}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Fade>
  );
};

export default StepPreferences;
