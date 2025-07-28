import {
  Message,
  Bookmark,
  BookmarkBorder,
  WarningAmber,
  Cancel,
  CheckCircle,
  AccessTime,
  VerifiedUser,
  WorkspacePremium,
  Language,
} from '@mui/icons-material';
import { Box, Avatar, Stack, Typography, Tooltip, Button, Rating, Chip } from '@mui/material';
import { TFunction } from 'i18next';
import { User } from '@modules/users/defs/types';
import { Creator } from '@modules/creators/defs/types';
import { useEffect, useState } from 'react';
import { useSavedProfiles } from '@modules/creators/hooks/useSavedProfiles';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';

const getAvailabilityChipProps = (status: string, t: TFunction) => {
  switch (status) {
    case 'AVAILABLE':
      return {
        color: 'success',
        icon: <CheckCircle fontSize="small" />,
        label: t('user:available'),
      };
    case 'LIMITED':
      return {
        color: 'warning',
        icon: <WarningAmber fontSize="small" />,
        label: t('user:limited'),
      };
    case 'UNAVAILABLE':
      return {
        color: 'error',
        icon: <Cancel fontSize="small" />,
        label: t('user:unavailable'),
      };
    case 'BUSY':
      return { color: 'info', icon: <AccessTime fontSize="small" />, label: t('user:busy') };
    default:
      return { color: 'default', icon: undefined, label: status };
  }
};

interface ProfileHeaderProps {
  user: User;
  creator: Creator;
  setSendMessageOpen?: (open: boolean) => void;
  t: TFunction;
  isUserProfile?: boolean;
}

const ProfileHeader = ({
  user,
  creator,
  setSendMessageOpen = () => {},
  t,
  isUserProfile = false,
}: ProfileHeaderProps) => {
  const availabilityProps = getAvailabilityChipProps(creator.availability, t);
  const isVerified =
    creator.verificationStatus === 'VERIFIED' || creator.verificationStatus === 'FEATURED';
  const isFeatured = creator.verificationStatus === 'FEATURED';
  const isJournalist = creator.isJournalist;

  const { isSaved, saveProfile, unsaveProfile } = useSavedProfiles();
  const [saved, setSaved] = useState<boolean | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  useEffect(() => {
    isSaved(creator.id).then((saved) => {
      setSaved(saved);
    });
  }, []);

  const handleToggleSave = async () => {
    try {
      if (saved) {
        await unsaveProfile(creator.id).then(() => {
          enqueueSnackbar(t('user:profile_unsaved', 'Profile unsaved'), { variant: 'info' });
          setSaved(false);
        });
      } else {
        await saveProfile(creator.id).then(() => {
          enqueueSnackbar(t('user:profile_saved', 'Profile saved'), { variant: 'success' });
          setSaved(true);
        });
      }
    } catch (e) {
      enqueueSnackbar(t('user:save_failed', 'Action failed'), { variant: 'error' });
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'center',
        gap: 4,
        mb: 4,
        p: { xs: 2, md: 4 },
        borderRadius: 4,
        boxShadow: 4,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Avatar src={user.profilePicture} sx={{ width: 120, height: 120, boxShadow: 2, mr: 3 }} />
      <Box flex={1} minWidth={0} width="100%" sx={{ px: { xs: 2, md: 0 } }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="h4" fontWeight={700} noWrap>
              {user.firstName} {user.lastName}
            </Typography>
            {isVerified && (
              <Tooltip title={t('user:verified')}>
                <VerifiedUser color="primary" />
              </Tooltip>
            )}
            {isFeatured && (
              <Tooltip title={t('user:featured')}>
                <WorkspacePremium color="warning" />
              </Tooltip>
            )}
            {isJournalist && (
              <Tooltip title={t('user:journalist_enabled')}>
                <Language color="info" />
              </Tooltip>
            )}
          </Stack>
          {!isUserProfile ? (
            <Stack direction={{ xs: 'row', sm: 'row' }} alignItems="center" spacing={1}>
              <Message
                onClick={() => setSendMessageOpen(true)}
                color="primary"
                sx={{
                  fontSize: 30,
                  cursor: 'pointer',
                  '&:hover': { transform: 'scale(1.1)', transition: 'transform 0.2s ease-in-out' },
                }}
              />
              {saved ? (
                <Bookmark
                  fontSize="large"
                  color="primary"
                  onClick={handleToggleSave}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      transition: 'transform 0.2s ease-in-out',
                    },
                  }}
                />
              ) : (
                <BookmarkBorder
                  fontSize="large"
                  color="primary"
                  onClick={handleToggleSave}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      transition: 'transform 0.2s ease-in-out',
                    },
                  }}
                />
              )}
            </Stack>
          ) : (
            <Stack direction="column" justifyContent="center" spacing={1}>
              <Button
                variant="gradient"
                color="primary"
                sx={{
                  ml: 2,
                }}
                onClick={() => router.push('/users/edit-profile')}
              >
                {t('user:edit_profile')}
              </Button>
            </Stack>
          )}
        </Stack>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
          {user.title || user.profile?.title}
        </Typography>
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          mt={2}
          flexWrap="wrap"
          gap={1}
          justifyContent={{ xs: 'space-around', md: 'flex-start' }}
        >
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
  );
};

export default ProfileHeader;
