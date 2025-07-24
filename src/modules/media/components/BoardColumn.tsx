import { useState } from 'react';
import { MediaPost, MEDIA_POST_STATUS } from '../defs/types';
import { Box, Chip, Typography } from '@mui/material';
import MediaPostCard from './MediaPostCard';

interface BoardColumnProps {
  column: (typeof COLUMNS)[0];
  tasks: MediaPost[];
  draggedTaskId: string | null;
  isDragOver: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (
    e: React.DragEvent,
    columnId: string,
    targetTaskId: string,
    position: 'above' | 'below'
  ) => void;
  onDragStart: (taskId: string) => void;
  onDragEnd: () => void;
  onCardClick: (task: MediaPost) => void;
}

const COLUMNS = [
  { id: 'backlog', title: 'Backlog', color: '#64748B', status: MEDIA_POST_STATUS.BACKLOG },
  {
    id: 'in-progress',
    title: 'In Progress',
    color: '#F59E0B',
    status: MEDIA_POST_STATUS.IN_PROGRESS,
  },
  {
    id: 'under-review',
    title: 'Under Review',
    color: '#8B5CF6',
    status: MEDIA_POST_STATUS.UNDER_REVIEW,
  },
  { id: 'approved', title: 'Approved', color: '#10B981', status: MEDIA_POST_STATUS.APPROVED },
];

const BoardColumn = ({
  column,
  tasks,
  draggedTaskId,
  isDragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragStart,
  onDragEnd,
  onCardClick,
}: BoardColumnProps) => {
  const [dragOverTaskId, setDragOverTaskId] = useState<string | null>(null);
  const [dragOverPosition, setDragOverPosition] = useState<'above' | 'below' | null>(null);

  const handleTaskDragOver = (
    e: React.DragEvent,
    taskId: string,
    position: 'above' | 'below' | null
  ) => {
    e.preventDefault();
    setDragOverTaskId(taskId);
    setDragOverPosition(position);
  };

  const handleTaskDrop = (e: React.DragEvent, taskId: string, position: 'above' | 'below') => {
    e.preventDefault();
    setDragOverTaskId(null);
    setDragOverPosition(null);
    onDrop(e, column.id, taskId, position);
  };

  return (
    <Box
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      sx={{
        minWidth: 280,
        background: isDragOver ? 'rgba(32, 101, 209, 0.1)' : 'rgba(255, 255, 255, 0.4)',
        backdropFilter: 'blur(15px)',
        borderRadius: 2,
        border: isDragOver
          ? '2px dashed rgba(32, 101, 209, 0.4)'
          : '1px solid rgba(32, 101, 209, 0.1)',
        p: 2,
        height: 'fit-content',
        minHeight: 200,
        transition: 'all 0.2s ease-in-out',
        transform: isDragOver ? 'scale(1.02)' : 'scale(1)',
      }}
    >
      {/* Column Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 2,
          pb: 1,
          borderBottom: '2px solid',
          borderColor: column.color + '30',
        }}
      >
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: column.color,
            mr: 1,
          }}
        />
        <Typography variant="subtitle1" fontWeight={700} color="text.primary">
          {column.title}
        </Typography>
        <Chip
          label={tasks.length}
          size="small"
          sx={{
            ml: 'auto',
            minWidth: 24,
            height: 20,
            fontSize: '0.7rem',
            backgroundColor: column.color + '20',
            color: column.color,
            fontWeight: 600,
          }}
        />
      </Box>

      {/* Tasks */}
      <Box sx={{ minHeight: 100 }}>
        {tasks.map((task: MediaPost, idx: number) => (
          <MediaPostCard
            key={String(task.id)}
            task={task}
            isDragging={String(draggedTaskId) === String(task.id)}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragOver={(e, position) => handleTaskDragOver(e, String(task.id), position)}
            onDrop={(e, position) => handleTaskDrop(e, String(task.id), position)}
            dragOverPosition={dragOverTaskId === String(task.id) ? dragOverPosition : null}
            onCardClick={onCardClick}
          />
        ))}
        {/* Drop zone at the end of the column */}
        {isDragOver && (
          <Box
            onDragOver={(e) => {
              e.preventDefault();
              setDragOverTaskId('end');
              setDragOverPosition('below');
            }}
            onDrop={(e) => {
              e.preventDefault();
              setDragOverTaskId(null);
              setDragOverPosition(null);
              onDrop(e, column.id, 'end', 'below');
            }}
            sx={{
              height: 60,
              border: '2px dashed rgba(32, 101, 209, 0.0)', // Hide default border
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(32, 101, 209, 0.05)',
              mt: 2,
              position: 'relative',
            }}
          >
            {/* Horizontal drop line at the bottom */}
            {dragOverTaskId === 'end' && dragOverPosition === 'below' && (
              <Box
                sx={{
                  position: 'absolute',
                  left: 16,
                  right: 16,
                  bottom: 8,
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
            <Typography variant="body2" color="primary.main" fontWeight={600}>
              Drop task here
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default BoardColumn;
