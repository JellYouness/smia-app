import { Box, Typography, Card, CardContent, Chip, Avatar } from '@mui/material';
import { useState, useRef, useEffect } from 'react';

// Dummy task data
const DUMMY_TASKS = [
  {
    id: '1',
    title: 'Design user authentication flow',
    description: 'Create wireframes and mockups for the login and registration process',
    assignee: { name: 'Sarah Chen', avatar: 'SC' },
    priority: 'High',
    tags: ['Design', 'UX'],
    status: 'backlog',
  },
  {
    id: '2',
    title: 'Implement API endpoints',
    description: 'Build REST API for user management and project data',
    assignee: { name: 'Mike Johnson', avatar: 'MJ' },
    priority: 'Medium',
    tags: ['Backend', 'API'],
    status: 'in-progress',
  },
  {
    id: '3',
    title: 'Setup CI/CD pipeline',
    description: 'Configure automated testing and deployment workflows',
    assignee: { name: 'Alex Kumar', avatar: 'AK' },
    priority: 'Medium',
    tags: ['DevOps', 'Infrastructure'],
    status: 'under-review',
  },
  {
    id: '4',
    title: 'Database schema design',
    description: 'Design and implement the core database structure',
    assignee: { name: 'Emma Davis', avatar: 'ED' },
    priority: 'High',
    tags: ['Database', 'Backend'],
    status: 'approved',
  },
];

const COLUMNS = [
  { id: 'backlog', title: 'Backlog', color: '#64748B' },
  { id: 'in-progress', title: 'In Progress', color: '#F59E0B' },
  { id: 'under-review', title: 'Under Review', color: '#8B5CF6' },
  { id: 'approved', title: 'Approved', color: '#10B981' },
];

const getPriorityColor = (priority: string) => {
  switch (priority.toLowerCase()) {
    case 'high':
      return '#EF4444';
    case 'medium':
      return '#F59E0B';
    case 'low':
      return '#10B981';
    default:
      return '#64748B';
  }
};

