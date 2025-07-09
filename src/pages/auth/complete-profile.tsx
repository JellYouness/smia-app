import { NextPage } from 'next';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Button,
  Stack,
  Alert,
  CircularProgress,
  MenuItem,
  Box,
} from '@mui/material';
import FormProvider, { RHFTextField, RHFSelect } from '@common/components/lib/react-hook-form';
import { LoadingButton } from '@mui/lab';
import { useTranslation } from 'next-i18next';
import { useCompleteProfile } from '@modules/users/hooks/api/useCompleteProfile';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import withAuth, { AUTH_MODE } from '@modules/auth/hocs/withAuth';
import Routes from '@common/defs/routes';

const CompleteProfile: NextPage = () => {
  const { t } = useTranslation(['common', 'user', 'auth']);
  const { methods, isLoading, isSubmitting, onSubmit, handleSkip } = useCompleteProfile();

  if (isLoading) {
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" sx={{ mb: 3, textAlign: 'center', fontWeight: 600 }}>
          {t('user:complete_your_profile')}
        </Typography>

        <Alert severity="info" sx={{ mb: 3 }}>
          {t('user:profile_completion_info')}
        </Alert>

        <FormProvider methods={methods} onSubmit={onSubmit}>
          {/* Personal Information Section */}
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: 'primary.main' }}>
            {t('user:personal_information')}
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                {t('common:phone_number')}
              </Typography>
              <RHFTextField
                name="phoneNumber"
                placeholder={t('user:enter_phone_number')}
                helperText={t('user:phone_number_help')}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                {t('common:preferred_language')}
              </Typography>
              <RHFTextField
                name="preferredLanguage"
                placeholder={t('user:enter_preferred_language')}
                helperText={t('user:preferred_language_help')}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                {t('common:timezone')}
              </Typography>
              <RHFTextField
                name="timezone"
                placeholder={t('user:enter_timezone')}
                helperText={t('user:timezone_help')}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                {t('common:gender')}
              </Typography>
              <RHFSelect
                name="gender"
                label={t('common:select_gender')}
                helperText={t('user:gender_help')}
              >
                <MenuItem value="MALE">{t('common:male')}</MenuItem>
                <MenuItem value="FEMALE">{t('common:female')}</MenuItem>
                <MenuItem value="OTHER">{t('common:other')}</MenuItem>
              </RHFSelect>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                {t('common:date_of_birth')}
              </Typography>
              <RHFTextField
                name="dateOfBirth"
                type="date"
                InputLabelProps={{ shrink: true }}
                helperText={t('user:date_of_birth_help')}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                {t('user:profile_picture_url')}
              </Typography>
              <RHFTextField
                name="profilePicture"
                placeholder={t('user:enter_profile_picture_url')}
                helperText={t('user:profile_picture_help')}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                {t('common:biography')}
              </Typography>
              <RHFTextField
                name="bio"
                placeholder={t('user:enter_bio_placeholder')}
                multiline
                rows={4}
                helperText={t('user:bio_help_text')}
              />
            </Grid>
          </Grid>

          {/* Address Information Section */}
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: 'primary.main' }}>
            {t('common:address_information')}
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                {t('common:address')}
              </Typography>
              <RHFTextField
                name="address"
                placeholder={t('user:enter_address')}
                helperText={t('user:address_help')}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                {t('common:city')}
              </Typography>
              <RHFTextField name="city" placeholder={t('user:enter_city')} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                {t('common:state')}
              </Typography>
              <RHFTextField name="state" placeholder={t('user:enter_state')} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                {t('common:country')}
              </Typography>
              <RHFTextField name="country" placeholder={t('user:enter_country')} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                {t('common:postal_code')}
              </Typography>
              <RHFTextField name="postalCode" placeholder={t('user:enter_postal_code')} />
            </Grid>
          </Grid>

          {/* Notification Preferences Section */}
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: 'primary.main' }}>
            {t('user:notification_preferences')}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
            {t('user:notification_preferences_help')}
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                {t('user:email_notifications')}
              </Typography>
              <RHFSelect
                name="notificationPreferences.email"
                helperText={t('user:email_notifications_help')}
              >
                <MenuItem value="true">{t('common:enabled')}</MenuItem>
                <MenuItem value="false">{t('common:disabled')}</MenuItem>
              </RHFSelect>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                {t('user:sms_notifications')}
              </Typography>
              <RHFSelect
                name="notificationPreferences.sms"
                helperText={t('user:sms_notifications_help')}
              >
                <MenuItem value="true">{t('common:enabled')}</MenuItem>
                <MenuItem value="false">{t('common:disabled')}</MenuItem>
              </RHFSelect>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                {t('user:push_notifications')}
              </Typography>
              <RHFSelect
                name="notificationPreferences.push"
                helperText={t('user:push_notifications_help')}
              >
                <MenuItem value="true">{t('common:enabled')}</MenuItem>
                <MenuItem value="false">{t('common:disabled')}</MenuItem>
              </RHFSelect>
            </Grid>
          </Grid>

          {/* Privacy Settings Section */}
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: 'primary.main' }}>
            {t('user:privacy_settings')}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
            {t('user:privacy_settings_help')}
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                {t('user:profile_visibility')}
              </Typography>
              <RHFSelect
                name="privacySettings.profileVisibility"
                helperText={t('user:profile_visibility_help')}
              >
                <MenuItem value="PUBLIC">{t('user:public')}</MenuItem>
                <MenuItem value="PRIVATE">{t('user:private')}</MenuItem>
                <MenuItem value="FRIENDS">{t('user:friends_only')}</MenuItem>
              </RHFSelect>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                {t('user:show_email')}
              </Typography>
              <RHFSelect name="privacySettings.showEmail" helperText={t('user:show_email_help')}>
                <MenuItem value="true">{t('common:yes')}</MenuItem>
                <MenuItem value="false">{t('common:no')}</MenuItem>
              </RHFSelect>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                {t('user:show_phone')}
              </Typography>
              <RHFSelect name="privacySettings.showPhone" helperText={t('user:show_phone_help')}>
                <MenuItem value="true">{t('common:yes')}</MenuItem>
                <MenuItem value="false">{t('common:no')}</MenuItem>
              </RHFSelect>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                {t('user:show_address')}
              </Typography>
              <RHFSelect
                name="privacySettings.showAddress"
                helperText={t('user:show_address_help')}
              >
                <MenuItem value="true">{t('common:yes')}</MenuItem>
                <MenuItem value="false">{t('common:no')}</MenuItem>
              </RHFSelect>
            </Grid>
          </Grid>

          {/* Social Media Links Section */}
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: 'primary.main' }}>
            {t('user:social_media_links')}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
            {t('user:social_media_links_help')}
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                {t('user:facebook_url')}
              </Typography>
              <RHFTextField
                name="socialMediaLinks.facebook"
                placeholder={t('user:enter_facebook_url')}
                helperText={t('user:facebook_url_help')}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                {t('user:twitter_url')}
              </Typography>
              <RHFTextField
                name="socialMediaLinks.twitter"
                placeholder={t('user:enter_twitter_url')}
                helperText={t('user:twitter_url_help')}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                {t('user:linkedin_url')}
              </Typography>
              <RHFTextField
                name="socialMediaLinks.linkedin"
                placeholder={t('user:enter_linkedin_url')}
                helperText={t('user:linkedin_url_help')}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                {t('user:instagram_url')}
              </Typography>
              <RHFTextField
                name="socialMediaLinks.instagram"
                placeholder={t('user:enter_instagram_url')}
                helperText={t('user:instagram_url_help')}
              />
            </Grid>
          </Grid>

          {/* Emergency Contact Section */}
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: 'primary.main' }}>
            {t('user:emergency_contact')}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
            {t('user:emergency_contact_help')}
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                {t('user:emergency_contact_name')}
              </Typography>
              <RHFTextField
                name="emergencyContact.name"
                placeholder={t('user:enter_emergency_contact_name')}
                helperText={t('user:emergency_contact_name_help')}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                {t('user:relationship')}
              </Typography>
              <RHFTextField
                name="emergencyContact.relationship"
                placeholder={t('user:enter_relationship')}
                helperText={t('user:relationship_help')}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                {t('user:emergency_contact_phone')}
              </Typography>
              <RHFTextField
                name="emergencyContact.phone"
                placeholder={t('user:enter_emergency_contact_phone')}
                helperText={t('user:emergency_contact_phone_help')}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                {t('user:emergency_contact_email')}
              </Typography>
              <RHFTextField
                name="emergencyContact.email"
                placeholder={t('user:enter_emergency_contact_email')}
                helperText={t('user:emergency_contact_email_help')}
              />
            </Grid>
          </Grid>

          {/* Preferences Section */}
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: 'primary.main' }}>
            {t('user:preferences')}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
            {t('user:preferences_help')}
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                {t('user:theme_preference')}
              </Typography>
              <RHFSelect name="preferences.theme" helperText={t('user:theme_preference_help')}>
                <MenuItem value="light">{t('user:light_theme')}</MenuItem>
                <MenuItem value="dark">{t('user:dark_theme')}</MenuItem>
                <MenuItem value="auto">{t('user:auto_theme')}</MenuItem>
              </RHFSelect>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                {t('user:language_preference')}
              </Typography>
              <RHFTextField
                name="preferences.language"
                placeholder={t('user:enter_language_preference')}
                helperText={t('user:language_preference_help')}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                {t('user:timezone_preference')}
              </Typography>
              <RHFTextField
                name="preferences.timezone"
                placeholder={t('user:enter_timezone_preference')}
                helperText={t('user:timezone_preference_help')}
              />
            </Grid>
          </Grid>

          <Stack direction="row" spacing={2} sx={{ mt: 4, justifyContent: 'center' }}>
            <Button variant="outlined" onClick={handleSkip} disabled={isSubmitting}>
              {t('common:skip_for_now')}
            </Button>
            <LoadingButton type="submit" variant="contained" loading={isSubmitting} size="large">
              {t('user:complete_profile')}
            </LoadingButton>
          </Stack>
        </FormProvider>
      </Paper>
    </Container>
  );
};

export default withAuth(CompleteProfile, {
  mode: AUTH_MODE.LOGGED_IN,
  redirectUrl: Routes.Auth.Login,
});

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['user', 'common', 'topbar', 'auth'])),
  },
});
