import { Box, Typography, Card, CardContent, Skeleton, useTheme, Grid } from '@mui/material';
import { Project, PROJECT_PROPOSAL_STATUS, ProjectProposal } from '@modules/projects/defs/types';
import useProjects from '@modules/projects/hooks/useProjects';
import { useEffect, useState } from 'react';
import { Id } from '@common/defs/types';
import ProposalReviewCard from '../ProposalReviewCard';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';
import { useTranslation } from 'react-i18next';

interface Props {
  projectId: Id;
  project: Project;
  onStatusChange?: (delta: { proposals?: number; hires?: number }) => void;
}

const ReviewProposalsStep = ({ projectId, onStatusChange }: Props) => {
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

  return (
    <Box>
      <Box height={600} overflow="auto" pt={2}>
        {loading && renderSkeleton()}

        {!loading && proposals.length === 0 ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            p={4}
            textAlign="center"
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              mb={2}
              mt={6}
              sx={{
                width: 72,
                height: 72,
              }}
            >
              <InboxOutlinedIcon sx={{ fontSize: 50, color: theme.palette.primary.main }} />
            </Box>
            <Typography variant="h6" mb={1}>
              {t('project:no_proposals_title')}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {t('project:no_proposals_description')}
            </Typography>
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
