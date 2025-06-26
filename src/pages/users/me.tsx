import { NextPage } from 'next';
import withAuth, { AUTH_MODE } from '@modules/auth/hocs/withAuth';
import Routes from '@common/defs/routes';
import {
  Box,
  Card,
  Grid,
  Typography,
  Avatar,
  Button,
  Stack,
  IconButton,
  Chip,
  Paper,
  Container,
  Badge,
} from '@mui/material';
import useAuth from '@modules/auth/hooks/api/useAuth';
import {
  Edit,
  Language,
  Work,
  Star,
  Verified,
  Business,
  Person,
  Email,
  Phone,
  Web,
  AttachMoney,
  Schedule,
  School,
  Public,
} from '@mui/icons-material';
import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import ApiRoutes from '@common/defs/api-routes';

interface ProfilePictureProps {
  src: string | null;
  onUpload: (file: File) => Promise<void>;
  onDelete: () => Promise<void>;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({ src, onUpload, onDelete }) => {
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
    <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center', mb: 2 }}>
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        badgeContent={
          <Stack direction="row" spacing={0.5}>
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <IconButton
              size="small"
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': { bgcolor: 'primary.dark' },
                width: 32,
                height: 32,
              }}
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              <Edit sx={{ fontSize: 16 }} />
            </IconButton>
            {src && (
              <IconButton
                size="small"
                sx={{
                  bgcolor: 'error.main',
                  color: 'white',
                  '&:hover': { bgcolor: 'error.dark' },
                  width: 32,
                  height: 32,
                }}
                onClick={onDelete}
                disabled={isUploading}
              >
                <Edit sx={{ fontSize: 16 }} />
              </IconButton>
            )}
          </Stack>
        }
      >
        <Avatar
          src={src || undefined}
          sx={{
            width: 120,
            height: 120,
            border: '4px solid white',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        />
      </Badge>
    </Box>
  );
};

