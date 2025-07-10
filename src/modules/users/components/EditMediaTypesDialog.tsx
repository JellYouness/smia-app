import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Stack,
  Typography,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { Any } from '@common/defs/types';

interface EditMediaTypesDialogProps {
  user: Any;
  onSave: (data: Any) => Promise<void>;
  loading?: boolean;
  open: boolean;
  onClose: () => void;
}

const MEDIA_TYPE_OPTIONS = [
  'VIDEO',
  'PHOTO',
  'AUDIO',
  'ANIMATION',
  'GRAPHIC_DESIGN',
  'WRITING',
  'TRANSLATION',
  'CONSULTING',
  'OTHER',
];

const EditMediaTypesDialog = ({
  user,
  onSave,
  loading,
  open,
  onClose,
}: EditMediaTypesDialogProps) => {
  const [mediaTypes, setMediaTypes] = useState<string[]>(user?.creator?.mediaTypes || []);
  const [newMediaType, setNewMediaType] = useState('');

  const handleAddItem = () => {
    if (newMediaType && !mediaTypes.includes(newMediaType)) {
      setMediaTypes([...mediaTypes, newMediaType]);
      setNewMediaType('');
    }
  };

  const handleRemoveItem = (mediaType: string) => {
    setMediaTypes(mediaTypes.filter((type) => type !== mediaType));
  };

  const handleAddFromOptions = (mediaType: string) => {
    if (!mediaTypes.includes(mediaType)) {
      setMediaTypes([...mediaTypes, mediaType]);
    }
  };

  const handleSave = async () => {
    await onSave(mediaTypes);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Media Types</DialogTitle>
      <DialogContent>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Edit Media Types
          </Typography>

          <Stack spacing={3}>
            {/* Current Media Types */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                Current Media Types
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {mediaTypes.map((mediaType) => (
                  <Chip
                    key={mediaType}
                    label={mediaType}
                    onDelete={() => handleRemoveItem(mediaType)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
                {mediaTypes.length === 0 && (
                  <Typography variant="body2" color="text.secondary">
                    No media types added yet
                  </Typography>
                )}
              </Box>
            </Box>

            {/* Add Custom Media Type */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                Add Custom Media Type
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <TextField
                  value={newMediaType}
                  onChange={(e) => setNewMediaType(e.target.value)}
                  placeholder="Enter custom media type"
                  size="small"
                  sx={{ flexGrow: 1 }}
                />
                <Button
                  onClick={handleAddItem}
                  variant="outlined"
                  size="small"
                  disabled={!newMediaType}
                >
                  Add
                </Button>
              </Box>
            </Box>

            {/* Quick Add Options */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                Quick Add Options
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {MEDIA_TYPE_OPTIONS.map((option) => (
                  <Chip
                    key={option}
                    label={option}
                    onClick={() => handleAddFromOptions(option)}
                    variant="outlined"
                    color={mediaTypes.includes(option) ? 'primary' : 'default'}
                    disabled={mediaTypes.includes(option)}
                  />
                ))}
              </Box>
            </Box>
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

export default EditMediaTypesDialog;
