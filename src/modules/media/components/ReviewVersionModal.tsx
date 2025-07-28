import React, { useState, useRef, useEffect, SyntheticEvent } from 'react';
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
  Slider,
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
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Fullscreen as FullscreenIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  VolumeUp as VolumeIcon,
  VolumeOff as VolumeOffIcon,
  CenterFocusStrong as CenterFocusIcon,
} from '@mui/icons-material';
import { mutate } from 'swr';
import useMedia from '../hooks/useMedia';
import { MEDIA_POST_REVIEW_DECISION } from '../defs/types';
import { useTranslation } from 'react-i18next';

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

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
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

// Enhanced Image Preview with proper zoom and pan
const ImagePreview = ({ file }: { file: ReviewVersionModalProps['files'][0] }) => {
  const theme = useTheme();
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev * 1.5, 5));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev / 1.5, 0.1));
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom((prev) => Math.max(0.1, Math.min(5, prev * delta)));
  };

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: alpha(theme.palette.grey[900], 0.02),
        borderRadius: 2,
        overflow: 'hidden',
        border: `1px solid ${alpha(theme.palette.grey[300], 0.3)}`,
      }}
    >
      {/* Controls */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: alpha(theme.palette.background.paper, 0.8),
          borderBottom: `1px solid ${alpha(theme.palette.grey[300], 0.3)}`,
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary' }}>
          {file.name}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <IconButton size="small" onClick={handleZoomOut} disabled={zoom <= 0.1}>
            <ZoomOutIcon />
          </IconButton>
          <Button size="small" onClick={handleResetZoom} sx={{ minWidth: 60, fontSize: '0.75rem' }}>
            {Math.round(zoom * 100)}%
          </Button>
          <IconButton size="small" onClick={handleZoomIn} disabled={zoom >= 5}>
            <ZoomInIcon />
          </IconButton>
          <IconButton size="small" onClick={handleResetZoom}>
            <CenterFocusIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Image Container */}
      <Box
        ref={containerRef}
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          position: 'relative',
          // cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
          background: `linear-gradient(45deg, ${alpha(
            theme.palette.grey[100],
            0.3
          )} 25%, transparent 25%), 
                       linear-gradient(-45deg, ${alpha(
                         theme.palette.grey[100],
                         0.3
                       )} 25%, transparent 25%), 
                       linear-gradient(45deg, transparent 75%, ${alpha(
                         theme.palette.grey[100],
                         0.3
                       )} 75%), 
                       linear-gradient(-45deg, transparent 75%, ${alpha(
                         theme.palette.grey[100],
                         0.3
                       )} 75%)`,
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <img
          ref={imageRef}
          src={file.url}
          alt={file.name}
          style={{
            maxWidth: zoom === 1 ? '100%' : 'none',
            maxHeight: zoom === 1 ? '100%' : 'none',
            transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
            transition: isDragging ? 'none' : 'transform 0.3s ease',
            borderRadius: 4,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            objectFit: 'contain',
            userSelect: 'none',
            pointerEvents: 'none',
          }}
          draggable={false}
        />
      </Box>
    </Box>
  );
};

