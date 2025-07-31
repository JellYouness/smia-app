import {
  Box,
  Typography,
  Card,
  CardContent,
  Skeleton,
  useTheme,
  Grid,
  Button,
  Tabs,
  Tab,
  Fade,
} from '@mui/material';
import { Project, PROJECT_PROPOSAL_STATUS, ProjectProposal } from '@modules/projects/defs/types';
import useProjects from '@modules/projects/hooks/useProjects';
import { useEffect, useState } from 'react';
import { Id } from '@common/defs/types';
import { FilterParam } from '@common/hooks/useItems';
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
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    fetchProposals();
  }, [projectId, activeTab]);

  const fetchProposals = async () => {
    setLoading(true);

    // Create filters based on active tab
    const filters: FilterParam[] = [];

    if (activeTab === 1) {
      filters.push({
        filterColumn: 'status',
        filterOperator: 'equals',
        filterValue: PROJECT_PROPOSAL_STATUS.PENDING,
      });
    } else if (activeTab === 2) {
      filters.push({
        filterColumn: 'status',
        filterOperator: 'equals',
        filterValue: PROJECT_PROPOSAL_STATUS.ACCEPTED,
      });
    } else if (activeTab === 3) {
      filters.push({
        filterColumn: 'status',
        filterOperator: 'equals',
        filterValue: PROJECT_PROPOSAL_STATUS.REJECTED,
      });
    } else if (activeTab === 4) {
      filters.push({
        filterColumn: 'status',
        filterOperator: 'equals',
        filterValue: PROJECT_PROPOSAL_STATUS.WITHDRAWN,
      });
    }

    const res = await readAllProposalsByProject(projectId, 1, 'all', undefined, filters);
    if (res.success && res.data) {
      setProposals(res.data.items);
    }
    setLoading(false);
  };

  const setProposalStatus = (id: number, status: PROJECT_PROPOSAL_STATUS) =>
    setProposals((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));

  const handleApprove = async (proposalId: number) => {
    setProposalStatus(proposalId, PROJECT_PROPOSAL_STATUS.ACCEPTED);

    const res = await approveProposal(proposalId);
    if (!res.success) {
      setProposalStatus(proposalId, PROJECT_PROPOSAL_STATUS.PENDING);
    }
  };

  const handleDecline = async (proposalId: number) => {
    setProposalStatus(proposalId, PROJECT_PROPOSAL_STATUS.REJECTED);

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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const getEmptyStateContent = () => {
    switch (activeTab) {
      case 0: // All Proposals
        return {
          title: t('project:no_proposals_title', 'No Proposals Yet'),
          description: t(
            'project:no_proposals_description',
            'Your project is live and waiting for talented professionals to submit their proposals. Great things are coming!'
          ),
          icon: <InboxOutlinedIcon />,
        };
      case 1: // Pending
        return {
          title: t('project:no_pending_proposals', 'No Pending Proposals'),
          description: t(
            'project:no_pending_proposals_description',
            'There are no pending proposals for this project.'
          ),
          icon: <InboxOutlinedIcon />,
        };
      case 2: // Accepted
        return {
          title: t('project:no_accepted_proposals', 'No Accepted Proposals'),
          description: t(
            'project:no_accepted_proposals_description',
            'No proposals have been accepted for this project yet.'
          ),
          icon: <InboxOutlinedIcon />,
        };
      case 3: // Rejected
        return {
          title: t('project:no_rejected_proposals', 'No Rejected Proposals'),
          description: t(
            'project:no_rejected_proposals_description',
            'No proposals have been rejected for this project.'
          ),
          icon: <InboxOutlinedIcon />,
        };
      case 4: // Withdrawn
        return {
          title: t('project:no_withdrawn_proposals', 'No Withdrawn Proposals'),
          description: t(
            'project:no_withdrawn_proposals_description',
            'No proposals have been withdrawn for this project.'
          ),
          icon: <InboxOutlinedIcon />,
        };
      default:
        return {
          title: t('project:no_proposals_title', 'No Proposals Yet'),
          description: t(
            'project:no_proposals_description',
            'Your project is live and waiting for talented professionals to submit their proposals. Great things are coming!'
          ),
          icon: <InboxOutlinedIcon />,
        };
    }
  };

  const renderEmptyState = () => (
    <StepperEmptyState
      icon={getEmptyStateContent().icon}
      title={getEmptyStateContent().title}
      description={getEmptyStateContent().description}
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
      {/* Tabs for filtering proposals */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.875rem',
              minHeight: 48,
            },
            '& .MuiTabs-indicator': {
              height: 3,
              borderRadius: '3px 3px 0 0',
              backgroundColor: (() => {
                switch (activeTab) {
                  case 1:
                    return theme.palette.warning.main;
                  case 2:
                    return theme.palette.success.main;
                  case 3:
                    return theme.palette.error.main;
                  case 4:
                    return theme.palette.info.main;
                  default:
                    return theme.palette.primary.main;
                }
              })(),
            },
          }}
        >
          <Tab
            label={t('project:all_proposals', 'All Proposals')}
            sx={{
              color: theme.palette.text.secondary,
              '&.Mui-selected': {
                color: theme.palette.primary.main,
              },
            }}
          />
          <Tab
            label={t('project:pending_proposals', 'Pending')}
            sx={{
              color: theme.palette.text.secondary,
              '&.Mui-selected': {
                color: theme.palette.warning.main,
              },
            }}
          />
          <Tab
            label={t('project:accepted_proposals', 'Accepted')}
            sx={{
              color: theme.palette.text.secondary,
              '&.Mui-selected': {
                color: theme.palette.success.main,
              },
            }}
          />
          <Tab
            label={t('project:rejected_proposals', 'Rejected')}
            sx={{
              color: theme.palette.text.secondary,
              '&.Mui-selected': {
                color: theme.palette.error.main,
              },
            }}
          />
          <Tab
            label={t('project:withdrawn_proposals', 'Withdrawn')}
            sx={{
              color: theme.palette.text.secondary,
              '&.Mui-selected': {
                color: theme.palette.info.main,
              },
            }}
          />
        </Tabs>
      </Box>

      <Box height={600} overflow="auto" p={2}>
        {loading && renderSkeleton()}

        {!loading && proposals.length === 0 ? (
          <Fade in timeout={600}>
            <Box
              width="100%"
              height="100%"
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              {renderEmptyState()}
            </Box>
          </Fade>
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
