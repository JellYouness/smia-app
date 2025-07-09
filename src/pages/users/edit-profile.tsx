import { NextPage } from 'next';
import withAuth, { AUTH_MODE } from '@modules/auth/hocs/withAuth';
import Routes from '@common/defs/routes';
import {
  Box,
  Card,
  Grid,
  Typography,
  Button,
  Stack,
  Container,
  Paper,
  MenuItem,
} from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import FormProvider, { RHFTextField, RHFSelect } from '@common/components/lib/react-hook-form';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import useAuth from '@modules/auth/hooks/api/useAuth';
import { ArrowBack, Save, Cancel, School, Work, Star } from '@mui/icons-material';
import useUsers, { UpdateOneInput } from '@modules/users/hooks/api/useUsers';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import ApiRoutes from '@common/defs/api-routes';
import { Any } from '@common/defs/types';

const EditProfile: NextPage = () => {
  const { user } = useAuth();
  const { updateOne } = useUsers();
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
    password: Yup.string().nullable().min(8, t('common:password_min_length')),
    creator: Yup.object().shape({
      experience: Yup.number().nullable().min(0, t('user:experience_min')),
      hourlyRate: Yup.number().nullable().min(0, t('user:hourly_rate_min')),
      availability: Yup.string().nullable(),
      skills: Yup.string().nullable(),
      mediaTypes: Yup.string().nullable(),
      education: Yup.array().of(
        Yup.object().shape({
          degree: Yup.string().nullable(),
          field: Yup.string().nullable(),
          institution: Yup.string().nullable(),
          year: Yup.string().nullable(),
        })
      ),
      professionalBackground: Yup.array().of(
        Yup.object().shape({
          title: Yup.string().nullable(),
          company: Yup.string().nullable(),
          duration: Yup.string().nullable(),
          description: Yup.string().nullable(),
        })
      ),
      achievements: Yup.array().of(Yup.string().nullable()),
    }),
    client: Yup.object().shape({
      companyName: Yup.string().nullable(),
      companySize: Yup.string().nullable(),
      industry: Yup.string().nullable(),
      websiteUrl: Yup.string().nullable().url(t('user:invalid_website_url')),
      budget: Yup.number().nullable().min(0, t('user:budget_min')),
    }),
  });

  const methods = useForm({
    resolver: yupResolver(ProfileSchema),
    defaultValues: {
      firstName: user?.first_name || '',
      lastName: user?.last_name || '',
      email: user?.email || '',
      phoneNumber: user?.phone_number || '',
      address: user?.address || '',
      city: user?.city || '',
      state: user?.state || '',
      country: user?.country || '',
      postalCode: user?.postal_code || '',
      bio: user?.profile?.bio || '',
      title: user?.profile?.title || '',
      preferredLanguage: user?.preferred_language || '',
      timezone: user?.timezone || '',
      password: '',
      creator: {
        experience: user?.creator?.experience || '',
        hourlyRate: user?.creator?.hourly_rate || '',
        availability: user?.creator?.availability || '',
        skills:
          user?.creator && Array.isArray(user.creator.skills) ? user.creator.skills.join(', ') : '',
        mediaTypes:
          user?.creator && Array.isArray(user.creator.media_types)
            ? user.creator.media_types.join(', ')
            : '',
        education: user?.creator?.education || [],
        professionalBackground: user?.creator?.professional_background || [],
        achievements: user?.creator?.achievements || [],
      },
      client: {
        companyName: user?.client?.company_name || '',
        companySize: user?.client?.company_size || '',
        industry: user?.client?.industry || '',
        websiteUrl: user?.client?.website_url || '',
        budget: user?.client?.budget || '',
      },
    },
  });

  const {
    handleSubmit,
    formState: { isDirty },
  } = methods;

  const onSubmit = async (data: Any) => {
    try {
      setIsSubmitting(true);

      // Prepare data for API
      const updateData: Any = {
        first_name: data.firstName,
        last_name: data.lastName,
        phone_number: data.phoneNumber,
        address: data.address,
        city: data.city,
        state: data.state,
        country: data.country,
        postal_code: data.postalCode,
        bio: data.bio,
        title: data.title,
        preferred_language: data.preferredLanguage,
        timezone: data.timezone,
      };

      // Add password if provided
      if (data.password) {
        updateData.password = data.password;
      }

      // Add creator-specific data
      if (user?.creator) {
        updateData.skills = data.creator.skills
          ? data.creator.skills.split(',').map((s: string) => s.trim())
          : [];
        updateData.media_types = data.creator.mediaTypes
          ? data.creator.mediaTypes.split(',').map((s: string) => s.trim())
          : [];
        updateData.experience = data.creator.experience;
        updateData.hourly_rate = data.creator.hourlyRate;
        updateData.availability = data.creator.availability;
        updateData.education = data.creator.education;
        updateData.professional_background = data.creator.professionalBackground;
        updateData.achievements = data.creator.achievements.filter(
          (achievement: string) => achievement.trim() !== ''
        );
      }

      // Add client-specific data
      if (user?.client) {
        updateData.company_name = data.client.companyName;
        updateData.company_size = data.client.companySize;
        updateData.industry = data.client.industry;
        updateData.website_url = data.client.websiteUrl;
        updateData.budget = data.client.budget;
      }

      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();

      if (result.success) {
        // Update local user data using SWR mutate
        mutate(result.data.user);
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

  const isCreator = user?.creator;
  const isClient = user?.client;

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
                  <RHFTextField name="phoneNumber" label={t('common:phone_number')} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <RHFTextField name="preferredLanguage" label={t('common:preferred_language')} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <RHFTextField name="timezone" label={t('common:timezone')} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <RHFTextField
                    name="password"
                    label={t('common:change_password')}
                    type="password"
                  />
                </Grid>
                <Grid item xs={12}>
                  <RHFTextField name="title" label={t('user:profile_title')} />
                </Grid>
                <Grid item xs={12}>
                  <RHFTextField name="bio" label={t('common:biography')} multiline rows={4} />
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

            {/* Creator-specific fields */}
            {isCreator && (
              <Card sx={{ p: 3 }}>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                  {t('user:professional_information')}
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <RHFTextField
                      name="creator.experience"
                      label={t('user:experience_years')}
                      type="number"
                      inputProps={{ min: 0 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <RHFTextField
                      name="creator.hourlyRate"
                      label={t('user:hourly_rate')}
                      type="number"
                      inputProps={{ min: 0, step: 0.01 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <RHFSelect name="creator.availability" label={t('user:availability')}>
                      <MenuItem value="AVAILABLE">{t('user:available')}</MenuItem>
                      <MenuItem value="LIMITED">{t('user:limited')}</MenuItem>
                      <MenuItem value="UNAVAILABLE">{t('user:unavailable')}</MenuItem>
                      <MenuItem value="BUSY">{t('user:busy')}</MenuItem>
                    </RHFSelect>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {t('user:skills')}
                    </Typography>
                    <RHFTextField
                      name="creator.skills"
                      label={t('user:skills_placeholder')}
                      placeholder="e.g., Photography, Video Editing, Graphic Design"
                      helperText={t('user:skills_help')}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {t('user:media_types')}
                    </Typography>
                    <RHFTextField
                      name="creator.mediaTypes"
                      label={t('user:media_types_placeholder')}
                      placeholder="e.g., PHOTO, VIDEO, DESIGN"
                      helperText={t('user:media_types_help')}
                    />
                  </Grid>

                  {/* Education Section */}
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
                      {t('user:education')}
                    </Typography>

                    {/* Education List */}
                    {methods.watch('creator.education')?.map((_: any, index: number) => (
                      <Card key={index} sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 2,
                          }}
                        >
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {t('user:education')} #{index + 1}
                          </Typography>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => {
                              const currentEducation = methods.getValues('creator.education') || [];
                              const newEducation = currentEducation.filter(
                                (_: any, i: number) => i !== index
                              );
                              methods.setValue('creator.education', newEducation);
                            }}
                          >
                            {t('common:remove')}
                          </Button>
                        </Box>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <RHFTextField
                              name={`creator.education.${index}.degree`}
                              label={t('user:degree')}
                              placeholder={t('user:enter_degree')}
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <RHFTextField
                              name={`creator.education.${index}.field`}
                              label={t('user:field_of_study')}
                              placeholder={t('user:enter_field_of_study')}
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <RHFTextField
                              name={`creator.education.${index}.institution`}
                              label={t('user:institution')}
                              placeholder={t('user:enter_institution')}
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <RHFTextField
                              name={`creator.education.${index}.year`}
                              label={t('user:graduation_year')}
                              placeholder={t('user:enter_graduation_year')}
                            />
                          </Grid>
                        </Grid>
                      </Card>
                    ))}

                    {/* Add Education Button */}
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        const currentEducation = methods.getValues('creator.education') || [];
                        methods.setValue('creator.education', [
                          ...currentEducation,
                          { degree: '', field: '', institution: '', year: '' },
                        ]);
                      }}
                      sx={{ mb: 2 }}
                    >
                      {t('user:add_education')}
                    </Button>
                  </Grid>

                  {/* Professional Background Section */}
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
                      {t('user:professional_background')}
                    </Typography>

                    {/* Professional Background List */}
                    {methods
                      .watch('creator.professionalBackground')
                      ?.map((_: any, index: number) => (
                        <Card key={index} sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              mb: 2,
                            }}
                          >
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              {t('user:professional_background')} #{index + 1}
                            </Typography>
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              onClick={() => {
                                const currentProfessionalBackground =
                                  methods.getValues('creator.professionalBackground') || [];
                                const newProfessionalBackground =
                                  currentProfessionalBackground.filter(
                                    (_: any, i: number) => i !== index
                                  );
                                methods.setValue(
                                  'creator.professionalBackground',
                                  newProfessionalBackground
                                );
                              }}
                            >
                              {t('common:remove')}
                            </Button>
                          </Box>
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                              <RHFTextField
                                name={`creator.professionalBackground.${index}.title`}
                                label={t('user:job_title')}
                                placeholder={t('user:enter_job_title')}
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <RHFTextField
                                name={`creator.professionalBackground.${index}.company`}
                                label={t('user:company')}
                                placeholder={t('user:enter_company')}
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <RHFTextField
                                name={`creator.professionalBackground.${index}.duration`}
                                label={t('user:duration')}
                                placeholder={t('user:enter_duration')}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <RHFTextField
                                name={`creator.professionalBackground.${index}.description`}
                                label={t('user:description')}
                                placeholder={t('user:enter_job_description')}
                                multiline
                                rows={2}
                              />
                            </Grid>
                          </Grid>
                        </Card>
                      ))}

                    {/* Add Professional Background Button */}
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        const currentProfessionalBackground =
                          methods.getValues('creator.professionalBackground') || [];
                        methods.setValue('creator.professionalBackground', [
                          ...currentProfessionalBackground,
                          { title: '', company: '', duration: '', description: '' },
                        ]);
                      }}
                      sx={{ mb: 2 }}
                    >
                      {t('user:add_professional_background')}
                    </Button>
                  </Grid>

                  {/* Achievements Section */}
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
                      {t('user:achievements')}
                    </Typography>

                    {/* Achievements List */}
                    {methods.watch('creator.achievements')?.map((_: any, index: number) => (
                      <Card key={index} sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 2,
                          }}
                        >
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {t('user:achievement')} #{index + 1}
                          </Typography>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => {
                              const currentAchievements =
                                methods.getValues('creator.achievements') || [];
                              const newAchievements = currentAchievements.filter(
                                (_: any, i: number) => i !== index
                              );
                              methods.setValue('creator.achievements', newAchievements);
                            }}
                          >
                            {t('common:remove')}
                          </Button>
                        </Box>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <RHFTextField
                              name={`creator.achievements.${index}`}
                              label={t('user:achievement_description')}
                              placeholder={t('user:enter_achievement')}
                              multiline
                              rows={2}
                            />
                          </Grid>
                        </Grid>
                      </Card>
                    ))}

                    {/* Add Achievement Button */}
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        const currentAchievements = methods.getValues('creator.achievements') || [];
                        methods.setValue('creator.achievements', [...currentAchievements, '']);
                      }}
                      sx={{ mb: 2 }}
                    >
                      {t('user:add_achievement')}
                    </Button>
                  </Grid>
                </Grid>
              </Card>
            )}

            {/* Client-specific fields */}
            {isClient && (
              <Card sx={{ p: 3 }}>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                  {t('user:company_information')}
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <RHFTextField name="client.companyName" label={t('user:company_name')} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <RHFTextField name="client.companySize" label={t('user:company_size')} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <RHFTextField name="client.industry" label={t('user:industry')} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <RHFTextField name="client.websiteUrl" label={t('user:website_url')} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <RHFTextField
                      name="client.budget"
                      label={t('user:budget')}
                      type="number"
                      inputProps={{ min: 0, step: 0.01 }}
                    />
                  </Grid>
                </Grid>
              </Card>
            )}

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
    ...(await serverSideTranslations(locale, ['user', 'common', 'topbar'])),
  },
});
