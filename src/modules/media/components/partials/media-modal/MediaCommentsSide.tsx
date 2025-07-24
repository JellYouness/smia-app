import {
  Avatar,
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  Stack,
  Divider,
} from '@mui/material';
import { Send, AccessTime } from '@mui/icons-material';
import { MediaPostComment } from '../../../defs/types';
import React, { useState } from 'react';

export type MediaPostCommentUI = MediaPostComment & {
  avatar: string;
  authorName: string;
  text: string;
  date: string;
  time: string;
};

interface MediaCommentSideProps {
  comments: MediaPostCommentUI[];
  onAddComment: (comment: string) => void;
}

const MediaCommentsSide = ({ comments, onAddComment }: MediaCommentSideProps) => {
  const [commentText, setCommentText] = useState('');

  const handleAddComment = () => {
    if (commentText.trim()) {
      onAddComment(commentText);
      setCommentText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleAddComment();
    }
  };

  const formatTimeAgo = (timeString: string) => {
    // Simple time ago formatting - you can enhance this
    return timeString;
  };

  const CommentCard = ({ comment }: { comment: MediaPostCommentUI }) => {
    return (
      <Card
        sx={{
          mb: 2,
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(32, 101, 209, 0.08)',
          borderRadius: 2,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            borderColor: 'primary.light',
          },
        }}
      >
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          {/* Header */}
          <Box display="flex" alignItems="center" mb={1.5}>
            <Avatar
              src={comment.avatar.startsWith('http') ? comment.avatar : undefined}
              sx={{
                width: 32,
                height: 32,
                fontSize: '0.75rem',
                backgroundColor: 'primary.main',
                color: 'white',
                mr: 1.5,
                fontWeight: 600,
              }}
            >
              {!comment.avatar.startsWith('http') ? comment.avatar : null}
            </Avatar>
            <Box flex={1}>
              <Typography
                variant="subtitle2"
                fontWeight={600}
                color="text.primary"
                fontSize="0.85rem"
              >
                {comment.authorName}
              </Typography>
              <Box display="flex" alignItems="center" gap={0.5}>
                <AccessTime sx={{ fontSize: 12, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary" fontSize="0.7rem">
                  {comment.time}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Comment Content */}
          <Typography
            variant="body2"
            color="text.primary"
            fontSize="0.8rem"
            lineHeight={1.5}
            sx={{
              wordBreak: 'break-word',
              whiteSpace: 'pre-wrap',
            }}
          >
            {comment.text}
          </Typography>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box
      sx={{
        width: 380,
        borderLeft: '1px solid rgba(32, 101, 209, 0.1)',
        background: 'linear-gradient(135deg, #fafbfc 0%, #f8fafc 100%)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      {/* Comments List */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: 2,
          '&::-webkit-scrollbar': {
            width: 6,
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'rgba(32, 101, 209, 0.1)',
            borderRadius: 3,
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(32, 101, 209, 0.3)',
            borderRadius: 3,
            '&:hover': {
              backgroundColor: 'rgba(32, 101, 209, 0.5)',
            },
          },
        }}
      >
        {comments.length === 0 ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="200px"
            color="text.secondary"
          >
            <Typography variant="body2" textAlign="center" fontSize="0.85rem">
              No comments yet
            </Typography>
            <Typography variant="caption" textAlign="center" mt={0.5} fontSize="0.7rem">
              Be the first to share your thoughts!
            </Typography>
          </Box>
        ) : (
          <Stack spacing={0}>
            {comments.map((comment) => (
              <CommentCard key={comment.id} comment={comment} />
            ))}
          </Stack>
        )}
      </Box>

      {/* Comment Input */}
      <Box sx={{ p: 2 }}>
        <Card
          sx={{
            background: 'rgba(32, 101, 209, 0.03)',
            border: '1px solid rgba(32, 101, 209, 0.1)',
            borderRadius: 2,
          }}
        >
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <TextField
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Share your thoughts..."
              multiline
              minRows={2}
              maxRows={4}
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '0.85rem',
                  borderRadius: '8px',
                  '& fieldset': {
                    borderColor: 'rgba(32, 101, 209, 0.2)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                  },
                },
                '& .MuiInputBase-input::placeholder': {
                  fontSize: '0.85rem',
                  opacity: 0.7,
                },
              }}
            />
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={1.5}>
              <Typography variant="caption" color="text.secondary" fontSize="0.7rem">
                Press Ctrl+Enter to send
              </Typography>
              <Button
                variant="contained"
                onClick={handleAddComment}
                disabled={!commentText.trim()}
                startIcon={<Send />}
                sx={{
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  px: 2.5,
                  py: 1,
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
                  },
                  '&:disabled': {
                    background: '#e5e7eb',
                    color: '#9ca3af',
                    boxShadow: 'none',
                    transform: 'none',
                  },
                }}
              >
                Comment
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default MediaCommentsSide;
