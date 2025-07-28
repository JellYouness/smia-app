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
  Chip,
  Stack,
  IconButton,
} from '@mui/material';
import { Add, Close } from '@mui/icons-material';
import { TFunction } from 'i18next';
import { Ambassador } from '../../defs/types';

interface EditSpecializationsDialogProps {
  ambassador: Ambassador;
  onSave: (data: Partial<Ambassador>) => void;
  loading?: boolean;
  open: boolean;
  onClose: () => void;
  t: TFunction;
}

const EditSpecializationsDialog = ({
  ambassador,
  onSave,
  loading = false,
  open,
  onClose,
  t,
}: EditSpecializationsDialogProps) => {
  const [specializations, setSpecializations] = useState<string[]>(
    ambassador.specializations || []
  );
  const [newSpecialization, setNewSpecialization] = useState('');

  const handleAddSpecialization = () => {
    if (newSpecialization.trim() && !specializations.includes(newSpecialization.trim())) {
      setSpecializations([...specializations, newSpecialization.trim()]);
      setNewSpecialization('');
    }
  };

  const handleRemoveSpecialization = (specToRemove: string) => {
    setSpecializations(specializations.filter((spec) => spec !== specToRemove));
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddSpecialization();
    }
  };

  const handleSave = () => {
    onSave({ specializations });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {t('user:edit_specializations') || 'Edit Specializations'}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ p: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {t('user:update_specializations') || 'Add or remove your areas of specialization.'}
          </Typography>

          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                {t('user:add_specialization') || 'Add Specialization'}
              </Typography>

              <Stack direction="row" spacing={1}>
                <TextField
                  value={newSpecialization}
                  onChange={(e) => setNewSpecialization(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={
                    t('user:enter_specialization') || 'e.g., Web Development, UI/UX Design'
                  }
                  size="small"
                  sx={{ flexGrow: 1 }}
                />
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={handleAddSpecialization}
                  disabled={!newSpecialization.trim()}
                >
                  {t('common:add') || 'Add'}
                </Button>
              </Stack>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                {t('user:current_specializations') || 'Current Specializations'}
              </Typography>

              <Stack direction="row" spacing={1} flexWrap="wrap">
                {specializations.map((spec, index) => (
                  <Chip
                    key={index}
                    label={spec}
                    onDelete={() => handleRemoveSpecialization(spec)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
                {specializations.length === 0 && (
                  <Typography variant="body2" color="text.secondary">
                    {t('user:no_specializations') || 'No specializations added yet.'}
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

export default EditSpecializationsDialog;
