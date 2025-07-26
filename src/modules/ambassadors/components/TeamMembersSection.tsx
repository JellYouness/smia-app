import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Checkbox,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { useTeamMembers } from '../hooks/useTeamMembers';
import { TeamMember } from '../defs/types';

interface TeamMembersSectionProps {
  ambassadorId: number;
  readOnly?: boolean;
}

interface AddTeamMemberDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (data: { userId: number; role?: string; isPrimary?: boolean }) => void;
  loading: boolean;
}

const AddTeamMemberDialog: React.FC<AddTeamMemberDialogProps> = ({
  open,
  onClose,
  onAdd,
  loading,
}) => {
  const [userId, setUserId] = useState('');
  const [role, setRole] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userId.trim()) {
      onAdd({
        userId: parseInt(userId),
        role: role.trim() || undefined,
        isPrimary,
      });
      setUserId('');
      setRole('');
      setIsPrimary(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Team Member</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="User ID"
            type="number"
            fullWidth
            variant="outlined"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
            disabled={loading}
          />
          <TextField
            margin="dense"
            label="Role (optional)"
            fullWidth
            variant="outlined"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            disabled={loading}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={isPrimary}
                onChange={(e) => setIsPrimary(e.target.checked)}
                disabled={loading}
              />
            }
            label="Primary team member"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading || !userId.trim()}>
            Add Member
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export const TeamMembersSection: React.FC<TeamMembersSectionProps> = ({
  ambassadorId,
  readOnly = false,
}) => {
  const {
    teamMembers,
    loading,
    error,
    fetchTeamMembers,
    addTeamMember,
    updateTeamMember,
    removeTeamMember,
  } = useTeamMembers({ ambassadorId });

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  useEffect(() => {
    fetchTeamMembers();
  }, [fetchTeamMembers]);

  const handleAddTeamMember = async (data: {
    userId: number;
    role?: string;
    isPrimary?: boolean;
  }) => {
    const result = await addTeamMember(data);
    if (result.success) {
      setAddDialogOpen(false);
    }
  };

  const handleUpdateTeamMember = async (
    teamMemberId: number,
    data: { role?: string; isPrimary?: boolean }
  ) => {
    await updateTeamMember(teamMemberId, data);
    setEditingMember(null);
  };

  const handleRemoveTeamMember = async (teamMemberId: number) => {
    if (window.confirm('Are you sure you want to remove this team member?')) {
      await removeTeamMember(teamMemberId);
    }
  };

  if (loading && teamMembers.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Team Members
          </Typography>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={100}>
            <PersonIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Team Members</Typography>
            {!readOnly && (
              <Button
                startIcon={<AddIcon />}
                variant="outlined"
                size="small"
                onClick={() => setAddDialogOpen(true)}
              >
                Add Member
              </Button>
            )}
          </Box>

          {error && (
            <Typography color="error" variant="body2" mb={2}>
              {error}
            </Typography>
          )}

          {teamMembers.length === 0 ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={100}>
              <Box textAlign="center">
                <PersonIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  No team members yet
                </Typography>
              </Box>
            </Box>
          ) : (
            <List>
              {teamMembers.map((member, index) => (
                <React.Fragment key={member.id}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        {member.user?.profile?.avatar ? (
                          <img src={member.user.profile.avatar} alt={member.user.name} />
                        ) : (
                          <PersonIcon />
                        )}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="body1">
                            {member.user?.name || `User ${member.userId}`}
                          </Typography>
                          {member.isPrimary && (
                            <Chip
                              icon={<StarIcon />}
                              label="Primary"
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          )}
                          {member.role && (
                            <Chip label={member.role} size="small" variant="outlined" />
                          )}
                        </Box>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          {member.user?.email}
                        </Typography>
                      }
                    />
                    {!readOnly && (
                      <ListItemSecondaryAction>
                        <IconButton
                          size="small"
                          onClick={() => setEditingMember(member)}
                          disabled={loading}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveTeamMember(member.id)}
                          disabled={loading}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    )}
                  </ListItem>
                  {index < teamMembers.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      <AddTeamMemberDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onAdd={handleAddTeamMember}
        loading={loading}
      />

      {/* Edit Dialog */}
      <Dialog open={!!editingMember} onClose={() => setEditingMember(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Team Member</DialogTitle>
        <DialogContent>
          {editingMember && (
            <Box>
              <TextField
                margin="dense"
                label="Role"
                fullWidth
                variant="outlined"
                defaultValue={editingMember.role || ''}
                onChange={(e) => {
                  setEditingMember({
                    ...editingMember,
                    role: e.target.value,
                  });
                }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={editingMember.isPrimary}
                    onChange={(e) => {
                      setEditingMember({
                        ...editingMember,
                        isPrimary: e.target.checked,
                      });
                    }}
                  />
                }
                label="Primary team member"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingMember(null)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              if (editingMember) {
                handleUpdateTeamMember(editingMember.id, {
                  role: editingMember.role,
                  isPrimary: editingMember.isPrimary,
                });
              }
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
