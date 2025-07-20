import { Card, CardContent, Stack, Avatar, Typography, Grid, Fade, Box } from '@mui/material';
import { Notifications } from '@mui/icons-material';
import { RHFSwitch } from '@common/components/lib/react-hook-form';
import { TFunction } from 'i18next';

const StepNotifications = ({ methods, t }: { methods: any; t: TFunction }) => {
  return (
    <Fade in timeout={500}>
      <Card elevation={0} sx={{ border: (theme) => `1px solid ${theme.palette.divider}` }}>
        <CardContent sx={{ p: 4 }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
            <Avatar sx={{ bgcolor: 'info.main' }}>
              <Notifications />
            </Avatar>
            <Typography variant="h5" fontWeight={600}>
              {t('user:notification_preferences')}
            </Typography>
          </Stack>
          <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
            {t('user:notification_preferences_help')}
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card variant="outlined" sx={{ p: 2 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <RHFSwitch name="notificationPreferences.email" label="" />
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {t('user:email_notifications')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {t('user:email_notifications_help')}
                    </Typography>
                  </Box>
                </Stack>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card variant="outlined" sx={{ p: 2 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <RHFSwitch name="notificationPreferences.sms" label="" />
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {t('user:sms_notifications')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {t('user:sms_notifications_help')}
                    </Typography>
                  </Box>
                </Stack>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card variant="outlined" sx={{ p: 2 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <RHFSwitch name="notificationPreferences.push" label="" />
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {t('user:push_notifications')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {t('user:push_notifications_help')}
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

export default StepNotifications;
