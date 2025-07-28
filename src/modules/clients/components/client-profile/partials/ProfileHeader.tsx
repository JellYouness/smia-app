import { Message, Bookmark, BookmarkBorder } from '@mui/icons-material';
import { Box, Avatar, Stack, Typography, Button } from '@mui/material';
import { TFunction } from 'i18next';
import { User } from '@modules/users/defs/types';
import { useEffect, useState } from 'react';
import { useSavedProfiles } from '@modules/creators/hooks/useSavedProfiles';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import { Client } from '@modules/clients/defs/types';

interface ProfileHeaderProps {
  user: User;
  setSendMessageOpen?: (open: boolean) => void;
  t: TFunction;
  isUserProfile?: boolean;
}

const ProfileHeader = ({
  user,
  setSendMessageOpen = () => {},
  t,
  isUserProfile = false,
}: ProfileHeaderProps) => {
  const { isSaved, saveProfile, unsaveProfile } = useSavedProfiles();
  const [saved, setSaved] = useState<boolean | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const client = user.client as Client;

  useEffect(() => {
    isSaved(client.id).then((saved) => {
      setSaved(saved);
    });
  }, []);

  const handleToggleSave = async () => {
    try {
      if (saved) {
        await unsaveProfile(client.id).then(() => {
          enqueueSnackbar(t('user:profile_unsaved', 'Profile unsaved'), { variant: 'info' });
          setSaved(false);
        });
      } else {
        await saveProfile(client.id).then(() => {
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
        width: { sù: '70%', md: 'auto' },
        margin: '0 auto',
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
      <Box flex={1} minWidth={0} width="100%" sx={{ px: { sm: 4, md: 0 } }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="h4" fontWeight={700} noWrap>
              {user.firstName} {user.lastName}
            </Typography>
          </Stack>
          {!isUserProfile ? (
            <Stack direction="row" alignItems="center" spacing={1}>
              <Button
                variant="contained"
                color="primary"
                sx={{ ml: 2 }}
                onClick={() => setSendMessageOpen(true)}
              >
                <Message />
              </Button>
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
                sx={{ ml: 2 }}
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
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {user.profile?.city}, {user.profile?.country}
        </Typography>
        {/* {client.industry && (
          <Chip label={client.industry} variant="outlined" color="primary" size="small" />
        )} */}
      </Box>
    </Box>
  );
};

export default ProfileHeader;
