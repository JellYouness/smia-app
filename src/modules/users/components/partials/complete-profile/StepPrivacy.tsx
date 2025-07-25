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
import { Security } from '@mui/icons-material';
import { RHFSelect, RHFSwitch } from '@common/components/lib/react-hook-form';
import { TFunction } from 'i18next';
import { Any } from '@common/defs/types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StepPrivacy = ({ methods, t }: { methods: Any; t: TFunction }) => {
  return (
    <Fade in timeout={500}>
      <Card elevation={0} sx={{ border: (theme) => `1px solid ${theme.palette.divider}` }}>
        <CardContent sx={{ p: 4 }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
            <Avatar sx={{ bgcolor: 'warning.main' }}>
              <Security />
            </Avatar>
            <Typography variant="h5" fontWeight={600}>
              {t('user:privacy_settings')}
            </Typography>
          </Stack>
          <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
            {t('user:privacy_settings_help')}
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <RHFSelect
                name="privacySettings.profileVisibility"
                label={t('user:profile_visibility')}
                helperText={t('user:profile_visibility_help')}
              >
                <MenuItem value="PUBLIC">
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography>{t('user:public')}</Typography>
                  </Stack>
                </MenuItem>
                <MenuItem value="PRIVATE">
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography>{t('user:private')}</Typography>
                  </Stack>
                </MenuItem>
                <MenuItem value="FRIENDS">
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography>{t('user:friends_only')}</Typography>
                  </Stack>
                </MenuItem>
              </RHFSelect>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ p: 2 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <RHFSwitch name="privacySettings.showEmail" label="" />
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {t('user:show_email')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {t('user:show_email_help')}
                    </Typography>
                  </Box>
                </Stack>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ p: 2 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <RHFSwitch name="privacySettings.showPhone" label="" />
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {t('user:show_phone')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {t('user:show_phone_help')}
                    </Typography>
                  </Box>
                </Stack>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ p: 2 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <RHFSwitch name="privacySettings.showAddress" label="" />
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {t('user:show_address')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {t('user:show_address_help')}
                    </Typography>
                  </Box>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Fade>
  );
};

export default StepPrivacy;