const MyProfile: NextPage = () => {
  const { user } = useAuth();
  const { t } = useTranslation(['common', 'user']);
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [profilePicture, setProfilePicture] = useState<string | null>(user?.profilePicture || null);

  // Get the mutate function from SWR to update user data
  const { mutate } = useSWR(ApiRoutes.Auth.Me);

  const handleUploadPicture = async (file: File) => {
    // Implementation for uploading profile picture
    console.log('Uploading file:', file);
  };

  const handleDeletePicture = async () => {
    // Implementation for deleting profile picture
    console.log('Deleting profile picture');
  };

  const handleEditProfile = () => {
    router.push(Routes.Users.EditProfile);
  };

  const renderHeader = () => (
    <Paper
      elevation={0}
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: 0,
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <ProfilePicture
                src={profilePicture}
                onUpload={handleUploadPicture}
                onDelete={handleDeletePicture}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                {user?.firstName} {user?.lastName}
              </Typography>
              <Typography variant="h6" sx={{ mb: 2, opacity: 0.9 }}>
                {user?.email}
              </Typography>
              {user?.profile?.bio && (
                <Typography variant="body1" sx={{ opacity: 0.8 }}>
                  {user.profile.bio}
                </Typography>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' } }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<Edit />}
                onClick={handleEditProfile}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                }}
              >
                {t('user:edit_profile')}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Paper>
  );

  const renderBasicInfo = () => (
    <Card sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        {t('common:basic_information')}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Person sx={{ color: 'text.secondary' }} />
            <Box>
              <Typography variant="body2" color="text.secondary">
                {t('common:name')}
              </Typography>
              <Typography variant="body1">
                {user?.firstName} {user?.lastName}
              </Typography>
            </Box>
          </Stack>
        </Grid>
        <Grid item xs={12} md={6}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Email sx={{ color: 'text.secondary' }} />
            <Box>
              <Typography variant="body2" color="text.secondary">
                {t('common:email')}
              </Typography>
              <Typography variant="body1">{user?.email}</Typography>
            </Box>
          </Stack>
        </Grid>
        {user?.phone_number && (
          <Grid item xs={12} md={6}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Phone sx={{ color: 'text.secondary' }} />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {t('common:phone_number')}
                </Typography>
                <Typography variant="body1">{user.phone_number}</Typography>
              </Box>
            </Stack>
          </Grid>
        )}
        {user?.preferred_language && (
          <Grid item xs={12} md={6}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Language sx={{ color: 'text.secondary' }} />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {t('common:preferred_language')}
                </Typography>
                <Typography variant="body1">{user.preferred_language}</Typography>
              </Box>
            </Stack>
          </Grid>
        )}
        {user?.timezone && (
          <Grid item xs={12} md={6}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Schedule sx={{ color: 'text.secondary' }} />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {t('common:timezone')}
                </Typography>
                <Typography variant="body1">{user.timezone}</Typography>
              </Box>
            </Stack>
          </Grid>
        )}
        {user?.bio && (
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {t('common:biography')}
            </Typography>
            <Typography variant="body1">{user.bio}</Typography>
          </Grid>
        )}
      </Grid>
    </Card>
  );

  const renderAddressInfo = () => (
    <Card sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        {t('common:address')}
      </Typography>
      <Grid container spacing={3}>
        {user?.profile?.address && (
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {t('common:address')}
            </Typography>
            <Typography variant="body1">{user.profile.address}</Typography>
          </Grid>
        )}
        {user?.profile?.city && (
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {t('common:city')}
            </Typography>
            <Typography variant="body1">{user.profile.city}</Typography>
          </Grid>
        )}
        {user?.profile?.state && (
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {t('common:state')}
            </Typography>
            <Typography variant="body1">{user.profile.state}</Typography>
          </Grid>
        )}
        {user?.profile?.country && (
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {t('common:country')}
            </Typography>
            <Typography variant="body1">{user.profile.country}</Typography>
          </Grid>
        )}
        {user?.profile?.postal_code && (
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {t('common:postal_code')}
            </Typography>
            <Typography variant="body1">{user.profile.postal_code}</Typography>
          </Grid>
        )}
      </Grid>
    </Card>
  );

  const renderCreatorInfo = () => {
    if (!user?.creator) {
      return null;
    }
    const creator = user.creator;

    return (
      <Card sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Work sx={{ mr: 2, color: 'primary.main' }} />
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {t('user:creator_info')}
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {Array.isArray(creator.skills) && creator.skills.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {t('user:skills')}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                {creator.skills.map((skill, index) => (
                  <Chip key={index} label={skill} color="primary" variant="outlined" />
                ))}
              </Stack>
            </Grid>
          )}

          {Array.isArray(creator.mediaTypes) && creator.mediaTypes.length > 0 && (
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {t('user:media_types')}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                {creator.mediaTypes.map((type, index) => (
                  <Chip key={index} label={type} size="small" />
                ))}
              </Stack>
            </Grid>
          )}

          {creator.experience && (
            <Grid item xs={12} md={6}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Schedule sx={{ color: 'text.secondary' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {t('user:experience')}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {creator.experience} {t('user:years')}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          )}

          {creator.hourlyRate && (
            <Grid item xs={12} md={6}>
              <Stack direction="row" spacing={2} alignItems="center">
                <AttachMoney sx={{ color: 'text.secondary' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {t('user:hourly_rate')}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    ${creator.hourlyRate}/hr
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          )}

          {Array.isArray(creator.languages) && creator.languages.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {t('user:languages')}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                {creator.languages.map((lang, index) => (
                  <Chip
                    key={index}
                    label={`${lang.language} (${lang.proficiency})`}
                    variant="outlined"
                    size="small"
                  />
                ))}
              </Stack>
            </Grid>
          )}

          {Array.isArray(creator.regionalExpertise) && creator.regionalExpertise.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {t('user:regional_expertise')}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                {creator.regionalExpertise.map((region, index) => (
                  <Chip
                    key={index}
                    label={`${region.region} (${region.expertiseLevel})`}
                    variant="outlined"
                    size="small"
                  />
                ))}
              </Stack>
            </Grid>
          )}

          {creator.verificationStatus && (
            <Grid item xs={12} md={6}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Verified sx={{ color: 'text.secondary' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {t('user:verification_status')}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {creator.verificationStatus}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          )}

          {creator.availability && (
            <Grid item xs={12} md={6}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Schedule sx={{ color: 'text.secondary' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {t('user:availability')}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {creator.availability}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          )}

          {/* Education Section */}
          {Array.isArray(creator.education) && creator.education.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
                {t('user:education')}
              </Typography>
              <Stack spacing={2}>
                {creator.education.map((edu, index) => (
                  <Paper key={index} sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                      <School sx={{ color: 'primary.main' }} />
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {edu.degree} in {edu.field}
                      </Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      {edu.institution} • {edu.year}
                    </Typography>
                  </Paper>
                ))}
              </Stack>
            </Grid>
          )}

          {/* Professional Background Section */}
          {Array.isArray(creator.professionalBackground) &&
            creator.professionalBackground.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
                  {t('user:professional_background')}
                </Typography>
                <Stack spacing={2}>
                  {creator.professionalBackground.map((job, index) => (
                    <Paper key={index} sx={{ p: 2, bgcolor: 'grey.50' }}>
                      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                        <Work sx={{ color: 'primary.main' }} />
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {job.title}
                        </Typography>
                      </Stack>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {job.company} • {job.duration}
                      </Typography>
                      {job.description && (
                        <Typography variant="body2" color="text.secondary">
                          {job.description}
                        </Typography>
                      )}
                    </Paper>
                  ))}
                </Stack>
              </Grid>
            )}

          {/* Achievements Section */}
          {Array.isArray(creator.achievements) && creator.achievements.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
                {t('user:achievements')}
              </Typography>
              <Stack spacing={1}>
                {creator.achievements.map((achievement, index) => (
                  <Stack key={index} direction="row" spacing={1} alignItems="center">
                    <Star sx={{ color: 'warning.main', fontSize: 16 }} />
                    <Typography variant="body2">{achievement}</Typography>
                  </Stack>
                ))}
              </Stack>
            </Grid>
          )}
        </Grid>
      </Card>
    );
  };

  const renderClientInfo = () => {
    if (!user?.client) {
      return null;
    }
    const client = user.client;

    return (
      <Card sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Business sx={{ mr: 2, color: 'primary.main' }} />
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {t('user:client_info')}
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {client.companyName && (
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {t('user:company_name')}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {client.companyName}
              </Typography>
            </Grid>
          )}

          {client.industry && (
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {t('user:industry')}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {client.industry}
              </Typography>
            </Grid>
          )}

          {client.websiteUrl && (
            <Grid item xs={12} md={6}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Web sx={{ color: 'text.secondary' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {t('user:website_url')}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    <a
                      href={client.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'inherit', textDecoration: 'none' }}
                    >
                      {client.websiteUrl}
                    </a>
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          )}

          {client.budget && (
            <Grid item xs={12} md={6}>
              <Stack direction="row" spacing={2} alignItems="center">
                <AttachMoney sx={{ color: 'text.secondary' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {t('user:budget')}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    ${client.budget.toLocaleString()}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          )}

          {client.projectCount && (
            <Grid item xs={12} md={6}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Work sx={{ color: 'text.secondary' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {t('user:project_count')}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {client.projectCount} {t('user:projects')}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          )}

          {Array.isArray(client.preferredCreators) && client.preferredCreators.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {t('user:preferred_creators')}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                {client.preferredCreators.map((creatorId, index) => (
                  <Chip
                    key={index}
                    label={`Creator #${creatorId}`}
                    variant="outlined"
                    size="small"
                  />
                ))}
              </Stack>
            </Grid>
          )}
        </Grid>
      </Card>
    );
  };

  const renderAmbassadorInfo = () => {
    if (!user?.ambassador) {
      return null;
    }
    const ambassador = user.ambassador;

    return (
      <Card sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Public sx={{ mr: 2, color: 'primary.main' }} />
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {t('user:ambassador_info')}
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {ambassador.teamName && (
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {t('user:team_name')}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {ambassador.teamName}
              </Typography>
            </Grid>
          )}

          {Array.isArray(ambassador.specializations) && ambassador.specializations.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {t('user:specializations')}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                {ambassador.specializations.map((spec, index) => (
                  <Chip key={index} label={spec} color="primary" variant="outlined" />
                ))}
              </Stack>
            </Grid>
          )}

          {ambassador.clientCount && (
            <Grid item xs={12} md={6}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Person sx={{ color: 'text.secondary' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {t('user:client_count')}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {ambassador.clientCount} {t('user:clients')}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          )}

          {ambassador.commissionRate && (
            <Grid item xs={12} md={6}>
              <Stack direction="row" spacing={2} alignItems="center">
                <AttachMoney sx={{ color: 'text.secondary' }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {t('user:commission_rate')}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {ambassador.commissionRate}%
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          )}

          {ambassador.teamDescription && (
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {t('user:team_description')}
              </Typography>
              <Typography variant="body1">{ambassador.teamDescription}</Typography>
            </Grid>
          )}
        </Grid>
      </Card>
    );
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      {renderHeader()}

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={3}>
          {renderBasicInfo()}
          {renderAddressInfo()}
          {user?.creator && renderCreatorInfo()}
          {user?.client && renderClientInfo()}
          {user?.ambassador && renderAmbassadorInfo()}
        </Stack>
      </Container>
    </Box>
  );
};

export default withAuth(MyProfile, { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login });

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['user', 'common', 'topbar'])),
  },
});