// Enhanced Audio Preview with custom controls
const AudioPreview = ({ file }: { file: ReviewVersionModalProps['files'][0] }) => {
  const theme = useTheme();
  const { t } = useTranslation(['common']);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [seeking, setSeeking] = useState(false);

  console.log('AudioPreview render, audioRef.current =', audioRef.current, 'seeking=', seeking);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    const updateTime = () => {
      console.debug('[Audio] timeupdate →', audio.currentTime, { seeking });
      if (!seeking) {
        setCurrentTime(audio.currentTime);
      }
    };
    const updateDuration = () => {
      console.debug('[Audio] loadedmetadata → duration:', audio.duration);
      setDuration(audio.duration);
    };
    const handleEnded = () => {
      console.debug('[Audio] ended');
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [seeking]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (_e: Event | SyntheticEvent, value: number | number[]) => {
    console.debug('[Slider] onChange (dragging) →', value);
    setSeeking(true);
    setCurrentTime(value as number);
  };

  const commitSeek = (_e: Event | SyntheticEvent, value: number | number[]) => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }
    const time = value as number;
    console.debug('[Slider] onChangeCommitted (drop) → seeking to', time);
    audio.currentTime = time;
    setCurrentTime(time);
    setSeeking(false);
  };

  const handleTimeChange = (event: Event, newValue: number | number[]) => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    const time = newValue as number;
    audio.currentTime = time;
    setCurrentTime(time);
  };

  const handleVolumeChange = (event: Event, newValue: number | number[]) => {
    const audio = audioRef.current;
    const vol = (newValue as number) / 100;
    if (audio) {
      audio.volume = vol;
    }
    setVolume(vol);
    setIsMuted(vol === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (isMuted) {
      audio.volume = volume;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${alpha('#8B5CF6', 0.05)}, ${alpha('#8B5CF6', 0.02)})`,
        borderRadius: 2,
        border: `1px solid ${alpha('#8B5CF6', 0.2)}`,
        minHeight: 400,
      }}
    >
      <audio
        ref={audioRef}
        src={file.url}
        preload="metadata"
        onLoadedMetadata={(e) =>
          console.log('🎧 loadedmetadata, duration=', e.currentTarget.duration)
        }
      >
        <track
          kind="captions"
          src={`/captions/${file.id}.vtt`}
          srcLang="en"
          label={t('common:english_captions')}
          default
        />
      </audio>

      <Box
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
          background: alpha(theme.palette.background.paper, 0.8),
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(139, 92, 246, 0.1)',
          minWidth: 400,
          maxWidth: 500,
        }}
      >
        <Box
          sx={{
            p: 3,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${alpha('#8B5CF6', 0.1)}, ${alpha(
              '#8B5CF6',
              0.05
            )})`,
            color: '#8B5CF6',
          }}
        >
          <AudioIcon sx={{ fontSize: 48 }} />
        </Box>

        <Typography variant="h6" sx={{ fontWeight: 600, textAlign: 'center', mb: 1 }}>
          {file.name}
        </Typography>

        {/* Progress Bar */}
        <Box sx={{ width: '100%', px: 2 }}>
          <Slider
            value={currentTime}
            max={duration || 0}
            onChange={handleSeek}
            onChangeCommitted={commitSeek}
            sx={{
              color: '#8B5CF6',
              '& .MuiSlider-thumb': {
                width: 16,
                height: 16,
                '&:hover': {
                  boxShadow: '0 0 0 8px rgba(139, 92, 246, 0.16)',
                },
              },
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="caption" color="text.secondary">
              {formatTime(currentTime)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatTime(duration)}
            </Typography>
          </Box>
        </Box>

        {/* Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%', px: 2 }}>
          <IconButton
            onClick={togglePlay}
            sx={{
              bgcolor: '#8B5CF6',
              color: 'white',
              '&:hover': { bgcolor: '#7C3AED' },
              width: 48,
              height: 48,
            }}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </IconButton>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
            <IconButton size="small" onClick={toggleMute}>
              {isMuted ? <VolumeOffIcon /> : <VolumeIcon />}
            </IconButton>
            <Slider
              value={isMuted ? 0 : volume * 100}
              onChange={handleVolumeChange}
              sx={{
                color: '#8B5CF6',
                '& .MuiSlider-thumb': { width: 12, height: 12 },
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

// Enhanced Video Preview with custom controls
const VideoPreview = ({ file }: { file: ReviewVersionModalProps['files'][0] }) => {
  const theme = useTheme();
  const { t } = useTranslation(['common']);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);
    const handleEnded = () => setIsPlaying(false);

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeChange = (event: Event, newValue: number | number[]) => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    const time = newValue as number;
    video.currentTime = time;
    setCurrentTime(time);
  };

  const handleVolumeChange = (event: Event, newValue: number | number[]) => {
    const video = videoRef.current;
    const vol = (newValue as number) / 100;
    if (video) {
      video.volume = vol;
    }
    setVolume(vol);
    setIsMuted(vol === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    if (isMuted) {
      video.volume = volume;
      setIsMuted(false);
    } else {
      video.volume = 0;
      setIsMuted(true);
    }
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      video.requestFullscreen();
    }
  };

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: alpha(theme.palette.grey[900], 0.95),
        borderRadius: 2,
        overflow: 'hidden',
        border: `1px solid ${alpha(theme.palette.grey[700], 0.3)}`,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          background: alpha(theme.palette.background.paper, 0.1),
          borderBottom: `1px solid ${alpha(theme.palette.grey[700], 0.3)}`,
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'white' }}>
          {file.name}
        </Typography>
      </Box>

      {/* Video Container */}
      <Box
        sx={{
          flex: 1,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <video
          ref={videoRef}
          src={file.url}
          style={{
            width: '100%',
            height: '100%',
            maxHeight: '500px',
            objectFit: 'contain',
            backgroundColor: 'black',
          }}
          onClick={togglePlay}
        >
          <track
            kind="captions"
            src={`/captions/${file.id}.vtt`}
            srcLang="en"
            label={t('common:english_captions')}
            default
          />
        </video>

        {/* Custom Controls Overlay */}
        <Fade in={showControls}>
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
              p: 2,
              color: 'white',
            }}
          >
            {/* Progress Bar */}
            <Box sx={{ mb: 2 }}>
              <Slider
                value={currentTime}
                max={duration || 100}
                onChange={handleTimeChange}
                sx={{
                  color: theme.palette.primary.main,
                  '& .MuiSlider-thumb': {
                    width: 16,
                    height: 16,
                    '&:hover': {
                      boxShadow: `0 0 0 8px ${alpha(theme.palette.primary.main, 0.16)}`,
                    },
                  },
                }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="caption">{formatTime(currentTime)}</Typography>
                <Typography variant="caption">{formatTime(duration)}</Typography>
              </Box>
            </Box>

            {/* Control Buttons */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton onClick={togglePlay} sx={{ color: 'white' }}>
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
              </IconButton>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, maxWidth: 150 }}>
                <IconButton size="small" onClick={toggleMute} sx={{ color: 'white' }}>
                  {isMuted ? <VolumeOffIcon /> : <VolumeIcon />}
                </IconButton>
                <Slider
                  value={isMuted ? 0 : volume * 100}
                  onChange={handleVolumeChange}
                  sx={{
                    color: 'white',
                    '& .MuiSlider-thumb': { width: 12, height: 12 },
                  }}
                />
              </Box>

              <IconButton onClick={toggleFullscreen} sx={{ color: 'white' }}>
                <FullscreenIcon />
              </IconButton>
            </Box>
          </Box>
        </Fade>
      </Box>
    </Box>
  );
};

