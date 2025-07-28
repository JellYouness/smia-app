import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Close as CloseIcon,
  Download as DownloadIcon,
  Image as ImageIcon,
  Movie as MovieIcon,
  Audiotrack as AudioIcon,
  PictureAsPdf as PdfIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

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
    return { icon: <ImageIcon />, category: 'Image', color: '#4CAF50' };
  }
  if (mimeType.startsWith('video/')) {
    return { icon: <MovieIcon />, category: 'Video', color: '#FF9800' };
  }
  if (mimeType.startsWith('audio/')) {
    return { icon: <AudioIcon />, category: 'Audio', color: '#9C27B0' };
  }
  if (mimeType === 'application/pdf') {
    return { icon: <PdfIcon />, category: 'PDF', color: '#F44336' };
  }
  return { icon: <ImageIcon />, category: 'File', color: '#757575' };
};

const FileViewer = ({ file }: { file: NonNullable<FileViewerModalProps['file']> }) => {
  const theme = useTheme();
  const { t } = useTranslation(['common']);

  if (!file.url) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '200px',
          color: theme.palette.text.secondary,
        }}
      >
        <Typography variant="body1">File URL not available</Typography>
        <Typography variant="body2">Unable to display file content</Typography>
      </Box>
    );
  }

  // Image viewer
  if (file.type.startsWith('image/')) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          maxHeight: '70vh',
          overflow: 'hidden',
          borderRadius: '8px',
          backgroundColor: 'rgba(0, 0, 0, 0.05)',
        }}
      >
        <img
          src={file.url}
          alt={file.name}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            borderRadius: '8px',
          }}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            const errorDiv = document.createElement('div');
            errorDiv.textContent = 'Failed to load image';
            errorDiv.style.color = theme.palette.error.main;
            errorDiv.style.textAlign = 'center';
            errorDiv.style.padding = '16px';
            e.currentTarget.parentNode?.appendChild(errorDiv);
          }}
        />
      </Box>
    );
  }

  // Video viewer
  if (file.type.startsWith('video/')) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          borderRadius: '8px',
          overflow: 'hidden',
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
        }}
      >
        <video
          controls
          style={{
            maxWidth: '100%',
            maxHeight: '70vh',
            borderRadius: '8px',
          }}
          onError={(e) => {
            console.error('Video failed to load:', e);
          }}
        >
          <source src={file.url} type={file.type} />
          <track
            kind="captions"
            src={`/captions/${file.id}.vtt`}
            srcLang="en"
            label={t('common:english_captions')}
            default
          />
          <Typography variant="body2" sx={{ color: theme.palette.error.main, p: 2 }}>
            {t('common:browser_no_video_support')}
          </Typography>
        </video>
      </Box>
    );
  }

  // Audio viewer
  if (file.type.startsWith('audio/')) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
          p: 4,
          backgroundColor: 'rgba(0, 0, 0, 0.02)',
          borderRadius: '8px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 120,
            height: 120,
            borderRadius: '50%',
            backgroundColor: theme.palette.primary.main,
            color: 'white',
            mb: 2,
          }}
        >
          <AudioIcon sx={{ fontSize: 48 }} />
        </Box>
        <audio
          controls
          style={{
            width: '100%',
            maxWidth: '400px',
          }}
          onError={(e) => {
            console.error('Audio failed to load:', e);
          }}
        >
          <source src={file.url} type={file.type} />
          <track
            kind="captions"
            src={`/captions/${file.id}.vtt`}
            srcLang="en"
            label={t('common:english_captions')}
            default
          />
          <Typography variant="body2" sx={{ color: theme.palette.error.main }}>
            {t('common:browser_no_audio_support')}
          </Typography>
        </audio>
        <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: 500 }}>
          {file.name}
        </Typography>
      </Box>
    );
  }

  // PDF viewer
  if (file.type === 'application/pdf') {
    return (
      <Box
        sx={{
          height: '70vh',
          border: '1px solid rgba(0, 0, 0, 0.12)',
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      >
        <iframe
          src={file.url}
          width="100%"
          height="100%"
          style={{ border: 'none' }}
          title={file.name}
          onError={(e) => {
            console.error('PDF failed to load:', e);
          }}
        />
      </Box>
    );
  }

  // Fallback for unsupported types
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px',
        gap: 2,
        color: theme.palette.text.secondary,
      }}
    >
      <Typography variant="h6">Preview not available</Typography>
      <Typography variant="body2" sx={{ textAlign: 'center' }}>
        This file type cannot be previewed in the browser.
        <br />
        Use the download button to view the file.
      </Typography>
    </Box>
  );
};

const FileViewerModal: React.FC<FileViewerModalProps> = ({ open, onClose, file }) => {
  const theme = useTheme();

  if (!file) {
    return null;
  }

  const fileTypeInfo = getFileTypeInfo(file.type);

  const handleDownload = () => {
    if (file.url) {
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.name;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <FileViewer file={file} />
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          pb: 3,
          pt: 1,
          borderTop: '1px solid rgba(0, 0, 0, 0.08)',
        }}
      >
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={handleDownload}
          sx={{
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 500,
          }}
        >
          Download
        </Button>
        <Button
          variant="contained"
          onClick={onClose}
          sx={{
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 500,
            ml: 1,
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FileViewerModal;
