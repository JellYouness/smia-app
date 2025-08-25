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
  Alert,
  AlertTitle,
  Chip,
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
  VideoFile as VideoIcon,
  AudioFile as AudioIcon,
  PictureAsPdf,
  FilePresent as FileIcon,
  Delete as DeleteIcon,
  CloudDone,
  DeleteSweep,
  Visibility as VisibilityIcon,
  Warning as WarningIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { mutate } from 'swr';
import FileViewerModal from './FileViewerModal';
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

interface UnsupportedFile {
  name: string;
  type: string;
  size: number;
}

const SUPPORTED_FILE_TYPES = ['image/', 'video/', 'audio/', 'application/pdf'];

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
    return <VideoIcon sx={{ fontSize: 20 }} />;
  }
  if (mimeType.startsWith('audio/')) {
    return <AudioIcon sx={{ fontSize: 20 }} />;
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
    mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    mimeType === 'text/csv'
  ) {
    return <TableChart sx={{ fontSize: 20 }} />;
  }
  if (
    mimeType === 'application/vnd.ms-powerpoint' ||
    mimeType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ) {
    return <Slideshow sx={{ fontSize: 20 }} />;
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

// Check if file type can be previewed
const canPreviewFile = (mimeType: string): boolean => {
  return (
    mimeType.startsWith('image/') ||
    mimeType.startsWith('video/') ||
    mimeType.startsWith('audio/') ||
    mimeType === 'application/pdf'
  );
};

// Check if file type is supported
const isFileTypeSupported = (mimeType: string): boolean => {
  return SUPPORTED_FILE_TYPES.some((supportedType) => mimeType.startsWith(supportedType));
};

// Get friendly file type name
const getFriendlyFileType = (mimeType: string): string => {
  if (mimeType.startsWith('image/')) {
    return 'Image';
  }
  if (mimeType.startsWith('video/')) {
    return 'Video';
  }
  if (mimeType.startsWith('audio/')) {
    return 'Audio';
  }
  if (mimeType === 'application/pdf') {
    return 'PDF';
  }
  if (mimeType === 'text/csv') {
    return 'CSV';
  }
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) {
    return 'Excel';
  }
  if (mimeType.includes('word') || mimeType.includes('document')) {
    return 'Word Document';
  }
  if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) {
    return 'PowerPoint';
  }
  if (mimeType.startsWith('text/')) {
    return 'Text File';
  }
  return 'File';
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

