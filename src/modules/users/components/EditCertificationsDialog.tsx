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

interface EditCertificationsDialogProps {
  user: Any;
  onSave: (data: Any) => Promise<void>;
  loading?: boolean;
  open: boolean;
  onClose: () => void;
}

interface CertificationItem {
  title: string;
  issuer: string;
  date: string;
}

const EditCertificationsDialog = ({
  user,
  onSave,
  loading,
  open,
  onClose,
}: EditCertificationsDialogProps) => {
  const [certifications, setCertifications] = useState<CertificationItem[]>(
    user?.creator?.certifications || []
  );

  const handleAddItem = () => {
    setCertifications([...certifications, { title: '', issuer: '', date: '' }]);
  };

  const handleRemoveItem = (index: number) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };

  const handleUpdateItem = (index: number, field: keyof CertificationItem, value: string) => {
    const updatedItems = [...certifications];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setCertifications(updatedItems);
  };

  const handleSave = async () => {
    await onSave(certifications);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Certifications</DialogTitle>
      <DialogContent>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Edit Certifications
          </Typography>

          <Stack spacing={3}>
            {certifications.map((cert, index) => (
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
                      Certification {index + 1}
                    </Typography>
                    <IconButton size="small" onClick={() => handleRemoveItem(index)} color="error">
                      <Delete />
                    </IconButton>
                  </Box>

                  <Stack spacing={2}>
                    <TextField
                      label="Certification Title"
                      value={cert.title}
                      onChange={(e) => handleUpdateItem(index, 'title', e.target.value)}
                      fullWidth
                      size="small"
                    />
                    <TextField
                      label="Issuing Organization"
                      value={cert.issuer}
                      onChange={(e) => handleUpdateItem(index, 'issuer', e.target.value)}
                      fullWidth
                      size="small"
                    />
                    <TextField
                      label="Date Obtained"
                      value={cert.date}
                      onChange={(e) => handleUpdateItem(index, 'date', e.target.value)}
                      fullWidth
                      size="small"
                      type="date"
                      InputLabelProps={{ shrink: true }}
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
              Add Certification
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

export default EditCertificationsDialog;
