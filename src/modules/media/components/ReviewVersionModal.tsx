import React, { useState } from 'react';
import {
  Dialog,
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  Chip,
  Card,
  Fade,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Close as CloseIcon,
  Image as ImageIcon,
  VideoFile as VideoIcon,
  AudioFile as AudioIcon,
  PictureAsPdf as PdfIcon,
  CheckCircle as ApproveIcon,
  Edit as RevisionIcon,
  FilePresent as FileIcon,
} from '@mui/icons-material';
import { mutate } from 'swr';
import useMedia from '../hooks/useMedia';
import { MEDIA_POST_REVIEW_DECISION } from '../defs/types';
import { useTranslation } from 'react-i18next';
import ReusableFileViewer from './ReusableFileViewer';

interface ReviewVersionModalProps {
  open: boolean;
  onClose: () => void;
  version: {
    id: string;
    number: number;
  };
  files: Array<{
    id: string;
    name: string;
    size: number;
    type: string;
    url?: string;
  }>;
  postId?: number;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) {
    return '0 B';
  }
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / k ** i).toFixed(1)) + ' ' + sizes[i];
};

const getFileIcon = (type: string) => {
  if (type.startsWith('image/')) {
    return <ImageIcon sx={{ fontSize: 20 }} />;
  }
  if (type.startsWith('video/')) {
    return <VideoIcon sx={{ fontSize: 20 }} />;
  }
  if (type.startsWith('audio/')) {
    return <AudioIcon sx={{ fontSize: 20 }} />;
  }
  if (type === 'application/pdf') {
    return <PdfIcon sx={{ fontSize: 20 }} />;
  }
  return <FileIcon sx={{ fontSize: 20 }} />;
};

const getFileTypeColor = (type: string) => {
  if (type.startsWith('image/')) {
    return '#10B981';
  }
  if (type.startsWith('video/')) {
    return '#3B82F6';
  }
  if (type.startsWith('audio/')) {
    return '#8B5CF6';
  }
  if (type === 'application/pdf') {
    return '#EF4444';
  }
  return '#6B7280';
};

