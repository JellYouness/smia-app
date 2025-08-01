import React, { useEffect, useState } from 'react';
import {
  Box,
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
  Autocomplete,
  CircularProgress,
  Alert,
  Stack,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Star as StarIcon,
  Search as SearchIcon,
  Visibility,
} from '@mui/icons-material';
import { useTeamMembers } from '../hooks/useTeamMembers';
import { useSearchCreators } from '../hooks/useSearchCreators';
import { TeamMember } from '../defs/types';
import { Creator } from '@modules/creators/defs/types';
import { User } from '@modules/users/defs/types';
import { useRouter } from 'next/router';
import SectionCard from '@modules/users/components/SectionCard';
import UserAvatar from '@common/components/lib/partials/UserAvatar';

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
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [role, setRole] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);

  const {
    creators,
    loading: searchLoading,
    error: searchError,
    searchCreators,
  } = useSearchCreators({
    searchTerm,
    debounceMs: 300,
  });

  const handleSearchChange = (event: React.SyntheticEvent, value: string) => {
    setSearchTerm(value);
    searchCreators(value);
  };

  const handleCreatorSelect = (event: React.SyntheticEvent, creator: Creator | null) => {
    setSelectedCreator(creator);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCreator) {
      onAdd({
        userId: selectedCreator.userId,
        role: role.trim() || undefined,
        isPrimary,
      });
      setSelectedCreator(null);
      setSearchTerm('');
      setRole('');
      setIsPrimary(false);
    }
  };

  const handleClose = () => {
    setSelectedCreator(null);
    setSearchTerm('');
    setRole('');
    setIsPrimary(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Team Member</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Autocomplete
            autoFocus
            options={creators}
            getOptionLabel={(option) => {
              const user = option.user as User;
              return user?.name || user?.email || `Creator ${option.id}`;
            }}
            loading={searchLoading}
            value={selectedCreator}
            inputValue={searchTerm}
            onInputChange={handleSearchChange}
            onChange={handleCreatorSelect}
            renderInput={(params) => (
              <TextField
                {...params}
                margin="dense"
                label="Search creators by name or email"
                variant="outlined"
                required
                disabled={loading}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
                      {params.InputProps.startAdornment}
                    </>
                  ),
                  endAdornment: (
                    <>
                      {searchLoading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            renderOption={(props, option) => {
              const user = option.user as User;
              return (
                <Box component="li" {...props}>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <UserAvatar user={user as User} size="medium" width={32} height={32} />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body2" noWrap>
                        {user?.name || 'Unknown Creator'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" noWrap>
                        {user?.email || 'No email'}
                      </Typography>
                    </Box>
                    {option.verificationStatus === 'VERIFIED' && (
                      <Chip
                        label="Verified"
                        size="small"
                        color="success"
                        variant="outlined"
                        sx={{ ml: 1 }}
                      />
                    )}
                  </Box>
                </Box>
              );
            }}
            noOptionsText={searchTerm ? 'No creators found' : 'Start typing to search creators'}
            filterOptions={(x) => x} // Disable built-in filtering since we're using API search
          />

          {searchError && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {searchError}
            </Alert>
          )}

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
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading || !selectedCreator}>
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
  const router = useRouter();

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
      // Show success message for invitation sent
      if (result.data?.invitation_id) {
        // You can add a toast notification here if you have a notification system
        console.log('Invitation sent successfully!');
      }
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
    // eslint-disable-next-line no-alert
    if (window.confirm('Are you sure you want to remove this team member?')) {
      await removeTeamMember(teamMemberId);
    }
  };

  if (loading) {
    return (
      <SectionCard title="Team Members" readOnly={readOnly}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={100}>
          <CircularProgress />
        </Box>
      </SectionCard>
    );
  }

  return (
    <>
      <SectionCard title="Team Members" readOnly={readOnly} onEdit={() => setAddDialogOpen(true)}>
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
                <ListItem sx={{ px: 1, py: 0 }}>
                  <ListItemAvatar>
                    <UserAvatar
                      user={member.user as unknown as User}
                      size="medium"
                      width={32}
                      height={32}
                    />
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
                  <ListItemSecondaryAction>
                    <Stack direction="row" alignItems="center">
                      <IconButton
                        size="small"
                        onClick={() => router.push(`/creators/${member.id}`)}
                        disabled={loading}
                      >
                        <Visibility color="success" />
                      </IconButton>
                      {!readOnly && (
                        <>
                          <IconButton
                            size="small"
                            onClick={() => setEditingMember(member)}
                            disabled={loading}
                            color="primary"
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
                        </>
                      )}
                    </Stack>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < teamMembers.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </SectionCard>

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
