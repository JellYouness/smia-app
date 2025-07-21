import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useItems from '@common/hooks/useItems';
import CreatorsApiRoutes from '@modules/creators/defs/api-routes';
import { useTranslation } from 'react-i18next';
import { GetServerSideProps } from 'next';
import withAuth, { AUTH_MODE } from '@modules/auth/hocs/withAuth';
import withPermissions from '@modules/permissions/hocs/withPermissions';
import Namespaces from '@common/defs/namespaces';
import { CRUD_ACTION } from '@common/defs/types';
import Routes from '@common/defs/routes';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
  Box,
  Typography,
  Avatar,
  Chip,
  Stack,
  Grid,
  Divider,
  Rating,
  Tooltip,
  Button,
  Skeleton,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import LanguageIcon from '@mui/icons-material/Language';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CancelIcon from '@mui/icons-material/Cancel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Link from 'next/link';

const getAvailabilityChipProps = (status: string, t: (key: string) => string) => {
  switch (status) {
    case 'AVAILABLE':
      return {
        color: 'success',
        icon: <CheckCircleIcon fontSize="small" />,
        label: t('user:available'),
      };
    case 'LIMITED':
      return {
        color: 'warning',
        icon: <WarningAmberIcon fontSize="small" />,
        label: t('user:limited'),
      };
    case 'UNAVAILABLE':
      return {
        color: 'error',
        icon: <CancelIcon fontSize="small" />,
        label: t('user:unavailable'),
      };
    case 'BUSY':
      return { color: 'info', icon: <AccessTimeIcon fontSize="small" />, label: t('user:busy') };
    default:
      return { color: 'default', icon: undefined, label: status };
  }
};

