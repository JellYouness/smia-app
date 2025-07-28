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
  Chip,
  Stack,
  IconButton,
} from '@mui/material';
import { Add, Close } from '@mui/icons-material';
import { TFunction } from 'i18next';
import { Ambassador } from '../../defs/types';

interface EditServiceOfferingsDialogProps {
  ambassador: Ambassador;
  onSave: (data: Partial<Ambassador>) => void;
  loading?: boolean;
  open: boolean;
  onClose: () => void;
  t: TFunction;
}

const EditServiceOfferingsDialog = ({
  ambassador,
  onSave,
  loading = false,
  open,
  onClose,
  t,
}: EditServiceOfferingsDialogProps) => {
  const [serviceOfferings, setServiceOfferings] = useState<string[]>(
    ambassador.serviceOfferings || []
  );
  const [newService, setNewService] = useState('');

  const handleAddService = () => {
    if (newService.trim() && !serviceOfferings.includes(newService.trim())) {
      setServiceOfferings([...serviceOfferings, newService.trim()]);
      setNewService('');
    }
  };

  const handleRemoveService = (serviceToRemove: string) => {
    setServiceOfferings(serviceOfferings.filter((service) => service !== serviceToRemove));
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddService();
    }
  };

  const handleSave = () => {
    onSave({ serviceOfferings });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {t('user:edit_service_offerings') || 'Edit Service Offerings'}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ p: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {t('user:update_service_offerings') || 'Add or remove the services your team offers.'}
          </Typography>

          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                {t('user:add_service_offering') || 'Add Service Offering'}
              </Typography>

              <Stack direction="row" spacing={1}>
                <TextField
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t('user:enter_service') || 'e.g., Web Development, Consulting'}
                  size="small"
                  sx={{ flexGrow: 1 }}
                />
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={handleAddService}
                  disabled={!newService.trim()}
                >
                  {t('common:add') || 'Add'}
                </Button>
              </Stack>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                {t('user:current_service_offerings') || 'Current Service Offerings'}
              </Typography>

              <Stack direction="row" spacing={1} flexWrap="wrap">
                {serviceOfferings.map((service, index) => (
                  <Chip
                    key={index}
                    label={service}
                    onDelete={() => handleRemoveService(service)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
                {serviceOfferings.length === 0 && (
                  <Typography variant="body2" color="text.secondary">
                    {t('user:no_service_offerings') || 'No service offerings added yet.'}
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

export default EditServiceOfferingsDialog;
