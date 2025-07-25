import { useState, useCallback } from 'react';
import {
  Box,
  Collapse,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  CircularProgress,
  Fade,
} from '@mui/material';
import {
  ExpandMore,
  ChevronRight,
  CloudUpload,
  Description,
  TableChart,
  Slideshow,
  InsertDriveFile,
  Image,
  Movie,
  Audiotrack,
  PictureAsPdf,
  Delete as DeleteIcon,
  CloudDone,
  DeleteSweep,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { mutate } from 'swr';
import FileViewerModal from './FileViewer';
import useMedia from '../hooks/useMedia';
import { User } from '@modules/users/defs/types';
import { FileItem, MediaPostAssignment } from '../defs/types';

interface FileSectionProps {
  title: string;
  files: FileItem[];
  onFilesAdd: (files: FileList) => void;
  isExpanded: boolean;
  onToggle: () => void;
  onFileDelete?: (fileId: string) => void;
  getFileUrl?: (fileId: string) => string | Promise<string>;
  showUploadInput?: boolean;
  postId?: number | null;
  assignments?: MediaPostAssignment[];
  user?: User;
  suspendedMessage?: string;
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

const getFileIcon = (mimeType: string) => {
  if (mimeType.startsWith('image/')) {
    return <Image sx={{ fontSize: 20 }} />;
  }
  if (mimeType.startsWith('video/')) {
    return <Movie sx={{ fontSize: 20 }} />;
  }
  if (mimeType.startsWith('audio/')) {
    return <Audiotrack sx={{ fontSize: 20 }} />;
  }
  if (mimeType === 'application/pdf') {
    return <PictureAsPdf sx={{ fontSize: 20 }} />;
  }
  if (
    mimeType === 'application/msword' ||
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    return <Description sx={{ fontSize: 20 }} />;
  }
  if (
    mimeType === 'application/vnd.ms-excel' ||
    mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ) {
    return <TableChart sx={{ fontSize: 20 }} />;
  }
  if (
    mimeType === 'application/vnd.ms-powerpoint' ||
    mimeType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ) {
    return <Slideshow sx={{ fontSize: 20 }} />;
  }
  return <InsertDriveFile sx={{ fontSize: 20 }} />;
};

// Check if file type can be previewed
const canPreviewFile = (mimeType: string): boolean => {
  return (
    mimeType.startsWith('image/') ||
    mimeType.startsWith('video/') ||
    mimeType.startsWith('audio/') ||
    mimeType === 'application/pdf'
  );
};

const LoadingOverlay = ({
  isUploading,
  isDeleting,
}: {
  isUploading?: boolean;
  isDeleting?: boolean;
}) => {
  const theme = useTheme();

  if (!isUploading && !isDeleting) {
    return null;
  }

  return (
    <Fade in={isUploading || isDeleting}>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: isDeleting ? 'rgba(211, 47, 47, 0.05)' : 'rgba(32, 101, 209, 0.05)',
          backdropFilter: 'blur(2px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1,
          borderRadius: '4px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            px: 2,
            py: 1,
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          }}
        >
          {isUploading && (
            <>
              <CircularProgress size={16} sx={{ color: theme.palette.primary.main }} />
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 500,
                  color: theme.palette.primary.main,
                }}
              >
                Uploading...
              </Typography>
            </>
          )}
          {isDeleting && (
            <>
              <CircularProgress size={16} sx={{ color: theme.palette.error.main }} />
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 500,
                  color: theme.palette.error.main,
                }}
              >
                Deleting...
              </Typography>
            </>
          )}
        </Box>
      </Box>
    </Fade>
  );
};

