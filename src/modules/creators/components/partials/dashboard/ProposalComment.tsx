import { ProjectProposalComment } from '@modules/projects/defs/types';
import {
  Box,
  useTheme,
  styled,
  alpha,
  Typography,
  Tooltip,
  IconButton,
  Avatar,
  Stack,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

import { ReplyOutlined } from '@mui/icons-material';

interface CommentContainerProps {
  depth?: number;
}

interface ProposalCommentProps {
  comment: ProjectProposalComment;
  depth?: number;
  onReply: (comment: ProjectProposalComment) => void;
  replyingTo?: ProjectProposalComment | null;
}

const CommentContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'depth',
})<CommentContainerProps>(({ theme, depth = 0 }) => ({
  marginLeft: depth > 0 ? `${depth * 16}px` : 0,
  marginTop: theme.spacing(1),
  position: 'relative',
}));

const ProposalComment = ({ comment, depth = 0, onReply, replyingTo }: ProposalCommentProps) => {
  const theme = useTheme();
  const { t } = useTranslation(['common']);
  const formatDate = (dateString: string) => dayjs(dateString).format('MMM D, YYYY [at] h:mm A');

  return (
    <CommentContainer depth={depth}>
      <Box
        sx={{
          display: 'flex',
          gap: 1.5,
          alignItems: 'flex-start',
          p: 1,
          borderRadius: 1,
          '&:hover': {
            backgroundColor: alpha(theme.palette.grey[100], 0.5),
          },
        }}
      >
        <Avatar
          src={comment.user?.profileImage ?? undefined}
          sx={{
            width: 32,
            height: 32,
            mt: 0.5,
          }}
        />
        <Box sx={{ flex: 1 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography variant="subtitle2" fontWeight={600} fontSize="0.875rem">
                {comment.user?.firstName} {comment.user?.lastName}
              </Typography>
              <Typography variant="caption" color="text.secondary" fontSize="0.75rem">
                {formatDate(comment.createdAt)}
              </Typography>
            </Box>
            {depth === 0 && (
              <Tooltip title={t('common:reply')} placement="top">
                <IconButton
                  size="small"
                  onClick={() => onReply(comment)}
                  sx={{
                    p: 0.5,
                    color:
                      replyingTo?.id === comment.id
                        ? theme.palette.primary.main
                        : theme.palette.text.secondary,
                  }}
                >
                  <ReplyOutlined fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
          <Typography
            variant="body2"
            color="text.secondary"
            whiteSpace="pre-line"
            mt={0.5}
            sx={{ lineHeight: 1.5, fontSize: '0.875rem' }}
          >
            {comment.body}
          </Typography>

          {replyingTo?.id === comment.id && (
            <Typography variant="caption" color="primary" sx={{ display: 'block', mt: 0.5 }}>
              {t('common:replying')}...
            </Typography>
          )}
        </Box>
      </Box>
      {comment.children && comment.children.length > 0 && (
        <Box sx={{ pl: 1.5, borderLeft: `1px solid ${alpha(theme.palette.divider, 0.2)}` }}>
          {comment.children.map((child) => (
            <ProposalComment
              key={child.id}
              comment={child}
              depth={depth + 1}
              onReply={onReply}
              replyingTo={replyingTo}
            />
          ))}
        </Box>
      )}
    </CommentContainer>
  );
};

export default ProposalComment;
