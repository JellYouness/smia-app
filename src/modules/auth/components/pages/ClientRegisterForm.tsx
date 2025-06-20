import FormProvider, { RHFTextField, RHFCheckbox } from '@common/components/lib/react-hook-form';
import { LockOpen } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useForm } from 'react-hook-form';
import useAuth, { RegisterInput } from '@modules/auth/hooks/api/useAuth';
import Link from '@mui/material/Link';
import Routes from '@common/defs/routes';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import { useRouter } from 'next/router';

const ClientRegisterForm = () => {
  const { register } = useAuth();
  const { t } = useTranslation(['auth', 'common']);
  const router = useRouter();

  const RegisterSchema = Yup.object().shape({
    email: Yup.string()
      .email(t('common:email_format_incorrect'))
      .required(t('common:field_required')),
    password: Yup.string()
      .min(8, t('auth:password_min_length'))
      .required(t('common:field_required')),
    passwordConfirmation: Yup.string()
      .oneOf([Yup.ref('password')], t('auth:passwords_must_match'))
      .required(t('common:field_required')),
    firstName: Yup.string()
      .min(2, t('auth:first_name_min_length'))
      .required(t('common:field_required')),
    lastName: Yup.string()
      .min(2, t('auth:last_name_min_length'))
      .required(t('common:field_required')),
    termsAccepted: Yup.boolean()
      .oneOf([true], t('auth:terms_must_be_accepted'))
      .required(t('common:field_required')),
  });

  const methods = useForm<RegisterInput>({
    resolver: yupResolver(RegisterSchema),
    defaultValues: {
      userType: 'client',
      termsAccepted: false,
      email: '',
      password: '',
      passwordConfirmation: '',
      firstName: '',
      lastName: '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: RegisterInput) => {
    console.log('Form submitted with data:', data);
    try {
      const response = await register(data);
      console.log('Registration response in form:', response);
      if (response.success) {
        // Store email for verification page
        localStorage.setItem('pendingVerificationEmail', data.email);
        router.push('/auth/verify-email');
      }
    } catch (error) {
      console.error('Registration error in form:', error);
    }
  };

  return (
    <>
      <Typography
        component="h1"
        variant="h2"
        sx={{
          marginTop: 2,
          marginBottom: 2,
          textAlign: 'center',
          fontWeight: 'bold',
        }}
      >
        {t('auth:client_registration_title')}
      </Typography>
      <Card sx={{ maxWidth: '600px', margin: 'auto' }}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3} sx={{ padding: 4 }}>
            <Grid item xs={12} sm={6}>
              <RHFTextField name="firstName" label={t('auth:first_name')} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <RHFTextField name="lastName" label={t('auth:last_name')} />
            </Grid>
            <Grid item xs={12}>
              <RHFTextField name="email" label={t('common:email')} type="email" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <RHFTextField name="password" label={t('common:password')} type="password" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <RHFTextField
                name="passwordConfirmation"
                label={t('auth:confirm_password')}
                type="password"
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <RHFCheckbox name="termsAccepted" label={undefined} />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {t('auth:terms_and_conditions_text')}{' '}
                  <Link href="/terms" target="_blank">
                    {t('auth:terms_and_conditions_link')}
                  </Link>
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sx={{ textAlign: 'center' }}>
              <LoadingButton
                size="large"
                variant="contained"
                type="submit"
                startIcon={<LockOpen />}
                loadingPosition="start"
                loading={isSubmitting}
                sx={{ minWidth: 200 }}
              >
                {t('auth:create_account')}
              </LoadingButton>
            </Grid>
            <Grid item xs={12} sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                {t('auth:already_have_account')}{' '}
                <Link href={Routes.Auth.Login}>{t('auth:sign_in')}</Link>
              </Typography>
            </Grid>
            <Grid item xs={12} sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                {t('auth:are_you_creator')}{' '}
                <Link href={Routes.Auth.RegisterCreator}>{t('auth:register_as_creator')}</Link>
              </Typography>
            </Grid>
          </Grid>
        </FormProvider>
      </Card>
    </>
  );
};

export default ClientRegisterForm;
