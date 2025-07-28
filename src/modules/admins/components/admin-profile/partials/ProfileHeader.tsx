import { Box, Avatar, Stack, Typography, Button } from '@mui/material';
import { TFunction } from 'i18next';
import { User } from '@modules/users/defs/types';
import { useRouter } from 'next/router';

interface ProfileHeaderProps {
  user: User;
  t: TFunction;
}

const ProfileHeader = ({ user, t }: ProfileHeaderProps) => {
  const router = useRouter();

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
        </Stack>
      </Box>
    </Box>
  );
};

export default ProfileHeader;
