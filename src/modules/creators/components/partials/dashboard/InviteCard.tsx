import {
  Card,
  CardContent,
  Stack,
  Box,
  Typography,
  Chip,
  Avatar,
  IconButton,
  Button,
  Divider,
  Tooltip,
} from '@mui/material';
import { AccessTime, Close, OpenInNewOutlined } from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';
import dayjs from 'dayjs';
import { PROJECT_INVITE_STATUS, ProjectInvite } from '@modules/projects/defs/types';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import ConfirmDialog from '@common/components/lib/feedbacks/ConfirmDialog';
import Routes from '@common/defs/routes';
import { useRouter } from 'next/router';
import ProposalWizardDialog from '../../ProposalWizardDialog';

interface InviteCardProps {
  invite: ProjectInvite;
  onAccept(): void;
  onDecline(): void;
}

const InviteCard: React.FC<InviteCardProps> = ({ invite, onAccept, onDecline }) => {
  const { t } = useTranslation(['invite', 'common']);
  const theme = useTheme();
  const router = useRouter();
  const { project } = invite;
  const clientUser = project?.client?.user;

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);

  const handleDeclineClick = () => setConfirmOpen(true);
  const handleConfirm = () => {
    setConfirmOpen(false);
    onDecline();
  };

  const handleAcceptClick = () => setWizardOpen(true);

  const statusColour = {
    PENDING: 'info',
    ACCEPTED: 'success',
    DECLINED: 'error',
    EXPIRED: 'default',
  } as const;

  const daysLeft = invite.expiresAt ? dayjs(invite.expiresAt).diff(dayjs(), 'day') : null;

  let tooltipDate = '';
  if (invite.status === PROJECT_INVITE_STATUS.ACCEPTED && invite.acceptedAt) {
    tooltipDate = dayjs(invite.acceptedAt).format('MMM DD, YYYY');
  } else if (invite.status === PROJECT_INVITE_STATUS.DECLINED && invite.declinedAt) {
    tooltipDate = dayjs(invite.declinedAt).format('MMM DD, YYYY');
  } else if (invite.status === PROJECT_INVITE_STATUS.EXPIRED && invite.expiresAt) {
    tooltipDate = dayjs(invite.expiresAt).format('MMM DD, YYYY');
  }

  return (
    <>
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid',
          borderColor: alpha(theme.palette.divider, 0.15),
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 6px 24px rgba(0,0,0,0.12)',
            transform: 'translateY(-2px)',
          },
          position: 'relative',
          overflow: 'visible',
          p: 2,
        }}
      >
        {invite.status === PROJECT_INVITE_STATUS.PENDING && (
          <Box
            sx={{
              position: 'absolute',
              top: -8,
              right: 16,
              backgroundColor: theme.palette.info.main,
              color: theme.palette.info.contrastText,
              px: 1.5,
              py: 0.5,
              borderRadius: '4px 4px 0 0',
              fontSize: '0.75rem',
              fontWeight: 600,
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              zIndex: 1,
            }}
          >
            {t('invite:new')}
          </Box>
        )}

        <CardContent sx={{ p: 3, pt: invite.status === PROJECT_INVITE_STATUS.PENDING ? 4 : 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Box>
              <Typography variant="h6" fontWeight={700} mb={1}>
                {project?.title}
              </Typography>

              <Stack direction="row" spacing={1} flexWrap="wrap" alignItems="center">
                {invite.status !== PROJECT_INVITE_STATUS.PENDING ? (
                  <Tooltip title={tooltipDate} arrow placement="top">
                    <Box component="span" sx={{ display: 'inline-flex' }}>
                      <Chip
                        label={invite.status}
                        size="small"
                        color={statusColour[invite.status]}
                        variant="outlined"
                        sx={{
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                  </Tooltip>
                ) : (
                  <Chip
                    label={invite.status}
                    size="small"
                    color={statusColour[invite.status]}
                    variant="outlined"
                    sx={{
                      fontWeight: 600,
                      ...(invite.status === PROJECT_INVITE_STATUS.PENDING && {
                        backgroundColor: alpha(theme.palette.info.main, 0.15),
                        color: theme.palette.info.dark,
                      }),
                    }}
                  />
                )}

                {project?.budget && (
                  <Chip
                    label={`$${project.budget}`}
                    size="small"
                    variant="outlined"
                    color="info"
                    sx={{ borderColor: alpha(theme.palette.info.main, 0.5), m: 0 }}
                  />
                )}

                {daysLeft !== null && invite.status === PROJECT_INVITE_STATUS.PENDING && (
                  <Tooltip title={t('invite:expires_in', { days: daysLeft })}>
                    <Chip
                      icon={<AccessTime fontSize="small" />}
                      label={`${daysLeft}d`}
                      size="small"
                      color={daysLeft <= 2 ? 'warning' : 'default'}
                      variant={daysLeft <= 2 ? 'filled' : 'outlined'}
                      sx={{
                        fontWeight: 600,
                        ...(daysLeft <= 2 && {
                          backgroundColor: alpha(theme.palette.warning.main, 0.15),
                          color: theme.palette.warning.dark,
                        }),
                      }}
                    />
                  </Tooltip>
                )}
              </Stack>
            </Box>

            <Tooltip title={t('invite:view_project')}>
              <IconButton
                size="small"
                onClick={() =>
                  router.push(Routes.Projects.ReadOne.replace('{id}', invite.projectId))
                }
                sx={{
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.2),
                  },
                }}
              >
                <OpenInNewOutlined fontSize="small" sx={{ color: theme.palette.primary.main }} />
              </IconButton>
            </Tooltip>
          </Stack>

          {invite.message && (
            <Box
              sx={{
                backgroundColor: alpha(theme.palette.primary.light, 0.05),
                borderLeft: `3px solid ${alpha(theme.palette.primary.main, 0.5)}`,
                p: 2,
                mb: 2.5,
                borderRadius: '0 4px 4px 0',
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                whiteSpace="pre-line"
                fontStyle="italic"
              >
                {invite.message.length > 180 ? invite.message.slice(0, 177) + '…' : invite.message}
              </Typography>
            </Box>
          )}

          <Divider
            sx={{
              my: 2,
              borderColor: alpha(theme.palette.divider, 0.1),
              borderWidth: 1,
            }}
          />

          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Avatar
                src={clientUser?.profileImage}
                sx={{
                  width: 36,
                  height: 36,
                  boxShadow: theme.shadows[1],
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                }}
              />
              <Box>
                <Typography variant="body2" fontWeight={500}>
                  {clientUser?.firstName} {clientUser?.lastName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {project?.client?.companyName}
                </Typography>
              </Box>
            </Stack>

            {invite.status === PROJECT_INVITE_STATUS.PENDING && (
              <Stack direction="row" spacing={1.5}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={handleDeclineClick}
                  sx={{
                    borderRadius: 2,
                    px: 2,
                    fontWeight: 600,
                    borderWidth: 1.5,
                    '&:hover': { borderWidth: 1.5 },
                  }}
                >
                  {t('common:decline')}
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  onClick={handleAcceptClick}
                  sx={{
                    borderRadius: 2,
                    px: 2,
                    fontWeight: 600,
                    boxShadow: 'none',
                    '&:hover': {
                      boxShadow: `0 4px 8px ${alpha(theme.palette.primary.main, 0.3)}`,
                    },
                  }}
                >
                  {t('common:accept')}
                </Button>
              </Stack>
            )}
          </Stack>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title={t('invite:confirm_decline_title')}
        content={t('invite:confirm_decline_body')}
        cancellable
        action={
          <Button variant="contained" color="error" onClick={handleConfirm}>
            {t('common:decline')}
          </Button>
        }
      />

      <ProposalWizardDialog
        open={wizardOpen}
        inviteId={invite.id}
        onClose={() => setWizardOpen(false)}
        onSuccess={onAccept}
        invite={invite}
      />
    </>
  );
};

export default InviteCard;