const FilePreview = ({
  file,
  isSelected,
  onClick,
}: {
  file: ReviewVersionModalProps['files'][0];
  isSelected: boolean;
  onClick: () => void;
}) => {
  const theme = useTheme();
  const typeColor = getFileTypeColor(file.type);

  return (
    <Card
      sx={{
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        border: isSelected ? `2px solid ${theme.palette.primary.main}` : '2px solid transparent',
        boxShadow: isSelected
          ? `0 2px 4px ${alpha(theme.palette.primary.main, 0.25)}`
          : '0 2px 8px rgba(0,0,0,0.08)',
        '&:hover': {
          boxShadow: `0 2px 10px ${alpha(theme.palette.primary.main, 0.15)}`,
        },
        borderRadius: 1,
        overflow: 'hidden',
        background: `linear-gradient(135deg, ${alpha(typeColor, 0.05)}, ${alpha(typeColor, 0.02)})`,
      }}
      onClick={onClick}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          sx={{
            p: 1.5,
            borderRadius: 1,
            background: `linear-gradient(135deg, ${alpha(typeColor, 0.1)}, ${alpha(
              typeColor,
              0.05
            )})`,
            color: typeColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {getFileIcon(file.type)}
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              mb: 0.5,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {file.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              label={file.type.split('/')[1]?.toUpperCase() || 'FILE'}
              size="small"
              sx={{
                height: 20,
                fontSize: '0.7rem',
                fontWeight: 600,
                backgroundColor: alpha(typeColor, 0.1),
                color: typeColor,
                border: `1px solid ${alpha(typeColor, 0.2)}`,
              }}
            />
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {formatFileSize(file.size)}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

const ReviewVersionModal = ({ open, onClose, version, files, postId }: ReviewVersionModalProps) => {
  const theme = useTheme();
  const { reviewVersion } = useMedia();
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);

  const handleApprove = async () => {
    if (!postId) {
      return;
    }
    setSubmitting(true);
    try {
      await reviewVersion(postId, {
        versionId: Number(version.id),
        decision: MEDIA_POST_REVIEW_DECISION.APPROVED,
        comment: comment || undefined,
      });
      // Refresh the assets, post data, and board data to update the UI
      await mutate(['/media_posts', postId, 'assets']);
      await mutate(['/media_posts', postId]);
      await mutate('/media_posts');
    } catch (error) {
      console.error('Error approving version:', error);
    } finally {
      setSubmitting(false);
      onClose();
    }
  };

  const handleRequestRevisions = async () => {
    console.log(postId, comment, version.id);
    if (!postId || !comment) {
      return;
    }
    setSubmitting(true);
    try {
      await reviewVersion(postId, {
        versionId: Number(version.id),
        decision: MEDIA_POST_REVIEW_DECISION.REVISION_REQUESTED,
        comment,
      });
      // Refresh the assets, post data, and board data to update the UI
      await mutate(['/media_posts', postId, 'assets']);
      await mutate(['/media_posts', postId]);
      await mutate('/media_posts');
    } catch (error) {
      console.error('Error requesting revisions:', error);
    } finally {
      setSubmitting(false);
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          background: `linear-gradient(135deg, ${alpha(
            theme.palette.background.paper,
            0.98
          )}, ${alpha(theme.palette.background.default, 0.95)})`,
          backdropFilter: 'blur(20px)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.15)',
          overflow: 'hidden',
          height: '90vh',
          maxHeight: '900px',
        },
      }}
    >
      <Box sx={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box
          sx={{
            p: 3,
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(
              theme.palette.primary.main,
              0.05
            )})`,
            borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            position: 'relative',
          }}
        >
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              background: alpha(theme.palette.background.paper, 0.8),
              '&:hover': {
                background: theme.palette.background.paper,
                transform: 'scale(1.05)',
              },
              transition: 'all 0.2s ease',
            }}
            size="small"
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            Review Version {version.number}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            {files.length} file{files.length !== 1 ? 's' : ''} to review
          </Typography>
        </Box>

        <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* File List Sidebar */}
          <Box
            sx={{
              width: 380,
              borderRight: `1px solid ${alpha(theme.palette.grey[300], 0.3)}`,
              background: alpha(theme.palette.background.paper, 0.5),
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box sx={{ p: 3, borderBottom: `1px solid ${alpha(theme.palette.grey[300], 0.3)}` }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                Files ({files.length})
              </Typography>
            </Box>
            <Box
              sx={{
                flex: 1,
                p: 2,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
              }}
            >
              {files.map((file, index) => (
                <Fade in key={file.id} timeout={300 + index * 100}>
                  <Box>
                    <FilePreview
                      file={file}
                      isSelected={selectedFileIndex === index}
                      onClick={() => setSelectedFileIndex(index)}
                    />
                  </Box>
                </Fade>
              ))}
            </Box>
          </Box>

          {/* Main Content Area */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {/* Preview Area */}
            <Box sx={{ flex: 1, p: 3, overflow: 'hidden' }}>
              <Fade in key={selectedFileIndex} timeout={300}>
                <Box sx={{ height: '100%' }}>
                  <ReusableFileViewer file={files[selectedFileIndex]} showControls height="100%" />
                </Box>
              </Fade>
            </Box>

            {/* Review Section */}
            <Box
              sx={{
                borderTop: `1px solid ${alpha(theme.palette.grey[300], 0.3)}`,
                background: alpha(theme.palette.background.paper, 0.8),
                p: 3,
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Review Comments
              </Typography>
              <TextField
                placeholder="Add your review comments here... (Required for requesting revisions)"
                multiline
                minRows={3}
                maxRows={4}
                fullWidth
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                variant="outlined"
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    background: theme.palette.background.paper,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.1)}`,
                    },
                    '&.Mui-focused': {
                      boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}`,
                    },
                  },
                }}
              />

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  startIcon={<ApproveIcon />}
                  onClick={handleApprove}
                  disabled={submitting}
                  sx={{
                    minWidth: 140,
                    height: 48,
                    fontWeight: 600,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #10B981, #059669)',
                    boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #059669, #047857)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)',
                    },
                    '&:disabled': {
                      background: alpha(theme.palette.action.disabled, 0.1),
                    },
                  }}
                >
                  Approve
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<RevisionIcon />}
                  onClick={handleRequestRevisions}
                  disabled={!comment || submitting}
                  sx={{
                    minWidth: 180,
                    height: 48,
                    fontWeight: 600,
                    borderRadius: 2,
                    borderColor: '#F59E0B',
                    color: '#F59E0B',
                    background: alpha('#F59E0B', 0.05),
                    '&:hover': {
                      borderColor: '#D97706',
                      background: alpha('#F59E0B', 0.1),
                      transform: 'translateY(-1px)',
                      boxShadow: '0 6px 20px rgba(245, 158, 11, 0.2)',
                    },
                    '&:disabled': {
                      borderColor: alpha(theme.palette.action.disabled, 0.3),
                      color: alpha(theme.palette.action.disabled, 0.5),
                    },
                  }}
                >
                  Request Revisions
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
};

export default ReviewVersionModal;
