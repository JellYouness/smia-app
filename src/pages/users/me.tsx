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
  Paper,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Chip,
  useTheme,
  Divider,
} from '@mui/material';
import useAuth from '@modules/auth/hooks/api/useAuth';
import {
  Language,
  Work,
  Star,
  Verified,
  Person,
  Email,
  Phone,
  AttachMoney,
  Schedule,
  Edit,
  LinkedIn,
  Twitter,
  Facebook,
  Instagram,
  GitHub,
  Language as LanguageIcon,
  School,
} from '@mui/icons-material';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import ApiRoutes from '@common/defs/api-routes';
import Skeleton from '@mui/material/Skeleton';
import Link from 'next/link';
import { Any } from '@common/defs/types';
import {
  JsonDataRenderer,
  ChipList,
  CardList,
  InfoItem,
  ProfilePicture,
  SectionCard,
} from '@modules/users/components';

interface MainContentProps {
  user: Any;
  t: Any;
}

const MainContent = ({ user, t }: MainContentProps) => {
  const [openPortfolio, setOpenPortfolio] = useState(false);
  const [openSkills, setOpenSkills] = useState(false);
  const [openLanguages, setOpenLanguages] = useState(false);
  const [openEducation, setOpenEducation] = useState(false);
  const [openAchievements, setOpenAchievements] = useState(false);
  const [openTestimonials, setOpenTestimonials] = useState(false);
  const [openCertifications, setOpenCertifications] = useState(false);
  const [openEmployment, setOpenEmployment] = useState(false);
  const [openOther, setOpenOther] = useState(false);

  const renderDialog = (title: string, open: boolean, onClose: () => void) => (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit {title}</DialogTitle>
      <DialogContent>
        <Typography>Edit {title} form goes here.</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Stack spacing={0}>
      {/* Title/About Section */}
      <SectionCard title={user?.profile?.title || t('user:about')} editLink="/users/edit-profile">
        <Typography variant="body1" sx={{ mt: 1 }}>
          {user?.profile?.bio || <Skeleton width="80%" />}
        </Typography>
      </SectionCard>

      {/* Portfolio Section */}
      <SectionCard title="Portfolio" onEdit={() => setOpenPortfolio(true)}>
        <CardList
          items={user?.creator?.portfolio || []}
          renderCard={(item) => (
            <Box
              sx={{
                p: 3,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                mb: 2,
                '&:hover': {
                  borderColor: 'primary.main',
                  boxShadow: 1,
                  transform: 'translateY(-2px)',
                  transition: 'all 0.2s ease-in-out',
                },
              }}
            >
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: 'primary.main' }}>
                {item.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                {item.description}
              </Typography>
              {item.url && (
                <Link href={item.url} target="_blank" rel="noopener noreferrer">
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: 'primary.main',
                        color: 'white',
                      },
                    }}
                  >
                    View Project
                  </Button>
                </Link>
              )}
            </Box>
          )}
          fallback={
            <Box
              sx={{
                p: 4,
                textAlign: 'center',
                border: '2px dashed',
                borderColor: 'divider',
                borderRadius: 2,
                bgcolor: 'grey.50',
              }}
            >
              <Skeleton variant="rectangular" height={60} sx={{ borderRadius: 2, mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                Showcase your best work and projects.
              </Typography>
            </Box>
          }
        />
      </SectionCard>
      {renderDialog('Portfolio', openPortfolio, () => setOpenPortfolio(false))}

      {/* Skills Section */}
      <SectionCard title="Skills" onEdit={() => setOpenSkills(true)}>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
          <ChipList items={user?.creator?.skills || []} />
        </Stack>
      </SectionCard>
      {renderDialog('Skills', openSkills, () => setOpenSkills(false))}

      {/* Certifications Section */}
      <SectionCard title="Certifications" onEdit={() => setOpenCertifications(true)}>
        <Stack spacing={3}>
          <JsonDataRenderer
            data={user?.creator?.certifications || []}
            renderItem={(cert) => (
              <Box
                sx={{
                  p: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                  position: 'relative',
                  '&:hover': {
                    borderColor: 'success.main',
                    boxShadow: 1,
                  },
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 32,
                    right: 24,
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: 'success.main',
                  }}
                />
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: 'success.dark' }}>
                  {cert.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
                  Issued by: {cert.issuer}
                </Typography>
                {cert.date && (
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                    Date: {cert.date}
                  </Typography>
                )}
              </Box>
            )}
            fallback={
              <Box
                sx={{
                  p: 4,
                  textAlign: 'center',
                  border: '2px dashed',
                  borderColor: 'divider',
                  borderRadius: 2,
                  bgcolor: 'grey.50',
                }}
              >
                <Skeleton variant="rectangular" height={60} sx={{ borderRadius: 2, mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  Listing your certifications can help prove your specific knowledge or abilities.
                </Typography>
              </Box>
            }
          />
        </Stack>
      </SectionCard>
      {renderDialog('Certifications', openCertifications, () => setOpenCertifications(false))}

      {/* Employment History Section */}
      <SectionCard title="Employment History" onEdit={() => setOpenEmployment(true)}>
        <Stack spacing={3}>
          <JsonDataRenderer
            data={user?.creator?.professionalBackground || []}
            renderItem={(job) => (
              <Box
                sx={{
                  p: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  // borderRadius: 2,
                  borderRadius: '0 16px 16px 0',
                  bgcolor: 'background.paper',
                  position: 'relative',
                  '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: 1,
                  },
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 4,
                    bgcolor: 'primary.main',
                  }}
                />
                <Box sx={{ pl: 2 }}>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: 'primary.main' }}>
                    {job.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1, fontWeight: 500 }}
                  >
                    {job.company} • {job.duration}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {job.description}
                  </Typography>
                </Box>
              </Box>
            )}
            fallback={
              <Box
                sx={{
                  p: 4,
                  textAlign: 'center',
                  border: '2px dashed',
                  borderColor: 'divider',
                  borderRadius: 2,
                  bgcolor: 'grey.50',
                }}
              >
                <Skeleton variant="rectangular" height={60} sx={{ borderRadius: 2, mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  Add your employment history to help clients understand your background.
                </Typography>
              </Box>
            }
          />
        </Stack>
      </SectionCard>
      {renderDialog('Employment History', openEmployment, () => setOpenEmployment(false))}

      {/* Achievements Section */}
      <SectionCard title="Achievements" onEdit={() => setOpenAchievements(true)}>
        <Stack spacing={3}>
          <JsonDataRenderer
            data={user?.creator?.achievements || []}
            renderItem={(achievement, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 2.5,
                  pl: 3,
                  bgcolor: 'grey.50',
                  borderLeft: '6px solid',
                  borderColor: 'warning.main',
                  borderRadius: '0 16px 16px 0',
                  boxShadow: 0,
                  gap: 2,
                  position: 'relative',
                  minHeight: 56,
                  '&:hover': {
                    boxShadow: 2,
                    bgcolor: 'background.paper',
                    borderColor: 'primary.main',
                    transition: 'all 0.2s',
                  },
                }}
              >
                <Star sx={{ color: 'warning.main', fontSize: 28, mr: 2, flexShrink: 0 }} />
                <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.primary' }}>
                  {achievement}
                </Typography>
              </Box>
            )}
            fallback={
              <Box
                sx={{
                  p: 4,
                  textAlign: 'center',
                  border: '2px dashed',
                  borderColor: 'divider',
                  borderRadius: 2,
                  bgcolor: 'grey.50',
                }}
              >
                <Skeleton variant="rectangular" height={60} sx={{ borderRadius: 2, mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  Highlight your key achievements and accomplishments.
                </Typography>
              </Box>
            }
          />
        </Stack>
      </SectionCard>
      {renderDialog('Achievements', openAchievements, () => setOpenAchievements(false))}

      {/* Testimonials Section */}
      <SectionCard title="Testimonials" onEdit={() => setOpenTestimonials(true)}>
        <Skeleton variant="rectangular" height={60} sx={{ borderRadius: 2 }} />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Showcase your skills with non-Upwork client testimonials
        </Typography>
      </SectionCard>
      {renderDialog('Testimonials', openTestimonials, () => setOpenTestimonials(false))}

      {/* Other Experiences Section */}
      <SectionCard title="Other Experiences" onEdit={() => setOpenOther(true)}>
        <Skeleton variant="rectangular" height={60} sx={{ borderRadius: 2 }} />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Add any other experiences that help you stand out.
        </Typography>
      </SectionCard>
      {renderDialog('Other Experiences', openOther, () => setOpenOther(false))}
    </Stack>
  );
};

