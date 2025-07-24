import React, { useState, useEffect } from 'react';
import {
  Dialog,
  Box,
  Typography,
  IconButton,
  Chip,
  TextField,
  Stack,
  Divider,
  Menu,
  MenuItem,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { MediaPost, MediaPostAsset, MediaPostReview, MediaPostComment } from '../../../defs/types';
import MediaCommentsSide from './MediaCommentsSide';
import MediaReviews from './MediaReviews';
import MediaAssets from './MediaAssets';
import dayjs from 'dayjs';
import MediaAssignees from './MediaAssignees';
import useSWR, { mutate } from 'swr';
import { useTranslation } from 'react-i18next';
import useMedia from '../../../hooks/useMedia';
import useAuth from '@modules/auth/hooks/api/useAuth';
import { MoreHoriz } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';

const PRIORITY_CONFIG = {
  HIGH: { color: '#ff4757', bg: '#fff5f5', icon: '🔥' },
  MED: { color: '#ffa502', bg: '#fffbf0', icon: '⚡' },
  LOW: { color: '#26de81', bg: '#f0fff4', icon: '📝' },
};

const STATUS_CONFIG = {
  BACKLOG: { color: '#747d8c', bg: '#f8f9fa', label: 'Backlog' },
  IN_PROGRESS: { color: '#5352ed', bg: '#f4f3ff', label: 'In Progress' },
  UNDER_REVIEW: { color: '#ff6348', bg: '#fff5f4', label: 'Under Review' },
  APPROVED: { color: '#26de81', bg: '#f0fff4', label: 'Approved' },
  ARCHIVED: { color: '#57606f', bg: '#f1f2f6', label: 'Archived' },
};

// Cache key helper for media post data
const mediaPostCacheKey = (id: number) => ['/media_posts', id];

interface MediaPostDetailsModalProps {
  open: boolean;
  onClose: () => void;
  mediaPost: MediaPost | null;
  onOptimisticDelete?: (postId: number) => void;
}

const MediaPostDetailsModal = ({
  open,
  onClose,
  mediaPost: propMediaPost,
  onOptimisticDelete,
}: MediaPostDetailsModalProps) => {
  const { t } = useTranslation(['media', 'common']);
  const { readOne, addComment, deleteOne } = useMedia();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [titleValue, setTitleValue] = useState('');
  const [descriptionValue, setDescriptionValue] = useState('');
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { user } = useAuth();

  if (!user) {
    return null;
  }

  // Use SWR directly to get live media post data
  const { data: mediaPostData, isLoading } = useSWR(
    propMediaPost ? mediaPostCacheKey(propMediaPost.id) : null,
    () => readOne(propMediaPost!.id)
  );

  // Use SWR data if available, fallback to prop
  const currentMediaPost = mediaPostData?.data?.item || propMediaPost;

  useEffect(() => {
    setTitleValue(currentMediaPost?.title || '');
    setDescriptionValue(currentMediaPost?.description || '');
  }, [currentMediaPost]);

  useEffect(() => {
    setMenuAnchorEl(null);
  }, [open, currentMediaPost]);

  if (!currentMediaPost) {
    return null;
  }

  // Map assignments to assignees for UI
  const assignees =
    currentMediaPost.assignments?.map((a: any, idx: number) => {
      const firstName = a.creator?.user?.firstName ?? '';
      const lastName = a.creator?.user?.lastName ?? '';
      const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'U';
      return {
        id: a.creatorId ?? idx,
        name: `${firstName} ${lastName}`.trim() || 'Unknown',
        avatar: a.creator?.user?.profile?.profileImage ?? '',
        initials,
        role: a.role,
      };
    }) ?? [];

  // Use real assets and reviews
  const assets: MediaPostAsset[] = currentMediaPost.assets || [];
  const reviews: MediaPostReview[] = currentMediaPost.reviews || [];

  // Map comments for comments sidebar
  const comments: (MediaPostComment & {
    avatar: string;
    authorName: string;
    text: string;
    date: string;
    time: string;
  })[] = (currentMediaPost.comments || []).map((c: any) => {
    const firstName = c.author?.firstName ?? '';
    const lastName = c.author?.lastName ?? '';
    const initials = `${firstName.charAt(0) ?? ''}${lastName.charAt(0) ?? ''}`.toUpperCase() || 'U';

    return {
      ...c,
      authorName: `${firstName} ${lastName}`.trim() || 'Unknown',
      avatar: c.author?.profile?.profileImage ?? initials,
      text: c.body,
      date: c.createdAt ? c.createdAt.slice(0, 10) : '',
      time: c.createdAt
        ? new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : '',
    };
  });

  const handleAddComment = async (body: string) => {
    if (!body.trim()) {
      return;
    }

    try {
      const response = await addComment(currentMediaPost.id, {
        authorId: user.id,
        body,
      });

      if (response.success) {
        mutate(mediaPostCacheKey(currentMediaPost.id));
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const priorityConfig = PRIORITY_CONFIG[currentMediaPost.priority];
  const statusConfig = STATUS_CONFIG[currentMediaPost.status];

  // Dropdown menu handlers
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleDelete = async () => {
    if (onOptimisticDelete && currentMediaPost) {
      onOptimisticDelete(currentMediaPost.id);
    }
    onClose();
    await deleteOne(currentMediaPost.id);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          background: '#ffffff',
          maxHeight: '90vh',
          height: '850px',
          width: '1300px',
          maxWidth: '1300px',
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          py: 2,
          borderBottom: '1px solid #e5e7eb',
          background: '#fafbfc',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip
            label={statusConfig.label}
            size="small"
            sx={{
              backgroundColor: statusConfig.bg,
              color: statusConfig.color,
              fontWeight: 600,
              fontSize: '0.75rem',
              height: '24px',
              border: `1px solid ${statusConfig.color}20`,
            }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
            Created {dayjs(currentMediaPost.createdAt).fromNow()}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton size="small" sx={{ color: 'grey.500' }} onClick={handleMenuOpen}>
            <MoreHoriz fontSize="small" />
          </IconButton>
          <Menu
            anchorEl={menuAnchorEl}
            open={Boolean(menuAnchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
              <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete
            </MenuItem>
          </Menu>
          <IconButton onClick={onClose} size="small" sx={{ color: 'grey.500' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', height: 'calc(100% - 65px)' }}>
        {/* Main Content */}
        <Box
          sx={{
            flex: 1,
            p: 4,
            overflowY: 'auto',
            background: '#ffffff',
          }}
        >
          {/* Title Section */}
          <Box sx={{ mb: 4 }}>
            {isEditingTitle ? (
              <TextField
                value={titleValue}
                onChange={(e) => setTitleValue(e.target.value)}
                onBlur={() => setIsEditingTitle(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
                variant="standard"
                sx={{
                  '& .MuiInput-root': {
                    fontSize: '1.75rem',
                    fontWeight: 700,
                    '&:before': { borderBottom: 'none' },
                    '&:after': { borderBottom: '2px solid primary.main' },
                  },
                }}
                autoFocus
                fullWidth
                multiline
                minRows={1}
              />
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontSize: '1.75rem',
                    fontWeight: 700,
                    color: '#1f2937',
                    cursor: 'pointer',
                    wordBreak: 'break-word',
                    whiteSpace: 'pre-line',
                    '&:hover': { color: 'primary.main' },
                  }}
                  onClick={() => setIsEditingTitle(true)}
                >
                  {titleValue}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => setIsEditingTitle(true)}
                  sx={{
                    opacity: 0.7,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      opacity: 1,
                      background: (theme) => theme.palette.primary.main,
                      color: 'white',
                    },
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
          </Box>

          {/* Property Grid */}
          <Box sx={{ mb: 4 }}>
            <Stack spacing={4}>
              {/* Priority & Due Date Row */}
              <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {/* Priority Card */}
                <Box
                  sx={{
                    minWidth: 220,
                    p: 3,
                    borderRadius: '12px',
                    background: `linear-gradient(135deg, ${priorityConfig.bg} 0%, ${priorityConfig.bg}80 100%)`,
                    border: `2px solid ${priorityConfig.color}20`,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <Box sx={{ position: 'absolute', top: 10, right: 10, fontSize: '1.5rem' }}>
                    {priorityConfig.icon}
                  </Box>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      color: priorityConfig.color,
                      letterSpacing: '0.5px',
                      mb: 1,
                    }}
                  >
                    Priority Level
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      color: priorityConfig.color,
                      textTransform: 'capitalize',
                    }}
                  >
                    {currentMediaPost.priority.toLowerCase()} Priority
                  </Typography>
                </Box>

                {/* Due Date Card */}
                <Box
                  sx={{
                    minWidth: 220,
                    p: 3,
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                    border: '2px solid #e2e8f020',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
                    <CalendarTodayIcon sx={{ fontSize: '20px', color: '#64748b' }} />
                  </Box>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      color: '#64748b',
                      letterSpacing: '0.5px',
                      mb: 1,
                    }}
                  >
                    Due Date
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      color: '#1e293b',
                    }}
                  >
                    {currentMediaPost.dueDate
                      ? dayjs(currentMediaPost.dueDate).format('MMMM D, YYYY')
                      : 'No deadline set'}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Assignees Card */}

              <MediaAssignees
                assignees={assignees}
                projectCreators={currentMediaPost.project?.creators || []}
                postId={currentMediaPost.id}
              />
            </Stack>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Description */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      color: '#1e293b',
                    }}
                  >
                    Description
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => setIsEditingDescription(true)}
                    sx={{
                      opacity: 0.7,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        opacity: 1,
                        background: (theme) => theme.palette.primary.main,
                        color: 'white',
                      },
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: '0.8rem',
                    color: '#64748b',
                    fontWeight: 500,
                  }}
                >
                  Project details and requirements
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                p: 4,
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                border: '2px solid #e2e8f020',
                minHeight: '120px',
                transition: 'all 0.2s ease',
                '&:hover': {
                  border: '2px solid #64748b30',
                },
              }}
            >
              {isEditingDescription ? (
                <TextField
                  value={descriptionValue}
                  onChange={(e) => setDescriptionValue(e.target.value)}
                  onBlur={() => setIsEditingDescription(false)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.ctrlKey) {
                      setIsEditingDescription(false);
                    }
                  }}
                  multiline
                  minRows={4}
                  fullWidth
                  variant="standard"
                  placeholder="Add a description..."
                  sx={{
                    '& .MuiInput-root': {
                      fontSize: '0.95rem',
                      lineHeight: 1.6,
                      '&:before': { borderBottom: 'none' },
                      '&:after': { borderBottom: '2px solid primary.main' },
                    },
                  }}
                  autoFocus
                />
              ) : (
                <Typography
                  variant="body1"
                  onClick={() => setIsEditingDescription(true)}
                  sx={{
                    lineHeight: 1.7,
                    fontSize: '0.95rem',
                    color: descriptionValue ? '#374151' : '#9ca3af',
                    cursor: 'pointer',
                    fontStyle: descriptionValue ? 'normal' : 'italic',
                    transition: 'color 0.2s ease',
                    wordBreak: 'break-word',
                    whiteSpace: 'pre-line',
                    '&:hover': { color: 'primary.main' },
                  }}
                >
                  {descriptionValue || 'Click to add a description...'}
                </Typography>
              )}
            </Box>
          </Box>

          {/* Assets */}
          {assets.length > 0 && <MediaAssets assets={assets} />}

          {/* Reviews */}
          {reviews.length > 0 && <MediaReviews reviews={reviews} />}
        </Box>

        {/* Comments Sidebar */}
        <MediaCommentsSide comments={comments} onAddComment={handleAddComment} />
      </Box>
    </Dialog>
  );
};

export default MediaPostDetailsModal;
