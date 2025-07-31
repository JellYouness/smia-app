import React, { useState } from 'react';
import {
  Box,
  Collapse,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tabs,
  Tab,
  Chip,
  Button,
  Dialog,
} from '@mui/material';
import {
  ExpandMore,
  ChevronRight,
  Description,
  TableChart,
  Slideshow,
  InsertDriveFile,
  Image,
  VideoFile as VideoIcon,
  AudioFile as AudioIcon,
  PictureAsPdf,
  FilePresent as FileIcon,
  CheckCircle,
  Schedule,
  ErrorOutline,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import FileViewerModal from './FileViewerModal';
import ReviewVersionModal from './ReviewVersionModal';
import { MediaPostReview } from '../defs/types';

interface VersionFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedBy: string;
  uploadedAt: string;
}

interface Version {
  id: string;
  number: number;
  status: 'IN_REVIEW' | 'CHANGES_REQUESTED' | 'APPROVED';
  createdBy: string;
  createdAt: string;
  files: VersionFile[];
}

interface VersionsSectionProps {
  isExpanded: boolean;
  onToggle: () => void;
  versions?: Version[];
  isProjectOwner?: boolean;
  lastVersionWithAssets?: Version;
  postId?: number;
  reviews?: MediaPostReview[];
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

const getStatusChip = (status: Version['status']) => {
  const statusConfig = {
    APPROVED: {
      label: 'Approved',
      color: '#4caf50' as const,
      icon: <CheckCircle sx={{ fontSize: 14 }} />,
    },
    IN_REVIEW: {
      label: 'In Review',
      color: '#ff9800' as const,
      icon: <Schedule sx={{ fontSize: 14 }} />,
    },
    CHANGES_REQUESTED: {
      label: 'Changes Requested',
      color: '#f44336' as const,
      icon: <ErrorOutline sx={{ fontSize: 14 }} />,
    },
  };

  const config = statusConfig[status];

  return (
    <Chip
      icon={config.icon}
      label={config.label}
      size="small"
      sx={{
        backgroundColor: `${config.color}15`,
        color: config.color,
        border: `1px solid ${config.color}30`,
        fontWeight: 500,
        fontSize: '0.75rem',
        '& .MuiChip-icon': {
          color: config.color,
        },
      }}
    />
  );
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const VersionsSection = ({
  isExpanded,
  onToggle,
  versions,
  isProjectOwner = false,
  lastVersionWithAssets,
  postId,
  reviews = [],
}: VersionsSectionProps) => {
  const theme = useTheme();
  const [selectedTab, setSelectedTab] = useState(0);

  // Set selected tab to the newest version when expanded
  React.useEffect(() => {
    if (isExpanded && versions && versions.length > 0) {
      setSelectedTab(versions.length - 1);
    }
  }, [isExpanded, versions]);

  // File viewer modal state
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{
    id: string;
    name: string;
    size: number;
    type: string;
    url?: string;
  } | null>(null);

  // Review modal state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  const canPreviewFile = (mimeType: string): boolean => {
    return (
      mimeType.startsWith('image/') ||
      mimeType.startsWith('video/') ||
      mimeType.startsWith('audio/') ||
      mimeType === 'application/pdf'
    );
  };

  const handleFileView = (file: VersionFile) => {
    setSelectedFile({
      id: file.id,
      name: file.name,
      size: file.size,
      type: file.type,
      url: (file as any).url || '',
    });
    setViewerOpen(true);
  };

  const handleCloseViewer = () => {
    setViewerOpen(false);
    setSelectedFile(null);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const versionsToShow = versions && versions.length > 0 ? versions : [];
  const totalVersions = versionsToShow.length;

  return (
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
          Version History
        </Typography>
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
          {totalVersions}
        </Typography>
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
          {versionsToShow.length === 0 ? (
            <Box
              sx={{
                p: 4,
                textAlign: 'center',
                color: theme.palette.text.secondary,
              }}
            >
              <Typography variant="body2">No versions available yet</Typography>
            </Box>
          ) : (
            <>
              {/* Version Tabs */}
              <Box
                sx={{
                  borderBottom: '1px solid rgba(32, 101, 209, 0.08)',
                  background: 'rgba(255, 255, 255, 0.5)',
                }}
              >
                <Tabs
                  value={selectedTab}
                  onChange={handleTabChange}
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={{
                    minHeight: 48,
                    '& .MuiTab-root': {
                      minHeight: 48,
                      textTransform: 'none',
                      fontWeight: 500,
                      fontSize: '0.875rem',
                      minWidth: 'auto',
                      px: 2,
                    },
                    '& .MuiTabs-indicator': {
                      backgroundColor: (() => {
                        const isCurrentVersionSelected = selectedTab === versionsToShow.length - 1;
                        if (isCurrentVersionSelected) {
                          const currentVersion = versionsToShow[versionsToShow.length - 1];
                          const statusConfig = {
                            APPROVED: '#4caf50',
                            IN_REVIEW: '#ff9800',
                            CHANGES_REQUESTED: '#f44336',
                          };
                          return statusConfig[currentVersion.status] || theme.palette.primary.main;
                        }
                        return theme.palette.action.disabled;
                      })(),
                    },
                  }}
                >
                  {versionsToShow.map((version, index) => {
                    const isCurrentVersion = index === versionsToShow.length - 1;
                    const statusConfig = {
                      APPROVED: '#4caf50',
                      IN_REVIEW: '#ff9800',
                      CHANGES_REQUESTED: '#f44336',
                    };
                    const statusColor = statusConfig[version.status];

                    return (
                      <Tab
                        key={version.id}
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography
                              variant="inherit"
                              sx={{
                                color: isCurrentVersion
                                  ? statusColor || 'inherit'
                                  : 'text.disabled',
                                fontWeight: isCurrentVersion ? 500 : 400,
                              }}
                            >
                              V{version.number}
                            </Typography>
                            {isCurrentVersion && getStatusChip(version.status)}
                          </Box>
                        }
                        sx={{
                          opacity: isCurrentVersion ? 1 : 0.6,
                          '&.Mui-selected': {
                            opacity: 1,
                          },
                        }}
                      />
                    );
                  })}
                </Tabs>
              </Box>

              {/* Selected Version Content */}
              {versionsToShow[selectedTab] && (
                <Box>
                  {/* Version Info */}
                  <Box sx={{ p: 2, borderBottom: '1px solid rgba(32, 101, 209, 0.05)' }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        mb: 1,
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Version {versionsToShow[selectedTab].number}
                      </Typography>
                      {/* Review button for project owner on last version if under review */}
                      {isProjectOwner &&
                      lastVersionWithAssets &&
                      versionsToShow[selectedTab].id === lastVersionWithAssets.id &&
                      lastVersionWithAssets.status === 'IN_REVIEW' ? (
                        <Button
                          variant="contained"
                          size="small"
                          sx={{ ml: 2, textTransform: 'none', fontWeight: 500 }}
                          onClick={() => setReviewModalOpen(true)}
                        >
                          Review
                        </Button>
                      ) : (
                        getStatusChip(versionsToShow[selectedTab].status)
                      )}
                    </Box>
                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                      Created by {versionsToShow[selectedTab].createdBy} •{' '}
                      {formatDate(versionsToShow[selectedTab].createdAt)}
                    </Typography>
                    {/* Client review/comment for this version */}
                    {(() => {
                      const versionId = versionsToShow[selectedTab].id;
                      const clientReview = reviews.find(
                        (r) =>
                          r.versionId?.toString() === versionId.toString() &&
                          r.reviewerType === 'CLIENT' &&
                          r.comment
                      );
                      if (clientReview) {
                        return (
                          <Box
                            sx={{
                              mt: 2,
                              p: 2,
                              background: 'rgba(32,101,209,0.04)',
                              borderRadius: 2,
                              border: '1px solid rgba(32,101,209,0.08)',
                            }}
                          >
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: 600, color: theme.palette.primary.main, mb: 0.5 }}
                            >
                              Client Review
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: theme.palette.text.primary, mb: 0.5 }}
                            >
                              {clientReview.comment}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ color: theme.palette.text.secondary }}
                            >
                              {clientReview.reviewer?.firstName || 'Client'} •{' '}
                              {clientReview.createdAt ? formatDate(clientReview.createdAt) : ''}
                            </Typography>
                          </Box>
                        );
                      }
                      return null;
                    })()}
                  </Box>

                  {/* Files List */}
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
                      {versionsToShow[selectedTab].files.map((file) => (
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
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 36 }}>
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
                              <Box sx={{ display: 'flex', gap: 2 }}>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: theme.palette.text.secondary,
                                  }}
                                >
                                  {formatFileSize(file.size)}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: theme.palette.text.secondary,
                                  }}
                                >
                                  by {file.uploadedBy}
                                </Typography>
                              </Box>
                            }
                          />
                          {/* Action buttons */}
                          <Box sx={{ display: 'flex', gap: 0.5, ml: 1 }}>
                            {canPreviewFile(file.type) && (
                              <IconButton
                                size="small"
                                sx={{ color: theme.palette.primary.main }}
                                onClick={() => handleFileView(file)}
                                title="Preview file"
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            )}
                          </Box>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </Box>
              )}
            </>
          )}
        </Box>
      </Collapse>
      {/* File Viewer Modal */}
      <FileViewerModal open={viewerOpen} onClose={handleCloseViewer} file={selectedFile} />
      {/* Review Modal for Project Owner */}
      {isProjectOwner && lastVersionWithAssets && (
        <ReviewVersionModal
          open={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          version={lastVersionWithAssets}
          files={lastVersionWithAssets.files}
          postId={postId}
        />
      )}
    </Box>
  );
};

export default VersionsSection;
