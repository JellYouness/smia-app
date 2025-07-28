import FormProvider, { RHFTextField } from '@common/components/lib/react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import useAuth, { LoginInput } from '@modules/auth/hooks/api/useAuth';
import { LockOpen } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import Link from '@mui/material/Link';
import Routes from '@common/defs/routes';
import { useTranslation } from 'react-i18next';
// import Logo from '@common/assets/svgs/Logo';

const LoginForm = () => {
  const { login } = useAuth();
  const { t } = useTranslation(['sign-in', 'common']);
  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email(t('common:email_format_incorrect'))
      .required(t('common:field_required')),
    password: Yup.string().required(t('common:field_required')),
  });
  const methods = useForm<LoginInput>({
    resolver: yupResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const onSubmit = async (data: LoginInput) => {
    await login(
      {
        email: data.email,
        password: data.password,
      },
      { displayProgress: true, displaySuccess: true }
    );
  };
  return (
    <>
      {/* <Logo sx={{ width: '100%', display: 'flex', justifyContent: 'center', mt: 3 }} /> */}
      <Typography
        component="h1"
        variant="h3"
        sx={{
          marginTop: 2,
          marginBottom: 2,
          textAlign: 'center',
          fontWeight: 'bold',
          color: 'primary.main',
        }}
      >
        {t('sign-in:title')}
      </Typography>
      <Card sx={{ maxWidth: '450px', margin: 'auto' }} elevation={5}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={4} sx={{ padding: 5 }}>
            <Grid item xs={12}>
              <RHFTextField name="email" label={t('common:email')} />
            </Grid>
            <Grid item xs={12}>
              <RHFTextField name="password" label={t('common:password')} type="password" />
            </Grid>
            <Grid item xs={12} sx={{ textAlign: 'center' }}>
              <LoadingButton
                size="large"
                variant="gradient"
                type="submit"
                startIcon={<LockOpen />}
                loadingPosition="start"
                loading={isSubmitting}
              >
                {t('sign-in:validate')}
              </LoadingButton>
            </Grid>
            <Grid item xs={12} sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                {t('sign-in:forgot_password_text')}{' '}
                <Link href={Routes.Auth.RequestPasswordReset}>
                  {t('sign-in:forgot_password_link_text')}
                </Link>
              </Typography>
            </Grid>
            <Grid item xs={12} sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                {t('sign-in:no_account_text')}{' '}
                <Link href={Routes.Auth.Register}>{t('sign-in:register_link_text')}</Link>
              </Typography>
            </Grid>
          </Grid>
        </FormProvider>
      </Card>
    </>
  );
};

export default LoginForm;
