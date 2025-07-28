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

const EditEquipmentDialog = ({
  user,
  onSave,
  loading,
  open,
  onClose,
}: EditEquipmentDialogProps) => {
  const [equipment, setEquipment] = useState<EquipmentData>(user?.creator?.equipmentInfo || {});
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newItemName, setNewItemName] = useState('');

  const handleAddCategory = () => {
    setCategoryModalOpen(true);
  };

  const handleSaveCategory = () => {
    if (newCategoryName && !equipment[newCategoryName]) {
      setEquipment({ ...equipment, [newCategoryName]: [] });
      setNewCategoryName('');
    }
    setCategoryModalOpen(false);
  };

  const handleCancelCategory = () => {
    setNewCategoryName('');
    setCategoryModalOpen(false);
  };

  const handleRemoveCategory = (category: string) => {
    const updatedEquipment = { ...equipment };
    delete updatedEquipment[category];
    setEquipment(updatedEquipment);
  };

  const handleAddItem = (category: string) => {
    setSelectedCategory(category);
    setItemModalOpen(true);
  };

  const handleSaveItem = () => {
    if (newItemName) {
      setEquipment({
        ...equipment,
        [selectedCategory]: [...(equipment[selectedCategory] || []), newItemName],
      });
      setNewItemName('');
    }
    setItemModalOpen(false);
  };

  const handleCancelItem = () => {
    setNewItemName('');
    setItemModalOpen(false);
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
    <>
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
                        <Button
                          startIcon={<Add />}
                          onClick={() => handleAddItem(category)}
                          variant="outlined"
                          size="small"
                          sx={{ alignSelf: 'flex-start' }}
                        >
                          Add {category} item
                        </Button>
                      </Box>
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
          <Button variant="gradient" color="error" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="gradient" color="primary" onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Category Modal */}
      <Dialog open={categoryModalOpen} onClose={handleCancelCategory} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Category</DialogTitle>
        <DialogContent>
          <Box sx={{ p: 2 }}>
            <TextField
              fullWidth
              label="Category Name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Enter category name"
              autoFocus
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSaveCategory();
                }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelCategory} color="error">
            Cancel
          </Button>
          <Button onClick={handleSaveCategory} color="primary" disabled={!newCategoryName.trim()}>
            Add Category
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Item Modal */}
      <Dialog open={itemModalOpen} onClose={handleCancelItem} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Item to {selectedCategory}</DialogTitle>
        <DialogContent>
          <Box sx={{ p: 2 }}>
            <TextField
              fullWidth
              label="Item Name"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder={`Enter ${selectedCategory} item name`}
              autoFocus
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSaveItem();
                }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelItem} color="error">
            Cancel
          </Button>
          <Button onClick={handleSaveItem} color="primary" disabled={!newItemName.trim()}>
            Add Item
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditEquipmentDialog;
