import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Stack,
  Typography,
  IconButton,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { Any } from '@common/defs/types';

interface EditAchievementsDialogProps {
  user: Any;
  onSave: (data: Any) => Promise<void>;
  loading?: boolean;
  open: boolean;
  onClose: () => void;
}

const EditAchievementsDialog = ({
  user,
  onSave,
  loading,
  open,
  onClose,
}: EditAchievementsDialogProps) => {
  const [achievements, setAchievements] = useState<string[]>(user?.creator?.achievements || []);

  const handleAddItem = () => {
    setAchievements([...achievements, '']);
  };

  const handleRemoveItem = (index: number) => {
    setAchievements(achievements.filter((_, i) => i !== index));
  };

  const handleUpdateItem = (index: number, value: string) => {
    const updatedItems = [...achievements];
    updatedItems[index] = value;
    setAchievements(updatedItems);
  };

  const handleSave = async () => {
    await onSave(achievements);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Achievements</DialogTitle>
      <DialogContent>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Edit Achievements
          </Typography>

          <Stack spacing={3}>
            {achievements.map((achievement, index) => (
              <Card key={index} variant="outlined">
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 2,
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Achievement {index + 1}
                    </Typography>
                    <IconButton size="small" onClick={() => handleRemoveItem(index)} color="error">
                      <Delete />
                    </IconButton>
                  </Box>

                  <TextField
                    label="Achievement Description"
                    value={achievement}
                    onChange={(e) => handleUpdateItem(index, e.target.value)}
                    fullWidth
                    multiline
                    rows={2}
                    size="small"
                    placeholder="Describe your achievement or accomplishment"
                  />
                </CardContent>
              </Card>
            ))}

            <Button
              startIcon={<Add />}
              onClick={handleAddItem}
              variant="outlined"
              sx={{ alignSelf: 'flex-start' }}
            >
              Add Achievement
            </Button>
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSave} disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditAchievementsDialog;