interface SidebarProps {
  user: Any;
  profilePicture: string | null;
  handleUploadPicture: (file: File) => Promise<void>;
  handleDeletePicture: () => Promise<void>;
}

const Sidebar = ({
  user,
  profilePicture,
  handleUploadPicture,
  handleDeletePicture,
}: SidebarProps) => (
  <Stack spacing={3}>
    <Card sx={{ p: 3, textAlign: 'center' }}>
      <ProfilePicture
        src={profilePicture}
        onUpload={handleUploadPicture}
        onDelete={handleDeletePicture}
      />
      <Typography variant="h6" sx={{ mt: 2, fontWeight: 700 }}>
        {user?.firstName} {user?.lastName}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {user?.profile?.city || <Skeleton width={80} />}{' '}
        {user?.profile?.country ? `, ${user.profile.country}` : ''}
      </Typography>

      {/* Additional Info */}
      {user?.creator && (
        <Box sx={{ mt: 2 }}>
          <Stack spacing={1}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Verified sx={{ fontSize: 16, color: 'success.main' }} />
              <Typography variant="body2" color="text.secondary">
                {user.creator.verificationStatus}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Work sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {user.creator.experience} years experience
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AttachMoney sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                ${user.creator.hourlyRate}/hr
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Star sx={{ fontSize: 16, color: 'warning.main' }} />
              <Typography variant="body2" color="text.secondary">
                {user.creator.averageRating} ({user.creator.ratingCount} reviews)
              </Typography>
            </Box>
          </Stack>
        </Box>
      )}
    </Card>

    {/* Languages Section */}
    <Card sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <LanguageIcon sx={{ fontSize: 20, color: 'primary.main' }} />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Languages
        </Typography>
      </Box>
      <Stack spacing={1}>
        <JsonDataRenderer
          data={user?.creator?.languages || []}
          renderItem={(lang, index) => (
            <Box
              key={index}
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {lang.language}
              </Typography>
              <Chip label={lang.proficiency} size="small" color="secondary" variant="outlined" />
            </Box>
          )}
          fallback={
            <Typography variant="body2" color="text.secondary">
              No languages added yet
            </Typography>
          }
        />
      </Stack>
    </Card>

    {/* Education Section */}
    <Card sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <School sx={{ fontSize: 20, color: 'primary.main' }} />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Education
        </Typography>
      </Box>
      <Stack spacing={2}>
        <JsonDataRenderer
          data={user?.creator?.education || []}
          renderItem={(edu, index) => (
            <Box key={index}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                {edu.degree} in {edu.field}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                {edu.institution}
              </Typography>
              {edu.year && (
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                  {edu.year}
                </Typography>
              )}
            </Box>
          )}
          fallback={
            <Typography variant="body2" color="text.secondary">
              No education added yet
            </Typography>
          }
        />
      </Stack>
    </Card>

    {/* Social Media Links */}
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Social Media
      </Typography>
      <Stack spacing={1}>
        {user?.profile?.socialMediaLinks?.linkedin && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LinkedIn sx={{ fontSize: 20, color: '#0077b5' }} />
            <Link
              href={user.profile.socialMediaLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Typography variant="body2" color="primary" sx={{ textDecoration: 'none' }}>
                LinkedIn
              </Typography>
            </Link>
          </Box>
        )}
        {user?.profile?.socialMediaLinks?.twitter && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Twitter sx={{ fontSize: 20, color: '#1DA1F2' }} />
            <Link
              href={user.profile.socialMediaLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Typography variant="body2" color="primary" sx={{ textDecoration: 'none' }}>
                Twitter
              </Typography>
            </Link>
          </Box>
        )}
        {user?.profile?.socialMediaLinks?.facebook && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Facebook sx={{ fontSize: 20, color: '#1877F2' }} />
            <Link
              href={user.profile.socialMediaLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Typography variant="body2" color="primary" sx={{ textDecoration: 'none' }}>
                Facebook
              </Typography>
            </Link>
          </Box>
        )}
        {user?.profile?.socialMediaLinks?.instagram && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Instagram sx={{ fontSize: 20, color: '#E4405F' }} />
            <Link
              href={user.profile.socialMediaLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Typography variant="body2" color="primary" sx={{ textDecoration: 'none' }}>
                Instagram
              </Typography>
            </Link>
          </Box>
        )}
        {user?.profile?.socialMediaLinks?.github && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <GitHub sx={{ fontSize: 20, color: '#333' }} />
            <Link
              href={user.profile.socialMediaLinks.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Typography variant="body2" color="primary" sx={{ textDecoration: 'none' }}>
                GitHub
              </Typography>
            </Link>
          </Box>
        )}
        {!user?.profile?.socialMediaLinks?.linkedin &&
          !user?.profile?.socialMediaLinks?.twitter &&
          !user?.profile?.socialMediaLinks?.facebook &&
          !user?.profile?.socialMediaLinks?.instagram &&
          !user?.profile?.socialMediaLinks?.github && (
            <Typography variant="body2" color="text.secondary">
              No social media links added yet
            </Typography>
          )}
      </Stack>
    </Card>
  </Stack>
);

