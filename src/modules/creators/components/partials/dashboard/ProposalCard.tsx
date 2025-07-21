import {
  Card,
  CardContent,
  Stack,
  Box,
  Typography,
  Chip,
  Avatar,
  IconButton,
  Divider,
  Tooltip,
  Collapse,
  TextField,
  Button,
  CircularProgress,
  useTheme,
  alpha,
} from '@mui/material';
import { OpenInNewOutlined, ChatBubbleOutline, ExpandMore, Send, Close } from '@mui/icons-material';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useMemo } from 'react';
import Routes from '@common/defs/routes';
import { useRouter } from 'next/router';

import { ProjectProposal, ProjectProposalComment } from '@modules/projects/defs/types';
import useProjects from '@modules/projects/hooks/useProjects';
import ProposalComment from './ProposalComment';
import { countComments } from '@modules/creators/defs/utils';

interface ProposalCardProps {
  proposal: ProjectProposal;
}

const ProposalCard: React.FC<ProposalCardProps> = ({ proposal }) => {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation(['proposal', 'common']);
  const project = proposal.project;

  const { addCommentToProposal, readAllCommentsByProposal } = useProjects();

  const [expanded, setExpanded] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<ProjectProposalComment[]>([]);
  const [posting, setPosting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<ProjectProposalComment | null>(null);

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

  const totalComments = useMemo(() => countComments(comments), [comments]);

  const handleReplyClick = (comment: ProjectProposalComment) => {
    setReplyingTo(comment);
    setTimeout(() => {
      const textField = document.getElementById('comment-textfield');
      if (textField) {
        textField.focus();
      }
    }, 100);
  };

  const cancelReply = () => {
    setReplyingTo(null);
  };

  const statusColor: Record<string, 'info' | 'success' | 'error' | 'default'> = {
    PENDING: 'info',
    ACCEPTED: 'success',
    DECLINED: 'error',
    CANCELED: 'default',
  };

  const formattedAmount = proposal.amount
    ? `$${parseFloat(proposal.amount.toString()).toLocaleString()} ${proposal.currency ?? ''}`
    : t('proposal:amount_unspecified');

  const renderComments = (comments: ProjectProposalComment[]) => {
    return comments.map((comment) => (
      <ProposalComment
        key={comment.id}
        comment={comment}
        onReply={handleReplyClick}
        replyingTo={replyingTo}
      />
    ));
  };

  const topLevelComments = comments.filter((comment) => comment.parentId === null);

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: '0 3px 10px rgba(0,0,0,0.08)',
        border: '1px solid',
        borderColor: alpha(theme.palette.divider, 0.1),
        transition: 'all .3s ease',
        background: theme.palette.background.paper,
        '&:hover': {
          boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
        },
        p: 2,
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Stack direction="row" justifyContent="space-between" mb={1.5}>
          <Box>
            <Typography variant="h6" fontWeight={700} fontSize="1.05rem">
              {project?.title}
            </Typography>

            <Stack direction="row" spacing={1} flexWrap="wrap" alignItems="center" mt={0.5}>
              <Chip
                label={proposal.status}
                size="small"
                color={statusColor[proposal.status] ?? 'default'}
                sx={{
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  height: 24,
                }}
              />
              <Chip
                label={formattedAmount}
                size="small"
                variant="outlined"
                color="info"
                sx={{
                  fontWeight: 500,
                  fontSize: '0.75rem',
                  height: 24,
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
                    fontSize: '0.75rem',
                    height: 24,
                    borderColor: alpha(theme.palette.secondary.main, 0.3),
                    color: theme.palette.secondary.dark,
                  }}
                />
              )}
            </Stack>
          </Box>

          <Tooltip title={t('proposal:view_project')} arrow>
            <IconButton
              size="small"
              onClick={() =>
                router.push(Routes.Projects.ReadOne.replace('{id}', proposal.projectId.toString()))
              }
              sx={{
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.2),
                },
                alignSelf: 'flex-start',
                mt: 0.5,
              }}
            >
              <OpenInNewOutlined fontSize="small" sx={{ color: theme.palette.primary.main }} />
            </IconButton>
          </Tooltip>
        </Stack>

        {proposal.coverLetter && (
          <Box
            sx={{
              backgroundColor: alpha(theme.palette.primary.light, 0.05),
              borderLeft: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
              p: 2,
              my: 2,
              borderRadius: '0 4px 4px 0',
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              whiteSpace="pre-line"
              sx={{
                fontSize: '0.875rem',
                lineHeight: 1.7,
              }}
            >
              {proposal.coverLetter}
            </Typography>
          </Box>
        )}

        <Box mt={2}>
          <Divider
            sx={{
              my: 1.5,
              borderColor: alpha(theme.palette.divider, 0.1),
            }}
          />

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            py={1}
            onClick={() => setExpanded(!expanded)}
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
                variant="subtitle2"
                fontWeight={600}
                sx={{
                  color: expanded ? theme.palette.primary.main : 'inherit',
                  fontSize: '0.875rem',
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
                p: 0.5,
              }}
            >
              <ExpandMore fontSize="small" />
            </IconButton>
          </Stack>

          <Collapse in={expanded}>
            <Box
              sx={{
                maxHeight: 350,
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
                  py={2}
                  fontStyle="italic"
                  sx={{ fontSize: '0.875rem' }}
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

              <Stack direction="row" spacing={0.5} alignItems="center">
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
                      fontSize: '0.875rem',
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
                    minWidth: 36,
                    height: 36,
                    borderRadius: '50%',
                    p: 0,
                    mb: 0.5,
                  }}
                  onClick={handleAddComment}
                  disabled={!newComment.trim() || posting}
                >
                  {posting ? <CircularProgress size={18} /> : <Send fontSize="small" />}
                </Button>
              </Stack>
            </Box>
          </Collapse>
        </Box>

        <Divider
          sx={{
            my: 2,
            borderColor: alpha(theme.palette.divider, 0.1),
          }}
        />

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar
              src={proposal.project?.client?.user.profileImage ?? undefined}
              sx={{
                width: 36,
                height: 36,
              }}
            />
            <Box>
              <Typography variant="body2" fontWeight={600} fontSize="0.875rem">
                {proposal.project?.client?.user?.firstName}{' '}
                {proposal.project?.client?.user?.lastName}
              </Typography>
              <Typography variant="caption" color="text.secondary" fontSize="0.75rem">
                {project?.client?.companyName}
              </Typography>
            </Box>
          </Stack>

          <Typography variant="caption" color="text.secondary" fontSize="0.75rem">
            {dayjs(proposal.createdAt).format('MMM D, YYYY')}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ProposalCard;
