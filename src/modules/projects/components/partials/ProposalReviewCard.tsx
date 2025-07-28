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
  Collapse,
  Divider,
  Tooltip,
  TextField,
  CircularProgress,
  alpha,
  useTheme,
  Grid,
} from '@mui/material';
import {
  ChatBubbleOutline,
  ExpandMore,
  OpenInNewOutlined,
  Send,
  Close,
  ArrowDropDown,
  ArrowDropUp,
  CalendarToday,
  AttachMoney,
  Schedule,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import {
  PROJECT_PROPOSAL_STATUS,
  ProjectProposal,
  ProjectProposalComment,
} from '@modules/projects/defs/types';
import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import Routes from '@common/defs/routes';
import useProjects from '@modules/projects/hooks/useProjects';
import ProposalComment from '@modules/creators/components/partials/dashboard/ProposalComment';
import ConfirmDialog from '@common/components/lib/feedbacks/ConfirmDialog';
import { countComments } from '@modules/creators/defs/utils';

interface Props {
  proposal: ProjectProposal;
  onApprove: (proposalId: number) => void;
  onDecline: (proposalId: number) => void;
}

const statusColorMap: Record<string, 'info' | 'success' | 'error' | 'default'> = {
  PENDING: 'info',
  ACCEPTED: 'success',
  DECLINED: 'error',
};

const ProposalReviewCard = ({ proposal, onApprove, onDecline }: Props) => {
  const theme = useTheme();
  const { t } = useTranslation(['proposal', 'common']);
  const router = useRouter();
  const { addCommentToProposal, readAllCommentsByProposal } = useProjects();

  const [expanded, setExpanded] = useState(false);
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<ProjectProposalComment[]>([]);
  const [posting, setPosting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<ProjectProposalComment | null>(null);
  const [confirmDeclineOpen, setConfirmDeclineOpen] = useState(false);
  const [confirmApproveOpen, setConfirmApproveOpen] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [proposal.id]);

  const fetchComments = async () => {
    const res = await readAllCommentsByProposal(proposal.id);
    if (res.success && res.data) {
      setComments(res.data.items);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      return;
    }

    setPosting(true);
    const res = await addCommentToProposal(proposal.id, {
      body: newComment.trim(),
      parentId: replyingTo?.id ?? undefined,
    });

    setPosting(false);

    if (res.success && res.data) {
      fetchComments();
      setNewComment('');
      setReplyingTo(null);
      if (!expanded) {
        setExpanded(true);
      }
    }
  };

  const handleReplyClick = (comment: ProjectProposalComment) => {
    setReplyingTo(comment);
    setTimeout(() => {
      const textField = document.getElementById('comment-textfield');
      if (textField) {
        textField.focus();
      }
    }, 100);
  };

  const cancelReply = () => setReplyingTo(null);

  const formatDate = (dateString: string) => dayjs(dateString).format('MMM D, YYYY');
  const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;

  const projectBudget = proposal.project?.budget ? formatCurrency(proposal.project.budget) : 'N/A';
  const proposalAmount = proposal.amount ? formatCurrency(proposal.amount) : 'N/A';

  const projectStart = proposal.project?.startDate ? formatDate(proposal.project.startDate) : 'N/A';
  const projectEnd = proposal.project?.endDate ? formatDate(proposal.project.endDate) : 'N/A';

  const projectDuration =
    proposal.project?.startDate && proposal.project?.endDate
      ? dayjs(proposal.project.endDate).diff(proposal.project.startDate, 'day')
      : 0;

  const topLevelComments = comments.filter((comment) => comment.parentId === null);

  const renderComments = (comments: ProjectProposalComment[]) => {
    return comments.map((comment: ProjectProposalComment) => (
      <ProposalComment
        key={comment.id}
        comment={comment}
        onReply={handleReplyClick}
        replyingTo={replyingTo}
      />
    ));
  };

  const toggleDetailsExpansion = () => {
    setDetailsExpanded(!detailsExpanded);
  };

  const totalComments = useMemo(() => countComments(comments), [comments]);

  return (
    <>
      <Card
        sx={{
          position: 'relative',
          borderRadius: 2,
          boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
          border: '1px solid',
          borderColor: alpha(theme.palette.divider, 0.1),
          transition: 'all .3s ease',
          background: theme.palette.background.paper,
          '&:hover': {
            boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
            borderColor: alpha(theme.palette.primary.main, 0.2),
          },
          mb: 2,
          overflow: 'visible',
          p: 2,
        }}
      >
        {proposal.status === PROJECT_PROPOSAL_STATUS.PENDING && (
          <Box
            sx={{
              position: 'absolute',
              top: -8,
              right: 25,
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
            {t('proposal:new')}
          </Box>
        )}
        <CardContent sx={{ p: 2, pb: '8px !important' }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            onClick={toggleDetailsExpansion}
            sx={{ cursor: 'pointer' }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  src={proposal.creator?.user?.profile?.profilePicture ?? undefined}
                  sx={{ width: 56, height: 56 }}
                />
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    {proposal.creator?.user?.firstName} {proposal.creator?.user?.lastName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mt={0.5}>
                    {t('proposal:submitted_on')} {dayjs(proposal.createdAt).format('MMM D, YYYY')}
                  </Typography>
                </Box>
              </Stack>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={1}>
              {proposal.status !== PROJECT_PROPOSAL_STATUS.PENDING && (
                <Chip
                  label={proposal.status}
                  variant="outlined"
                  size="small"
                  color={statusColorMap[proposal.status] ?? 'default'}
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    height: 24,
                  }}
                />
              )}
              <IconButton size="small">
                {detailsExpanded ? <ArrowDropUp /> : <ArrowDropDown />}
              </IconButton>
            </Stack>
          </Stack>
        </CardContent>

        <Collapse in={detailsExpanded} timeout="auto" unmountOnExit>
          <CardContent sx={{ pt: 0, pb: '16px !important' }}>
            <Divider sx={{ my: 2, borderColor: alpha(theme.palette.divider, 0.1) }} />

            {/* Project vs Proposal Comparison */}
            <Box mb={3}>
              <Box display="flex" alignItems="center" mb={2} gap={1}>
                <Typography variant="h6" fontWeight={600}>
                  {t('proposal:project_details')}
                </Typography>

                <Tooltip title={t('proposal:view_project')} arrow>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(
                        Routes.Projects.ReadOne.replace('{id}', proposal.projectId.toString())
                      );
                    }}
                    size="small"
                    sx={{
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.2) },
                    }}
                  >
                    <OpenInNewOutlined
                      fontSize="small"
                      sx={{ color: theme.palette.primary.main }}
                    />
                  </IconButton>
                </Tooltip>
              </Box>

              <Grid container spacing={3}>
                {/* Project Details */}
                <Grid item xs={12} md={6}>
                  <Box
                    sx={{
                      p: 2.5,
                      borderRadius: 2,
                      border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                      backgroundColor: alpha(theme.palette.primary.light, 0.03),
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight={600} mb={2}>
                      {t('proposal:your_project')}
                    </Typography>

                    <Stack spacing={1.5}>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">
                          <AttachMoney fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                          {t('proposal:budget')}
                        </Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {projectBudget}
                        </Typography>
                      </Stack>

                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">
                          <CalendarToday fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                          {t('proposal:timeline')}
                        </Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {projectStart} - {projectEnd}{' '}
                          <Typography component="span" variant="body2" color="primary">
                            ({projectDuration} {t('common:days')})
                          </Typography>
                        </Typography>
                      </Stack>
                    </Stack>
                  </Box>
                </Grid>

                {/* Proposal Details */}
                <Grid item xs={12} md={6}>
                  <Box
                    sx={{
                      p: 2.5,
                      borderRadius: 2,
                      border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                      backgroundColor: alpha(theme.palette.info.light, 0.03),
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight={600} mb={2}>
                      {t('proposal:proposal_details')}
                    </Typography>

                    <Stack spacing={1.5}>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">
                          <AttachMoney fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                          {t('proposal:proposed_amount')}
                        </Typography>
                        <Typography variant="body2" fontWeight={500} color="primary">
                          {proposalAmount} {proposal.currency ? `(${proposal.currency})` : ''}
                        </Typography>
                      </Stack>

                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">
                          <Schedule fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                          {t('proposal:proposed_duration')}
                        </Typography>
                        <Typography variant="body2" fontWeight={500} color="primary">
                          {proposal.durationDays || 'N/A'} {t('common:days')}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            {proposal.coverLetter && (
              <Box mb={3}>
                <Typography variant="subtitle1" fontWeight={600} mb={1.5}>
                  {t('proposal:cover_letter')}
                </Typography>
                <Box
                  sx={{
                    backgroundColor: alpha(theme.palette.primary.light, 0.05),
                    borderLeft: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                    p: 2,
                    borderRadius: '0 8px 8px 0',
                    maxHeight: 150,
                    overflowY: 'auto',
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    whiteSpace="pre-line"
                    sx={{ lineHeight: 1.6, fontSize: '0.9rem' }}
                  >
                    {proposal.coverLetter}
                  </Typography>
                </Box>
              </Box>
            )}

            <Box mb={2}>
              <Grid container spacing={1.5} justifyContent="flex-end">
                {proposal.status === PROJECT_PROPOSAL_STATUS.PENDING && (
                  <>
                    <Grid item>
                      <Button
                        variant="outlined"
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmDeclineOpen(true);
                        }}
                        size="small"
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
                    </Grid>
                    <Grid item>
                      <Button
                        variant="contained"
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmApproveOpen(true);
                        }}
                        size="small"
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
                        {t('common:approve')}
                      </Button>
                    </Grid>
                  </>
                )}
              </Grid>

              {proposal.status !== PROJECT_PROPOSAL_STATUS.PENDING && (
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color={
                    proposal.status === PROJECT_PROPOSAL_STATUS.ACCEPTED
                      ? 'success.main'
                      : 'error.main'
                  }
                  textAlign="right"
                  mt={1.5}
                >
                  {proposal.status === PROJECT_PROPOSAL_STATUS.ACCEPTED
                    ? t('proposal:already_accepted')
                    : t('proposal:already_declined')}
                </Typography>
              )}
            </Box>

            <Box>
              <Divider sx={{ my: 1.5, borderColor: alpha(theme.palette.divider, 0.1) }} />

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                py={1}
                onClick={(e) => {
                  e.stopPropagation();
                  setExpanded(!expanded);
                }}
                sx={{ cursor: 'pointer', userSelect: 'none' }}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <ChatBubbleOutline
                    fontSize="small"
                    sx={{
                      color: expanded ? theme.palette.primary.main : theme.palette.text.secondary,
                    }}
                  />
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    sx={{
                      color: expanded ? theme.palette.primary.main : 'inherit',
                    }}
                  >
                    {t('proposal:comments')} ({totalComments})
                  </Typography>
                </Stack>

                <IconButton
                  size="small"
                  sx={{
                    transform: expanded ? 'rotate(180deg)' : 'none',
                    transition: '0.3s',
                    color: expanded ? theme.palette.primary.main : 'inherit',
                  }}
                >
                  <ExpandMore fontSize="small" />
                </IconButton>
              </Stack>

              <Collapse in={expanded}>
                <Box
                  sx={{
                    maxHeight: 250,
                    overflowY: 'auto',
                    pr: 1,
                    py: 1,
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    borderRadius: 1,
                    backgroundColor: alpha(theme.palette.background.default, 0.5),
                    mt: 1,
                  }}
                >
                  {topLevelComments.length > 0 ? (
                    renderComments(topLevelComments)
                  ) : (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      textAlign="center"
                      py={1.5}
                      fontStyle="italic"
                      fontSize="0.85rem"
                    >
                      {t('proposal:no_comments')}
                    </Typography>
                  )}
                </Box>

                <Box mt={1.5}>
                  {replyingTo && (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 1,
                        backgroundColor: alpha(theme.palette.primary.light, 0.1),
                        borderRadius: 1,
                        p: '4px 8px',
                        fontSize: '0.8rem',
                      }}
                    >
                      <Typography variant="caption" fontWeight={500} sx={{ mr: 1 }}>
                        {t('common:replying_to')} {replyingTo.user?.firstName}:
                      </Typography>
                      <IconButton size="small" onClick={cancelReply} sx={{ p: 0.25, ml: 'auto' }}>
                        <Close fontSize="small" />
                      </IconButton>
                    </Box>
                  )}

                  <Stack direction="row" spacing={0.5} alignItems="flex-end">
                    <TextField
                      id="comment-textfield"
                      fullWidth
                      size="small"
                      placeholder={
                        replyingTo
                          ? t('proposal:write_reply_placeholder')
                          : t('proposal:add_comment_placeholder')
                      }
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      multiline
                      maxRows={3}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '0.85rem',
                          backgroundColor: theme.palette.background.paper,
                          '&:hover fieldset': {
                            borderColor: alpha(theme.palette.primary.main, 0.5),
                          },
                        },
                      }}
                    />
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        minWidth: 34,
                        height: 34,
                        borderRadius: '50%',
                        p: 0,
                        mb: 0.5,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddComment();
                      }}
                      disabled={!newComment.trim() || posting}
                    >
                      {posting ? <CircularProgress size={16} /> : <Send fontSize="small" />}
                    </Button>
                  </Stack>
                </Box>
              </Collapse>
            </Box>
          </CardContent>
        </Collapse>
      </Card>

      <ConfirmDialog
        open={confirmDeclineOpen}
        onClose={() => setConfirmDeclineOpen(false)}
        title={t('proposal:confirm_decline_title')}
        content={t('proposal:confirm_decline_body')}
        cancellable
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              onDecline(proposal.id);
              setConfirmDeclineOpen(false);
            }}
          >
            {t('common:confirm')}
          </Button>
        }
      />

      <ConfirmDialog
        open={confirmApproveOpen}
        onClose={() => setConfirmApproveOpen(false)}
        title={t('proposal:confirm_approve_title')}
        content={t('proposal:confirm_approve_body')}
        cancellable
        action={
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              onApprove(proposal.id);
              setConfirmApproveOpen(false);
            }}
          >
            {t('common:confirm')}
          </Button>
        }
      />
    </>
  );
};

export default ProposalReviewCard;
