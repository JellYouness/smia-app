import { NextPage } from 'next';
import withAuth, { AUTH_MODE } from '@modules/auth/hocs/withAuth';
import Routes from '@common/defs/routes';
import {
  Box,
  Card,
  Grid,
  Typography,
  Avatar,
  Tabs,
  Tab,
  Button,
  Stack,
  IconButton,
  MenuItem,
} from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import PageHeader from '@common/components/lib/partials/PageHeader';
import FormProvider, {
  RHFTextField,
  RHFSelect,
  RHFCheckbox,
} from '@common/components/lib/react-hook-form';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import useAuth from '@modules/auth/hooks/api/useAuth';
import {
  LockOpen,
  Person,
  Settings,
  Business,
  Edit,
  Save,
  Cancel,
  PhotoCamera,
  Delete,
} from '@mui/icons-material';
import useUsers, { UpdateOneInput } from '@modules/users/hooks/api/useUsers';
import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

interface ProfilePictureProps {
  src: string | null;
  isEditing: boolean;
  onUpload: (file: File) => Promise<void>;
  onDelete: () => Promise<void>;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({ src, isEditing, onUpload, onDelete }) => {
  const { t } = useTranslation(['common', 'user']);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert(t('user:invalid_image_format'));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert(t('user:image_size_limit'));
      return;
    }

    setIsUploading(true);
    try {
      await onUpload(file);
    } catch (error) {
      console.error(t('user:image_upload_error'), error);
      alert(t('user:image_upload_error'));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        mb: isEditing ? 6 : 3,
      }}
    >
      <Avatar src={src || undefined} sx={{ width: 120, height: 120 }} />
      {isEditing && (
        <Stack
          direction="row"
          spacing={1}
          sx={{
            position: 'absolute',
            bottom: -40,
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <IconButton
            color="primary"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            <PhotoCamera />
          </IconButton>
          {src && (
            <IconButton color="error" onClick={onDelete} disabled={isUploading}>
              <Delete />
            </IconButton>
          )}
        </Stack>
      )}
    </Box>
  );
};

