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
} from '@mui/material';
import { Search, Clear, Work } from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

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

  const LoadingBlock = () => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 320,
        width: '100%',
        py: 6,
        backgroundColor: alpha(theme.palette.background.paper, 0.7),
        borderRadius: 2,
        boxShadow: 0,
      }}
    >
      <CircularProgress size={48} thickness={4} color="primary" sx={{ mb: 3 }} />
      <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500, mb: 0.5 }}>
        {t('invite:loading_invites')}
      </Typography>
      <Typography variant="body2" color="text.disabled">
        {t('invite:loading_invites_hint')}
      </Typography>
    </Box>
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
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: 2,
          mb: 3,
          top: theme.spacing(2),
          zIndex: 10,
          backgroundColor: alpha(theme.palette.background.default, 0.9),
          backdropFilter: 'blur(8px)',
          p: 1,
          borderRadius: 1,
        }}
      >
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
            maxWidth: 400,
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: alpha(theme.palette.divider, 0.2),
              },
              '&:hover fieldset': {
                borderColor: alpha(theme.palette.primary.main, 0.3),
              },
            },
          }}
        />

        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v as OffersTab)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ '& .MuiTabs-indicator': { height: 3 } }}
        >
          <Tab
            value="invites"
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {t('invite:invitations')}
                <Chip label={countInvites} size="small" color="primary" />
              </Box>
            }
          />
          <Tab
            value="proposals"
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {t('proposal:proposals')}
                <Chip label={countProposals} size="small" color="success" />
              </Box>
            }
          />
        </Tabs>
      </Box>

      {tab === 'invites' && (
        <>
          {loadingInvites && <LoadingBlock />}

          {!loadingInvites && visibleInvites.length === 0 ? (
            <EmptyBlock
              mainMessage={t('invite:no_invites')}
              subMessage={t('invite:no_invites_available')}
              noMatchMessage={t('invite:no_invites_match', { searchTerm })}
            />
          ) : (
            <Grid container spacing={3}>
              {visibleInvites.map((invite) => (
                <Grid item xs={12} key={invite.id}>
                  <InviteCard
                    invite={invite}
                    onAccept={handleInviteAccept}
                    onDecline={() => onDecline(invite.id)}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}

      {tab === 'proposals' && (
        <>
          {loadingProposals && <LoadingBlock />}

          {!loadingProposals && visibleProposals.length === 0 ? (
            <EmptyBlock
              mainMessage={t('proposal:no_proposals')}
              subMessage={t('proposal:no_proposals_available')}
              noMatchMessage={t('proposal:no_proposals_match', { searchTerm })}
            />
          ) : (
            <Grid container spacing={3}>
              {visibleProposals.map((proposal) => (
                <Grid item xs={12} key={proposal.id}>
                  <ProposalCard proposal={proposal} />
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}
    </Box>
  );
};

export default OffersPanel;