const TaskCard = ({
  task,
  isDragging,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  dragOverPosition,
}: {
  task: (typeof DUMMY_TASKS)[0];
  isDragging: boolean;
  onDragStart: (taskId: string) => void;
  onDragEnd: () => void;
  onDragOver: (e: React.DragEvent, position: 'above' | 'below' | null) => void;
  onDrop: (e: React.DragEvent, position: 'above' | 'below') => void;
  dragOverPosition: 'above' | 'below' | null;
}) => (
  <Box
    sx={{ position: 'relative' }}
    onDragOver={(e) => {
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
      onDragOver(e, position);
    }}
    onDrop={(e) => {
      e.preventDefault();
      const bounding = e.currentTarget.getBoundingClientRect();
      const offset = e.clientY - bounding.top;
      const position: 'above' | 'below' = offset < bounding.height / 2 ? 'above' : 'below';
      onDrop(e, position);
    }}
    onDragLeave={(e) => {
      onDragOver(e, null);
    }}
  >
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
      draggable
      onDragStart={() => onDragStart(task.id)}
      onDragEnd={onDragEnd}
      sx={{
        mb: 2,
        background: isDragging ? 'rgba(32, 101, 209, 0.1)' : 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        border: isDragging
          ? '2px solid rgba(32, 101, 209, 0.3)'
          : '1px solid rgba(32, 101, 209, 0.08)',
        borderRadius: 2,
        cursor: 'grab',
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
          {task.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2} fontSize="0.8rem">
          {task.description}
        </Typography>
        {/* Tags */}
        <Box display="flex" gap={0.5} mb={2} flexWrap="wrap">
          {task.tags.map((tag) => (
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
        {/* Bottom row: Priority and Assignee */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Chip
            label={task.priority}
            size="small"
            sx={{
              fontSize: '0.7rem',
              height: 20,
              backgroundColor: getPriorityColor(task.priority) + '20',
              color: getPriorityColor(task.priority),
              fontWeight: 600,
            }}
          />
          <Avatar
            sx={{
              width: 24,
              height: 24,
              fontSize: '0.7rem',
              backgroundColor: 'primary.main',
              color: 'white',
            }}
          >
            {task.assignee.avatar}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  </Box>
);

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
}: {
  column: (typeof COLUMNS)[0];
  tasks: typeof DUMMY_TASKS;
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
}) => {
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
        {tasks.map((task, idx) => (
          <TaskCard
            key={task.id}
            task={task}
            isDragging={draggedTaskId === task.id}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragOver={(e, position) => handleTaskDragOver(e, task.id, position)}
            onDrop={(e, position) => handleTaskDrop(e, task.id, position)}
            dragOverPosition={dragOverTaskId === task.id ? dragOverPosition : null}
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

export default function BoardPane() {
  const [tasks, setTasks] = useState(DUMMY_TASKS);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  // Ref for the horizontal scroll area
  const columnsScrollRef = useRef<HTMLDivElement>(null);

  // Adjust the height of the columns area to account for the fixed scrollbar
  const [columnsHeight, setColumnsHeight] = useState('calc(100% - 100px)');
  useEffect(() => {
    // 24px is the height of the fixed scrollbar area
    setColumnsHeight('calc(100% - 100px)');
  }, []);

  const handleDragStart = (taskId: string) => {
    setDraggedTaskId(taskId);
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    if (dragOverColumn !== columnId) {
      setDragOverColumn(columnId);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only clear drag over if we're leaving the column entirely
    // Check if the related target is still within the column
    const currentTarget = e.currentTarget as HTMLElement;
    const relatedTarget = e.relatedTarget as HTMLElement;

    if (!currentTarget.contains(relatedTarget)) {
      setDragOverColumn(null);
    }
  };

  // Enhanced drop handler for reordering and moving between columns
  const handleDrop = (
    e: React.DragEvent,
    targetColumnId: string,
    targetTaskId: string,
    position: 'above' | 'below'
  ) => {
    e.preventDefault();
    if (!draggedTaskId) {
      return;
    }
    setTasks((prevTasks) => {
      const draggedTask = prevTasks.find((t) => t.id === draggedTaskId);
      if (!draggedTask) {
        return prevTasks;
      }
      // Remove dragged task
      const filtered = prevTasks.filter((t) => t.id !== draggedTaskId);
      // If moving to a new column, update status
      const updatedTask = { ...draggedTask, status: targetColumnId };
      // Find target index (only among tasks in the target column)
      const targetColumnTasks = filtered.filter((t) => t.status === targetColumnId);
      let insertIdx = 0;
      if (targetTaskId === 'end') {
        // Place at the end of the column
        // Find last index of the target column
        const lastIdx = filtered.reduceRight(
          (acc, t, idx) => (t.status === targetColumnId && acc === -1 ? idx : acc),
          -1
        );
        insertIdx = lastIdx === -1 ? filtered.length : lastIdx + 1;
      } else {
        // Find the index of the target task in the filtered array
        const idxInFiltered = filtered.findIndex((t) => t.id === targetTaskId);
        if (position === 'above') {
          insertIdx = idxInFiltered;
        } else {
          insertIdx = idxInFiltered + 1;
        }
      }
      // Insert the updated task at the correct position
      const newTasks = [...filtered.slice(0, insertIdx), updatedTask, ...filtered.slice(insertIdx)];
      return newTasks;
    });
    setDraggedTaskId(null);
    setDragOverColumn(null);
  };

  return (
    <Box
      sx={{
        height: '100%',
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        background: 'transparent',
        position: 'relative',
        overflow: 'hidden', // Prevents leaking, but not disables scrollbars inside
      }}
    >
      {/* Board Header */}
      <Box mb={3}>
        <Typography variant="h5" fontWeight={700} color="text.primary" mb={1}>
          Project Board
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Drag and drop tasks between columns to update their status
        </Typography>
      </Box>

      {/* Board Columns (fills available space, scrolls both directions) */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'auto',
        }}
      >
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflowX: 'auto',
            overflowY: 'auto',
            display: 'flex',
            gap: 3,
            pb: 2,
            '&::-webkit-scrollbar': {
              width: 8,
              height: 8,
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'rgba(32, 101, 209, 0.1)',
              borderRadius: 4,
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(32, 101, 209, 0.3)',
              borderRadius: 4,
              '&:hover': {
                backgroundColor: 'rgba(32, 101, 209, 0.5)',
              },
            },
          }}
        >
          {COLUMNS.map((column) => (
            <BoardColumn
              key={column.id}
              column={column}
              tasks={tasks.filter((task) => task.status === column.id)}
              draggedTaskId={draggedTaskId}
              isDragOver={dragOverColumn === column.id}
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDragLeave={(e) => handleDragLeave(e)}
              onDrop={handleDrop}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