const CreatorProfilePage = ({ item, t }: { item: any; t: (key: string) => string }) => {
  const creator = item.creator;
  const user = item;
  const availabilityProps = getAvailabilityChipProps(creator.availability, t);
  const isVerified =
    creator.verificationStatus === 'VERIFIED' || creator.verificationStatus === 'FEATURED';
  const isFeatured = creator.verificationStatus === 'FEATURED';
  const isJournalist = creator.isJournalist;

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, md: 4 } }}>
      {/* Profile Header */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { md: 'center' },
          gap: 4,
          mb: 4,
          p: { xs: 2, md: 4 },
          borderRadius: 4,
          boxShadow: 2,
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Avatar src={user.profilePicture} sx={{ width: 120, height: 120, boxShadow: 2, mr: 3 }} />
        <Box flex={1} minWidth={0}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="h4" fontWeight={700} noWrap>
              {user.firstName} {user.lastName}
            </Typography>
            {isVerified && (
              <Tooltip title={t('user:verified')}>
                <VerifiedUserIcon color="primary" />
              </Tooltip>
            )}
            {isFeatured && (
              <Tooltip title={t('user:featured')}>
                <WorkspacePremiumIcon color="warning" />
              </Tooltip>
            )}
            {isJournalist && (
              <Tooltip title={t('user:journalist_enabled')}>
                <LanguageIcon color="info" />
              </Tooltip>
            )}
          </Stack>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
            {user.title || user.profile?.title}
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center" mt={2}>
            <Rating
              value={Number(creator.averageRating) || 0}
              precision={0.1}
              readOnly
              size="medium"
            />
            <Typography variant="body2">
              ({creator.ratingCount || 0} {t('user:ratings')})
            </Typography>
            <Chip
              label={availabilityProps.label}
              color={
                availabilityProps.color as
                  | 'success'
                  | 'warning'
                  | 'error'
                  | 'info'
                  | 'default'
                  | 'primary'
                  | 'secondary'
              }
              icon={availabilityProps.icon ? availabilityProps.icon : undefined}
              size="small"
              sx={{ fontWeight: 600, letterSpacing: 0.5 }}
            />
            <Typography variant="body2" color="text.secondary">
              {creator.experience} {t('user:years')}
            </Typography>
            {creator.hourlyRate && (
              <Typography variant="body2" color="text.secondary">
                {t('user:hourly_rate')}: ${creator.hourlyRate}/hr
              </Typography>
            )}
          </Stack>
        </Box>
      </Box>
      <Grid container spacing={4}>
        {/* Left column: Main info */}
        <Grid item xs={12} md={4}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" color="primary" fontWeight={600} mb={1}>
              {t('user:skills')}
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {creator.skills?.length > 0 ? (
                creator.skills.map((skill: string, idx: number) => (
                  <Chip key={idx} label={skill} size="small" variant="outlined" color="primary" />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  {t('user:no_skills_added_yet')}
                </Typography>
              )}
            </Stack>
          </Box>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" color="primary" fontWeight={600} mb={1}>
              {t('user:languages')}
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {creator.languages?.length > 0 ? (
                creator.languages.map((lang: { language: string }, idx: number) => (
                  <Chip
                    key={idx}
                    label={lang.language}
                    size="small"
                    variant="outlined"
                    color="secondary"
                  />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  {t('user:preferred_language_help')}
                </Typography>
              )}
            </Stack>
          </Box>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" color="primary" fontWeight={600} mb={1}>
              {t('user:media_types')}
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {creator.mediaTypes?.length > 0 ? (
                creator.mediaTypes.map((mediaType: string, idx: number) => (
                  <Chip
                    key={idx}
                    label={mediaType}
                    size="small"
                    variant="outlined"
                    color="primary"
                  />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  {t('user:add_media_types')}
                </Typography>
              )}
            </Stack>
          </Box>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" color="primary" fontWeight={600} mb={1}>
              {t('user:regional_expertise')}
            </Typography>
            <Stack spacing={1}>
              {creator.regionalExpertise?.length > 0 ? (
                creator.regionalExpertise.map(
                  (expertise: { region: string; expertiseLevel: string }, idx: number) => (
                    <Chip
                      key={idx}
                      label={expertise.region + ' (' + expertise.expertiseLevel + ')'}
                      size="small"
                      variant="outlined"
                      color="info"
                    />
                  )
                )
              ) : (
                <Typography variant="body2" color="text.secondary">
                  {t('user:no_regional_expertise')}
                </Typography>
              )}
            </Stack>
          </Box>
        </Grid>
        {/* Right column: Detailed sections */}
        <Grid item xs={12} md={8}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" color="primary" fontWeight={700} mb={2}>
              {t('user:about')}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {user.profile?.bio || t('user:no_bio_provided')}
            </Typography>
          </Box>
          <Divider sx={{ mb: 3 }} />
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" color="primary" fontWeight={700} mb={2}>
              {t('user:portfolio')}
            </Typography>
            {creator.portfolio?.length > 0 ? (
              <Stack spacing={2}>
                {creator.portfolio.map(
                  (item: { title: string; description: string; url?: string }, idx: number) => (
                    <Box
                      key={idx}
                      sx={{
                        p: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2,
                        bgcolor: 'background.paper',
                      }}
                    >
                      <Typography variant="h6" fontWeight={600}>
                        {item.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {item.description}
                      </Typography>
                      {item.url && (
                        <Link href={item.url} target="_blank" rel="noopener noreferrer">
                          <Button variant="outlined" size="small" sx={{ textTransform: 'none' }}>
                            {t('user:view_project')}
                          </Button>
                        </Link>
                      )}
                    </Box>
                  )
                )}
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary">
                {t('user:showcase_your_best_work')}
              </Typography>
            )}
          </Box>
          <Divider sx={{ mb: 3 }} />
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" color="primary" fontWeight={700} mb={2}>
              {t('user:certifications')}
            </Typography>
            {creator.certifications?.length > 0 ? (
              <Stack spacing={2}>
                {creator.certifications.map(
                  (cert: { title: string; issuer: string; date?: string }, idx: number) => (
                    <Box
                      key={idx}
                      sx={{
                        p: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2,
                        bgcolor: 'background.paper',
                      }}
                    >
                      <Typography variant="h6" fontWeight={600}>
                        {cert.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t('user:issued_by')}: {cert.issuer}
                      </Typography>
                      {cert.date && (
                        <Typography variant="body2" color="text.secondary">
                          {t('user:date')}: {cert.date}
                        </Typography>
                      )}
                    </Box>
                  )
                )}
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary">
                {t('user:ing_certifications_help')}
              </Typography>
            )}
          </Box>
          <Divider sx={{ mb: 3 }} />
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" color="primary" fontWeight={700} mb={2}>
              {t('user:achievements')}
            </Typography>
            {creator.achievements?.length > 0 ? (
              <Stack spacing={2}>
                {creator.achievements.map((ach: string, idx: number) => (
                  <Box
                    key={idx}
                    sx={{
                      p: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 2,
                      bgcolor: 'background.paper',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <StarIcon sx={{ color: 'warning.main', fontSize: 28 }} />
                    <Typography variant="body1" fontWeight={500}>
                      {ach}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary">
                {t('user:highlight_achievements')}
              </Typography>
            )}
          </Box>
          <Divider sx={{ mb: 3 }} />
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" color="primary" fontWeight={700} mb={2}>
              {t('user:professional_background')}
            </Typography>
            {creator.professionalBackground?.length > 0 ? (
              <Stack spacing={2}>
                {creator.professionalBackground.map(
                  (
                    job: { title: string; company: string; duration: string; description: string },
                    idx: number
                  ) => (
                    <Box
                      key={idx}
                      sx={{
                        p: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2,
                        bgcolor: 'background.paper',
                      }}
                    >
                      <Typography variant="h6" fontWeight={600}>
                        {job.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {job.company} • {job.duration}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {job.description}
                      </Typography>
                    </Box>
                  )
                )}
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary">
                {t('user:add_employment_history')}
              </Typography>
            )}
          </Box>
          <Divider sx={{ mb: 3 }} />
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" color="primary" fontWeight={700} mb={2}>
              {t('user:equipment_info')}
            </Typography>
            {creator.equipmentInfo && Object.keys(creator.equipmentInfo).length > 0 ? (
              <Stack spacing={2}>
                {Object.entries(creator.equipmentInfo).map(
                  ([category, items]: [string, any], idx: number) => (
                    <Box key={category + idx}>
                      <Typography
                        variant="h6"
                        fontWeight={600}
                        sx={{ textTransform: 'capitalize' }}
                      >
                        {category}
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        {Array.isArray(items) &&
                          items.map((item: string, i: number) => (
                            <Chip
                              key={i}
                              label={item}
                              size="small"
                              variant="outlined"
                              color="secondary"
                            />
                          ))}
                      </Stack>
                    </Box>
                  )
                )}
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary">
                {t('user:list_equipment_help')}
              </Typography>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

const CreatorDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { readOne } = useItems(CreatorsApiRoutes);
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation(['user', 'common']);

  useEffect(() => {
    if (id) {
      setLoading(true);
      readOne(Number(id))
        .then(({ data }) => {
          if (data && data.item) {
            const item = data.item as any;
            setItem({ ...item.user, creator: { ...item, user: undefined } });
          }
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ p: 6, textAlign: 'center' }}>
        <Skeleton variant="rectangular" height={200} />
      </Box>
    );
  }
  if (!item) {
    return (
      <Box sx={{ p: 6, textAlign: 'center' }}>
        <Typography variant="h6">{t('user:not_found', 'Creator not found')}</Typography>
      </Box>
    );
  }

  return <CreatorProfilePage item={item} t={t} />;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const locale = context.locale || 'en';
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'topbar',
        'footer',
        'leftbar',
        'user',
        'common',
        'notifications',
      ])),
    },
  };
};

export default withAuth(
  withPermissions(CreatorDetailsPage, {
    requiredPermissions: {
      entity: Namespaces.Creators,
      action: CRUD_ACTION.READ,
    },
    redirectUrl: Routes.Permissions.Forbidden,
  }),
  {
    mode: AUTH_MODE.LOGGED_IN,
    redirectUrl: Routes.Auth.Login,
  }
);