const MyProfile: NextPage = () => {
  const { user, initialized } = useAuth();
  const { t } = useTranslation(['common', 'user']);
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [profilePicture, setProfilePicture] = useState<string | null>(
    user?.profile?.profile_picture || null
  );

  // Update profile picture when user data changes
  useEffect(() => {
    if (user?.profile?.profile_picture) {
      setProfilePicture(user.profile.profile_picture);
    }
  }, [user?.profile?.profile_picture]);

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

  // Show loading state while auth is initializing
  if (!initialized) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: 'grey.50',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Show loading state if user data is not available yet
  if (!user) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', py: 4 }}>
        <Container maxWidth="xl">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3, textAlign: 'center' }}>
                <Skeleton variant="circular" width={120} height={120} sx={{ mx: 'auto', mb: 2 }} />
                <Skeleton variant="text" width="60%" sx={{ mx: 'auto', mb: 1 }} />
                <Skeleton variant="text" width="40%" sx={{ mx: 'auto' }} />
              </Card>
            </Grid>
            <Grid item xs={12} md={8}>
              <Stack spacing={3}>
                <Card sx={{ p: 3, mb: 3 }}>
                  <Skeleton variant="text" width="30%" sx={{ mb: 2 }} />
                  <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 1 }} />
                </Card>
                <Card sx={{ p: 3, mb: 3 }}>
                  <Skeleton variant="text" width="25%" sx={{ mb: 2 }} />
                  <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 1 }} />
                </Card>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>
    );
  }

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
      <Container maxWidth="xl">
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
          <InfoItem
            icon={<Person sx={{ color: 'text.secondary' }} />}
            label={t('common:name')}
            value={`${user?.firstName} ${user?.lastName}`}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <InfoItem
            icon={<Email sx={{ color: 'text.secondary' }} />}
            label={t('common:email')}
            value={user?.email}
          />
        </Grid>
        {user?.profile?.contactPhone && (
          <Grid item xs={12} md={6}>
            <InfoItem
              icon={<Phone sx={{ color: 'text.secondary' }} />}
              label={t('common:phone_number')}
              value={user.profile.contactPhone}
            />
          </Grid>
        )}
        {user?.profile?.preferred_language && (
          <Grid item xs={12} md={6}>
            <InfoItem
              icon={<Language sx={{ color: 'text.secondary' }} />}
              label={t('common:preferred_language')}
              value={user.profile.preferred_language}
            />
          </Grid>
        )}
        {user?.profile?.timezone && (
          <Grid item xs={12} md={6}>
            <InfoItem
              icon={<Schedule sx={{ color: 'text.secondary' }} />}
              label={t('common:timezone')}
              value={user.profile.timezone}
            />
          </Grid>
        )}
        {user?.profile?.bio && (
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {t('common:biography')}
            </Typography>
            <Typography variant="body1">{user.profile.bio}</Typography>
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

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'white', py: 4 }}>
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          <Grid
            item
            xs={12}
            md={4}
            sx={{ borderRight: `1px solid ${theme.palette.divider}`, pr: 4 }}
          >
            <Sidebar
              user={user}
              profilePicture={profilePicture}
              handleUploadPicture={handleUploadPicture}
              handleDeletePicture={handleDeletePicture}
            />
          </Grid>
          {/* <Divider orientation="vertical" flexItem /> */}
          <Grid item xs={12} md={8} sx={{ pl: '0 !important' }}>
            <MainContent user={user} t={t} />
          </Grid>
        </Grid>
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
