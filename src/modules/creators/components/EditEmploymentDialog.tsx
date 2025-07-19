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

interface EditEmploymentDialogProps {
  user: Any;
  onSave: (data: Any) => Promise<void>;
  loading?: boolean;
  open: boolean;
  onClose: () => void;
}

interface EmploymentItem {
  title: string;
  company: string;
  duration: string;
  description: string;
}

const EditEmploymentDialog = ({
  user,
  onSave,
  loading,
  open,
  onClose,
}: EditEmploymentDialogProps) => {
  const [employmentItems, setEmploymentItems] = useState<EmploymentItem[]>(
    user?.creator?.professionalBackground || []
  );

  const handleAddItem = () => {
    setEmploymentItems([
      ...employmentItems,
      { title: '', company: '', duration: '', description: '' },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setEmploymentItems(employmentItems.filter((_, i) => i !== index));
  };

  const handleUpdateItem = (index: number, field: keyof EmploymentItem, value: string) => {
    const updatedItems = [...employmentItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setEmploymentItems(updatedItems);
  };

  const handleSave = async () => {
    await onSave(employmentItems);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Employment History</DialogTitle>
      <DialogContent>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Edit Employment History
          </Typography>

          <Stack spacing={3}>
            {employmentItems.map((item, index) => (
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
                      Position {index + 1}
                    </Typography>
                    <IconButton size="small" onClick={() => handleRemoveItem(index)} color="error">
                      <Delete />
                    </IconButton>
                  </Box>

                  <Stack spacing={2}>
                    <TextField
                      label="Job Title"
                      value={item.title}
                      onChange={(e) => handleUpdateItem(index, 'title', e.target.value)}
                      fullWidth
                      size="small"
                    />
                    <TextField
                      label="Company"
                      value={item.company}
                      onChange={(e) => handleUpdateItem(index, 'company', e.target.value)}
                      fullWidth
                      size="small"
                    />
                    <TextField
                      label="Duration"
                      value={item.duration}
                      onChange={(e) => handleUpdateItem(index, 'duration', e.target.value)}
                      fullWidth
                      size="small"
                      placeholder="e.g., 2 years, 2018-2020"
                    />
                    <TextField
                      label="Description"
                      value={item.description}
                      onChange={(e) => handleUpdateItem(index, 'description', e.target.value)}
                      fullWidth
                      multiline
                      rows={3}
                      size="small"
                      placeholder="Describe your role and responsibilities"
                    />
                  </Stack>
                </CardContent>
              </Card>
            ))}

            <Button
              startIcon={<Add />}
              onClick={handleAddItem}
              variant="outlined"
              sx={{ alignSelf: 'flex-start' }}
            >
              Add Position
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

export default EditEmploymentDialog;
