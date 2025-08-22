import {
  Box,
  Tabs,
  Tab,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
  Card,
  Grid,
  Typography,
  Button,
  Skeleton,
  Fade,
  Slide,
  CardContent,
  Stack,
  Divider,
} from '@mui/material';
import {
  Search,
  Clear,
  Work,
  MailOutline,
  AssignmentTurnedIn,
  Schedule,
  CheckCircle,
  Cancel,
  AttachMoney,
  CalendarToday,
  Person,
} from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

import useProjects from '@modules/projects/hooks/useProjects';
import { Creator } from '@modules/creators/defs/types';
import { ProjectInvite, ProjectProposal } from '@modules/projects/defs/types';

import InviteCard from './InviteCard';
import { Id } from '@common/defs/types';
import ProposalCard from './ProposalCard';
// import ProposalCard from './ProposalCard';

type OffersTab = 'invites' | 'proposals';

interface OffersPanelProps {
  creator: Creator;
}

const OffersPanel: React.FC<OffersPanelProps> = ({ creator }) => {
  const { t } = useTranslation(['invite', 'proposal', 'common']);
  const theme = useTheme();

  /* ───────── state ───────── */
  const [invites, setInvites] = useState<ProjectInvite[]>([]);
  const [proposals, setProposals] = useState<ProjectProposal[]>([]);
  const [loadingInvites, setLoadingInvites] = useState(false);
  const [loadingProposals, setLoadingProposals] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [tab, setTab] = useState<OffersTab>('invites');

  /* ───────── fetch data ───────── */
  const { readAllInvitesByCreator, declineInvite, readAllProposalsByCreator } = useProjects();

  useEffect(() => {
    fetchInvites();
    fetchProposals();
  }, [creator]);

  const fetchProposals = async () => {
    if (!creator) {
      return;
    }
    setLoadingProposals(true);
    const res = await readAllProposalsByCreator(creator.id);
    if (res.success && res.data) {
      setProposals(res.data.items);
    }
    setLoadingProposals(false);
  };

  const fetchInvites = async () => {
    if (!creator) {
      return;
    }
    setLoadingInvites(true);
    const res = await readAllInvitesByCreator(creator.id);
    if (res.success && res.data) {
      setInvites(res.data.items);
    }
    setLoadingInvites(false);
  };

  const onDecline = async (inviteId: Id) => {
    const response = await declineInvite(inviteId);
    if (response.success) {
      fetchInvites();
    }
  };

  /* ───────── helpers ───────── */
  const filterText = (txt: string) => txt.toLowerCase().includes(searchTerm.toLowerCase());

  const visibleInvites = invites.filter(
    (i) => !searchTerm || filterText(i.project?.title ?? '') || filterText(i.message ?? '')
  );

  const visibleProposals = proposals.filter(
    (p) => !searchTerm || filterText(p.project?.title ?? '') || filterText(p.coverLetter ?? '')
  );

  const clearSearch = () => setSearchTerm('');

  const countInvites = invites.length;
  const countProposals = proposals.length;

  const handleInviteAccept = () => {
    fetchInvites();
    fetchProposals();
  };

  // Modern loading skeleton
  const LoadingSkeleton = () => (
    <Fade in timeout={300}>
      <Box>
        {[1, 2, 3].map((index) => (
          <Card
            key={index}
            sx={{
              mb: 3,
              borderRadius: 3,
              border: '1px solid',
              borderColor: alpha(theme.palette.divider, 0.08),
              background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(
                theme.palette.primary.main,
                0.02
              )} 100%)`,
              overflow: 'hidden',
            }}
          >
            <CardContent sx={{ p: 4 }}>
              {/* Header skeleton */}
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                <Box sx={{ flex: 1 }}>
                  <Skeleton
                    variant="text"
                    width="60%"
                    height={28}
                    sx={{ borderRadius: 1, mb: 1 }}
                  />
                  <Skeleton
                    variant="text"
                    width="40%"
                    height={20}
                    sx={{ borderRadius: 1, mb: 2 }}
                  />
                  <Skeleton
                    variant="rectangular"
                    width={100}
                    height={24}
                    sx={{ borderRadius: 1 }}
                  />
                </Box>
                <Skeleton variant="circular" width={40} height={40} sx={{ ml: 2 }} />
              </Box>

              {/* Content skeleton */}
              <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 2, mb: 3 }} />

              {/* Info cards skeleton */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                {[1, 2].map((cardIndex) => (
                  <Grid item xs={12} sm={6} key={cardIndex}>
                    <Skeleton
                      variant="rectangular"
                      height={60}
                      sx={{
                        borderRadius: 2,
                        background: alpha(theme.palette.primary.main, 0.04),
                      }}
                    />
                  </Grid>
                ))}
              </Grid>

              {/* Footer skeleton */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Skeleton variant="circular" width={32} height={32} />
                  <Box>
                    <Skeleton
                      variant="text"
                      width={100}
                      height={16}
                      sx={{ borderRadius: 1, mb: 0.5 }}
                    />
                    <Skeleton variant="text" width={60} height={14} sx={{ borderRadius: 1 }} />
                  </Box>
                </Box>
                <Skeleton variant="rectangular" width={100} height={32} sx={{ borderRadius: 1 }} />
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Fade>
  );

  const EmptyBlock = ({
    mainMessage,
    subMessage,
    noMatchMessage,
  }: {
    mainMessage: string;
    subMessage: string;
    noMatchMessage: string;
  }) => (
    <Card
      sx={{
        textAlign: 'center',
        p: 4,
        boxShadow: 'none',
        border: `1px dashed ${alpha(theme.palette.divider, 0.4)}`,
      }}
    >
      <Work sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
      <Typography variant="h6" color="text.secondary" mb={1}>
        {mainMessage}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {searchTerm ? noMatchMessage : subMessage}
      </Typography>
      {searchTerm && (
        <Button
          variant="text"
          size="small"
          onClick={clearSearch}
          sx={{ mt: 2 }}
          startIcon={<Clear />}
        >
          {t('common:clear_search')}
        </Button>
      )}
    </Card>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Card
        sx={{
          mb: 3,
          borderRadius: 1,
          background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(
            theme.palette.secondary.main,
            0.02
          )} 100%)`,
          border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          boxShadow: `0 2px 12px ${alpha(theme.palette.common.black, 0.06)}`,
          overflow: 'hidden',
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'stretch', sm: 'center' },
              gap: 3,
            }}
          >
            {/* Search Section */}
            <Box sx={{ flex: 1, maxWidth: { xs: '100%', sm: 400 } }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 1,
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}
              >
                Search Offers
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder={t('common:search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={clearSearch}>
                        <Clear fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: alpha(theme.palette.background.default, 0.4),
                    borderRadius: 1,
                    '& fieldset': {
                      borderColor: alpha(theme.palette.divider, 0.2),
                    },
                    '&:hover fieldset': {
                      borderColor: alpha(theme.palette.secondary.main, 0.4),
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.secondary.main,
                    },
                  },
                }}
              />
            </Box>

            {/* Tabs Section */}
            <Box sx={{ flex: 1, maxWidth: { xs: '100%', sm: 350 } }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 1,
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}
              >
                Filter by Type
              </Typography>
              <Box
                sx={{
                  backgroundColor: alpha(theme.palette.background.default, 0.4),
                  borderRadius: 1,
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  overflow: 'hidden',
                }}
              >
                <Tabs
                  value={tab}
                  onChange={(_, v) => setTab(v as OffersTab)}
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={{
                    minHeight: 44,
                    '& .MuiTabs-indicator': {
                      height: 3,
                      borderRadius: '1px 1px 0 0',
                      background: `linear-gradient(90deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
                    },
                    '& .MuiTab-root': {
                      minHeight: 44,
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      px: 2.5,
                      py: 1,
                      '&.Mui-selected': {
                        color: theme.palette.secondary.main,
                        backgroundColor: alpha(theme.palette.secondary.main, 0.08),
                      },
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.secondary.main, 0.04),
                      },
                    },
                  }}
                >
                  <Tab
                    value="invites"
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" fontWeight="inherit">
                          {t('invite:invitations')}
                        </Typography>
                        <Chip
                          label={countInvites}
                          size="small"
                          color="info"
                          sx={{
                            height: 20,
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            minWidth: 24,
                          }}
                        />
                      </Box>
                    }
                  />
                  <Tab
                    value="proposals"
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" fontWeight="inherit">
                          {t('proposal:proposals')}
                        </Typography>
                        <Chip
                          label={countProposals}
                          size="small"
                          color="secondary"
                          sx={{
                            height: 20,
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            minWidth: 24,
                          }}
                        />
                      </Box>
                    }
                  />
                </Tabs>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Main Content */}
      {tab === 'invites' && (
        <>
          {loadingInvites && <LoadingSkeleton />}

          {!loadingInvites && visibleInvites.length === 0 ? (
            <EmptyBlock
              mainMessage={t('invite:no_invites')}
              subMessage={t('invite:no_invites_available')}
              noMatchMessage={t('invite:no_invites_match', { searchTerm })}
            />
          ) : (
            <Fade in timeout={500}>
              <Box>
                {visibleInvites.map((invite, index) => (
                  <Slide in direction="up" timeout={300 + index * 100} key={invite.id}>
                    <Card
                      sx={{
                        mb: 3,
                        borderRadius: 3,
                        border: '1px solid',
                        borderColor: alpha(theme.palette.divider, 0.08),
                        background: `linear-gradient(135deg, ${
                          theme.palette.background.paper
                        } 0%, ${alpha(theme.palette.info.main, 0.02)} 100%)`,
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        position: 'relative',
                        overflow: 'hidden',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: `0 20px 40px ${alpha(theme.palette.info.main, 0.15)}`,
                          borderColor: alpha(theme.palette.info.main, 0.2),
                        },
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: 4,
                          background: `linear-gradient(90deg, ${theme.palette.info.main}, ${theme.palette.primary.main})`,
                        },
                      }}
                    >
                      <CardContent sx={{ p: 4 }}>
                        {/* Enhanced Invite Card Content */}
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                              <MailOutline sx={{ color: theme.palette.info.main, fontSize: 24 }} />
                              <Typography
                                variant="h6"
                                sx={{
                                  fontWeight: 700,
                                  color: theme.palette.text.primary,
                                }}
                              >
                                Project Invitation
                              </Typography>
                              <Chip
                                label="New"
                                size="small"
                                color="info"
                                variant="filled"
                                sx={{ fontWeight: 600 }}
                              />
                            </Box>

                            <Typography
                              variant="h5"
                              sx={{
                                fontWeight: 600,
                                color: theme.palette.text.primary,
                                mb: 2,
                                lineHeight: 1.3,
                              }}
                            >
                              {invite.project?.title}
                            </Typography>

                            <Typography
                              variant="body1"
                              sx={{
                                color: theme.palette.text.secondary,
                                lineHeight: 1.6,
                                mb: 3,
                              }}
                            >
                              {invite.message}
                            </Typography>

                            {/* Project Info Cards */}
                            <Grid container spacing={2} sx={{ mb: 3 }}>
                              {/* Budget Card */}
                              {invite.project?.budget && (
                                <Grid item xs={12} sm={6}>
                                  <Box
                                    sx={{
                                      p: 2,
                                      borderRadius: 2,
                                      background: `linear-gradient(135deg, ${alpha(
                                        theme.palette.success.main,
                                        0.1
                                      )} 0%, ${alpha(theme.palette.success.main, 0.05)} 100%)`,
                                      border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 2,
                                    }}
                                  >
                                    <AttachMoney
                                      sx={{ color: theme.palette.success.main, fontSize: 20 }}
                                    />
                                    <Box>
                                      <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        display="block"
                                      >
                                        Budget
                                      </Typography>
                                      <Typography
                                        variant="body2"
                                        fontWeight={700}
                                        color="success.main"
                                      >
                                        ${invite.project.budget}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Grid>
                              )}

                              {/* Timeline Card */}
                              <Grid item xs={12} sm={6}>
                                <Box
                                  sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    background: `linear-gradient(135deg, ${alpha(
                                      theme.palette.warning.main,
                                      0.1
                                    )} 0%, ${alpha(theme.palette.warning.main, 0.05)} 100%)`,
                                    border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                  }}
                                >
                                  <CalendarToday
                                    sx={{ color: theme.palette.warning.main, fontSize: 20 }}
                                  />
                                  <Box>
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                      display="block"
                                    >
                                      Timeline
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      fontWeight={600}
                                      color="warning.main"
                                    >
                                      {invite.project?.startDate && invite.project?.endDate
                                        ? `${dayjs(invite.project.startDate).format(
                                            'MMM DD'
                                          )} - ${dayjs(invite.project.endDate).format('MMM DD')}`
                                        : 'To be discussed'}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Grid>
                            </Grid>

                            <Divider
                              sx={{ my: 3, borderColor: alpha(theme.palette.divider, 0.1) }}
                            />

                            {/* Footer with Client Info and Actions */}
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Person
                                  sx={{ color: theme.palette.text.secondary, fontSize: 20 }}
                                />
                                <Box>
                                  <Typography variant="body2" fontWeight={600} color="text.primary">
                                    {invite.project?.client?.firstName}{' '}
                                    {invite.project?.client?.lastName}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    Client • Sent {dayjs(invite.createdAt).fromNow()}
                                  </Typography>
                                </Box>
                              </Box>

                              <Stack direction="row" spacing={2}>
                                <Button
                                  variant="outlined"
                                  size="medium"
                                  onClick={() => onDecline(invite.id)}
                                  sx={{
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    px: 3,
                                    borderColor: alpha(theme.palette.error.main, 0.5),
                                    color: theme.palette.error.main,
                                    '&:hover': {
                                      borderColor: theme.palette.error.main,
                                      backgroundColor: alpha(theme.palette.error.main, 0.1),
                                    },
                                  }}
                                >
                                  Decline
                                </Button>
                                <Button
                                  variant="contained"
                                  size="medium"
                                  onClick={handleInviteAccept}
                                  sx={{
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    px: 3,
                                    background: `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.primary.main} 100%)`,
                                    boxShadow: `0 4px 12px ${alpha(theme.palette.info.main, 0.3)}`,
                                    '&:hover': {
                                      transform: 'translateY(-1px)',
                                      boxShadow: `0 6px 16px ${alpha(
                                        theme.palette.info.main,
                                        0.4
                                      )}`,
                                    },
                                  }}
                                >
                                  Accept Invite
                                </Button>
                              </Stack>
                            </Box>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Slide>
                ))}
              </Box>
            </Fade>
          )}
        </>
      )}

      {tab === 'proposals' && (
        <>
          {loadingProposals && <LoadingSkeleton />}

          {!loadingProposals && visibleProposals.length === 0 ? (
            <EmptyBlock
              mainMessage={t('proposal:no_proposals')}
              subMessage={t('proposal:no_proposals_available')}
              noMatchMessage={t('proposal:no_proposals_match', { searchTerm })}
            />
          ) : (
            <Fade in timeout={500}>
              <Box>
                {visibleProposals.map((proposal, index) => (
                  <Slide in direction="up" timeout={300 + index * 100} key={proposal.id}>
                    <Card
                      sx={{
                        mb: 3,
                        borderRadius: 3,
                        border: '1px solid',
                        borderColor: alpha(theme.palette.divider, 0.08),
                        background: `linear-gradient(135deg, ${
                          theme.palette.background.paper
                        } 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)`,
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        position: 'relative',
                        overflow: 'hidden',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: `0 20px 40px ${alpha(theme.palette.secondary.main, 0.15)}`,
                          borderColor: alpha(theme.palette.secondary.main, 0.2),
                        },
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: 4,
                          background: `linear-gradient(90deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
                        },
                      }}
                    >
                      <CardContent sx={{ p: 4 }}>
                        {/* Enhanced Proposal Card Content */}
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                              <AssignmentTurnedIn
                                sx={{ color: theme.palette.secondary.main, fontSize: 24 }}
                              />
                              <Typography
                                variant="h6"
                                sx={{
                                  fontWeight: 700,
                                  color: theme.palette.text.primary,
                                }}
                              >
                                Your Proposal
                              </Typography>
                              <Chip
                                label={proposal.status}
                                size="small"
                                color="secondary"
                                variant="filled"
                                sx={{ fontWeight: 600, textTransform: 'capitalize' }}
                              />
                            </Box>

                            <Typography
                              variant="h5"
                              sx={{
                                fontWeight: 600,
                                color: theme.palette.text.primary,
                                mb: 2,
                                lineHeight: 1.3,
                              }}
                            >
                              {proposal.project?.title}
                            </Typography>

                            <Typography
                              variant="body1"
                              sx={{
                                color: theme.palette.text.secondary,
                                lineHeight: 1.6,
                                mb: 3,
                              }}
                            >
                              {proposal.coverLetter}
                            </Typography>

                            {/* Proposal Info Cards */}
                            <Grid container spacing={2} sx={{ mb: 3 }}>
                              {/* Proposed Rate Card */}
                              {proposal.proposedRate && (
                                <Grid item xs={12} sm={6}>
                                  <Box
                                    sx={{
                                      p: 2,
                                      borderRadius: 2,
                                      background: `linear-gradient(135deg, ${alpha(
                                        theme.palette.success.main,
                                        0.1
                                      )} 0%, ${alpha(theme.palette.success.main, 0.05)} 100%)`,
                                      border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 2,
                                    }}
                                  >
                                    <AttachMoney
                                      sx={{ color: theme.palette.success.main, fontSize: 20 }}
                                    />
                                    <Box>
                                      <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        display="block"
                                      >
                                        Proposed Rate
                                      </Typography>
                                      <Typography
                                        variant="body2"
                                        fontWeight={700}
                                        color="success.main"
                                      >
                                        ${proposal.proposedRate}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Grid>
                              )}

                              {/* Status Card */}
                              <Grid item xs={12} sm={6}>
                                <Box
                                  sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    background: `linear-gradient(135deg, ${alpha(
                                      theme.palette.info.main,
                                      0.1
                                    )} 0%, ${alpha(theme.palette.info.main, 0.05)} 100%)`,
                                    border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                  }}
                                >
                                  <Schedule sx={{ color: theme.palette.info.main, fontSize: 20 }} />
                                  <Box>
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                      display="block"
                                    >
                                      Status
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      fontWeight={600}
                                      color="info.main"
                                      sx={{ textTransform: 'capitalize' }}
                                    >
                                      {proposal.status}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Grid>
                            </Grid>

                            <Divider
                              sx={{ my: 3, borderColor: alpha(theme.palette.divider, 0.1) }}
                            />

                            {/* Footer with Project Info */}
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Person
                                  sx={{ color: theme.palette.text.secondary, fontSize: 20 }}
                                />
                                <Box>
                                  <Typography variant="body2" fontWeight={600} color="text.primary">
                                    {proposal.project?.client?.firstName}{' '}
                                    {proposal.project?.client?.lastName}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    Client • Submitted {dayjs(proposal.createdAt).fromNow()}
                                  </Typography>
                                </Box>
                              </Box>

                              <Button
                                variant="contained"
                                size="medium"
                                sx={{
                                  borderRadius: 2,
                                  textTransform: 'none',
                                  fontWeight: 600,
                                  px: 3,
                                  background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`,
                                  boxShadow: `0 4px 12px ${alpha(
                                    theme.palette.secondary.main,
                                    0.3
                                  )}`,
                                  '&:hover': {
                                    transform: 'translateY(-1px)',
                                    boxShadow: `0 6px 16px ${alpha(
                                      theme.palette.secondary.main,
                                      0.4
                                    )}`,
                                  },
                                }}
                              >
                                View Details
                              </Button>
                            </Box>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Slide>
                ))}
              </Box>
            </Fade>
          )}
        </>
      )}
    </Box>
  );
};

export default OffersPanel;
