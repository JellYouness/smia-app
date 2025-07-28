import React, { useState } from 'react';
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  IconButton,
  Card,
  CardContent,
} from '@mui/material';
import { Add, Close, Delete } from '@mui/icons-material';
import { TFunction } from 'i18next';
import { Ambassador, FeaturedWork } from '../../defs/types';

interface EditTeamDescriptionDialogProps {
  ambassador: Ambassador;
  onSave: (data: Partial<Ambassador>) => void;
  loading?: boolean;
  open: boolean;
  onClose: () => void;
  t: TFunction;
}

const EditTeamDescriptionDialog = ({
  ambassador,
  onSave,
  loading = false,
  open,
  onClose,
  t,
}: EditTeamDescriptionDialogProps) => {
  const [teamDescription, setTeamDescription] = useState(ambassador.teamDescription || '');
  const [featuredWork, setFeaturedWork] = useState<FeaturedWork[]>(ambassador.featuredWork || []);
  const [newWorkDescription, setNewWorkDescription] = useState('');

  const handleAddFeaturedWork = () => {
    if (newWorkDescription.trim()) {
      setFeaturedWork([
        ...featuredWork,
        {
          projectId: Date.now(), // Temporary ID
          description: newWorkDescription.trim(),
        },
      ]);
      setNewWorkDescription('');
    }
  };

  const handleRemoveFeaturedWork = (indexToRemove: number) => {
    setFeaturedWork(featuredWork.filter((_, index) => index !== indexToRemove));
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddFeaturedWork();
    }
  };

  const handleSave = () => {
    onSave({
      teamDescription,
      featuredWork,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {t('user:edit_team_description') || 'Edit Team Description'}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ p: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {t('user:update_team_description') || 'Update your team description and featured work.'}
          </Typography>

          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                {t('user:team_description') || 'Team Description'}
              </Typography>
              <TextField
                value={teamDescription}
                onChange={(e) => setTeamDescription(e.target.value)}
                multiline
                rows={4}
                fullWidth
                placeholder={
                  t('user:enter_team_description') ||
                  'Describe your team, their expertise, and what makes you unique...'
                }
                helperText={
                  t('user:team_description_help') ||
                  'Provide a detailed description of your team and their capabilities'
                }
              />
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                {t('user:featured_work') || 'Featured Work'}
              </Typography>

              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                <TextField
                  value={newWorkDescription}
                  onChange={(e) => setNewWorkDescription(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={
                    t('user:enter_featured_work') || 'Add a description of your featured work'
                  }
                  size="small"
                  sx={{ flexGrow: 1 }}
                />
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={handleAddFeaturedWork}
                  disabled={!newWorkDescription.trim()}
                >
                  {t('common:add') || 'Add'}
                </Button>
              </Stack>

              <Stack spacing={1}>
                {featuredWork.map((work, index) => (
                  <Card key={index} variant="outlined">
                    <CardContent sx={{ py: 1.5, px: 2 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="body2" sx={{ flexGrow: 1 }}>
                          {work.description}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveFeaturedWork(index)}
                          color="error"
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
                {featuredWork.length === 0 && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textAlign: 'center', py: 2 }}
                  >
                    {t('user:no_featured_work') || 'No featured work added yet.'}
                  </Typography>
                )}
              </Stack>
            </Box>
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button variant="gradient" color="error" onClick={onClose} disabled={loading}>
          {t('common:cancel') || 'Cancel'}
        </Button>
        <Button variant="gradient" color="primary" onClick={handleSave} disabled={loading}>
          {loading ? t('common:saving') || 'Saving...' : t('common:save_changes') || 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditTeamDescriptionDialog;
