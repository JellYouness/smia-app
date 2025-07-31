import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Close as CloseIcon,
  Download as DownloadIcon,
  Image as ImageIcon,
  VideoFile as VideoIcon,
  AudioFile as AudioIcon,
  PictureAsPdf as PdfIcon,
  FilePresent as FileIcon,
  MoreVert as MoreVertIcon,
  OpenInNew as OpenInNewIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import useUploads from '@modules/uploads/hooks/api/useUploads';
import ReusableFileViewer from './ReusableFileViewer';

interface FileViewerModalProps {
  open: boolean;
  onClose: () => void;
  file: {
    id: string;
    name: string;
    size: number;
    type: string;
    url?: string;
  } | null;
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

const getFileTypeInfo = (mimeType: string) => {
  if (mimeType.startsWith('image/')) {
    return { icon: <ImageIcon />, category: 'Image', color: '#10B981' };
  }
  if (mimeType.startsWith('video/')) {
    return { icon: <VideoIcon />, category: 'Video', color: '#3B82F6' };
  }
  if (mimeType.startsWith('audio/')) {
    return { icon: <AudioIcon />, category: 'Audio', color: '#8B5CF6' };
  }
  if (mimeType === 'application/pdf') {
    return { icon: <PdfIcon />, category: 'PDF', color: '#EF4444' };
  }
  return { icon: <FileIcon />, category: 'File', color: '#6B7280' };
};

const FileViewerModal: React.FC<FileViewerModalProps> = ({ open, onClose, file }) => {
  const theme = useTheme();
  const { t } = useTranslation(['common']);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { downloadFile } = useUploads();

  if (!file) {
    return null;
  }

  const fileTypeInfo = getFileTypeInfo(file.type);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenInNewTab = () => {
    if (file.url) {
      window.open(file.url, '_blank');
    }
    handleMenuClose();
  };

  const handleDownload = async () => {
    if (file.url) {
      try {
        await downloadFile(Number(file.id), file.name);
      } catch (error) {
        console.error('Download failed:', error);
        window.open(file.url, '_blank');
      }
    }
    handleMenuClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          pb: 1,
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32,
              borderRadius: '8px',
              backgroundColor: fileTypeInfo.color,
              color: 'white',
            }}
          >
            {React.cloneElement(fileTypeInfo.icon, { sx: { fontSize: 18 } })}
          </Box>
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                lineHeight: 1.2,
                wordBreak: 'break-word',
              }}
            >
              {file.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              <Chip
                label={fileTypeInfo.category}
                size="small"
                sx={{
                  backgroundColor: `${fileTypeInfo.color}15`,
                  color: fileTypeInfo.color,
                  fontWeight: 500,
                  fontSize: '0.75rem',
                }}
              />
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                {formatFileSize(file.size)}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            onClick={handleMenuOpen}
            sx={{
              color: theme.palette.text.secondary,
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            <MoreVertIcon />
          </IconButton>
          <IconButton
            onClick={onClose}
            sx={{
              color: theme.palette.text.secondary,
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <ReusableFileViewer file={file} showControls height="70vh" />
      </DialogContent>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            border: '1px solid rgba(0, 0, 0, 0.08)',
          },
        }}
      >
        <MenuItem onClick={handleOpenInNewTab}>
          <ListItemIcon>
            <OpenInNewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Open in new tab</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDownload}>
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Download</ListItemText>
        </MenuItem>
      </Menu>
    </Dialog>
  );
};

export default FileViewerModal;
