import {
  Box,
  Typography,
  Card,
  CardContent,
  Skeleton,
  useTheme,
  Grid,
  Button,
} from '@mui/material';
import { Project, PROJECT_PROPOSAL_STATUS, ProjectProposal } from '@modules/projects/defs/types';
import useProjects from '@modules/projects/hooks/useProjects';
import { useEffect, useState } from 'react';
import { Id } from '@common/defs/types';
import ProposalReviewCard from '../ProposalReviewCard';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import { useTranslation } from 'react-i18next';
import { PersonAddOutlined } from '@mui/icons-material';
import { useRouter } from 'next/router';
import StepperEmptyState from '../StepperEmptyState';

interface Props {
  projectId: Id;
  project: Project;
  onStatusChange?: (delta: { proposals?: number; hires?: number }) => void;
}

const ReviewProposalsStep = ({ projectId, onStatusChange }: Props) => {
  const router = useRouter();
  const { t } = useTranslation(['project']);
  const theme = useTheme();
  const { readAllProposalsByProject, approveProposal, declineProposal } = useProjects();
  const [proposals, setProposals] = useState<ProjectProposal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProposals();
  }, [projectId]);

  const fetchProposals = async () => {
    setLoading(true);
    const res = await readAllProposalsByProject(projectId);
    if (res.success && res.data) {
      setProposals(res.data.items);
    }
    setLoading(false);
  };

  const setProposalStatus = (id: number, status: PROJECT_PROPOSAL_STATUS) =>
    setProposals((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));

  const handleApprove = async (proposalId: number) => {
    setProposalStatus(proposalId, PROJECT_PROPOSAL_STATUS.ACCEPTED);
    // SWR will handle optimistic updates automatically

    const res = await approveProposal(proposalId);
    if (!res.success) {
      setProposalStatus(proposalId, PROJECT_PROPOSAL_STATUS.PENDING);
    }
  };

  const handleDecline = async (proposalId: number) => {
    setProposalStatus(proposalId, PROJECT_PROPOSAL_STATUS.REJECTED);
    // SWR will handle optimistic updates automatically

    const res = await declineProposal(proposalId);
    if (!res.success) {
      setProposalStatus(proposalId, PROJECT_PROPOSAL_STATUS.PENDING);
    }
  };

  const renderSkeleton = () => (
    <Box>
      {[1, 2, 3].map((id) => (
        <Card key={id} sx={{ mb: 2, borderRadius: 2 }}>
          <CardContent>
            <Box display="flex" alignItems="center">
              <Skeleton variant="circular" width={56} height={56} />
              <Box ml={2} flexGrow={1}>
                <Skeleton width="40%" height={24} />
                <Skeleton width="30%" height={20} sx={{ mt: 1 }} />
              </Box>
              <Skeleton variant="rectangular" width={100} height={36} />
            </Box>

            <Box mt={3}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ p: 2, bgcolor: theme.palette.background.default, borderRadius: 2 }}>
                    <Skeleton width="30%" height={20} />
                    <Skeleton width="70%" height={24} sx={{ mt: 1 }} />
                    <Skeleton width="60%" height={24} sx={{ mt: 1 }} />
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ p: 2, bgcolor: theme.palette.background.default, borderRadius: 2 }}>
                    <Skeleton width="40%" height={20} />
                    <Skeleton width="80%" height={24} sx={{ mt: 1 }} />
                    <Skeleton width="70%" height={24} sx={{ mt: 1 }} />
                  </Box>
                </Grid>
              </Grid>
            </Box>

            <Box mt={3}>
              <Skeleton width="20%" height={24} />
              <Skeleton variant="rectangular" height={80} sx={{ mt: 1, borderRadius: 1 }} />
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );

  const renderEmptyState = () => (
    <StepperEmptyState
      icon={<InboxOutlinedIcon />}
      title={t('project:no_proposals_title') || 'No Proposals Yet'}
      description={
        t('project:no_proposals_description') ||
        'Your project is live and waiting for talented professionals to submit their proposals. Great things are coming!'
      }
      buttonText={t('project:invite_creators', 'Invite Creators')}
      buttonIcon={<PersonAddOutlined />}
      onButtonClick={() => {
        router.push({
          pathname: router.pathname,
          query: { ...router.query, step: 'invite' },
        });
      }}
    />
  );

  return (
    <Box>
      <Box height={600} overflow="auto" p={2}>
        {loading && renderSkeleton()}

        {!loading && proposals.length === 0 ? (
          <Box
            width="100%"
            height="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            {renderEmptyState()}
          </Box>
        ) : (
          <Box>
            {proposals.map((proposal) => (
              <ProposalReviewCard
                key={proposal.id}
                proposal={proposal}
                onApprove={handleApprove}
                onDecline={handleDecline}
              />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ReviewProposalsStep;
