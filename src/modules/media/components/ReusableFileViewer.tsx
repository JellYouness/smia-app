import React, { useState, useRef, useEffect, SyntheticEvent } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Slider,
  Fade,
  useTheme,
  alpha,
  Fab,
  Tooltip,
} from '@mui/material';
import {
  Image as ImageIcon,
  VideoFile as VideoIcon,
  AudioFile as AudioIcon,
  PictureAsPdf as PdfIcon,
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
import { useTranslation } from 'react-i18next';

interface FileViewerProps {
  file: {
    id: string;
    name: string;
    size: number;
    type: string;
    url?: string;
  };
  showControls?: boolean;
  height?: string | number;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
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

// Enhanced Image Preview with proper mouse-centered zoom
const ImagePreview = ({ file, showControls = true, height = '100%' }: FileViewerProps) => {
  const theme = useTheme();
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [fitZoom, setFitZoom] = useState(1);
  const [cursor, setCursor] = useState({ x: 0, y: 0 }); // Track mouse position in container-relative coords
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Calculate initial zoom to fit image in container
  useEffect(() => {
    const image = imageRef.current;
    const container = containerRef.current;

    if (image && container) {
      const handleImageLoad = () => {
        const containerRect = container.getBoundingClientRect();
        const imageAspectRatio = image.naturalWidth / image.naturalHeight;
        const containerAspectRatio = containerRect.width / containerRect.height;

        let initialZoom = 1;
        if (imageAspectRatio > containerAspectRatio) {
          // Image is wider than container - fit to width
          initialZoom = containerRect.width / image.naturalWidth;
        } else {
          // Image is taller than container - fit to height
          initialZoom = containerRect.height / image.naturalHeight;
        }

        setFitZoom(initialZoom);
        setZoom(initialZoom);
      };

      if (image.complete) {
        handleImageLoad();
      } else {
        image.addEventListener('load', handleImageLoad);
        return () => image.removeEventListener('load', handleImageLoad);
      }
    }
  }, [file.url]);

  // Point-aware zoom helper
  const zoomAtPoint = (factor: number, cx = cursor.x, cy = cursor.y) => {
    setZoom((prevZoom) => {
      const newZoom = Math.max(0.1, Math.min(5, prevZoom * factor));
      if (newZoom === prevZoom) {
        return prevZoom;
      }

      // world-coords of the point under the cursor *before* zoom
      const worldX = (cx - pan.x) / prevZoom;
      const worldY = (cy - pan.y) / prevZoom;

      // new pan so the same world-point stays under the cursor
      setPan({
        x: cx - worldX * newZoom,
        y: cy - worldY * newZoom,
      });

      return newZoom;
    });
  };

  const handleZoomIn = () => {
    zoomAtPoint(1.2);
  };

  const handleZoomOut = () => {
    zoomAtPoint(1 / 1.2);
  };

  const handleResetZoom = () => {
    setZoom(fitZoom);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > fitZoom) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const container = containerRef.current;
    if (container) {
      const rect = container.getBoundingClientRect();
      setCursor({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }

    if (isDragging && zoom > fitZoom) {
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
    const container = containerRef.current;

    if (container) {
      const containerRect = container.getBoundingClientRect();
      const mouseX = e.clientX - containerRect.left;
      const mouseY = e.clientY - containerRect.top;

      zoomAtPoint(delta, mouseX, mouseY);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '=' || e.key === '+') {
        e.preventDefault();
        zoomAtPoint(1.2);
      } else if (e.key === '-') {
        e.preventDefault();
        zoomAtPoint(1 / 1.2);
      } else if (e.key === '0') {
        e.preventDefault();
        handleResetZoom();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cursor, pan, zoom, fitZoom]);

  return (
    <Box
      sx={{
        height,
        display: 'flex',
        flexDirection: 'column',
        background: alpha(theme.palette.grey[900], 0.02),
        borderRadius: 2,
        overflow: 'hidden',
        border: `1px solid ${alpha(theme.palette.grey[300], 0.3)}`,
      }}
    >
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
          cursor: (() => {
            if (zoom <= fitZoom) {
              return 'default';
            }
            return isDragging ? 'grabbing' : 'grab';
          })(),
          '&:active': {
            cursor: (() => {
              if (zoom > fitZoom) {
                return 'grabbing';
              }
              return 'default';
            })(),
          },
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
        onDragStart={(e) => e.preventDefault()}
      >
        <img
          ref={imageRef}
          src={file.url}
          alt={file.name}
          style={{
            transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
            transition: isDragging ? 'none' : 'transform 0.3s ease',
            borderRadius: 4,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            objectFit: 'contain',
            userSelect: 'none',
            pointerEvents: 'none',
          }}
          draggable={false}
        />
        {/* Zoom Level Indicator */}
        {showControls && (
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              left: 16,
              bgcolor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              px: 2,
              py: 1,
              borderRadius: 1,
              fontSize: '0.875rem',
              zIndex: 2,
            }}
          >
            {Math.round((zoom / fitZoom) * 100)}%
          </Box>
        )}
        {/* Floating Zoom Controls */}
        {showControls && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 16,
              right: 16,
              display: 'flex',
              gap: 1,
              zIndex: 2,
            }}
          >
            <Tooltip title="Zoom Out (-)">
              <Fab
                size="small"
                onClick={handleZoomOut}
                disabled={zoom <= 0.1}
                sx={{ bgcolor: 'rgba(255, 255, 255, 0.9)' }}
              >
                <ZoomOutIcon />
              </Fab>
            </Tooltip>
            <Tooltip title="Reset (0)">
              <Fab
                size="small"
                onClick={handleResetZoom}
                disabled={zoom === fitZoom && pan.x === 0 && pan.y === 0}
                sx={{ bgcolor: 'rgba(255, 255, 255, 0.9)' }}
              >
                <CenterFocusIcon />
              </Fab>
            </Tooltip>
            <Tooltip title="Zoom In (=)">
              <Fab
                size="small"
                onClick={handleZoomIn}
                disabled={zoom >= 5}
                sx={{ bgcolor: 'rgba(255, 255, 255, 0.9)' }}
              >
                <ZoomInIcon />
              </Fab>
            </Tooltip>
          </Box>
        )}
      </Box>
    </Box>
  );
};