const MediaFileSection = ({
  title,
  files,
  onFilesAdd,
  isExpanded,
  onToggle,
  onFileDelete,
  getFileUrl,
  showUploadInput = true,
  postId,
  assignments = [],
  user,
  suspendedMessage,
}: FileSectionProps) => {
  const theme = useTheme();
  const [isDragOver, setIsDragOver] = useState(false);

  // File viewer modal state
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{
    id: string;
    name: string;
    size: number;
    type: string;
    url?: string;
  } | null>(null);

  const { requestReview } = useMedia();
  const [reviewLoading, setReviewLoading] = useState(false);

  // Only editors can see the Request Review button
  const isEditor = !!(
    user &&
    user.userType === 'CREATOR' &&
    assignments.some((a) => a.role === 'EDITOR' && a.creator && a.creator.userId === user.id)
  );

  // For reference section, only client/owner can upload
  const canShowUploadInput =
    (title === 'Reference Assets' && user?.userType === 'CLIENT') ||
    (title === 'Draft Files' && isEditor);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (e.dataTransfer.files) {
        onFilesAdd(e.dataTransfer.files);
      }
    },
    [onFilesAdd]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        onFilesAdd(e.target.files);
      }
    },
    [onFilesAdd]
  );

  // Handle file preview
  const handleFileView = async (file: FileItem) => {
    if (!canPreviewFile(file.type)) {
      return; // Don't open viewer for unsupported types
    }

    let fileUrl = '';

    if (getFileUrl) {
      try {
        const url = await getFileUrl(file.id);
        fileUrl = typeof url === 'string' ? url : '';
      } catch (error) {
        console.error('Failed to get file URL:', error);
        return;
      }
    }

    setSelectedFile({
      id: file.id,
      name: file.name,
      size: file.size,
      type: file.type,
      url: fileUrl,
    });
    setViewerOpen(true);
  };

  const handleCloseViewer = () => {
    setViewerOpen(false);
    setSelectedFile(null);
  };

  const handleRequestReview = async () => {
    if (!postId) {
      return;
    }
    setReviewLoading(true);
    try {
      const res = await requestReview(postId, { displaySuccess: true, displayProgress: true });
      // Refresh the assets and post data to update the UI
      await mutate(['/media_posts', postId, 'assets']);
      await mutate(['/media_posts', postId]);
    } catch (e) {
      console.log('error', e);
    } finally {
      setReviewLoading(false);
    }
  };

  return (
    <>
      <Box sx={{ mb: 1 }}>
        {/* Section Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 1.5,
            cursor: 'pointer',
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(32, 101, 209, 0.08)',
            transition: 'all 0.2s ease',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.8)',
              borderColor: 'rgba(32, 101, 209, 0.15)',
            },
          }}
          onClick={onToggle}
        >
          <IconButton size="small" sx={{ p: 0, mr: 1 }}>
            {isExpanded ? (
              <ExpandMore sx={{ fontSize: 18 }} />
            ) : (
              <ChevronRight sx={{ fontSize: 18 }} />
            )}
          </IconButton>
          <Typography
            variant="subtitle2"
            sx={{
              flex: 1,
              fontWeight: 600,
              color: theme.palette.text.primary,
            }}
          >
            {title}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {title === 'Draft Files' && files.length > 0 && postId && isEditor && (
              <Button
                variant="contained"
                size="small"
                sx={{ textTransform: 'none', fontWeight: 500 }}
                onClick={handleRequestReview}
                disabled={reviewLoading}
              >
                {reviewLoading ? (
                  <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center' }}>
                    <CircularProgress size={16} sx={{ mr: 1 }} />
                    Request Review
                  </Box>
                ) : (
                  'Request Review'
                )}
              </Button>
            )}

            <Typography
              variant="caption"
              sx={{
                px: 1.5,
                py: 0.5,
                backgroundColor: 'rgba(32, 101, 209, 0.1)',
                borderRadius: '12px',
                color: theme.palette.primary.main,
                fontWeight: 500,
              }}
            >
              {files.length}
            </Typography>
          </Box>
        </Box>

        {/* Section Content */}
        <Collapse in={isExpanded}>
          <Box
            sx={{
              mt: 1,
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(20px)',
              borderRadius: '12px',
              border: '1px solid rgba(32, 101, 209, 0.08)',
              overflow: 'hidden',
            }}
          >
            {/* Upload Area */}
            {showUploadInput !== false && canShowUploadInput && (
              <Box
                sx={{
                  p: 2,
                  borderBottom: files.length > 0 ? '1px solid rgba(32, 101, 209, 0.08)' : 'none',
                  background: isDragOver ? 'rgba(32, 101, 209, 0.05)' : 'rgba(255, 255, 255, 0.5)',
                  transition: 'background-color 0.2s ease',
                }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1.5,
                    p: 2,
                    border: '2px dashed',
                    borderColor: isDragOver
                      ? theme.palette.primary.main
                      : 'rgba(32, 101, 209, 0.2)',
                    borderRadius: '8px',
                    background: isDragOver ? 'rgba(32, 101, 209, 0.02)' : 'transparent',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <CloudUpload
                    sx={{
                      fontSize: 32,
                      color: isDragOver ? theme.palette.primary.main : 'rgba(32, 101, 209, 0.6)',
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.text.secondary,
                      textAlign: 'center',
                      fontWeight: 500,
                    }}
                  >
                    Drop files here or
                  </Typography>
                  <Button
                    variant="outlined"
                    component="label"
                    size="small"
                    sx={{
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontWeight: 500,
                    }}
                  >
                    Browse Files
                    <input type="file" hidden multiple onChange={handleFileSelect} />
                  </Button>
                </Box>
              </Box>
            )}
            {/* Suspended message if drafts are suspended */}
            {showUploadInput === false &&
              suspendedMessage &&
              title === 'Draft Files' &&
              isEditor && (
                <Box
                  sx={{
                    p: 2,
                    borderBottom: files.length > 0 ? '1px solid rgba(32, 101, 209, 0.08)' : 'none',
                    background: 'rgba(255, 255, 255, 0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.warning.main,
                      fontWeight: 600,
                      textAlign: 'center',
                    }}
                  >
                    {suspendedMessage}
                  </Typography>
                </Box>
              )}

            {/* Files List */}
            {files.length > 0 && (
              <Box
                sx={{
                  maxHeight: '200px',
                  overflowY: 'auto',
                  '&::-webkit-scrollbar': {
                    width: '6px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: 'rgba(0, 0, 0, 0.05)',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: 'rgba(32, 101, 209, 0.3)',
                    borderRadius: '3px',
                  },
                }}
              >
                <List sx={{ p: 0 }}>
                  {files.map((file) => (
                    <ListItem
                      key={file.id}
                      sx={{
                        py: 1,
                        px: 2,
                        borderBottom: '1px solid rgba(32, 101, 209, 0.05)',
                        '&:last-child': {
                          borderBottom: 'none',
                        },
                        '&:hover': {
                          background: 'rgba(32, 101, 209, 0.03)',
                        },
                        position: 'relative',
                        opacity: file.isUploading || file.isDeleting ? 0.7 : 1,
                        transition: 'opacity 0.2s ease',
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        {file.isUploading && (
                          <CloudDone sx={{ fontSize: 20, color: theme.palette.primary.main }} />
                        )}
                        {!file.isUploading && file.isDeleting ? (
                          <DeleteSweep sx={{ fontSize: 20, color: theme.palette.error.main }} />
                        ) : (
                          getFileIcon(file.type)
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 500,
                              color: theme.palette.text.primary,
                              wordBreak: 'break-word',
                            }}
                          >
                            {file.name}
                          </Typography>
                        }
                        secondary={
                          <Typography
                            variant="caption"
                            sx={{
                              color: theme.palette.text.secondary,
                            }}
                          >
                            {formatFileSize(file.size)}
                          </Typography>
                        }
                      />

                      {/* Action buttons */}
                      <Box sx={{ display: 'flex', gap: 0.5, ml: 1 }}>
                        {/* View button - only show for previewable files */}
                        {!file.isUploading && canPreviewFile(file.type) && (
                          <IconButton
                            size="small"
                            sx={{
                              color: theme.palette.primary.main,
                              opacity: file.isDeleting ? 0.3 : 1,
                            }}
                            onClick={() => handleFileView(file)}
                            disabled={file.isDeleting}
                            title="Preview file"
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        )}

                        {/* Delete button */}
                        {!file.isUploading && file.canDelete && (
                          <IconButton
                            size="small"
                            sx={{
                              color: 'error.main',
                              opacity: file.isDeleting ? 0.3 : 1,
                            }}
                            onClick={() => onFileDelete && onFileDelete(file.id)}
                            disabled={file.isDeleting}
                            title="Delete file"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Box>

                      {/* Loading Overlay */}
                      <LoadingOverlay isUploading={file.isUploading} isDeleting={file.isDeleting} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Box>
        </Collapse>
      </Box>

      {/* File Viewer Modal */}
      <FileViewerModal open={viewerOpen} onClose={handleCloseViewer} file={selectedFile} />
    </>
  );
};

export default MediaFileSection;
