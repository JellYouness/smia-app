import {
  Box,
  Tabs,
  Tab,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
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
  Pagination,
} from '@mui/material';
import {
  Search,
  Clear,
  Work,
  MailOutline,
  AssignmentTurnedIn,
  Schedule,
  AttachMoney,
  CalendarToday,
  Person,
} from '@mui/icons-material';
import { alpha, Theme, useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

import useProjects from '@modules/projects/hooks/useProjects';
import { Creator } from '@modules/creators/defs/types';
import { ProjectInvite, ProjectProposal } from '@modules/projects/defs/types';
import { PaginationMeta } from '@common/hooks/useItems';
import { Id } from '@common/defs/types';
import { TFunction } from 'i18next';
import ProposalWizardDialog from '../../ProposalWizardDialog';
import ConfirmDialog from '@common/components/lib/feedbacks/ConfirmDialog';
// import InviteCard from './InviteCard';
// import ProposalCard from './ProposalCard';

// Modern loading skeleton
const LoadingSkeleton = ({ theme }: { theme: Theme }) => (
  <Fade in timeout={300}>
    <Box>
      {[1].map((index) => (
        <Card
          key={index}
          sx={{
            mb: { xs: 2, sm: 3 },
            borderRadius: { xs: 2, sm: 3 },
            border: '1px solid',
            borderColor: alpha(theme.palette.divider, 0.08),
            background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(
              theme.palette.primary.main,
              0.02
            )} 100%)`,
            overflow: 'hidden',
          }}
        >
          <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            {/* Header skeleton */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'flex-start',
                mb: { xs: 2, sm: 3 },
                gap: { xs: 1, sm: 2 },
              }}
            >
              <Box sx={{ flex: 1, width: '100%' }}>
                <Skeleton
                  variant="text"
                  width="60%"
                  sx={{ borderRadius: 1, mb: 1, height: { xs: 24, sm: 28 } }}
                />
                <Skeleton
                  variant="text"
                  width="40%"
                  sx={{ borderRadius: 1, mb: 2, height: { xs: 18, sm: 20 } }}
                />
                <Skeleton
                  variant="rectangular"
                  width={100}
                  sx={{ borderRadius: 1, height: { xs: 20, sm: 24 } }}
                />
              </Box>
              <Skeleton
                variant="circular"
                sx={{
                  ml: { xs: 0, sm: 2 },
                  mt: { xs: 1, sm: 0 },
                  width: { xs: 32, sm: 40 },
                  height: { xs: 32, sm: 40 },
                }}
              />
            </Box>

            {/* Info cards skeleton */}
            <Grid container spacing={{ xs: 1, sm: 2 }} sx={{ mb: { xs: 2, sm: 3 } }}>
              {[1, 2].map((cardIndex) => (
                <Grid item xs={12} sm={6} key={cardIndex}>
                  <Skeleton
                    variant="rectangular"
                    sx={{
                      borderRadius: { xs: 1.5, sm: 2 },
                      background: alpha(theme.palette.primary.main, 0.04),
                      height: { xs: 50, sm: 60 },
                    }}
                  />
                </Grid>
              ))}
            </Grid>

            {/* Footer skeleton */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'stretch', sm: 'center' },
                justifyContent: 'space-between',
                gap: { xs: 2, sm: 0 },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2 } }}>
                <Skeleton
                  variant="circular"
                  sx={{ width: { xs: 28, sm: 32 }, height: { xs: 28, sm: 32 } }}
                />
                <Box>
                  <Skeleton
                    variant="text"
                    width={100}
                    sx={{ borderRadius: 1, mb: 0.5, height: { xs: 14, sm: 16 } }}
                  />
                  <Skeleton
                    variant="text"
                    width={60}
                    sx={{ borderRadius: 1, height: { xs: 12, sm: 14 } }}
                  />
                </Box>
              </Box>
              <Skeleton
                variant="rectangular"
                sx={{
                  borderRadius: { xs: 1.5, sm: 1 },
                  width: { xs: '100%', sm: 100 },
                  height: { xs: 36, sm: 32 },
                }}
              />
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
  theme,
  searchTerm,
  clearSearch,
  t,
}: {
  mainMessage: string;
  subMessage: string;
  noMatchMessage: string;
  theme: Theme;
  searchTerm: string;
  clearSearch: () => void;
  t: TFunction;
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

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);

  const handleDeclineClick = () => setConfirmOpen(true);
  const handleAcceptClick = () => setWizardOpen(true);

  // Pagination state
  const [invitePage, setInvitePage] = useState(1);
  const [proposalPage, setProposalPage] = useState(1);
  const [invitePageSize] = useState(1); // Show only one invite per page
  const [proposalPageSize] = useState(1); // Show only one proposal per page
  const [invitePaginationMeta, setInvitePaginationMeta] = useState<PaginationMeta | null>(null);
  const [proposalPaginationMeta, setProposalPaginationMeta] = useState<PaginationMeta | null>(null);

  /* ───────── fetch data ───────── */
  const { readAllInvitesByCreator, declineInvite, readAllProposalsByCreator } = useProjects();

  useEffect(() => {
    fetchInvites();
    fetchProposals();
  }, [creator]);

  useEffect(() => {
    if (creator) {
      fetchInvites(invitePage);
    }
  }, [invitePage]);

  useEffect(() => {
    if (creator) {
      fetchProposals(proposalPage);
    }
  }, [proposalPage]);

  const handleInvitePageChange = (newPage: number) => {
    setInvitePage(newPage);
  };

  const handleProposalPageChange = (newPage: number) => {
    setProposalPage(newPage);
  };

  const fetchProposals = async (currentPage = proposalPage) => {
    if (!creator) {
      return;
    }
    setLoadingProposals(true);
    const res = await readAllProposalsByCreator(creator.id, currentPage, proposalPageSize);
    if (res.success && res.data) {
      setProposals(res.data.items);
      setProposalPaginationMeta({
        currentPage: res.data.meta.currentPage,
        lastPage: res.data.meta.lastPage,
        totalItems: res.data.meta.totalItems,
      });
    }
    setLoadingProposals(false);
  };

  const fetchInvites = async (currentPage = invitePage) => {
    if (!creator) {
      return;
    }
    setLoadingInvites(true);
    const res = await readAllInvitesByCreator(creator.id, currentPage, invitePageSize);
    if (res.success && res.data) {
      setInvites(res.data.items);
      setInvitePaginationMeta({
        currentPage: res.data.meta.currentPage,
        lastPage: res.data.meta.lastPage,
        totalItems: res.data.meta.totalItems,
      });
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

  const clearSearch = () => {
    setSearchTerm('');
    // Reset to first page when clearing search
    if (invitePaginationMeta && invitePaginationMeta.currentPage !== 1) {
      setInvitePage(1);
    }
    if (proposalPaginationMeta && proposalPaginationMeta.currentPage !== 1) {
      setProposalPage(1);
    }
  };

  const countInvites = invites.length;
  const countProposals = proposals.length;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Card
        sx={{
          mb: 3,
          borderRadius: { xs: 1, sm: 2 },
          background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(
            theme.palette.secondary.main,
            0.02
          )} 100%)`,
          border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          boxShadow: `0 2px 12px ${alpha(theme.palette.common.black, 0.06)}`,
          overflow: 'hidden',
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', lg: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'stretch', lg: 'center' },
              gap: { xs: 2, sm: 3 },
            }}
          >
            {/* Search Section */}
            <Box sx={{ flex: 1, maxWidth: { xs: '100%', lg: '400px' } }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 1,
                  fontWeight: 600,
                  fontSize: { xs: '0.7rem', sm: '0.75rem' },
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
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  // Reset to first page when searching
                  if (invitePaginationMeta && invitePaginationMeta.currentPage !== 1) {
                    setInvitePage(1);
                  }
                  if (proposalPaginationMeta && proposalPaginationMeta.currentPage !== 1) {
                    setProposalPage(1);
                  }
                }}
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
                    // backgroundColor: alpha(theme.palette.background.default, 0.4),
                    bgcolor: 'white',
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
            <Box sx={{ maxWidth: { xs: '100%', lg: 'auto' }, minWidth: { lg: '300px' } }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 1,
                  fontWeight: 600,
                  fontSize: { xs: '0.7rem', sm: '0.75rem' },
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}
              >
                Filter by Type
              </Typography>
              <Box
                sx={{
                  // backgroundColor: alpha(theme.palette.background.default, 0.4),
                  bgcolor: 'white',
                  borderRadius: 1,
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  overflow: 'hidden',
                }}
              >
                <Tabs
                  value={tab}
                  onChange={(_, v) => {
                    setTab(v as OffersTab);
                    // Reset to first page when changing tabs
                    if (invitePaginationMeta && invitePaginationMeta.currentPage !== 1) {
                      setInvitePage(1);
                    }
                    if (proposalPaginationMeta && proposalPaginationMeta.currentPage !== 1) {
                      setProposalPage(1);
                    }
                  }}
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={{
                    minHeight: { xs: 40, sm: 44 },
                    '& .MuiTabs-indicator': {
                      height: 3,
                      borderRadius: '1px 1px 0 0',
                      background: `linear-gradient(90deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
                    },
                    '& .MuiTab-root': {
                      minHeight: { xs: 40, sm: 44 },
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: { xs: '0.8rem', sm: '0.875rem' },
                      px: { xs: 1.5, sm: 2.5 },
                      py: 1,
                      minWidth: { xs: 120, sm: 'auto' },
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
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
                        <Typography
                          variant="body2"
                          fontWeight="inherit"
                          sx={{ display: { xs: 'none', sm: 'block' } }}
                        >
                          {t('invite:invitations')}
                        </Typography>
                        <Typography
                          variant="body2"
                          fontWeight="inherit"
                          sx={{ display: { xs: 'block', sm: 'none' } }}
                        >
                          Invites
                        </Typography>
                        <Chip
                          label={countInvites}
                          size="small"
                          color="info"
                          sx={{
                            height: { xs: 18, sm: 20 },
                            fontSize: { xs: '0.7rem', sm: '0.75rem' },
                            fontWeight: 700,
                            minWidth: { xs: 20, sm: 24 },
                          }}
                        />
                      </Box>
                    }
                  />
                  <Tab
                    value="proposals"
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
                        <Typography
                          variant="body2"
                          fontWeight="inherit"
                          sx={{ display: { xs: 'none', sm: 'block' } }}
                        >
                          {t('proposal:proposals')}
                        </Typography>
                        <Typography
                          variant="body2"
                          fontWeight="inherit"
                          sx={{ display: { xs: 'block', sm: 'none' } }}
                        >
                          Proposals
                        </Typography>
                        <Chip
                          label={countProposals}
                          size="small"
                          color="secondary"
                          sx={{
                            height: { xs: 18, sm: 20 },
                            fontSize: { xs: '0.7rem', sm: '0.75rem' },
                            fontWeight: 700,
                            minWidth: { xs: 20, sm: 24 },
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
          {loadingInvites && <LoadingSkeleton theme={theme} />}

          {!loadingInvites && visibleInvites.length === 0 ? (
            <EmptyBlock
              mainMessage={t('invite:no_invites')}
              subMessage={t('invite:no_invites_available')}
              noMatchMessage={t('invite:no_invites_match', { searchTerm })}
              theme={theme}
              searchTerm={searchTerm}
              clearSearch={clearSearch}
              t={t}
            />
          ) : (
            !loadingInvites && (
              <Fade in timeout={500}>
                <Box>
                  {visibleInvites.map((invite, index) => (
                    <Box key={invite.id}>
                      <Slide in direction="up" timeout={300 + index * 100}>
                        <Card
                          sx={{
                            mb: { xs: 2, sm: 3 },
                            borderRadius: { xs: 2, sm: 3 },
                            border: '1px solid',
                            borderColor: alpha(theme.palette.divider, 0.08),
                            background: `linear-gradient(135deg, ${
                              theme.palette.background.paper
                            } 0%, ${alpha(theme.palette.info.main, 0.02)} 100%)`,
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            position: 'relative',
                            overflow: 'hidden',
                            '&:hover': {
                              transform: { xs: 'none', sm: 'translateY(-4px)' },
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
                          <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                            {/* Enhanced Invite Card Content */}
                            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                              <Box sx={{ flex: 1 }}>
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: { xs: 'flex-start', sm: 'center' },
                                    flexDirection: { xs: 'column', sm: 'row' },
                                    gap: { xs: 1, sm: 2 },
                                    mb: 2,
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: { xs: 1, sm: 2 },
                                    }}
                                  >
                                    <MailOutline
                                      sx={{
                                        color: theme.palette.info.main,
                                        fontSize: { xs: 20, sm: 24 },
                                      }}
                                    />
                                    <Typography
                                      variant="h6"
                                      sx={{
                                        fontWeight: 700,
                                        color: theme.palette.text.primary,
                                        fontSize: { xs: '1rem', sm: '1.25rem' },
                                      }}
                                    >
                                      Project Invitation
                                    </Typography>
                                  </Box>
                                  <Chip
                                    label="New"
                                    size="small"
                                    color="info"
                                    variant="filled"
                                    sx={{
                                      fontWeight: 600,
                                      fontSize: { xs: '0.7rem', sm: '0.75rem' },
                                      height: { xs: 22, sm: 24 },
                                      mt: { xs: 0.5, sm: 0 },
                                    }}
                                  />
                                </Box>

                                <Typography
                                  variant="h5"
                                  sx={{
                                    fontWeight: 600,
                                    color: theme.palette.text.primary,
                                    mb: 1,
                                    lineHeight: 1.3,
                                    fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
                                  }}
                                >
                                  {invite.project?.title}
                                </Typography>

                                <Typography
                                  variant="body1"
                                  sx={{
                                    color: theme.palette.text.secondary,
                                    lineHeight: 1.6,
                                    mb: 2,
                                    fontSize: { xs: '0.9rem', sm: '1rem' },
                                  }}
                                >
                                  {invite.message}
                                </Typography>

                                {/* Project Info Cards */}
                                <Grid container spacing={{ xs: 1, sm: 2 }} sx={{ mb: 1 }}>
                                  {/* Budget Card */}
                                  {invite.project?.budget && (
                                    <Grid item xs={12} sm={6}>
                                      <Box
                                        sx={{
                                          p: { xs: 1.5, sm: 2 },
                                          borderRadius: { xs: 1.5, sm: 2 },
                                          background: `linear-gradient(135deg, ${alpha(
                                            theme.palette.success.main,
                                            0.1
                                          )} 0%, ${alpha(theme.palette.success.main, 0.05)} 100%)`,
                                          border: `1px solid ${alpha(
                                            theme.palette.success.main,
                                            0.2
                                          )}`,
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: { xs: 1, sm: 2 },
                                        }}
                                      >
                                        <AttachMoney
                                          sx={{
                                            color: theme.palette.success.main,
                                            fontSize: { xs: 18, sm: 20 },
                                          }}
                                        />
                                        <Box>
                                          <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            display="block"
                                            sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                                          >
                                            Budget
                                          </Typography>
                                          <Typography
                                            variant="body2"
                                            fontWeight={700}
                                            color="success.main"
                                            sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
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
                                        p: { xs: 1.5, sm: 2 },
                                        borderRadius: { xs: 1.5, sm: 2 },
                                        background: `linear-gradient(135deg, ${alpha(
                                          theme.palette.warning.main,
                                          0.1
                                        )} 0%, ${alpha(theme.palette.warning.main, 0.05)} 100%)`,
                                        border: `1px solid ${alpha(
                                          theme.palette.warning.main,
                                          0.2
                                        )}`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: { xs: 1, sm: 2 },
                                      }}
                                    >
                                      <CalendarToday
                                        sx={{
                                          color: theme.palette.warning.main,
                                          fontSize: { xs: 18, sm: 20 },
                                        }}
                                      />
                                      <Box>
                                        <Typography
                                          variant="caption"
                                          color="text.secondary"
                                          display="block"
                                          sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                                        >
                                          Timeline
                                        </Typography>
                                        <Typography
                                          variant="body2"
                                          fontWeight={600}
                                          color="warning.main"
                                          sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                                        >
                                          {invite.project?.startDate && invite.project?.endDate
                                            ? `${dayjs(invite.project.startDate).format(
                                                'MMM DD'
                                              )} - ${dayjs(invite.project.endDate).format(
                                                'MMM DD'
                                              )}`
                                            : 'To be discussed'}
                                        </Typography>
                                      </Box>
                                    </Box>
                                  </Grid>
                                </Grid>

                                <Divider
                                  sx={{ my: 1, borderColor: alpha(theme.palette.divider, 0.1) }}
                                />

                                {/* Footer with Client Info and Actions */}
                                <Box
                                  sx={{
                                    display: 'flex',
                                    flexDirection: { xs: 'column', sm: 'row' },
                                    alignItems: { xs: 'stretch', sm: 'center' },
                                    justifyContent: 'space-between',
                                    gap: { xs: 2, sm: 0 },
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: { xs: 1.5, sm: 2 },
                                    }}
                                  >
                                    <Person
                                      sx={{
                                        color: theme.palette.text.secondary,
                                        fontSize: { xs: 18, sm: 20 },
                                      }}
                                    />
                                    <Box>
                                      <Typography
                                        variant="body2"
                                        fontWeight={600}
                                        color="text.primary"
                                        sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                                      >
                                        {invite.project?.client?.firstName}{' '}
                                        {invite.project?.client?.lastName}
                                      </Typography>
                                      <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                                      >
                                        Client • Sent {dayjs(invite.createdAt).fromNow()}
                                      </Typography>
                                    </Box>
                                  </Box>

                                  <Stack
                                    direction={{ xs: 'column', sm: 'row' }}
                                    spacing={{ xs: 1, sm: 2 }}
                                  >
                                    <Button
                                      variant="outlined"
                                      size="medium"
                                      onClick={handleDeclineClick}
                                      sx={{
                                        borderRadius: { xs: 1.5, sm: 2 },
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        px: { xs: 2, sm: 3 },
                                        py: { xs: 1, sm: 1.5 },
                                        fontSize: { xs: '0.8rem', sm: '0.875rem' },
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
                                      onClick={handleAcceptClick}
                                      sx={{
                                        borderRadius: { xs: 1.5, sm: 2 },
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        px: { xs: 2, sm: 3 },
                                        py: { xs: 1, sm: 1.5 },
                                        fontSize: { xs: '0.8rem', sm: '0.875rem' },
                                        background: `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.primary.main} 100%)`,
                                        boxShadow: `0 4px 12px ${alpha(
                                          theme.palette.info.main,
                                          0.3
                                        )}`,
                                        '&:hover': {
                                          transform: { xs: 'none', sm: 'translateY(-1px)' },
                                          boxShadow: `0 6px 16px ${alpha(
                                            theme.palette.info.main,
                                            0.4
                                          )}`,
                                        },
                                      }}
                                    >
                                      Send Proposal
                                    </Button>
                                  </Stack>
                                </Box>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      </Slide>

                      <ProposalWizardDialog
                        open={wizardOpen}
                        inviteId={invite.id}
                        onClose={() => setWizardOpen(false)}
                        onSuccess={() => {
                          setWizardOpen(false);
                          fetchInvites();
                          fetchProposals();
                        }}
                        invite={invite}
                      />

                      <ConfirmDialog
                        open={confirmOpen}
                        onClose={() => setConfirmOpen(false)}
                        title={t('invite:confirm_decline_title')}
                        content={t('invite:confirm_decline_body')}
                        cancellable
                        action={
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => {
                              setConfirmOpen(false);
                              onDecline(invite.id);
                            }}
                          >
                            {t('common:decline')}
                          </Button>
                        }
                      />
                    </Box>
                  ))}
                </Box>
              </Fade>
            )
          )}

          {/* Invites Pagination */}
          {invitePaginationMeta && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: { xs: 2, sm: 3 } }}>
              <Pagination
                count={invitePaginationMeta.lastPage}
                page={invitePaginationMeta.currentPage}
                onChange={(_, value) => handleInvitePageChange(value)}
                color="primary"
                shape="rounded"
                size="medium"
                sx={{
                  '& .MuiPagination-ul': {
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                  },
                  '& .MuiPaginationItem-root': {
                    fontWeight: 600,
                    minWidth: { xs: 32, sm: 40 },
                    height: { xs: 32, sm: 40 },
                    margin: { xs: '0 2px', sm: '0 4px' },
                    borderRadius: 1,
                    fontSize: { xs: '0.8rem', sm: '0.9rem' },
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.08),
                      transform: { xs: 'none', sm: 'translateY(-1px)' },
                    },
                    '&.Mui-selected': {
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      color: 'white',
                      boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                      '&:hover': {
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        transform: { xs: 'none', sm: 'translateY(-1px)' },
                      },
                    },
                  },
                }}
              />
            </Box>
          )}
        </>
      )}

      {tab === 'proposals' && (
        <>
          {loadingProposals && <LoadingSkeleton theme={theme} />}

          {!loadingProposals && visibleProposals.length === 0 ? (
            <EmptyBlock
              mainMessage={t('proposal:no_proposals')}
              subMessage={t('proposal:no_proposals_available')}
              noMatchMessage={t('proposal:no_proposals_match', { searchTerm })}
              theme={theme}
              searchTerm={searchTerm}
              clearSearch={clearSearch}
              t={t}
            />
          ) : (
            !loadingProposals && (
              <Fade in timeout={500}>
                <Box>
                  {visibleProposals.map((proposal, index) => (
                    <Box key={proposal.id}>
                      <Slide in direction="up" timeout={300 + index * 100}>
                        <Card
                          sx={{
                            mb: { xs: 2, sm: 3 },
                            borderRadius: { xs: 2, sm: 3 },
                            border: '1px solid',
                            borderColor: alpha(theme.palette.divider, 0.08),
                            background: `linear-gradient(135deg, ${
                              theme.palette.background.paper
                            } 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)`,
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            position: 'relative',
                            overflow: 'hidden',
                            '&:hover': {
                              transform: { xs: 'none', sm: 'translateY(-4px)' },
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
                          <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                            {/* Enhanced Proposal Card Content */}
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                              <Box sx={{ flex: 1 }}>
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: { xs: 'flex-start', sm: 'center' },
                                    flexDirection: { xs: 'column', sm: 'row' },
                                    gap: { xs: 1, sm: 2 },
                                    mb: 2,
                                    flexWrap: 'wrap',
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: { xs: 1, sm: 2 },
                                    }}
                                  >
                                    <AssignmentTurnedIn
                                      sx={{
                                        color: theme.palette.secondary.main,
                                        fontSize: { xs: 20, sm: 24 },
                                      }}
                                    />
                                    <Typography
                                      variant="h6"
                                      sx={{
                                        fontWeight: 700,
                                        color: theme.palette.text.primary,
                                        fontSize: { xs: '1rem', sm: '1.25rem' },
                                      }}
                                    >
                                      Your Proposal
                                    </Typography>
                                  </Box>
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      flexWrap: 'wrap',
                                      gap: { xs: 0.5, sm: 1 },
                                      mt: { xs: 0.5, sm: 0 },
                                    }}
                                  >
                                    <Chip
                                      label={proposal.status}
                                      size="small"
                                      color="secondary"
                                      variant="filled"
                                      sx={{
                                        fontWeight: 600,
                                        textTransform: 'capitalize',
                                        fontSize: { xs: '0.7rem', sm: '0.75rem' },
                                        height: { xs: 22, sm: 24 },
                                      }}
                                    />
                                    <Chip
                                      label={
                                        proposal.amount
                                          ? `$${parseFloat(
                                              proposal.amount.toString()
                                            ).toLocaleString()} ${proposal.currency ?? ''}`
                                          : t('proposal:amount_unspecified')
                                      }
                                      size="small"
                                      variant="outlined"
                                      color="info"
                                      sx={{
                                        fontWeight: 500,
                                        fontSize: { xs: '0.7rem', sm: '0.75rem' },
                                        height: { xs: 22, sm: 24 },
                                        borderColor: alpha(theme.palette.info.main, 0.3),
                                        color: theme.palette.info.dark,
                                      }}
                                    />
                                    {!!proposal.durationDays && (
                                      <Chip
                                        label={`${proposal.durationDays} ${t('common:days')}`}
                                        size="small"
                                        variant="outlined"
                                        color="secondary"
                                        sx={{
                                          fontWeight: 500,
                                          fontSize: { xs: '0.7rem', sm: '0.75rem' },
                                          height: { xs: 22, sm: 24 },
                                          borderColor: alpha(theme.palette.secondary.main, 0.3),
                                          color: theme.palette.secondary.dark,
                                        }}
                                      />
                                    )}
                                  </Box>
                                </Box>

                                <Typography
                                  variant="h5"
                                  sx={{
                                    fontWeight: 600,
                                    color: theme.palette.text.primary,
                                    mb: 1,
                                    lineHeight: 1.3,
                                    fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
                                  }}
                                >
                                  {proposal.project?.title}
                                </Typography>

                                <Typography
                                  variant="body1"
                                  sx={{
                                    color: theme.palette.text.secondary,
                                    lineHeight: 1.6,
                                    mb: 2,
                                    fontSize: { xs: '0.9rem', sm: '1rem' },
                                  }}
                                >
                                  {proposal.coverLetter}
                                </Typography>

                                {/* Proposal Info Cards */}
                                <Grid container spacing={{ xs: 1, sm: 2 }} sx={{ mb: 1 }}>
                                  {/* Proposed Rate Card */}
                                  {proposal.proposedRate && (
                                    <Grid item xs={12} sm={6}>
                                      <Box
                                        sx={{
                                          p: { xs: 1.5, sm: 2 },
                                          borderRadius: { xs: 1.5, sm: 2 },
                                          background: `linear-gradient(135deg, ${alpha(
                                            theme.palette.success.main,
                                            0.1
                                          )} 0%, ${alpha(theme.palette.success.main, 0.05)} 100%)`,
                                          border: `1px solid ${alpha(
                                            theme.palette.success.main,
                                            0.2
                                          )}`,
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: { xs: 1, sm: 2 },
                                        }}
                                      >
                                        <AttachMoney
                                          sx={{
                                            color: theme.palette.success.main,
                                            fontSize: { xs: 18, sm: 20 },
                                          }}
                                        />
                                        <Box>
                                          <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            display="block"
                                            sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                                          >
                                            Proposed Rate
                                          </Typography>
                                          <Typography
                                            variant="body2"
                                            fontWeight={700}
                                            color="success.main"
                                            sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
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
                                        p: { xs: 1.5, sm: 2 },
                                        borderRadius: { xs: 1.5, sm: 2 },
                                        background: `linear-gradient(135deg, ${alpha(
                                          theme.palette.info.main,
                                          0.1
                                        )} 0%, ${alpha(theme.palette.info.main, 0.05)} 100%)`,
                                        border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: { xs: 1, sm: 2 },
                                      }}
                                    >
                                      <Schedule
                                        sx={{
                                          color: theme.palette.info.main,
                                          fontSize: { xs: 18, sm: 20 },
                                        }}
                                      />
                                      <Box>
                                        <Typography
                                          variant="caption"
                                          color="text.secondary"
                                          display="block"
                                          sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                                        >
                                          Status
                                        </Typography>
                                        <Typography
                                          variant="body2"
                                          fontWeight={600}
                                          color="info.main"
                                          sx={{
                                            textTransform: 'capitalize',
                                            fontSize: { xs: '0.8rem', sm: '0.875rem' },
                                          }}
                                        >
                                          {proposal.status}
                                        </Typography>
                                      </Box>
                                    </Box>
                                  </Grid>
                                </Grid>

                                <Divider
                                  sx={{ my: 1, borderColor: alpha(theme.palette.divider, 0.1) }}
                                />

                                {/* Footer with Project Info */}
                                <Box
                                  sx={{
                                    display: 'flex',
                                    flexDirection: { xs: 'column', sm: 'row' },
                                    alignItems: { xs: 'stretch', sm: 'center' },
                                    justifyContent: 'space-between',
                                    gap: { xs: 2, sm: 0 },
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: { xs: 1.5, sm: 2 },
                                    }}
                                  >
                                    <Person
                                      sx={{
                                        color: theme.palette.text.secondary,
                                        fontSize: { xs: 18, sm: 20 },
                                      }}
                                    />
                                    <Box>
                                      <Typography
                                        variant="body2"
                                        fontWeight={600}
                                        color="text.primary"
                                        sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                                      >
                                        {proposal.project?.client?.firstName}{' '}
                                        {proposal.project?.client?.lastName}
                                      </Typography>
                                      <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                                      >
                                        Client • Submitted {dayjs(proposal.createdAt).fromNow()}
                                      </Typography>
                                    </Box>
                                  </Box>

                                  <Button
                                    variant="contained"
                                    size="medium"
                                    sx={{
                                      borderRadius: { xs: 1.5, sm: 2 },
                                      textTransform: 'none',
                                      fontWeight: 600,
                                      px: { xs: 2, sm: 3 },
                                      py: { xs: 1, sm: 1.5 },
                                      fontSize: { xs: '0.8rem', sm: '0.875rem' },
                                      alignSelf: { xs: 'center', sm: 'auto' },
                                      minWidth: { xs: '120px', sm: 'auto' },
                                      background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`,
                                      boxShadow: `0 4px 12px ${alpha(
                                        theme.palette.secondary.main,
                                        0.3
                                      )}`,
                                      '&:hover': {
                                        transform: { xs: 'none', sm: 'translateY(-1px)' },
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
                      {/* <ProposalCard proposal={proposal} /> */}
                    </Box>
                  ))}
                </Box>
              </Fade>
            )
          )}

          {/* Proposals Pagination */}
          {proposalPaginationMeta && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: { xs: 2, sm: 3 } }}>
              <Pagination
                count={proposalPaginationMeta.lastPage}
                page={proposalPaginationMeta.currentPage}
                onChange={(_, value) => handleProposalPageChange(value)}
                color="primary"
                shape="rounded"
                size="medium"
                sx={{
                  '& .MuiPagination-ul': {
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                  },
                  '& .MuiPaginationItem-root': {
                    fontWeight: 600,
                    minWidth: { xs: 32, sm: 40 },
                    height: { xs: 32, sm: 40 },
                    margin: { xs: '0 2px', sm: '0 4px' },
                    borderRadius: 1,
                    fontSize: { xs: '0.8rem', sm: '0.9rem' },
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.08),
                      transform: { xs: 'none', sm: 'translateY(-1px)' },
                    },
                    '&.Mui-selected': {
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      color: 'white',
                      boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                      '&:hover': {
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        transform: { xs: 'none', sm: 'translateY(-1px)' },
                      },
                    },
                  },
                }}
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default OffersPanel;
