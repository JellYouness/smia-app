import { NextPage } from 'next';
import withAuth, { AUTH_MODE } from '@modules/auth/hocs/withAuth';
import Routes from '@common/defs/routes';
import { Box, Card, Grid, Typography, Button, Stack, Container, Paper } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import FormProvider, { RHFTextField } from '@common/components/lib/react-hook-form';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { ArrowBack, Save, Lock } from '@mui/icons-material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import { Any } from '@common/defs/types';

const ChangePassword: NextPage = () => {
  const { t } = useTranslation(['common', 'user']);
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const PasswordSchema = Yup.object().shape({
    currentPassword: Yup.string()
      .required(t('user:current_password_required'))
      .min(8, t('common:password_min_length')),
    newPassword: Yup.string()
      .required(t('user:new_password_required'))
      .min(8, t('common:password_min_length')),
    confirmPassword: Yup.string()
      .required(t('user:confirm_password_required'))
      .oneOf([Yup.ref('newPassword')], t('user:passwords_must_match')),
  });

  const methods = useForm({
    resolver: yupResolver(PasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const {
    handleSubmit,
    formState: { isDirty },
  } = methods;

  const onSubmit = async (data: Any) => {
    try {
      setIsSubmitting(true);

      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: data.currentPassword,
          new_password: data.newPassword,
        }),
      });

      const result = await response.json();

      if (result.success) {
        enqueueSnackbar(t('user:password_changed_successfully'), { variant: 'success' });
        router.push(Routes.Users.EditProfile);
      } else {
        enqueueSnackbar(result.errors?.[0] || t('common:update_failed'), { variant: 'error' });
      }
    } catch (error) {
      console.error('Error changing password:', error);
      enqueueSnackbar(t('common:unexpected_error'), { variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push(Routes.Users.EditProfile);
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
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            {/* Password Change Form */}
            <Card sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Lock sx={{ fontSize: 28, color: 'primary.main' }} />
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {t('user:change_password')}
                </Typography>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {t('user:change_password_description')}
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <RHFTextField
                    name="currentPassword"
                    label={t('user:current_password')}
                    type="password"
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <RHFTextField
                    name="newPassword"
                    label={t('user:new_password')}
                    type="password"
                    required
                    helperText={t('common:password_min_length_help')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <RHFTextField
                    name="confirmPassword"
                    label={t('user:confirm_new_password')}
                    type="password"
                    required
                  />
                </Grid>
              </Grid>
            </Card>

            {/* Action Buttons */}
            <Card sx={{ p: 3 }}>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button variant="outlined" onClick={handleCancel} disabled={isSubmitting}>
                  {t('common:cancel')}
                </Button>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                  disabled={!isDirty}
                  startIcon={<Save />}
                >
                  {t('user:change_password')}
                </LoadingButton>
              </Stack>
            </Card>
          </Stack>
        </FormProvider>
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
    ...(await serverSideTranslations(locale, ['user', 'common', 'topbar'])),
  },
});
