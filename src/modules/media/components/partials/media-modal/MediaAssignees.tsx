import {
  Avatar,
  Box,
  Chip,
  IconButton,
  Stack,
  Typography,
  Menu,
  MenuItem,
  Divider,
  Select,
  FormControl,
  Button,
  Fade,
  ListItemAvatar,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Add, Person, Check, KeyboardArrowDown, Edit, Delete, Warning } from '@mui/icons-material';
import { useState } from 'react';
import useMedia from '@modules/media/hooks/useMedia';
import { Creator } from '@modules/creators/defs/types';
import { Id } from '@common/defs/types';
import { MEDIA_POST_ASSIGNMENT_ROLE } from '@modules/media/defs/types';

interface MediaAssigneesProps {
  assignees: {
    id: number;
    name: string;
    avatar: string;
    initials: string;
    role: string;
  }[];
  projectCreators: Creator[];
  postId: Id;
  disableAssign?: boolean;
}

enum CREATOR_PROJECT_PERMISSION {
  VIEWER = 'VIEWER',
  EDITOR = 'EDITOR',
}

const MediaAssignees = ({
  assignees,
  projectCreators,
  postId,
  disableAssign,
}: MediaAssigneesProps) => {
  const { upsertAssignee, deleteAssignee } = useMedia();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [assigneeMenuAnchor, setAssigneeMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [selectedRole, setSelectedRole] = useState<MEDIA_POST_ASSIGNMENT_ROLE>(
    MEDIA_POST_ASSIGNMENT_ROLE.EDITOR
  );
  const [selectedAssignee, setSelectedAssignee] = useState<any>(null);
  const [editingRole, setEditingRole] = useState<string>('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const open = Boolean(anchorEl);
  const assigneeMenuOpen = Boolean(assigneeMenuAnchor);

  // Get unassigned creators
  const flattenedCreators = projectCreators.map(({ creator, permission, role, status }) => ({
    ...creator,
    permission,
    role,
    status,
  }));

  const assignedCreatorIds = assignees.map((a) => a.id);
  const availableCreators = flattenedCreators.filter(
    (creator) => !assignedCreatorIds.includes(creator.id)
  );

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (disableAssign) {
      return;
    }
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedCreator(null);
    setSelectedRole(MEDIA_POST_ASSIGNMENT_ROLE.EDITOR);
  };

  const handleAssigneeClick = (event: React.MouseEvent<HTMLElement>, assignee: any) => {
    if (disableAssign) {
      return;
    }
    event.stopPropagation();
    setSelectedAssignee(assignee);
    setEditingRole(assignee.role);
    setAssigneeMenuAnchor(event.currentTarget);
  };

  const handleAssigneeMenuClose = () => {
    setAssigneeMenuAnchor(null);
    setSelectedAssignee(null);
    setEditingRole('');
  };

  const handleCreatorSelect = (creator: Creator) => {
    setSelectedCreator(creator);
  };

  const handleAssign = async () => {
    if (selectedCreator) {
      try {
        await upsertAssignee(postId, {
          creatorId: selectedCreator.id,
          role: selectedRole as MEDIA_POST_ASSIGNMENT_ROLE,
        });
        handleClose();
      } catch (error) {
        console.error('Failed to assign creator:', error);
      }
    }
  };

  const handleEditRole = async () => {
    if (selectedAssignee && editingRole) {
      try {
        await upsertAssignee(postId, {
          creatorId: selectedAssignee.id,
          role: editingRole as MEDIA_POST_ASSIGNMENT_ROLE,
        });
        handleAssigneeMenuClose();
      } catch (error) {
        console.error('Failed to update assignee role:', error);
      }
    }
  };

  const handleDeleteClick = () => {
    setAssigneeMenuAnchor(null);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedAssignee) {
      try {
        await deleteAssignee(postId, selectedAssignee.id);
        handleAssigneeMenuClose();
      } catch (error) {
        console.error('Failed to delete assignee:', error);
      }
    }
    setDeleteDialogOpen(false);
    setSelectedAssignee(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  const getCreatorInitials = (creator: Creator) => {
    const firstName = creator.user?.firstName || '';
    const lastName = creator.user?.lastName || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getCreatorName = (creator: Creator) => {
    return `${creator.user?.firstName || ''} ${creator.user?.lastName || ''}`.trim();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case CREATOR_PROJECT_PERMISSION.EDITOR:
        return { bg: '#ecfdf5', color: '#065f46', border: '#10b981' };
      case CREATOR_PROJECT_PERMISSION.VIEWER:
        return { bg: '#eff6ff', color: '#1e40af', border: '#3b82f6' };
      default:
        return { bg: '#f1f5f9', color: '#475569', border: '#94a3b8' };
    }
  };

  return (
    <Box sx={{ position: 'relative', overflow: 'hidden' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontSize: '1.1rem',
                fontWeight: 700,
                color: '#1e293b',
                mb: 0.5,
              }}
            >
              Team Members
            </Typography>
            <Typography
              variant="caption"
              sx={{
                fontSize: '0.8rem',
                color: '#64748b',
                fontWeight: 500,
              }}
            >
              {assignees.length} people assigned
            </Typography>
          </Box>
        </Box>

        <IconButton
          size="small"
          onClick={handleClick}
          disabled={availableCreators.length === 0 || disableAssign}
          sx={{
            width: 36,
            height: 36,
            border: '2px dashed #3b82f6',
            borderRadius: '10px',
            color: '#3b82f6',
            background: 'rgba(59, 130, 246, 0.05)',
            transition: 'all 0.2s ease',
            '&:hover': {
              background: 'rgba(59, 130, 246, 0.1)',
              transform: 'scale(1.05)',
            },
            '&:disabled': {
              opacity: 0.5,
              cursor: 'not-allowed',
            },
          }}
        >
          <Add fontSize="small" />
        </IconButton>
      </Box>

      <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" sx={{ gap: 2 }}>
        {assignees.map((assignee, index) => (
          <Box
            key={assignee.id}
            onClick={disableAssign ? undefined : (e) => handleAssigneeClick(e, assignee)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              p: 2,
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.8)',
              border: '1px solid rgba(100, 116, 139, 0.1)',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
              '&:hover': {
                background: 'rgba(255, 255, 255, 1)',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(100, 116, 139, 0.15)',
              },
            }}
          >
            <Avatar
              key={assignee.id}
              src={assignee.avatar || undefined}
              sx={{
                width: 36,
                height: 36,
                fontSize: '0.8rem',
                fontWeight: 700,
                background: `linear-gradient(135deg, ${
                  ['#3b82f6', '#ef4444', '#10b981', '#f59e0b'][index % 4]
                } 0%, ${['#1d4ed8', '#dc2626', '#059669', '#d97706'][index % 4]} 100%)`,
                color: 'white',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              }}
            >
              {!assignee.avatar && assignee.initials}
            </Avatar>
            <Box>
              <Typography
                variant="body2"
                sx={{
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: '#1e293b',
                  lineHeight: 1.2,
                }}
              >
                {assignee.name}
              </Typography>
              {assignee.role && (
                <Chip
                  label={assignee.role}
                  size="small"
                  sx={{
                    height: '18px',
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    backgroundColor: getRoleColor(assignee.role).bg,
                    color: getRoleColor(assignee.role).color,
                    border: `1px solid ${getRoleColor(assignee.role).border}20`,
                    mt: 0.5,
                    '& .MuiChip-label': { px: 1 },
                  }}
                />
              )}
            </Box>
          </Box>
        ))}
      </Stack>

      {/* Assignment Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 320,
            maxWidth: 400,
            borderRadius: '16px',
            border: '1px solid rgba(100, 116, 139, 0.1)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
            '& .MuiList-root': {
              p: 2,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="h6"
            sx={{
              fontSize: '1rem',
              fontWeight: 600,
              color: '#1e293b',
              mb: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Person fontSize="small" />
            Assign Team Member
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontSize: '0.85rem',
              color: '#64748b',
              mb: 2,
            }}
          >
            Select a creator from your project team
          </Typography>
        </Box>

        {availableCreators.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.9rem' }}>
              All project creators are already assigned
            </Typography>
          </Box>
        ) : (
          <>
            {/* Creator Selection */}
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="body2"
                sx={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#374151',
                  mb: 1.5,
                }}
              >
                Choose Creator
              </Typography>

              {availableCreators.map((creator) => (
                <MenuItem
                  key={creator.id}
                  onClick={() => handleCreatorSelect(creator)}
                  selected={selectedCreator?.id === creator.id}
                  sx={{
                    borderRadius: '8px',
                    mb: 1,
                    p: 1.5,
                    border:
                      selectedCreator?.id === creator.id
                        ? '2px solid #3b82f6'
                        : '1px solid transparent',
                    background:
                      selectedCreator?.id === creator.id
                        ? 'rgba(59, 130, 246, 0.05)'
                        : 'transparent',
                    '&:hover': {
                      background: 'rgba(59, 130, 246, 0.08)',
                    },
                    '&.Mui-selected': {
                      background: 'rgba(59, 130, 246, 0.05)',
                    },
                  }}
                >
                  <ListItemAvatar sx={{ minWidth: 45 }}>
                    <Avatar
                      sx={{
                        width: 36,
                        height: 36,
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        color: 'white',
                      }}
                    >
                      {getCreatorInitials(creator)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={getCreatorName(creator)}
                    secondary={`${creator.user?.email || 'No email listed'}`}
                    primaryTypographyProps={{
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      color: '#1e293b',
                    }}
                    secondaryTypographyProps={{
                      fontSize: '0.75rem',
                      color: '#64748b',
                    }}
                  />
                  {selectedCreator?.id === creator.id && (
                    <Check fontSize="small" sx={{ color: '#3b82f6', ml: 1 }} />
                  )}
                </MenuItem>
              ))}
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Role Selection */}
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="body2"
                sx={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#374151',
                  mb: 1.5,
                }}
              >
                Assign Role
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as MEDIA_POST_ASSIGNMENT_ROLE)}
                  IconComponent={KeyboardArrowDown}
                  sx={{
                    borderRadius: '8px',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(100, 116, 139, 0.2)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#3b82f6',
                    },
                  }}
                >
                  <MenuItem value={CREATOR_PROJECT_PERMISSION.EDITOR}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: '#10b981',
                        }}
                      />
                      <Typography sx={{ fontSize: '0.9rem', fontWeight: 500 }}>Editor</Typography>
                    </Box>
                  </MenuItem>
                  <MenuItem value={CREATOR_PROJECT_PERMISSION.VIEWER}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: '#3b82f6',
                        }}
                      />
                      <Typography sx={{ fontSize: '0.9rem', fontWeight: 500 }}>Viewer</Typography>
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, pt: 1 }}>
              <Button
                variant="outlined"
                onClick={handleClose}
                sx={{
                  flex: 1,
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 600,
                  borderColor: 'rgba(100, 116, 139, 0.3)',
                  color: '#64748b',
                  '&:hover': {
                    borderColor: '#64748b',
                    background: 'rgba(100, 116, 139, 0.05)',
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleAssign}
                disabled={!selectedCreator}
                sx={{
                  flex: 1,
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
                    boxShadow: '0 6px 16px rgba(59, 130, 246, 0.4)',
                  },
                  '&:disabled': {
                    background: '#e2e8f0',
                    color: '#94a3b8',
                    boxShadow: 'none',
                  },
                }}
              >
                Assign
              </Button>
            </Box>
          </>
        )}
      </Menu>

      {/* Assignee Actions Menu */}
      <Menu
        anchorEl={assigneeMenuAnchor}
        open={assigneeMenuOpen}
        onClose={handleAssigneeMenuClose}
        TransitionComponent={Fade}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 320,
            maxWidth: 400,
            borderRadius: '16px',
            border: '1px solid rgba(100, 116, 139, 0.1)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
            '& .MuiList-root': {
              p: 2,
            },
          },
        }}
        transformOrigin={{ horizontal: 'center', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
      >
        {selectedAssignee && !disableAssign && (
          <>
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="h6"
                sx={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#1e293b',
                  mb: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Edit fontSize="small" />
                Manage {selectedAssignee.name}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontSize: '0.85rem',
                  color: '#64748b',
                  mb: 2,
                }}
              >
                Edit role or remove from assignment
              </Typography>
            </Box>

            {/* Current Assignee Info */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 2,
                mb: 3,
                borderRadius: '8px',
                background: 'rgba(59, 130, 246, 0.05)',
                border: '1px solid rgba(59, 130, 246, 0.1)',
              }}
            >
              <Avatar
                src={selectedAssignee.avatar || undefined}
                sx={{
                  width: 36,
                  height: 36,
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  color: 'white',
                }}
              >
                {!selectedAssignee.avatar && selectedAssignee.initials}
              </Avatar>
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: '#1e293b',
                    lineHeight: 1.2,
                  }}
                >
                  {selectedAssignee.name}
                </Typography>
                <Chip
                  label={selectedAssignee.role}
                  size="small"
                  sx={{
                    height: '18px',
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    backgroundColor: getRoleColor(selectedAssignee.role).bg,
                    color: getRoleColor(selectedAssignee.role).color,
                    border: `1px solid ${getRoleColor(selectedAssignee.role).border}20`,
                    mt: 0.5,
                  }}
                />
              </Box>
            </Box>

            {/* Role Edit Section */}
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="body2"
                sx={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#374151',
                  mb: 1.5,
                }}
              >
                Change Role
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={editingRole}
                  onChange={(e) => setEditingRole(e.target.value)}
                  IconComponent={KeyboardArrowDown}
                  sx={{
                    borderRadius: '8px',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(100, 116, 139, 0.2)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#3b82f6',
                    },
                  }}
                >
                  <MenuItem value={CREATOR_PROJECT_PERMISSION.EDITOR}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: '#10b981',
                        }}
                      />
                      <Typography sx={{ fontSize: '0.9rem', fontWeight: 500 }}>Editor</Typography>
                    </Box>
                  </MenuItem>
                  <MenuItem value={CREATOR_PROJECT_PERMISSION.VIEWER}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: '#3b82f6',
                        }}
                      />
                      <Typography sx={{ fontSize: '0.9rem', fontWeight: 500 }}>Viewer</Typography>
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={handleDeleteClick}
                startIcon={<Delete fontSize="small" />}
                sx={{
                  flex: 1,
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 600,
                  borderColor: 'rgba(239, 68, 68, 0.3)',
                  color: '#ef4444',
                  '&:hover': {
                    borderColor: '#ef4444',
                    background: 'rgba(239, 68, 68, 0.05)',
                  },
                }}
              >
                Remove
              </Button>
              <Button
                variant="contained"
                onClick={handleEditRole}
                disabled={editingRole === selectedAssignee.role}
                sx={{
                  flex: 1,
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                    boxShadow: '0 6px 16px rgba(16, 185, 129, 0.4)',
                  },
                  '&:disabled': {
                    background: '#e2e8f0',
                    color: '#94a3b8',
                    boxShadow: 'none',
                  },
                }}
              >
                Update Role
              </Button>
            </Box>
          </>
        )}
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            maxWidth: '400px',
            width: '100%',
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: '#1e293b',
            fontWeight: 600,
          }}
        >
          <Warning sx={{ color: '#f59e0b' }} />
          Remove Team Member
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#64748b', mb: 2 }}>
            Are you sure you want to remove <strong>{selectedAssignee?.name}</strong> from this
            assignment?
          </Typography>
          <Typography sx={{ color: '#64748b', fontSize: '0.9rem' }}>
            This action cannot be undone. They will lose access to this post and any associated
            permissions.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={handleDeleteCancel}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 600,
              color: '#64748b',
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                boxShadow: '0 6px 16px rgba(239, 68, 68, 0.4)',
              },
            }}
          >
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MediaAssignees;