const UnsupportedFilesAlert = ({
  unsupportedFiles,
  onDismiss,
}: {
  unsupportedFiles: UnsupportedFile[];
  onDismiss: () => void;
}) => {
  const theme = useTheme();

  if (unsupportedFiles.length === 0) {
    return null;
  }

  return (
    <Fade in>
      <Alert
        severity="warning"
        sx={{
          mb: 2,
          borderRadius: '12px',
          border: '1px solid rgba(237, 108, 2, 0.2)',
          background:
            'linear-gradient(135deg, rgba(255, 243, 224, 0.8) 0%, rgba(255, 248, 240, 0.9) 100%)',
          backdropFilter: 'blur(10px)',
          '& .MuiAlert-icon': {
            color: theme.palette.warning.main,
          },
        }}
        action={
          <IconButton size="small" onClick={onDismiss} sx={{ color: theme.palette.warning.main }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
        icon={<WarningIcon />}
      >
        <AlertTitle sx={{ fontWeight: 600, mb: 1 }}>
          {unsupportedFiles.length === 1 ? 'Unsupported File Type' : 'Some Files Not Supported'}
        </AlertTitle>

        <Typography variant="body2" sx={{ mb: 2, color: theme.palette.warning.dark }}>
          {unsupportedFiles.length === 1
            ? 'The following file type is not supported:'
            : 'The following file types are not supported:'}
        </Typography>

        <Box sx={{ mb: 2 }}>
          {unsupportedFiles.map((file, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: 1,
                p: 1,
                background: 'rgba(255, 255, 255, 0.7)',
                borderRadius: '8px',
                border: '1px solid rgba(237, 108, 2, 0.1)',
              }}
            >
              {getFileIcon(file.type)}
              <Box sx={{ flex: 1, minWidth: 0 }}>
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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                  <Chip
                    label={getFriendlyFileType(file.type)}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '0.7rem',
                      background: 'rgba(237, 108, 2, 0.1)',
                      color: theme.palette.warning.dark,
                      fontWeight: 500,
                    }}
                  />
                  <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                    {formatFileSize(file.size)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Alert>
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
  const [unsupportedFiles, setUnsupportedFiles] = useState<UnsupportedFile[]>([]);

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

  const isEditor = !!(
    user &&
    user.userType === 'CREATOR' &&
    assignments.some((a) => a.role === 'EDITOR' && a.creator && a.creator.userId === user.id)
  );

  const canShowUploadInput =
    (title === 'Reference Assets' && user?.userType === 'CLIENT') ||
    (title === 'Draft Files' && isEditor);

  const validateAndProcessFiles = useCallback(
    (fileList: FileList) => {
      const supportedFiles: File[] = [];
      const unsupported: UnsupportedFile[] = [];

      Array.from(fileList).forEach((file) => {
        if (isFileTypeSupported(file.type)) {
          supportedFiles.push(file);
        } else {
          unsupported.push({
            name: file.name,
            type: file.type,
            size: file.size,
          });
        }
      });

      if (unsupported.length > 0) {
        setUnsupportedFiles(unsupported);
      }

      if (supportedFiles.length > 0) {
        const dt = new DataTransfer();
        supportedFiles.forEach((file) => dt.items.add(file));
        onFilesAdd(dt.files);
      }
    },
    [onFilesAdd]
  );

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
        validateAndProcessFiles(e.dataTransfer.files);
      }
    },
    [validateAndProcessFiles]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        validateAndProcessFiles(e.target.files);
      }
      // Reset the input value to allow selecting the same file again
      e.target.value = '';
    },
    [validateAndProcessFiles]
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
      await mutate('/media_posts'); // Added this line to update the board pane
    } catch (e) {
      console.log('error', e);
    } finally {
      setReviewLoading(false);
    }
  };

  const handleDismissUnsupportedAlert = () => {
    setUnsupportedFiles([]);
  };

  return (
    <>
      <Box sx={{ mb: 1 }}>
        {/* Unsupported Files Alert */}
        <UnsupportedFilesAlert
          unsupportedFiles={unsupportedFiles}
          onDismiss={handleDismissUnsupportedAlert}
        />

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
                disabled={reviewLoading || files.some((file) => file.isUploading)}
              >
                {(() => {
                  if (reviewLoading) {
                    return (
                      <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center' }}>
                        <CircularProgress size={16} sx={{ mr: 1 }} />
                        Requesting...
                      </Box>
                    );
                  }
                  if (files.some((file) => file.isUploading)) {
                    return 'Uploading...';
                  }
                  return 'Request Review';
                })()}
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
                  <Typography
                    variant="caption"
                    sx={{
                      color: theme.palette.text.disabled,
                      textAlign: 'center',
                      mt: 0.5,
                    }}
                  >
                    Supported: Images, Videos, Audio, PDF
                  </Typography>
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
                        {(() => {
                          if (file.isUploading) {
                            return (
                              <CloudDone sx={{ fontSize: 20, color: theme.palette.primary.main }} />
                            );
                          }
                          if (file.isDeleting) {
                            return (
                              <DeleteSweep sx={{ fontSize: 20, color: theme.palette.error.main }} />
                            );
                          }
                          return (
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: getFileTypeColor(file.type),
                              }}
                            >
                              {getFileIcon(file.type)}
                            </Box>
                          );
                        })()}
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
