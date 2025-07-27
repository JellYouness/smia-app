import React, { useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Chip,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
  Group as GroupIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTeamInvitation } from '@modules/ambassadors/hooks/useTeamInvitation';
import Routes from '@common/defs/routes';

const TeamInvitationPage = () => {
  const router = useRouter();
  const { token } = router.query;
  const { t } = useTranslation(['user', 'common']);

  const {
    invitation,
    loading,
    error,
    responding,
    responseMessage,
    fetchInvitation,
    acceptInvitation,
    declineInvitation,
    clearResponseMessage,
  } = useTeamInvitation({ token: token as string });

  useEffect(() => {
    if (token) {
      fetchInvitation();
    }
  }, [token, fetchInvitation]);

  const handleAccept = async () => {
    await acceptInvitation();
    router.push(Routes.Common.Home);
  };

  const handleDecline = async () => {
    await declineInvitation();
    router.push(Routes.Common.Home);
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
        }}
      >
        <Card sx={{ maxWidth: 500, width: '100%' }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <CancelIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              {t('user:invitation_error') || 'Invitation Error'}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {error}
            </Typography>
            <Button variant="contained" onClick={() => router.push('/')}>
              {t('common:go_home') || 'Go Home'}
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  if (!invitation) {
    return null;
  }

  const isExpired = new Date(invitation.expires_at) < new Date();
  const isResponded = invitation.status !== 'PENDING';

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
        bgcolor: 'grey.50',
      }}
    >
      <Card sx={{ maxWidth: 600, width: '100%' }}>
        <CardContent sx={{ p: 4 }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <GroupIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" gutterBottom>
              {t('user:team_invitation') || 'Team Invitation'}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {t('user:team_invitation_subtitle') || 'You have been invited to join a team'}
            </Typography>
          </Box>

          {/* Response Message */}
          {responseMessage && (
            <Alert severity={responseMessage.type} sx={{ mb: 3 }} onClose={clearResponseMessage}>
              {responseMessage.message}
            </Alert>
          )}

          {/* Team Information */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              {t('user:team_details') || 'Team Details'}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar
                src={invitation.ambassador.user.profile?.avatar}
                sx={{ width: 48, height: 48, mr: 2 }}
              >
                <PersonIcon />
              </Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  {invitation.ambassador.teamName || 'SMIA Ambassador Team'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('user:invited_by') || 'Invited by'}: {invitation.ambassador.user.name}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Invitation Details */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              {t('user:invitation_details') || 'Invitation Details'}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {invitation.role && (
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {t('user:role') || 'Role'}:
                  </Typography>
                  <Typography variant="body1">{invitation.role}</Typography>
                </Box>
              )}
              {invitation.is_primary && (
                <Chip
                  label={t('user:primary_member') || 'Primary Team Member'}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              )}
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {t('user:expires_at') || 'Expires'}:
                </Typography>
                <Typography variant="body1">
                  {new Date(invitation.expires_at).toLocaleDateString()} at{' '}
                  {new Date(invitation.expires_at).toLocaleTimeString()}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Status Information */}
          {isExpired && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              {t('user:invitation_expired') || 'This invitation has expired.'}
            </Alert>
          )}

          {isResponded && (
            <Alert severity={invitation.status === 'ACCEPTED' ? 'success' : 'info'} sx={{ mb: 3 }}>
              {invitation.status === 'ACCEPTED'
                ? t('user:invitation_accepted') || 'You have accepted this invitation.'
                : t('user:invitation_declined') || 'You have declined this invitation.'}
            </Alert>
          )}

          {/* Action Buttons */}
          {!isExpired && !isResponded && (
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="contained"
                color="success"
                size="large"
                startIcon={<CheckCircleIcon />}
                onClick={handleAccept}
                disabled={responding}
                sx={{ minWidth: 120 }}
              >
                {responding ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  t('user:accept') || 'Accept'
                )}
              </Button>
              <Button
                variant="outlined"
                color="error"
                size="large"
                startIcon={<CancelIcon />}
                onClick={handleDecline}
                disabled={responding}
                sx={{ minWidth: 120 }}
              >
                {responding ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  t('user:decline') || 'Decline'
                )}
              </Button>
            </Box>
          )}

          {/* Navigation */}
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button variant="text" onClick={() => router.push('/')}>
              {t('common:go_home') || 'Go Home'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TeamInvitationPage;

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['user', 'common', 'topbar', 'notifications'])),
  },
});
