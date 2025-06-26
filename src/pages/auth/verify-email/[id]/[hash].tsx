import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Card, Typography, Box, CircularProgress } from '@mui/material';
import { CheckCircle, Error } from '@mui/icons-material';
import useAuth from '@modules/auth/hooks/api/useAuth';
import Routes from '@common/defs/routes';
import { useTranslation } from 'react-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const EmailVerificationPage: NextPage = () => {
  const router = useRouter();
  const { verifyEmail } = useAuth();
  const { t } = useTranslation(['auth', 'common']);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmailToken = async () => {
      const { id, hash } = router.query;
      console.log(id, hash);

      if (!id || !hash) {
        setStatus('error');
        setMessage(t('auth:invalid_verification_link'));
        return;
      }

      try {
        const response = await verifyEmail(
          { id: Number(id), hash: String(hash) },
          { displayProgress: false }
        );

        if (response.success) {
          setStatus('success');
          setMessage(t('auth:email_verified_success'));
          // Redirect to profile completion page after 3 seconds
          setTimeout(() => {
            router.push(Routes.Auth.CompleteProfile);
          }, 3000);
        } else {
          setStatus('error');
          setMessage(response.errors?.[0] || t('common:unexpected_error'));
        }
      } catch (error) {
        setStatus('error');
        setMessage(t('common:unexpected_error'));
      }
    };

    if (router.isReady) {
      verifyEmailToken();
    }
  }, []);

  const getIcon = () => {
    switch (status) {
      case 'loading':
        return <CircularProgress size={64} />;
      case 'success':
        return <CheckCircle sx={{ fontSize: 64, color: 'success.main' }} />;
      case 'error':
        return <Error sx={{ fontSize: 64, color: 'error.main' }} />;
      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (status) {
      case 'loading':
        return t('auth:verifying_email');
      case 'success':
        return t('auth:email_verified_title');
      case 'error':
        return t('auth:verification_failed_title');
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}
    >
      <Card sx={{ maxWidth: '500px', margin: 'auto', p: 4, textAlign: 'center' }}>
        <Box sx={{ mb: 3 }}>{getIcon()}</Box>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
          {getTitle()}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {message}
        </Typography>
        {status === 'error' && (
          <Typography variant="body2" color="text.secondary">
            {t('auth:verification_error_help')}
          </Typography>
        )}
      </Card>
    </Box>
  );
};

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['auth', 'common', 'topbar'])),
  },
});

export default EmailVerificationPage;