const MainPreview = ({ file }: { file: ReviewVersionModalProps['files'][0] }) => {
  const theme = useTheme();

  if (!file.url) {
    return (
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: `linear-gradient(135deg, ${alpha(theme.palette.grey[100], 0.5)}, ${alpha(
            theme.palette.grey[50],
            0.8
          )})`,
          borderRadius: 2,
          border: `2px dashed ${theme.palette.grey[300]}`,
          minHeight: 500,
        }}
      >
        <FileIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
          No preview available
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: 'text.secondary', textAlign: 'center', maxWidth: 300 }}
        >
          This file type cannot be previewed, but it's available for download
        </Typography>
      </Box>
    );
  }

  if (file.type.startsWith('image/')) {
    return <ImagePreview file={file} />;
  }

  if (file.type.startsWith('video/')) {
    return <VideoPreview file={file} />;
  }

  if (file.type.startsWith('audio/')) {
    return <AudioPreview file={file} />;
  }

  if (file.type === 'application/pdf') {
    return (
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: alpha(theme.palette.grey[50], 0.5),
          borderRadius: 2,
          overflow: 'hidden',
          border: `1px solid ${alpha(theme.palette.grey[300], 0.3)}`,
        }}
      >
        <Box
          sx={{
            p: 2,
            background: alpha(theme.palette.background.paper, 0.8),
            borderBottom: `1px solid ${alpha(theme.palette.grey[300], 0.3)}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {file.name}
          </Typography>
          <Button
            size="small"
            startIcon={<FullscreenIcon />}
            onClick={() => window.open(file.url, '_blank')}
            sx={{ fontSize: '0.75rem' }}
          >
            Open Full View
          </Button>
        </Box>
        <Box sx={{ flex: 1 }}>
          <iframe
            src={`${file.url}#view=FitH`}
            title={file.name}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              background: 'white',
            }}
          />
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${alpha(theme.palette.grey[100], 0.5)}, ${alpha(
          theme.palette.grey[50],
          0.8
        )})`,
        borderRadius: 2,
        border: `2px dashed ${theme.palette.grey[300]}`,
        minHeight: 500,
      }}
    >
      <FileIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
      <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
        Preview not supported
      </Typography>
      <Typography
        variant="body2"
        sx={{ color: 'text.secondary', textAlign: 'center', maxWidth: 300 }}
      >
        This file type cannot be previewed in the browser
      </Typography>
    </Box>
  );
};

const ReviewVersionModal: React.FC<ReviewVersionModalProps> = ({
  open,
  onClose,
  version,
  files,
  postId,
}) => {
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
      // Refresh the assets and post data to update the UI
      await mutate(['/media_posts', postId, 'assets']);
      await mutate(['/media_posts', postId]);
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
      // Refresh the assets and post data to update the UI
      await mutate(['/media_posts', postId, 'assets']);
      await mutate(['/media_posts', postId]);
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
                  <MainPreview file={files[selectedFileIndex]} />
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
