import {
  Box,
  Card,
  CardContent,
  Typography,
  Tooltip,
  Chip,
  Avatar,
  AvatarGroup,
  IconButton,
} from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { MediaPost } from '../defs/types';
import UserAvatar from '@common/components/lib/partials/UserAvatar';
import { User } from '@modules/users/defs/types';

interface MediaPostCardProps {
  task: MediaPost;
  isDragging: boolean;
  onDragStart?: (taskId: string) => void;
  onDragEnd?: () => void;
  onDragOver?: (e: React.DragEvent, position: 'above' | 'below' | null) => void;
  onDrop?: (e: React.DragEvent, position: 'above' | 'below') => void;
  dragOverPosition: 'above' | 'below' | null;
  onCardClick: (task: MediaPost) => void;
  onFilesClick?: (task: MediaPost) => void;
  disableDrag?: boolean;
}

const getPriorityColor = (priority: string) => {
  switch (priority.toLowerCase()) {
    case 'high':
      return '#EF4444';
    case 'med':
      return '#F59E0B';
    case 'low':
      return '#10B981';
    default:
      return '#64748B';
  }
};

const MediaPostCard = ({
  task,
  isDragging,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  dragOverPosition,
  onCardClick,
  onFilesClick,
  disableDrag,
}: MediaPostCardProps) => (
  <Box
    sx={{ position: 'relative' }}
    onDragOver={
      disableDrag
        ? undefined
        : (e) => {
            e.preventDefault();
            const bounding = e.currentTarget.getBoundingClientRect();
            const offset = e.clientY - bounding.top;
            // Add a margin zone (8px) to avoid twitching at the edge
            let position: 'above' | 'below' | null = null;
            if (offset < bounding.height / 2 - 8) {
              position = 'above';
            } else if (offset > bounding.height / 2 + 8) {
              position = 'below';
            } else {
              position = null;
            }
            if (onDragOver) {
              onDragOver(e, position);
            }
          }
    }
    onDrop={
      disableDrag
        ? undefined
        : (e) => {
            e.preventDefault();
            const bounding = e.currentTarget.getBoundingClientRect();
            const offset = e.clientY - bounding.top;
            const position: 'above' | 'below' = offset < bounding.height / 2 ? 'above' : 'below';
            if (onDrop) {
              onDrop(e, position);
            }
          }
    }
    onDragLeave={
      disableDrag
        ? undefined
        : (e) => {
            if (onDragOver) {
              onDragOver(e, null);
            }
          }
    }
    onClick={() => onCardClick(task)}
  >
    {/* File Icon in top right */}
    {onFilesClick && (
      <IconButton
        size="small"
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 20,
          background: 'rgba(255,255,255,0.85)',
          boxShadow: 1,
          '&:hover': { background: 'rgba(32,101,209,0.08)' },
        }}
        onClick={(e) => {
          e.stopPropagation();
          onFilesClick(task);
        }}
        aria-label="Show files"
      >
        <InsertDriveFileIcon fontSize="small" color="primary" />
      </IconButton>
    )}
    {/* Drop indicator: horizontal line, subtle and spaced */}
    {dragOverPosition === 'above' && (
      <Box
        sx={{
          position: 'absolute',
          left: 16,
          right: 16,
          top: -10,
          height: 0,
          borderTop: '2px solid',
          borderColor: 'primary.light',
          borderRadius: 2,
          zIndex: 10,
          pointerEvents: 'none',
          boxShadow: '0 1px 6px 0 rgba(32,101,209,0.10)',
        }}
      />
    )}
    {dragOverPosition === 'below' && (
      <Box
        sx={{
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: -10,
          height: 0,
          borderBottom: '2px solid',
          borderColor: 'primary.light',
          borderRadius: 2,
          zIndex: 10,
          pointerEvents: 'none',
          boxShadow: '0 1px 6px 0 rgba(32,101,209,0.10)',
        }}
      />
    )}
    <Card
      draggable={!disableDrag}
      onDragStart={disableDrag ? undefined : () => onDragStart && onDragStart(String(task.id))}
      onDragEnd={disableDrag ? undefined : onDragEnd}
      onClick={() => onCardClick(task)}
      sx={{
        mb: 2,
        background: isDragging ? 'rgba(32, 101, 209, 0.1)' : 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        border: isDragging
          ? '2px solid rgba(32, 101, 209, 0.3)'
          : '1px solid rgba(32, 101, 209, 0.08)',
        borderRadius: 2,
        cursor: isDragging ? 'grabbing' : 'pointer',
        transition: 'all 0.2s ease-in-out',
        transform: isDragging ? 'rotate(3deg) scale(1.02)' : 'none',
        opacity: isDragging ? 0.8 : 1,
        zIndex: isDragging ? 1000 : 1,
        '&:hover': {
          transform: isDragging ? 'rotate(3deg) scale(1.02)' : 'translateY(-2px)',
          boxShadow: (theme) => (isDragging ? theme.customShadows.primary : theme.customShadows.z8),
          borderColor: 'primary.light',
        },
        '&:active': {
          cursor: 'grabbing',
        },
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Typography variant="subtitle2" fontWeight={600} mb={1} color="text.primary">
          <Tooltip title={task.title || 'Untitled'}>
            <span
              style={{
                display: 'block',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                width: '100%',
                maxWidth: '100%',
              }}
            >
              {task.title || <span style={{ color: '#aaa' }}>Untitled</span>}
            </span>
          </Tooltip>
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2} fontSize="0.8rem">
          <Tooltip title={task.description || 'No description'}>
            <span
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                width: '100%',
                maxWidth: '100%',
                minHeight: '1.6em',
              }}
            >
              {task.description || <span style={{ color: '#bbb' }}>No description</span>}
            </span>
          </Tooltip>
        </Typography>
        {/* Tags: Only show if present and non-empty */}
        {Array.isArray(task.tags) && task.tags.length > 0 && (
          <Box display="flex" gap={0.5} mb={2} flexWrap="wrap">
            {task.tags.map((tag: string) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                sx={{
                  fontSize: '0.7rem',
                  height: 20,
                  backgroundColor: 'rgba(32, 101, 209, 0.1)',
                  color: 'primary.main',
                  border: '1px solid rgba(32, 101, 209, 0.2)',
                }}
              />
            ))}
          </Box>
        )}
        {/* Bottom row: Priority and Assignee */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Chip
            label={task.priority ? task.priority : 'No priority'}
            size="small"
            sx={{
              fontSize: '0.7rem',
              height: 20,
              backgroundColor: getPriorityColor(task.priority || '') + '20',
              color: getPriorityColor(task.priority || ''),
              fontWeight: 600,
            }}
          />
          {/* Assigned Creators: Show up to 3 avatars, with +N if more */}
          {Array.isArray(task.assignments) && task.assignments.length > 0 ? (
            <AvatarGroup max={3} spacing="small">
              {task.assignments.map((assignment, idx) => {
                const user = assignment.creator?.user;

                if (!user) {
                  return null;
                }
                return <UserAvatar user={user as User} size="small" />;
              })}
            </AvatarGroup>
          ) : (
            <Avatar
              sx={{
                width: 24,
                height: 24,
                fontSize: '0.7rem',
                backgroundColor: 'grey.400',
                color: 'white',
              }}
            >
              {/* Default icon or initials */}
              <span role="img" aria-label="Unassigned">
                ?
              </span>
            </Avatar>
          )}
        </Box>
      </CardContent>
    </Card>
  </Box>
);

export default MediaPostCard;
