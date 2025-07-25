import { NextPage } from 'next';
import withAuth, { AUTH_MODE } from '@modules/auth/hocs/withAuth';
import Routes from '@common/defs/routes';
import { Box, Card, Grid, Typography, Button, Stack, Container, Paper } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import FormProvider, { RHFPhoneField, RHFTextField } from '@common/components/lib/react-hook-form';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import useAuth from '@modules/auth/hooks/api/useAuth';
import { ArrowBack, Save, Lock } from '@mui/icons-material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import ApiRoutes from '@common/defs/api-routes';
import { Any } from '@common/defs/types';
import {
  PHONE_FIELD_COUNTRIES,
  PHONE_FIELD_PREFERRED_COUNTRIES,
} from '@modules/creators/defs/enums';
import useProfileUpdates from '@modules/users/hooks/api/useProfileUpdates';

const EditProfile: NextPage = () => {
  const { user } = useAuth();
  const { t } = useTranslation(['common', 'user']);
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get the mutate function from SWR to update user data
  const { mutate } = useSWR(ApiRoutes.Auth.Me);

  const ProfileSchema = Yup.object().shape({
    firstName: Yup.string().nullable(),
    lastName: Yup.string().nullable(),
    email: Yup.string().nullable(),
    phoneNumber: Yup.string().nullable(),
    address: Yup.string().nullable(),
    city: Yup.string().nullable(),
    state: Yup.string().nullable(),
    country: Yup.string().nullable(),
    postalCode: Yup.string().nullable(),
    bio: Yup.string().nullable().max(1000, t('common:bio_too_long')),
    title: Yup.string().nullable().max(255, t('user:profile_title_too_long')),
    preferredLanguage: Yup.string().nullable(),
    timezone: Yup.string().nullable(),
  });

  const methods = useForm({
    resolver: yupResolver(ProfileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phoneNumber: user?.profile?.phoneNumber || '',
      address: user?.profile?.address || '',
      city: user?.profile?.city || '',
      state: user?.profile?.state || '',
      country: user?.profile?.country || '',
      postalCode: user?.profile?.postalCode || '',
    },
  });

  const {
    handleSubmit,
    formState: { isDirty },
  } = methods;

  const { updateProfile } = useProfileUpdates();

  const onSubmit = async (data: Any) => {
    try {
      setIsSubmitting(true);

      // Prepare data for API
      const updateData: Any = {
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        address: data.address,
        city: data.city,
        state: data.state,
        country: data.country,
        postalCode: data.postalCode,
      };

      const result = await updateProfile(updateData);

      if (result.success) {
        // Update local user data using SWR mutate
        mutate(result.data?.data);
        enqueueSnackbar(t('user:profile_updated_successfully'), { variant: 'success' });
        router.push(Routes.Users.Me);
      } else {
        enqueueSnackbar(result.errors?.[0] || t('common:update_failed'), { variant: 'error' });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      enqueueSnackbar(t('common:unexpected_error'), { variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push(Routes.Users.Me);
  };

  const handleChangePassword = () => {
    router.push(Routes.Users.ChangePassword);
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
              {t('user:edit_profile')}
            </Typography>
          </Stack>
        </Container>
      </Paper>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            {/* Basic Information */}
            <Card sx={{ p: 3 }}>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                {t('common:personal_information')}
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <RHFTextField name="firstName" label={t('common:first_name')} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <RHFTextField name="lastName" label={t('common:last_name')} />
                </Grid>
                <Grid item xs={12}>
                  <RHFTextField name="email" label={t('common:email')} disabled />
                </Grid>
                <Grid item xs={12} md={6}>
                  {/* <RHFTextField name="phoneNumber" label={t('common:phone_number')} /> */}
                  <RHFPhoneField
                    name="phoneNumber"
                    label={t('common:phone_number')}
                    placeholder={t('user:enter_phone_number')}
                    helperText={t('user:phone_number_help')}
                    defaultCountry="FR"
                    forceCallingCode
                    focusOnSelectCountry={false}
                    preferredCountries={PHONE_FIELD_PREFERRED_COUNTRIES}
                    onlyCountries={PHONE_FIELD_COUNTRIES}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Button
                    variant="outlined"
                    startIcon={<Lock />}
                    onClick={handleChangePassword}
                    sx={{ height: 56, width: '100%' }}
                  >
                    {t('user:change_password')}
                  </Button>
                </Grid>
              </Grid>
            </Card>

            {/* Address Information */}
            <Card sx={{ p: 3 }}>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                {t('common:address_information')}
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <RHFTextField name="address" label={t('common:address')} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <RHFTextField name="city" label={t('common:city')} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <RHFTextField name="state" label={t('common:state')} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <RHFTextField name="country" label={t('common:country')} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <RHFTextField name="postalCode" label={t('common:postal_code')} />
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
                  {t('common:save')}
                </LoadingButton>
              </Stack>
            </Card>
          </Stack>
        </FormProvider>
      </Container>
    </Box>
  );
};

export default withAuth(EditProfile, { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login });

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['user', 'common', 'topbar', 'notifications'])),
  },
});
