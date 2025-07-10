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

interface EditPortfolioDialogProps {
  user: Any;
  onSave: (data: Any) => Promise<void>;
  loading?: boolean;
  open: boolean;
  onClose: () => void;
}

interface PortfolioItem {
  title: string;
  description: string;
  url: string;
}

const EditPortfolioDialog = ({
  user,
  onSave,
  loading,
  open,
  onClose,
}: EditPortfolioDialogProps) => {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>(
    user?.creator?.portfolio || []
  );

  const handleAddItem = () => {
    setPortfolioItems([...portfolioItems, { title: '', description: '', url: '' }]);
  };

  const handleRemoveItem = (index: number) => {
    setPortfolioItems(portfolioItems.filter((_, i) => i !== index));
  };

  const handleUpdateItem = (index: number, field: keyof PortfolioItem, value: string) => {
    const updatedItems = [...portfolioItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setPortfolioItems(updatedItems);
  };

  const handleSave = async () => {
    await onSave(portfolioItems);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Portfolio</DialogTitle>
      <DialogContent>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Edit Portfolio
          </Typography>

          <Stack spacing={3}>
            {portfolioItems.map((item, index) => (
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
                      Project {index + 1}
                    </Typography>
                    <IconButton size="small" onClick={() => handleRemoveItem(index)} color="error">
                      <Delete />
                    </IconButton>
                  </Box>

                  <Stack spacing={2}>
                    <TextField
                      label="Project Title"
                      value={item.title}
                      onChange={(e) => handleUpdateItem(index, 'title', e.target.value)}
                      fullWidth
                      size="small"
                    />
                    <TextField
                      label="Description"
                      value={item.description}
                      onChange={(e) => handleUpdateItem(index, 'description', e.target.value)}
                      fullWidth
                      multiline
                      rows={3}
                      size="small"
                    />
                    <TextField
                      label="Project URL"
                      value={item.url}
                      onChange={(e) => handleUpdateItem(index, 'url', e.target.value)}
                      fullWidth
                      size="small"
                      placeholder="https://example.com"
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
              Add Project
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

export default EditPortfolioDialog;
