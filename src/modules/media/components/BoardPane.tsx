import { Box, Typography, Button, Skeleton, Fade } from '@mui/material';
import { useState, useEffect, useMemo } from 'react';
import CreateMediaPostModal from './CreateMediaPostModal';
import useMedia from '../hooks/useMedia';
import { mutate as globalMutate } from 'swr';
import { MEDIA_POST_STATUS, MediaPost } from '../defs/types';
import MediaPostDetailsModal from './partials/media-modal/MediaPostDetailsModal';
import BoardColumn from './BoardColumn';
import useAuth from '@modules/auth/hooks/api/useAuth';
import usePermissions from '@modules/permissions/hooks/usePermissions';
import Namespaces from '@common/defs/namespaces';
import { CRUD_ACTION } from '@common/defs/types';

interface BoardPaneProps {
  projectId: number;
  onFilesClick: (post: MediaPost) => void;
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

const BoardPane = ({ projectId, onFilesClick }: BoardPaneProps) => {
  const { items: mediaPosts, readAll, mutate, patchOne } = useMedia({ fetchItems: true });
  const { user } = useAuth();
  const { can } = usePermissions();
  const [loading, setLoading] = useState(false);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [optimisticPosts, setOptimisticPosts] = useState<MediaPost[] | null>(null);
  const [selectedPost, setSelectedPost] = useState<MediaPost | null>(null);

  const canCreateMediaPost = useMemo(() => {
    return can(Namespaces.MediaPosts, CRUD_ACTION.CREATE);
  }, [can]);

  const mediaPostsKey = '/media_posts';

  const optimisticDeletePost = (postId: number) => {
    globalMutate(
      mediaPostsKey,
      (posts: MediaPost[] = []) => posts.filter((post) => post.id !== postId),
      false
    );
    setOptimisticPosts((prev) => {
      const current = prev ?? mediaPosts ?? [];
      return current.filter((post) => post.id !== postId);
    });
  };

  const postsToRender = optimisticPosts ?? mediaPosts;

  useEffect(() => {
    if (projectId) {
      setLoading(true);
      readAll(1, 'all', undefined, [
        { filterColumn: 'projectId', filterOperator: '=', filterValue: projectId },
      ]).finally(() => setLoading(false));
    }
  }, [projectId]);

  useEffect(() => {
    setOptimisticPosts(null);
  }, [mediaPosts]);

  const [columnsHeight, setColumnsHeight] = useState('calc(100% - 100px)');
  useEffect(() => {
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
    // Use the enum value from the column definition
    const newStatus = COLUMNS.find((col) => String(col.id) === String(targetColumnId))?.status;
    if (!newStatus) {
      setDraggedTaskId(null);
      setDragOverColumn(null);
      return;
    }
    // Optimistically update the UI
    setOptimisticPosts((prev) => {
      const current = prev ?? mediaPosts ?? [];
      return current.map((post) =>
        String(post.id) === String(draggedTaskId) ? { ...post, status: newStatus } : post
      );
    });
    // End drag state immediately for instant feedback
    setDraggedTaskId(null);
    setDragOverColumn(null);
    setLoading(true);
    patchOne(Number(draggedTaskId), { status: newStatus })
      .then((res) => {
        if (res.success && res.data && res.data.item) {
          // Update the optimistic state with the returned item
          setOptimisticPosts((prev) => {
            const current = prev ?? mediaPosts ?? [];
            return current.map((post) =>
              String(post.id) === String(draggedTaskId) ? { ...post, ...res.data!.item } : post
            );
          });
        }
        // Add a small delay before mutate to let backend update
        setTimeout(() => {
          mutate();
        }, 200);
      })
      .catch(() => {
        setOptimisticPosts(null);
        // Optionally show an error notification
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Pass a handler to TaskCard to open the modal
  const handleCardClick = (task: MediaPost) => {
    setSelectedPost(task);
  };

  // Add a flag to disable drag for creators
  const disableDrag = user?.userType === 'CREATOR';

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <Fade in timeout={300}>
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowX: 'auto',
          overflowY: 'auto',
          display: 'flex',
          gap: 3,
          pb: 2,
          width: '100%',
        }}
      >
        {COLUMNS.map((column) => (
          <Box
            key={String(column.id)}
            sx={{ flex: 1, minWidth: 280, display: 'flex', flexDirection: 'column' }}
          >
            {/* Column header skeleton */}
            <Box sx={{ mb: 2 }}>
              <Skeleton variant="text" width="60%" height={24} sx={{ mb: 1, borderRadius: 1 }} />
              <Skeleton variant="text" width="40%" height={16} sx={{ borderRadius: 1 }} />
            </Box>

            {/* Column content skeleton */}
            <Box
              sx={{
                flex: 1,
                minHeight: 400,
                background: 'rgba(255, 255, 255, 0.6)',
                borderRadius: 2,
                border: '1px dashed rgba(32, 101, 209, 0.2)',
                p: 2,
              }}
            >
              {/* Task card skeletons */}
              {[1, 2, 3].map((index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Skeleton
                    variant="rectangular"
                    height={80}
                    sx={{
                      borderRadius: 2,
                      background: 'rgba(32, 101, 209, 0.08)',
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    </Fade>
  );

  return (
    <Box
      sx={{
        height: '100%',
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        background: 'transparent',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Board Header */}
      <Box mb={3} display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography variant="h5" fontWeight={700} color="text.primary" mb={1}>
            Project Board
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Drag and drop tasks between columns to update their status
          </Typography>
        </Box>
        {canCreateMediaPost && (
          <Button
            variant="contained"
            sx={{
              backgroundColor: 'primary.main',
              color: 'white',
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: 2,
              '&:hover': { backgroundColor: 'primary.dark' },
              ml: 2,
              minWidth: 180,
              height: 40,
            }}
            onClick={() => setCreateModalOpen(true)}
          >
            Create a media post
          </Button>
        )}
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
        {loading ? (
          <LoadingSkeleton />
        ) : (
          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              overflowX: 'auto',
              overflowY: 'auto',
              display: 'flex',
              gap: 3,
              pb: 2,
              width: '100%',
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
              <Box
                key={String(column.id)}
                sx={{ flex: 1, minWidth: 280, display: 'flex', flexDirection: 'column' }}
              >
                <BoardColumn
                  column={column}
                  tasks={
                    Array.isArray(postsToRender)
                      ? postsToRender.filter((task: MediaPost) => task.status === column.status)
                      : []
                  }
                  draggedTaskId={draggedTaskId}
                  isDragOver={dragOverColumn === String(column.id)}
                  onDragOver={disableDrag ? undefined : (e) => handleDragOver(e, String(column.id))}
                  onDragLeave={disableDrag ? undefined : (e) => handleDragLeave(e)}
                  onDrop={disableDrag ? undefined : handleDrop}
                  onDragStart={disableDrag ? undefined : handleDragStart}
                  onDragEnd={disableDrag ? undefined : handleDragEnd}
                  onCardClick={handleCardClick}
                  onFilesClick={onFilesClick}
                  disableDrag={disableDrag}
                />
              </Box>
            ))}
          </Box>
        )}
      </Box>
      <CreateMediaPostModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        projectId={projectId}
        onCreated={() => {
          setCreateModalOpen(false);
          mutate();
        }}
      />
      <MediaPostDetailsModal
        open={!!selectedPost}
        mediaPost={selectedPost}
        onClose={async () => {
          setSelectedPost(null);
          await new Promise<void>((resolve) => {
            setTimeout(resolve, 100);
          });
          globalMutate(mediaPostsKey);
        }}
        onOptimisticDelete={optimisticDeletePost}
      />
    </Box>
  );
};

export default BoardPane;
