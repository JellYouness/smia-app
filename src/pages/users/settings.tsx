import { NextPage } from 'next';
import withAuth, { AUTH_MODE } from '@modules/auth/hocs/withAuth';
import Routes from '@common/defs/routes';
import {
  Box,
  Grid,
  Typography,
  Button,
  Stack,
  Paper,
  Divider,
  MenuItem,
  Switch,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import FormProvider, { RHFSelect } from '@common/components/lib/react-hook-form';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { Lock, Security, Link as LinkIcon, ExitToApp, QrCode2 } from '@mui/icons-material';
import {
  useUserSettings,
  UserSettings,
  TwoFASetup,
  Session,
  ConnectedAccount,
} from '@modules/users/hooks/api';
import Image from 'next/image';
import { setUserLanguage } from '@common/components/lib/utils/language';
import useAuth from '@modules/auth/hooks/api/useAuth';
import { UserProfile } from '@modules/users/defs/types';

const UserSettingsPage: NextPage = () => {
  const { t } = useTranslation(['common', 'user']);
  const {
    fetchSettings,
    updateSettings,
    fetch2FAStatus,
    enable2FA,
    disable2FA,
    fetchSessions,
    revokeSession,
    revokeAllSessionsExceptCurrent,
    fetchConnectedAccounts,
    disconnectAccount,
    connectAccount,
  } = useUserSettings();
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [twoFA, setTwoFA] = useState(false);
  const [twoFASetup, setTwoFASetup] = useState<TwoFASetup | null>(null);
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([]);
  const [revokeDialog, setRevokeDialog] = useState<{ open: boolean; sessionId?: string | number }>({
    open: false,
  });
  const [revokeAllDialog, setRevokeAllDialog] = useState<{ open: boolean }>({
    open: false,
  });
  const [disconnectDialog, setDisconnectDialog] = useState<{ open: boolean; provider?: string }>({
    open: false,
  });

  useEffect(() => {
    if (user) {
      setProfile(user.profile);
    }
  }, [user]);

  const methods = useForm({
    defaultValues: {
      language: profile?.preferredLanguage ?? 'en',
      notifications: {
        email: profile?.notificationPreferences?.email ?? false,
        inApp: profile?.notificationPreferences?.inApp ?? false,
      },
      privacy: profile?.profileVisibility ?? 'PUBLIC',
    },
  });
  const { handleSubmit, reset, watch, setValue } = methods;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [settings, twoFAStatus, sessionList, accounts] = await Promise.all([
          fetchSettings(),
          fetch2FAStatus(),
          fetchSessions(),
          fetchConnectedAccounts(),
        ]);

        if (settings.success) {
          reset({
            language: settings.data?.language ?? 'en',
            notifications: settings.data?.notifications ?? {
              email: false,
              inApp: false,
            },
            privacy: (settings.data?.privacy ?? 'PUBLIC') as 'PUBLIC' | 'PRIVATE' | 'TEAM_ONLY',
          });
        }

        if (twoFAStatus.success) {
          setTwoFA(twoFAStatus.data?.enabled ?? false);
        }

        if (sessionList.success) {
          setSessions(sessionList.data ?? []);
        }

        if (accounts.success) {
          setConnectedAccounts(accounts.data ?? []);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchSettings, fetch2FAStatus, fetchSessions, fetchConnectedAccounts, reset]);

  const onSubmit = async (data: UserSettings) => {
    setIsSubmitting(true);
    try {
      await updateSettings(data);
      switch (data.language) {
        case 'fr':
          setUserLanguage('fr');
          break;
        case 'es':
          setUserLanguage('es');
          break;
        case 'en':
          setUserLanguage('en');
          break;
        default:
          setUserLanguage('en');
      }
    } catch (e) {
      console.error('Error saving settings:', e);
    }
    setIsSubmitting(false);
  };

  const handleEnable2FA = async () => {
    try {
      const response = await enable2FA();
      if (response.success) {
        setTwoFASetup(response.data ?? null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDisable2FA = async () => {
    try {
      const response = await disable2FA();
      if (response.success) {
        setTwoFA(false);
        setTwoFASetup(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRevokeSession = async () => {
    if (revokeDialog.sessionId) {
      try {
        const response = await revokeSession(revokeDialog.sessionId);
        if (response.success) {
          setSessions((prev) => prev.filter((s) => s.id !== revokeDialog.sessionId));
        }
      } catch (e) {
        console.error(e);
      }
    }
    setRevokeDialog({ open: false });
  };

  const handleRevokeAllSessions = async () => {
    try {
      const response = await revokeAllSessionsExceptCurrent();
      if (response.success) {
        setSessions((prev) => prev.filter((s) => s.current));
      }
    } catch (e) {
      console.error(e);
    }
    setRevokeAllDialog({ open: false });
  };

  const handleDisconnectAccount = async () => {
    if (disconnectDialog.provider) {
      try {
        const response = await disconnectAccount(disconnectDialog.provider);
        if (response.success) {
          setConnectedAccounts((prev) => {
            return prev.map((acc) =>
              acc.provider === disconnectDialog.provider ? { ...acc, connected: false } : acc
            );
          });
        }
      } catch (e) {
        console.error(e);
      }
    }
    setDisconnectDialog({ open: false });
  };

  if (loading) {
    return (
      <Box
        sx={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 1000, mx: 'auto' }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
          {t('user:settings', 'Settings')}
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={4}>
            {/* Profile Preferences */}
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                {t('user:profile_preferences', 'Profile Preferences')}
              </Typography>
              <Grid container spacing={3}>
                {/* <Grid item xs={12} md={6}>
                  <RHFTextField name="email" label={t('common:email')} disabled />
                </Grid> */}
                <Grid item xs={12} md={6}>
                  <RHFSelect name="language" label={t('user:language_preference', 'Language')}>
                    <MenuItem value="en">{t('topbar:language_english')}</MenuItem>
                    <MenuItem value="fr">{t('topbar:language_french')}</MenuItem>
                    <MenuItem value="es">{t('topbar:language_spanish')}</MenuItem>
                  </RHFSelect>
                </Grid>
              </Grid>
            </Box>
            {/* Notification Preferences */}
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                {t('user:notification_preferences', 'Notification Preferences')}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      border: '1px solid',
                      borderColor: 'primary.main',
                      borderRadius: 2,
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        borderColor: 'primary.main',
                        boxShadow: 2,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                          {t('user:email_notifications', 'Email Notifications')}
                        </Typography>
                      </Box>
                      <Switch
                        checked={!!watch('notifications.email')}
                        onChange={(_, checked) => setValue('notifications.email', checked)}
                        color="primary"
                      />
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      border: '1px solid',
                      borderColor: 'primary.main',
                      borderRadius: 2,
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        borderColor: 'primary.main',
                        boxShadow: 2,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                          {t('user:in_app_notifications', 'In-App Notifications')}
                        </Typography>
                      </Box>
                      <Switch
                        checked={!!watch('notifications.inApp')}
                        onChange={(_, checked) => setValue('notifications.inApp', checked)}
                        color="primary"
                      />
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
            {/* Privacy Settings */}
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                {t('user:privacy_settings', 'Privacy Settings')}
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <RHFSelect
                    name="privacy"
                    label={t('user:profile_visibility', 'Profile Visibility')}
                  >
                    <MenuItem value="PUBLIC">{t('user:public', 'Public')}</MenuItem>
                    <MenuItem value="PRIVATE">{t('user:private', 'Private')}</MenuItem>
                    <MenuItem value="FRIENDS">{t('user:friends_only', 'Friends Only')}</MenuItem>
                  </RHFSelect>
                </Grid>
              </Grid>
            </Box>
            {/* Account Security */}
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                {t('user:account_security', 'Account Security')}
              </Typography>
              <Stack spacing={2}>
                <Button
                  variant="outlined"
                  startIcon={<Lock />}
                  onClick={() => {
                    window.location.href = Routes.Users.ChangePassword;
                  }}
                >
                  {t('user:change_password', 'Change Password')}
                </Button>
                <ListItem>
                  <ListItemText
                    primary={t('user:two_factor_auth', 'Two-Factor Authentication (2FA)')}
                    secondary={
                      twoFA ? t('user:enabled', 'Enabled') : t('user:disabled', 'Disabled')
                    }
                  />
                  {twoFA ? (
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<Security />}
                      onClick={handleDisable2FA}
                    >
                      {t('user:disable_2fa', 'Disable 2FA')}
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<Security />}
                      onClick={handleEnable2FA}
                    >
                      {t('user:enable_2fa', 'Enable 2FA')}
                    </Button>
                  )}
                </ListItem>
                {twoFASetup && (
                  <Box
                    sx={{
                      mt: 2,
                      mb: 2,
                      p: 2,
                      border: '1px solid',
                      borderColor: 'grey.300',
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                      <QrCode2 sx={{ mr: 1 }} />
                      {t('user:scan_qr', 'Scan this QR code in your authenticator app')}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                      <Image
                        src={twoFASetup.qrCodeUrl}
                        alt="2FA QR Code"
                        style={{ width: 180, height: 180, objectFit: 'contain' }}
                        width={180}
                        height={180}
                      />
                    </Box>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {t('user:or_enter_secret', 'Or enter this secret:')}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: 'monospace' }}>
                      {twoFASetup.secret}
                    </Typography>
                  </Box>
                )}
                <Divider sx={{ my: 2 }} />
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {t('user:active_sessions', 'Active Sessions')}
                  </Typography>
                  {sessions.length > 1 && (
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => setRevokeAllDialog({ open: true })}
                    >
                      {t('user:revoke_all_sessions', 'Revoke All Other Sessions')}
                    </Button>
                  )}
                </Box>
                <List>
                  {sessions.map((session) => (
                    <ListItem key={session.id}>
                      <ListItemText
                        primary={session.device}
                        secondary={
                          <>
                            {t('user:last_active', 'Last active')}: {session.formattedLastActive}
                            {session.current && ` • (${t('user:this_device', 'This device')})`}
                          </>
                        }
                      />
                      {!session.current && (
                        <IconButton
                          edge="end"
                          color="error"
                          onClick={() => setRevokeDialog({ open: true, sessionId: session.id })}
                        >
                          <ExitToApp />
                        </IconButton>
                      )}
                    </ListItem>
                  ))}
                </List>
              </Stack>
            </Box>
            {/* Connected Accounts */}
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                {t('user:connected_accounts', 'Connected Accounts')}
              </Typography>
              <List>
                {connectedAccounts.map((acc) => (
                  <ListItem key={acc.provider}>
                    <ListItemText
                      primary={acc.provider}
                      secondary={
                        acc.connected
                          ? t('user:connected', 'Connected')
                          : t('user:not_connected', 'Not Connected')
                      }
                    />
                    {acc.connected ? (
                      <Button
                        variant="outlined"
                        color="success"
                        startIcon={<LinkIcon />}
                        onClick={() => setDisconnectDialog({ open: true, provider: acc.provider })}
                      >
                        {t('user:disconnect', 'Disconnect')}
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<LinkIcon />}
                        onClick={() => connectAccount(acc.provider)}
                      >
                        {t('user:connect', 'Connect')}
                      </Button>
                    )}
                  </ListItem>
                ))}
              </List>
            </Box>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button variant="contained" type="submit" disabled={isSubmitting}>
                {t('common:save', 'Save')}
              </Button>
            </Stack>
          </Stack>
        </FormProvider>
      </Paper>
      {/* Session revoke dialog */}
      <Dialog open={revokeDialog.open} onClose={() => setRevokeDialog({ open: false })}>
        <DialogTitle>{t('user:revoke_session', 'Revoke Session')}</DialogTitle>
        <DialogContent>
          {t('user:revoke_session_confirm', 'Are you sure you want to revoke this session?')}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRevokeDialog({ open: false })}>
            {t('common:cancel', 'Cancel')}
          </Button>
          <Button color="error" onClick={handleRevokeSession}>
            {t('common:confirm_action', 'Yes, delete')}
          </Button>
        </DialogActions>
      </Dialog>
      {/* Revoke all sessions dialog */}
      <Dialog open={revokeAllDialog.open} onClose={() => setRevokeAllDialog({ open: false })}>
        <DialogTitle>{t('user:revoke_all_sessions', 'Revoke All Other Sessions')}</DialogTitle>
        <DialogContent>
          {t(
            'user:revoke_all_sessions_confirm',
            'Are you sure you want to revoke all other sessions? This will log you out from all other devices.'
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRevokeAllDialog({ open: false })}>
            {t('common:cancel', 'Cancel')}
          </Button>
          <Button color="error" onClick={handleRevokeAllSessions}>
            {t('common:confirm_action', 'Yes, revoke all')}
          </Button>
        </DialogActions>
      </Dialog>
      {/* Disconnect account dialog */}
      <Dialog open={disconnectDialog.open} onClose={() => setDisconnectDialog({ open: false })}>
        <DialogTitle>{t('user:disconnect_account', 'Disconnect Account')}</DialogTitle>
        <DialogContent>
          {t(
            'user:disconnect_account_confirm',
            'Are you sure you want to disconnect this account?'
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDisconnectDialog({ open: false })}>
            {t('common:cancel', 'Cancel')}
          </Button>
          <Button color="error" onClick={handleDisconnectAccount}>
            {t('common:confirm_action', 'Yes, delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['user', 'common', 'topbar', 'notifications'])),
  },
});

export default withAuth(UserSettingsPage, {
  mode: AUTH_MODE.LOGGED_IN,
  redirectUrl: Routes.Auth.Login,
});
