import { NextPage } from 'next';
import withAuth, { AUTH_MODE } from '@modules/auth/hocs/withAuth';
import Routes from '@common/defs/routes';
import { Box, Card, Typography, Button, Stack, Container, Paper } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { ArrowBack, Lock } from '@mui/icons-material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import useAuth from '@modules/auth/hooks/api/useAuth';

const ChangePassword: NextPage = () => {
  const { t } = useTranslation(['common', 'user']);
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const { user, requestPasswordReset, logout } = useAuth();

  const handleCancel = () => {
    router.push(Routes.Users.EditProfile);
  };

  const handleSendEmail = async () => {
    if (!user?.email) {
      enqueueSnackbar(t('user:email_not_found'), { variant: 'error' });
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await requestPasswordReset({ email: user.email });
      if (response.success) {
        setEmailSent(true);
        enqueueSnackbar(t('user:password_reset_email_sent'), { variant: 'success' });
        logout();
      } else {
        enqueueSnackbar(response.errors?.[0] || t('common:update_failed'), { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar(t('common:unexpected_error'), { variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 0,
          py: 3,
        }}
      >
        <Container maxWidth="lg">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<ArrowBack />}
              onClick={handleCancel}
              sx={{ borderColor: 'rgba(255,255,255,0.3)' }}
            >
              {t('common:return')}
            </Button>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {t('user:change_password')}
            </Typography>
          </Stack>
        </Container>
      </Paper>

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Stack spacing={3}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <Lock sx={{ fontSize: 40, color: 'primary.main' }} />
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {t('user:change_password')}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {t('user:password_reset_email_info', { email: user?.email || '' })}
              </Typography>
              <LoadingButton
                variant="contained"
                loading={isSubmitting}
                onClick={handleSendEmail}
                disabled={emailSent || !user?.email}
              >
                {emailSent
                  ? t('user:password_reset_email_sent_button')
                  : t('user:send_password_reset_email')}
              </LoadingButton>
            </Box>
          </Card>
        </Stack>
      </Container>
    </Box>
  );
};

export default withAuth(ChangePassword, {
  mode: AUTH_MODE.LOGGED_IN,
  redirectUrl: Routes.Auth.Login,
});

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['user', 'common', 'topbar', 'notifications'])),
  },
});
