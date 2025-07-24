import { Box, IconButton } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';

interface PaneHeaderProps {
  title: string;
  hidden: boolean;
  onToggle: () => void;
}

export default function PaneHeader({ title, hidden, onToggle }: PaneHeaderProps) {
  const isFilesPane = title === 'Files';
  const isUpdatesPane = title === 'Updates';

  // Choose appropriate icons based on pane and state
  const getHideIcon = () => {
    if (isFilesPane) {
      return <ChevronRightIcon fontSize="small" />;
    } // Hide right pane: →
    if (isUpdatesPane) {
      return <ChevronLeftIcon fontSize="small" />;
    } // Hide left pane: ←
    return <ChevronLeftIcon fontSize="small" />;
  };

  const getShowIcon = () => {
    if (isFilesPane) {
      return <ChevronLeftIcon fontSize="small" />;
    } // Show right pane: ←
    if (isUpdatesPane) {
      return <ChevronRightIcon fontSize="small" />;
    } // Show left pane: →
    return <ChevronRightIcon fontSize="small" />;
  };

  return (
    <Box
      sx={{
        height: 60,
        display: 'flex',
        alignItems: 'center',
        px: 1.5,
        background: 'background.paper',
        justifyContent: hidden ? 'center' : 'center',
        position: 'relative',
      }}
    >
      {/* For all panes when open: centered title with absolute positioned icon */}
      {!hidden && title !== 'Board' && (
        <>
          <Box
            sx={{
              flex: 1,
              fontWeight: 600,
              fontSize: '1rem',
              color: 'text.primary',
              textAlign: 'center',
            }}
          >
            {title}
          </Box>
          <IconButton
            size="small"
            onClick={onToggle}
            sx={{
              position: 'absolute',
              [isFilesPane ? 'left' : 'right']: 8,
              p: 0.5,
              borderRadius: 1,
              color: 'text.secondary',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                color: 'primary.main',
                backgroundColor: 'primary.50',
                transform: 'scale(1.1)',
              },
            }}
            aria-label={`Hide ${title}`}
          >
            {getHideIcon()}
          </IconButton>
        </>
      )}

      {/* For hidden panes: centered expand icon */}
      {hidden && title !== 'Board' && (
        <IconButton
          size="small"
          onClick={onToggle}
          sx={{
            p: 0.5,
            borderRadius: 1,
            color: 'text.disabled',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              color: 'primary.main',
              backgroundColor: 'primary.50',
              transform: 'scale(1.2)',
              boxShadow: 1,
            },
          }}
          aria-label={`Show ${title}`}
        >
          {getShowIcon()}
        </IconButton>
      )}

      {/* For Board pane: always just the title */}
      {title === 'Board' && (
        <Box
          sx={{
            flex: 1,
            fontWeight: 600,
            fontSize: '1.5rem',
            color: 'text.primary',
            textAlign: 'center',
          }}
        >
          {title}
        </Box>
      )}
    </Box>
  );
}
