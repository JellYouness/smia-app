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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  IconButton,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import { Add, Close, Delete } from '@mui/icons-material';
import { TFunction } from 'i18next';
import { Ambassador, RegionalExpertise } from '../../defs/types';

interface EditRegionalExpertiseDialogProps {
  ambassador: Ambassador;
  onSave: (data: Partial<Ambassador>) => void;
  loading?: boolean;
  open: boolean;
  onClose: () => void;
  t: TFunction;
}

const EditRegionalExpertiseDialog = ({
  ambassador,
  onSave,
  loading = false,
  open,
  onClose,
  t,
}: EditRegionalExpertiseDialogProps) => {
  const [regionalExpertise, setRegionalExpertise] = useState<RegionalExpertise[]>(
    ambassador.regionalExpertise || []
  );
  const [newRegion, setNewRegion] = useState('');
  const [newExpertiseLevel, setNewExpertiseLevel] = useState<
    'BEGINNER' | 'INTERMEDIATE' | 'EXPERT'
  >('BEGINNER');

  const expertiseLevels = [
    { value: 'BEGINNER', label: t('user:beginner') || 'Beginner' },
    { value: 'INTERMEDIATE', label: t('user:intermediate') || 'Intermediate' },
    { value: 'EXPERT', label: t('user:expert') || 'Expert' },
  ];

  const handleAddExpertise = () => {
    if (newRegion.trim() && !regionalExpertise.some((ex) => ex.region === newRegion.trim())) {
      setRegionalExpertise([
        ...regionalExpertise,
        { region: newRegion.trim(), proficiencyLevel: newExpertiseLevel },
      ]);
      setNewRegion('');
      setNewExpertiseLevel('BEGINNER');
    }
  };

  const handleRemoveExpertise = (regionToRemove: string) => {
    setRegionalExpertise(regionalExpertise.filter((ex) => ex.region !== regionToRemove));
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddExpertise();
    }
  };

  const handleSave = () => {
    onSave({ regionalExpertise });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {t('user:edit_regional_expertise') || 'Edit Regional Expertise'}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ p: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {t('user:update_regional_expertise') ||
              'Add or update your regional expertise and proficiency levels.'}
          </Typography>

          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                {t('user:add_regional_expertise') || 'Add Regional Expertise'}
              </Typography>

              <Stack direction="row" spacing={2} alignItems="center">
                <TextField
                  value={newRegion}
                  onChange={(e) => setNewRegion(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t('user:enter_region') || 'e.g., North America, Europe'}
                  size="small"
                  sx={{ flexGrow: 1 }}
                />
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>{t('user:expertise_level') || 'Level'}</InputLabel>
                  <Select
                    value={newExpertiseLevel}
                    onChange={(e) =>
                      setNewExpertiseLevel(e.target.value as 'BEGINNER' | 'INTERMEDIATE' | 'EXPERT')
                    }
                    label={t('user:expertise_level') || 'Level'}
                  >
                    {expertiseLevels.map((level) => (
                      <MenuItem key={level.value} value={level.value}>
                        {level.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={handleAddExpertise}
                  disabled={!newRegion.trim()}
                >
                  {t('common:add') || 'Add'}
                </Button>
              </Stack>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                {t('user:current_regional_expertise') || 'Current Regional Expertise'}
              </Typography>

              <Stack spacing={1}>
                {regionalExpertise.map((expertise, index) => (
                  <Card key={index} variant="outlined">
                    <CardContent sx={{ py: 1.5, px: 2 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Typography variant="body2" fontWeight={500}>
                            {expertise.region}
                          </Typography>
                          <Chip
                            label={
                              expertiseLevels.find((l) => l.value === expertise.proficiencyLevel)
                                ?.label
                            }
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </Stack>
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveExpertise(expertise.region)}
                          color="error"
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
                {regionalExpertise.length === 0 && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textAlign: 'center', py: 2 }}
                  >
                    {t('user:no_regional_expertise') || 'No regional expertise added yet.'}
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

export default EditRegionalExpertiseDialog;
