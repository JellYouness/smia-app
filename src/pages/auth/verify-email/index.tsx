import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Card, Typography, Box, Button, CircularProgress } from '@mui/material';
import { Email, Refresh } from '@mui/icons-material';
import useAuth from '@modules/auth/hooks/api/useAuth';
import Routes from '@common/defs/routes';
import { useTranslation } from 'react-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useSnackbar } from 'notistack';

const EmailVerificationPendingPage: NextPage = () => {
  const router = useRouter();
  const { resendEmailVerification } = useAuth();
  const { t } = useTranslation(['auth', 'common']);
  const { enqueueSnackbar } = useSnackbar();
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Get email from query params or localStorage
    const emailFromQuery = router.query.email as string;
    const emailFromStorage = localStorage.getItem('pendingVerificationEmail');

    if (emailFromQuery) {
      setEmail(emailFromQuery);
      localStorage.setItem('pendingVerificationEmail', emailFromQuery);
    } else if (emailFromStorage) {
      setEmail(emailFromStorage);
    }
  }, [router.query]);

  const handleResendEmail = async () => {
    if (!email) {
      return;
    }

    setLoading(true);
    try {
      const response = await resendEmailVerification({ email });
      if (response.success) {
        // Show success message
        enqueueSnackbar(t('auth:verification_email_resent'), { variant: 'success' });
      } else {
        // Show error message
        enqueueSnackbar(response.errors?.[0] || t('common:unexpected_error'), { variant: 'error' });
      }
    } catch (error) {
      console.error('Error resending verification email:', error);
      enqueueSnackbar(t('common:unexpected_error'), { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    localStorage.removeItem('pendingVerificationEmail');
    router.push('/auth/login');
  };

  return (
    <Box
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}
    >
      <Card sx={{ maxWidth: '500px', margin: 'auto', p: 4, textAlign: 'center' }}>
        <Box sx={{ mb: 3 }}>
          <Email sx={{ fontSize: 64, color: 'primary.main' }} />
        </Box>

        <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
          {t('auth:check_your_email')}
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {t('auth:verification_email_sent')}
        </Typography>

        {email && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {t('auth:email_sent_to')}: <strong>{email}</strong>
          </Typography>
        )}

        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          {t('auth:click_link_in_email')}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={loading ? <CircularProgress size={20} /> : <Refresh />}
            onClick={handleResendEmail}
            disabled={loading || !email}
            fullWidth
          >
            {t('auth:resend_verification_email')}
          </Button>

          <Button variant="text" onClick={handleBackToLogin} fullWidth>
            {t('auth:back_to_login')}
          </Button>
        </Box>
      </Card>
    </Box>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['auth', 'common', 'topbar'])),
  },
});

export default EmailVerificationPendingPage;