const MyProfile: NextPage = () => {
  const { user } = useAuth();
  const { updateOne } = useUsers();
  const { t } = useTranslation(['common', 'user']);
  const [activeTab, setActiveTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(user?.profilePicture || null);

  const ProfileSchema = Yup.object()
    .shape({
      email: Yup.string()
        .max(191, t('common:field_too_long'))
        .email(t('common:email_format_incorrect'))
        .required(t('common:field_required')),
      password: Yup.string().max(191, t('common:field_too_long')),
      firstName: Yup.string().max(191, t('common:field_too_long')),
      lastName: Yup.string().max(191, t('common:field_too_long')),
      phoneNumber: Yup.string().max(191, t('common:field_too_long')),
      address: Yup.string().max(191, t('common:field_too_long')),
      city: Yup.string().max(191, t('common:field_too_long')),
      state: Yup.string().max(191, t('common:field_too_long')),
      country: Yup.string().max(191, t('common:field_too_long')),
      postalCode: Yup.string().max(191, t('common:field_too_long')),
      bio: Yup.string().max(1000, t('common:field_too_long')),
      preferredLanguage: Yup.string().max(191, t('common:field_too_long')),
      timezone: Yup.string().max(191, t('common:field_too_long')),
    })
    .strict()
    .noUnknown();

  const methods = useForm<UpdateOneInput>({
    resolver: yupResolver(ProfileSchema as any),
    defaultValues: {
      email: user?.email || '',
      password: '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phoneNumber: user?.phoneNumber || '',
      address: user?.address || '',
      city: user?.city || '',
      state: user?.state || '',
      country: user?.country || '',
      postalCode: user?.postalCode || '',
      bio: user?.bio || '',
      preferredLanguage: user?.preferredLanguage || '',
      timezone: user?.timezone || '',
      notificationPreferences: user?.notificationPreferences || {
        email: true,
        sms: false,
        push: true,
      },
      privacySettings: user?.privacySettings || {
        profileVisibility: 'PUBLIC',
        showEmail: false,
        showPhone: false,
        showAddress: false,
      },
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = methods;

  const handleUploadPicture = async (file: File) => {
    const formData = new FormData();
    formData.append('profile_picture', file);

    // TODO: Implémenter l'appel API pour télécharger l'image
    // const response = await uploadProfilePicture(formData);
    // setProfilePicture(response.url);

    // Pour l'instant, on utilise une URL temporaire
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePicture(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDeletePicture = async () => {
    try {
      // TODO: Implémenter l'appel API pour supprimer l'image
      // await deleteProfilePicture();
      setProfilePicture(null);
    } catch (error) {
      console.error(t('user:image_delete_error'), error);
      alert(t('user:image_delete_error'));
    }
  };

  const onSubmit = async (data: UpdateOneInput) => {
    if (!user) {
      return;
    }
    await updateOne(user.id, data, { displayProgress: true, displaySuccess: true });
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const renderBasicInfoPreview = () => (
    <Grid container rowSpacing={3} columnSpacing={2}>
      <Grid item xs={12}>
        <ProfilePicture
          src={profilePicture}
          isEditing={isEditing}
          onUpload={handleUploadPicture}
          onDelete={handleDeletePicture}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Typography variant="subtitle2" color="text.secondary">
          {t('common:first_name')}
        </Typography>
        <Typography variant="body1">{user?.firstName || '-'}</Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <Typography variant="subtitle2" color="text.secondary">
          {t('common:last_name')}
        </Typography>
        <Typography variant="body1">{user?.lastName || '-'}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle2" color="text.secondary">
          {t('common:email')}
        </Typography>
        <Typography variant="body1">{user?.email || '-'}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle2" color="text.secondary">
          {t('common:phone_number')}
        </Typography>
        <Typography variant="body1">{user?.phoneNumber || '-'}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle2" color="text.secondary">
          {t('common:biography')}
        </Typography>
        <Typography variant="body1">{user?.bio || '-'}</Typography>
      </Grid>
    </Grid>
  );

  const renderAddressPreview = () => (
    <Grid container rowSpacing={3} columnSpacing={2}>
      <Grid item xs={12}>
        <Typography variant="subtitle2" color="text.secondary">
          {t('common:address')}
        </Typography>
        <Typography variant="body1">{user?.address || '-'}</Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <Typography variant="subtitle2" color="text.secondary">
          {t('common:city')}
        </Typography>
        <Typography variant="body1">{user?.city || '-'}</Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <Typography variant="subtitle2" color="text.secondary">
          {t('common:state')}
        </Typography>
        <Typography variant="body1">{user?.state || '-'}</Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <Typography variant="subtitle2" color="text.secondary">
          {t('common:country')}
        </Typography>
        <Typography variant="body1">{user?.country || '-'}</Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <Typography variant="subtitle2" color="text.secondary">
          {t('common:postal_code')}
        </Typography>
        <Typography variant="body1">{user?.postalCode || '-'}</Typography>
      </Grid>
    </Grid>
  );

  const renderPreferencesPreview = () => (
    <Grid container rowSpacing={3} columnSpacing={2}>
      <Grid item xs={12} md={6}>
        <Typography variant="subtitle2" color="text.secondary">
          {t('common:preferred_language')}
        </Typography>
        <Typography variant="body1">{user?.preferredLanguage || '-'}</Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <Typography variant="subtitle2" color="text.secondary">
          {t('common:timezone')}
        </Typography>
        <Typography variant="body1">{user?.timezone || '-'}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          {t('common:notification_preferences')}
        </Typography>
        <Stack spacing={1}>
          <Typography variant="body2">
            • Email:{' '}
            {user?.notificationPreferences?.email ? t('common:enabled') : t('common:disabled')}
          </Typography>
          <Typography variant="body2">
            • SMS: {user?.notificationPreferences?.sms ? t('common:enabled') : t('common:disabled')}
          </Typography>
          <Typography variant="body2">
            • Push:{' '}
            {user?.notificationPreferences?.push ? t('common:enabled') : t('common:disabled')}
          </Typography>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          {t('common:privacy_settings')}
        </Typography>
        <Stack spacing={1}>
          <Typography variant="body2">
            • {t('common:profile_visibility')}:{' '}
            {user?.privacySettings?.profileVisibility || t('common:public')}
          </Typography>
          <Typography variant="body2">
            • {t('common:show_email')}:{' '}
            {user?.privacySettings?.showEmail ? t('common:yes') : t('common:no')}
          </Typography>
          <Typography variant="body2">
            • {t('common:show_phone')}:{' '}
            {user?.privacySettings?.showPhone ? t('common:yes') : t('common:no')}
          </Typography>
          <Typography variant="body2">
            • {t('common:show_address')}:{' '}
            {user?.privacySettings?.showAddress ? t('common:yes') : t('common:no')}
          </Typography>
        </Stack>
      </Grid>
    </Grid>
  );

  const renderBasicInfo = () => (
    <Grid container rowSpacing={3} columnSpacing={2}>
      <Grid item xs={12}>
        <ProfilePicture
          src={profilePicture}
          isEditing={isEditing}
          onUpload={handleUploadPicture}
          onDelete={handleDeletePicture}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <RHFTextField name="firstName" label={t('common:first_name')} />
      </Grid>
      <Grid item xs={12} md={6}>
        <RHFTextField name="lastName" label={t('common:last_name')} />
      </Grid>
      <Grid item xs={12}>
        <RHFTextField name="email" label={t('common:email')} />
      </Grid>
      <Grid item xs={12}>
        <RHFTextField name="phoneNumber" label={t('common:phone_number')} />
      </Grid>
      <Grid item xs={12}>
        <RHFTextField name="bio" label={t('common:biography')} multiline rows={4} />
      </Grid>
    </Grid>
  );

  const renderAddress = () => (
    <Grid container rowSpacing={3} columnSpacing={2}>
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
  );

  const renderPreferences = () => (
    <Grid container rowSpacing={3} columnSpacing={2}>
      <Grid item xs={12} md={6}>
        <RHFTextField name="preferredLanguage" label={t('common:preferred_language')} />
      </Grid>
      <Grid item xs={12} md={6}>
        <RHFTextField name="timezone" label={t('common:timezone')} />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          {t('common:notification_preferences')}
        </Typography>
        <RHFCheckbox name="notificationPreferences.email" label={t('common:email_notifications')} />
        <RHFCheckbox name="notificationPreferences.sms" label={t('common:sms_notifications')} />
        <RHFCheckbox name="notificationPreferences.push" label={t('common:push_notifications')} />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          {t('common:privacy_settings')}
        </Typography>
        <RHFSelect name="privacySettings.profileVisibility" label={t('common:profile_visibility')}>
          <MenuItem value="PUBLIC">{t('common:public')}</MenuItem>
          <MenuItem value="PRIVATE">{t('common:private')}</MenuItem>
          <MenuItem value="CONNECTIONS">{t('common:connections_only')}</MenuItem>
        </RHFSelect>
        <RHFCheckbox name="privacySettings.showEmail" label={t('common:show_email')} />
        <RHFCheckbox name="privacySettings.showPhone" label={t('common:show_phone')} />
        <RHFCheckbox name="privacySettings.showAddress" label={t('common:show_address')} />
      </Grid>
    </Grid>
  );

  const renderSecurity = () => (
    <Grid container rowSpacing={3} columnSpacing={2}>
      <Grid item xs={12}>
        <RHFTextField name="password" label={t('common:change_password')} type="password" />
      </Grid>
    </Grid>
  );

  return (
    <>
      {/* <Box sx={{ marginBottom: 4, display: 'flex', justifyContent: 'center' }}>
        <PageHeader title="Mon profil" />
      </Box> */}
      <Card sx={{ maxWidth: '800px', margin: 'auto', p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          {!isEditing ? (
            <Button variant="contained" startIcon={<Edit />} onClick={handleEdit}>
              {t('common:edit')}
            </Button>
          ) : (
            <Stack direction="row" spacing={2}>
              <Button variant="outlined" startIcon={<Cancel />} onClick={handleCancel}>
                {t('common:cancel')}
              </Button>
              <LoadingButton
                variant="contained"
                startIcon={<Save />}
                loading={isSubmitting}
                onClick={handleSubmit(onSubmit)}
              >
                {t('common:save')}
              </LoadingButton>
            </Stack>
          )}
        </Box>

        <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }} centered>
          <Tab icon={<Person />} label={t('common:basic_information')} />
          <Tab icon={<Business />} label={t('common:address')} />
          <Tab icon={<Settings />} label={t('common:preferences')} />
          <Tab icon={<LockOpen />} label={t('common:security')} />
        </Tabs>

        {!isEditing ? (
          <Box sx={{ p: 2 }}>
            {activeTab === 0 && renderBasicInfoPreview()}
            {activeTab === 1 && renderAddressPreview()}
            {activeTab === 2 && renderPreferencesPreview()}
            {activeTab === 3 && renderSecurity()}
          </Box>
        ) : (
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ p: 2 }}>
              {activeTab === 0 && renderBasicInfo()}
              {activeTab === 1 && renderAddress()}
              {activeTab === 2 && renderPreferences()}
              {activeTab === 3 && renderSecurity()}
            </Box>
          </FormProvider>
        )}
      </Card>
    </>
  );
};

export default withAuth(MyProfile, { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login });

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['user', 'common', 'topbar'])),
  },
});
