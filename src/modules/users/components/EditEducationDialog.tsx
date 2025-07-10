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

interface EditEducationDialogProps {
  user: Any;
  onSave: (data: Any) => Promise<void>;
  loading?: boolean;
  open: boolean;
  onClose: () => void;
}

interface EducationItem {
  year: string;
  field: string;
  degree: string;
  institution: string;
}

const EditEducationDialog = ({
  user,
  onSave,
  loading,
  open,
  onClose,
}: EditEducationDialogProps) => {
  const [educationItems, setEducationItems] = useState<EducationItem[]>(
    user?.creator?.education || []
  );

  const handleAddItem = () => {
    setEducationItems([...educationItems, { year: '', field: '', degree: '', institution: '' }]);
  };

  const handleRemoveItem = (index: number) => {
    setEducationItems(educationItems.filter((_, i) => i !== index));
  };

  const handleUpdateItem = (index: number, field: keyof EducationItem, value: string) => {
    const updatedItems = [...educationItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setEducationItems(updatedItems);
  };

  const handleSave = async () => {
    await onSave(educationItems);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Education</DialogTitle>
      <DialogContent>
        <Box sx={{ p: 2 }}>
          <Stack spacing={3}>
            {educationItems.map((item, index) => (
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
                      Education {index + 1}
                    </Typography>
                    <IconButton size="small" onClick={() => handleRemoveItem(index)} color="error">
                      <Delete />
                    </IconButton>
                  </Box>

                  <Stack spacing={2}>
                    <TextField
                      label="Institution"
                      value={item.institution}
                      onChange={(e) => handleUpdateItem(index, 'institution', e.target.value)}
                      fullWidth
                      size="small"
                    />
                    <TextField
                      label="Degree"
                      value={item.degree}
                      onChange={(e) => handleUpdateItem(index, 'degree', e.target.value)}
                      fullWidth
                      size="small"
                      placeholder="e.g., Bachelor's, Master's, PhD"
                    />
                    <TextField
                      label="Field of Study"
                      value={item.field}
                      onChange={(e) => handleUpdateItem(index, 'field', e.target.value)}
                      fullWidth
                      size="small"
                      placeholder="e.g., Computer Science, Journalism"
                    />
                    <TextField
                      label="Year"
                      value={item.year}
                      onChange={(e) => handleUpdateItem(index, 'year', e.target.value)}
                      fullWidth
                      size="small"
                      placeholder="e.g., 2020"
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
              Add Education
            </Button>
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditEducationDialog;
