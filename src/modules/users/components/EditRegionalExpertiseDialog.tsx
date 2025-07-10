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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { Any } from '@common/defs/types';

interface EditRegionalExpertiseDialogProps {
  user: Any;
  onSave: (data: Any) => Promise<void>;
  loading?: boolean;
  open: boolean;
  onClose: () => void;
}

interface RegionalExpertiseItem {
  region: string;
  expertiseLevel: string;
}

const EXPERTISE_LEVELS = ['BEGINNER', 'INTERMEDIATE', 'EXPERT', 'NATIVE'];

const EditRegionalExpertiseDialog = ({
  user,
  onSave,
  loading,
  open,
  onClose,
}: EditRegionalExpertiseDialogProps) => {
  const [expertiseItems, setExpertiseItems] = useState<RegionalExpertiseItem[]>(
    user?.creator?.regionalExpertise || []
  );

  const handleAddItem = () => {
    setExpertiseItems([...expertiseItems, { region: '', expertiseLevel: 'BEGINNER' }]);
  };

  const handleRemoveItem = (index: number) => {
    setExpertiseItems(expertiseItems.filter((_, i) => i !== index));
  };

  const handleUpdateItem = (index: number, field: keyof RegionalExpertiseItem, value: string) => {
    const updatedItems = [...expertiseItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setExpertiseItems(updatedItems);
  };

  const handleSave = async () => {
    await onSave({ regionalExpertise: expertiseItems });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Regional Expertise</DialogTitle>
      <DialogContent>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Edit Regional Expertise
          </Typography>

          <Stack spacing={3}>
            {expertiseItems.map((item, index) => (
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
                      Region {index + 1}
                    </Typography>
                    <IconButton size="small" onClick={() => handleRemoveItem(index)} color="error">
                      <Delete />
                    </IconButton>
                  </Box>

                  <Stack spacing={2}>
                    <TextField
                      label="Region/Country"
                      value={item.region}
                      onChange={(e) => handleUpdateItem(index, 'region', e.target.value)}
                      fullWidth
                      size="small"
                      placeholder="e.g., United States, Europe, Asia"
                    />
                    <FormControl fullWidth size="small">
                      <InputLabel>Expertise Level</InputLabel>
                      <Select
                        value={item.expertiseLevel}
                        onChange={(e) => handleUpdateItem(index, 'expertiseLevel', e.target.value)}
                        label="Expertise Level"
                      >
                        {EXPERTISE_LEVELS.map((level) => (
                          <MenuItem key={level} value={level}>
                            {level}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
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
              Add Region
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

export default EditRegionalExpertiseDialog;
