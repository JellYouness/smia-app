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
  Skeleton,
} from '@mui/material';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import LanguageIcon from '@mui/icons-material/Language';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CancelIcon from '@mui/icons-material/Cancel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { TFunction } from 'next-i18next';
import { User } from '@modules/users/defs/types';
import { Creator } from '@modules/creators/defs/types';
import SkillsSection from '@common/components/SkillsSection';
import RegionalExpertiseSection from '@common/components/RegionalExpertiseSection';
import MediaTypesSection from '@common/components/MediaTypesSection';
import AboutSection from '@common/components/AboutSection';
import PortfolioSection from '@common/components/PortfolioSection';
import CertificationsSection from '@common/components/CertificationsSection';
import AchievementsSection from '@common/components/AchievementsSection';
import ProfessionalBackgroundSection from '@common/components/ProfessionalBackgroundSection';
import EquipmentInfoSection from '@common/components/EquipmentInfoSection';
import UserLanguages from '@common/components/UserLanguages';

const getAvailabilityChipProps = (status: string, t: TFunction) => {
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

const CreatorProfilePage = ({ item, t }: { item: User; t: TFunction }) => {
  const creator = item.creator as Creator;
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
              sx={{ fontWeight: 600, letterSpacing: 0.5, color: 'white' }}
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
            <UserLanguages
              languages={creator.languages}
              t={t}
              editable
              titleSize="h5"
              borderBottom
            />
          </Box>
          <Box sx={{ mb: 3 }}>
            <MediaTypesSection creator={creator} t={t} readOnly titleSize="h5" />
          </Box>
          <Box sx={{ mb: 3 }}>
            <RegionalExpertiseSection creator={creator} t={t} readOnly titleSize="h5" />
          </Box>
        </Grid>
        {/* Right column: Detailed sections */}
        <Grid item xs={12} md={8}>
          <Box sx={{ mb: 1, p: 3 }}>
            <AboutSection
              bio={user.profile?.bio}
              shortBio={user.profile?.shortBio}
              hourlyRate={creator.hourlyRate}
              title={user.profile?.title}
            />
          </Box>
          <Divider sx={{ mb: 1 }} />
          <Box sx={{ mb: 1 }}>
            <SkillsSection creator={creator} t={t} readOnly />
          </Box>
          <Box sx={{ mb: 1 }}>
            <PortfolioSection creator={creator} t={t} readOnly />
          </Box>
          <Box sx={{ mb: 1 }}>
            <CertificationsSection creator={creator} t={t} readOnly />
          </Box>
          <Box sx={{ mb: 1 }}>
            <AchievementsSection creator={creator} t={t} readOnly />
          </Box>
          <Box sx={{ mb: 1 }}>
            <ProfessionalBackgroundSection creator={creator} t={t} readOnly />
          </Box>
          <Box sx={{ mb: 1 }}>
            <EquipmentInfoSection creator={creator} t={t} readOnly />
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
  const [item, setItem] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation(['user', 'common']);

  useEffect(() => {
    if (id) {
      setLoading(true);
      readOne(Number(id))
        .then(({ data }) => {
          if (data && data.item) {
            const item = data.item as User;
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
