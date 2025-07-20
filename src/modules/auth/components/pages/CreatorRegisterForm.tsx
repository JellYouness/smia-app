import FormProvider, {
  RHFTextField,
  RHFCheckbox,
  RHFAutocomplete,
  RHFSelect,
} from '@common/components/lib/react-hook-form';
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
import { Box, Chip, TextField } from '@mui/material';
import { useState } from 'react';
import { useRouter } from 'next/router';

const CreatorRegisterForm = () => {
  const { register } = useAuth();
  const { t } = useTranslation(['auth', 'common']);
  const [languages, setLanguages] = useState<Array<{ language: string; proficiency: string }>>([]);
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
    skills: Yup.array().min(1, t('auth:skills_min_required')).required(t('common:field_required')),
    mediaTypes: Yup.array()
      .min(1, t('auth:media_types_min_required'))
      .required(t('common:field_required')),
    experienceLevel: Yup.string().required(t('common:field_required')),
    regions: Yup.array()
      .min(1, t('auth:regions_min_required'))
      .required(t('common:field_required')),
    termsAccepted: Yup.boolean()
      .oneOf([true], t('auth:terms_must_be_accepted'))
      .required(t('common:field_required')),
  });

  const methods = useForm<RegisterInput>({
    resolver: yupResolver(RegisterSchema),
    defaultValues: {
      userType: 'creator',
      termsAccepted: false,
      skills: [],
      mediaTypes: [],
      regions: [],
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: RegisterInput) => {
    const response = await register(
      {
        ...data,
        userType: 'creator',
        languages,
      },
      { displayProgress: true, displaySuccess: true }
    );

    if (response.success) {
      // Store email for verification page
      localStorage.setItem('pendingVerificationEmail', data.email);
      router.push('/auth/verify-email');
    }
  };

  const addLanguage = () => {
    setLanguages([...languages, { language: '', proficiency: '' }]);
  };

  const updateLanguage = (index: number, field: 'language' | 'proficiency', value: string) => {
    console.log('updateLanguage', index, field, value);
    const updatedLanguages = [...languages];
    updatedLanguages[index][field] = value;
    setLanguages(updatedLanguages);
  };

  const removeLanguage = (index: number) => {
    setLanguages(languages.filter((_, i) => i !== index));
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
        {t('auth:creator_registration_title')}
      </Typography>
      <Card sx={{ maxWidth: '800px', margin: 'auto' }}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3} sx={{ padding: 4 }}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {t('auth:basic_information')}
              </Typography>
            </Grid>
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

            {/* Professional Details */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, mt: 2 }}>
                {t('auth:professional_details')}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <RHFAutocomplete
                name="skills"
                label={t('auth:skills')}
                options={[
                  'Photography',
                  'Videography',
                  'Graphic Design',
                  'Web Design',
                  'Content Writing',
                  'Social Media Management',
                  'SEO',
                  'Marketing',
                  'Translation',
                  'Voice Over',
                  'Animation',
                  'Illustration',
                ]}
                multiple
                freeSolo
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                  ))
                }
              />
            </Grid>
            <Grid item xs={12}>
              <RHFAutocomplete
                name="mediaTypes"
                label={t('auth:media_types')}
                options={[
                  'Images',
                  'Videos',
                  'Audio',
                  'Documents',
                  'Graphics',
                  'Animations',
                  'Web Content',
                  'Social Media Content',
                ]}
                multiple
              />
            </Grid>
            <Grid item xs={12}>
              <RHFAutocomplete
                name="experienceLevel"
                label={t('auth:experience_level')}
                options={['Beginner', 'Intermediate', 'Advanced', 'Expert']}
              />
            </Grid>

            {/* Regional Expertise */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, mt: 2 }}>
                {t('auth:regional_expertise')}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <RHFAutocomplete
                name="regions"
                label={t('auth:regions')}
                options={[
                  'North America',
                  'Europe',
                  'Asia',
                  'Africa',
                  'South America',
                  'Australia',
                  'Middle East',
                  'Caribbean',
                ]}
                multiple
                freeSolo
              />
            </Grid>

            {/* Languages */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, mt: 2 }}>
                {t('auth:languages')}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              {languages.map((lang, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <TextField
                    label={t('auth:language')}
                    value={lang.language}
                    onChange={(e) => updateLanguage(index, 'language', e.target.value)}
                    sx={{ flex: 1 }}
                  />
                  {/* <RHFSelect
                    name={`languages[${index}].proficiency`}
                    label={t('auth:proficiency')}
                    value={lang.proficiency}
                    onChange={(e) => updateLanguage(index, 'proficiency', e.target.value)}
                    variant="outlined"
                    sx={{ flex: 1 }}
                  >
                    <option value="Basic">Basic</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Native">Native</option>
                  </RHFSelect> */}
                  <RHFAutocomplete
                    name={`languages[${index}].proficiency`}
                    label={t('auth:proficiency')}
                    options={['Basic', 'Intermediate', 'Advanced', 'Native']}
                    onChange={(_, value) => updateLanguage(index, 'proficiency', value as string)}
                    sx={{ flex: 1 }}
                  />
                  <LoadingButton
                    variant="outlined"
                    color="error"
                    onClick={() => removeLanguage(index)}
                    sx={{ minWidth: 'auto' }}
                  >
                    {t('common:remove')}
                  </LoadingButton>
                </Box>
              ))}
              <LoadingButton variant="outlined" onClick={addLanguage} sx={{ mb: 2 }}>
                {t('auth:add_language')}
              </LoadingButton>
            </Grid>

            {/* Terms and Conditions */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'start' }}>
                <RHFCheckbox name="termsAccepted" label={undefined} />
                <Typography variant="body2" color="text.secondary">
                  {t('auth:terms_and_conditions_text')}{' '}
                  <Link href="/terms" target="_blank">
                    {t('auth:terms_and_conditions_link')}
                  </Link>
                </Typography>
              </Box>
            </Grid>

            {/* Submit Button */}
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

            {/* Links */}
            <Grid item xs={12} sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                {t('auth:already_have_account')}{' '}
                <Link href={Routes.Auth.Login}>{t('auth:sign_in')}</Link>
              </Typography>
            </Grid>
            <Grid item xs={12} sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                {t('auth:are_you_client')}{' '}
                <Link href={Routes.Auth.RegisterClient}>{t('auth:register_as_client')}</Link>
              </Typography>
            </Grid>
          </Grid>
        </FormProvider>
      </Card>
    </>
  );
};

export default CreatorRegisterForm;
