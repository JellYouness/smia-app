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
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { Any } from '@common/defs/types';

interface EditEquipmentDialogProps {
  user: Any;
  onSave: (data: Any) => Promise<void>;
  loading?: boolean;
  open: boolean;
  onClose: () => void;
}

interface EquipmentData {
  [category: string]: string[];
}

const EQUIPMENT_CATEGORIES = ['audio', 'lenses', 'cameras', 'lighting', 'other'];

const EditEquipmentDialog = ({
  user,
  onSave,
  loading,
  open,
  onClose,
}: EditEquipmentDialogProps) => {
  const [equipment, setEquipment] = useState<EquipmentData>(user?.creator?.equipmentInfo || {});

  const handleAddCategory = () => {
    const newCategory = prompt('Enter category name:');
    if (newCategory && !equipment[newCategory]) {
      setEquipment({ ...equipment, [newCategory]: [] });
    }
  };

  const handleRemoveCategory = (category: string) => {
    const updatedEquipment = { ...equipment };
    delete updatedEquipment[category];
    setEquipment(updatedEquipment);
  };

  const handleAddItem = (category: string) => {
    const newItem = prompt(`Enter ${category} item:`);
    if (newItem) {
      setEquipment({
        ...equipment,
        [category]: [...(equipment[category] || []), newItem],
      });
    }
  };

  const handleRemoveItem = (category: string, index: number) => {
    const updatedItems = equipment[category].filter((_, i) => i !== index);
    setEquipment({
      ...equipment,
      [category]: updatedItems,
    });
  };

  const handleSave = async () => {
    await onSave(equipment);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Equipment</DialogTitle>
      <DialogContent>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Edit Equipment
          </Typography>

          <Stack spacing={3}>
            {Object.entries(equipment).map(([category, items]) => (
              <Card key={category} variant="outlined">
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 2,
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600, textTransform: 'capitalize' }}
                    >
                      {category}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveCategory(category)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </Box>

                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {items.map((item, index) => (
                        <Chip
                          key={index}
                          label={item}
                          onDelete={() => handleRemoveItem(category, index)}
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                    <Button
                      startIcon={<Add />}
                      onClick={() => handleAddItem(category)}
                      variant="outlined"
                      size="small"
                      sx={{ alignSelf: 'flex-start' }}
                    >
                      Add {category} item
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            ))}

            <Button
              startIcon={<Add />}
              onClick={handleAddCategory}
              variant="outlined"
              sx={{ alignSelf: 'flex-start' }}
            >
              Add Category
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

export default EditEquipmentDialog;