// Enhanced Audio Preview with custom controls
const AudioPreview = ({ file, showControls = true, height = '100%' }: FileViewerProps) => {
  const theme = useTheme();
  const { t } = useTranslation(['common']);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [seeking, setSeeking] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    const updateTime = () => {
      if (!seeking) {
        setCurrentTime(audio.currentTime);
      }
    };
    const updateDuration = () => {
      setDuration(audio.duration);
    };
    const handleEnded = () => {
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

  const handleSeek = (_e: Event | SyntheticEvent<Element, Event>, value: number | number[]) => {
    setSeeking(true);
    setCurrentTime(value as number);
  };

  const commitSeek = (_e: Event | SyntheticEvent<Element, Event>, value: number | number[]) => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }
    const time = value as number;
    audio.currentTime = time;
    setCurrentTime(time);
    setSeeking(false);
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
        height,
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
      <audio ref={audioRef} src={file.url} preload="metadata">
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

// Simple Video Preview with native controls
const VideoPreview = ({ file, showControls = true, height = '100%' }: FileViewerProps) => {
  const theme = useTheme();
  const { t } = useTranslation(['common']);

  return (
    <Box
      sx={{
        height,
        display: 'flex',
        flexDirection: 'column',
        background: alpha(theme.palette.grey[50], 0.5),
        borderRadius: 2,
        overflow: 'hidden',
        border: `1px solid ${alpha(theme.palette.grey[300], 0.3)}`,
      }}
    >
      <video
        src={file.url}
        controls={showControls}
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        }}
      >
        <track
          kind="captions"
          src={`/captions/${file.id}.vtt`}
          srcLang="en"
          label={t('common:english_captions')}
          default
        />
      </video>
    </Box>
  );
};

// PDF Preview
const PdfPreview = ({ file, showControls = true, height = '100%' }: FileViewerProps) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        height,
        display: 'flex',
        flexDirection: 'column',
        background: alpha(theme.palette.grey[50], 0.5),
        borderRadius: 2,
        overflow: 'hidden',
        border: `1px solid ${alpha(theme.palette.grey[300], 0.3)}`,
      }}
    >
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
  );
};

// Fallback for unsupported file types
const UnsupportedFilePreview = ({ file, height = '100%' }: FileViewerProps) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        height,
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

const ReusableFileViewer: React.FC<FileViewerProps> = ({
  file,
  showControls = true,
  height = '100%',
}) => {
  if (!file.url) {
    return (
      <Box
        sx={{
          height,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: `linear-gradient(135deg, ${alpha('#6B7280', 0.05)}, ${alpha(
            '#6B7280',
            0.02
          )})`,
          borderRadius: 2,
          border: `2px dashed ${alpha('#6B7280', 0.3)}`,
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
    return <ImagePreview file={file} showControls={showControls} height={height} />;
  }

  if (file.type.startsWith('video/')) {
    return <VideoPreview file={file} showControls={showControls} height={height} />;
  }

  if (file.type.startsWith('audio/')) {
    return <AudioPreview file={file} showControls={showControls} height={height} />;
  }

  if (file.type === 'application/pdf') {
    return <PdfPreview file={file} showControls={showControls} height={height} />;
  }

  return <UnsupportedFilePreview file={file} height={height} />;
};

export default ReusableFileViewer;
