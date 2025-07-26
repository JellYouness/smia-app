import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  IconButton,
  Chip,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import FormProvider, { RHFTextField } from '@common/components/lib/react-hook-form';
import { Add, Close } from '@mui/icons-material';
import { TFunction } from 'i18next';
import { Ambassador } from '../../defs/types';

interface EditVerificationCommissionDialogProps {
  ambassador: Ambassador;
  onSave: (data: Partial<Ambassador>) => void;
  loading?: boolean;
  open: boolean;
  onClose: () => void;
  t: TFunction;
}

const EditVerificationCommissionDialog = ({
  ambassador,
  onSave,
  loading = false,
  open,
  onClose,
  t,
}: EditVerificationCommissionDialogProps) => {
  const [verificationDocuments, setVerificationDocuments] = useState<string[]>(
    ambassador.verificationDocuments || []
  );
  const [newDocument, setNewDocument] = useState('');

  const VerificationCommissionSchema = Yup.object().shape({
    commissionRate: Yup.number()
      .typeError(t('user:commission_must_be_number') || 'Commission rate must be a number')
      .min(0, t('user:commission_must_be_positive') || 'Commission rate must be positive')
      .max(100, t('user:commission_too_high') || 'Commission rate cannot exceed 100%'),
  });

  const methods = useForm({
    resolver: yupResolver(VerificationCommissionSchema),
    defaultValues: {
      commissionRate: ambassador.commissionRate || 0,
    },
  });

  const { handleSubmit } = methods;

  const handleAddDocument = () => {
    if (newDocument.trim() && !verificationDocuments.includes(newDocument.trim())) {
      setVerificationDocuments([...verificationDocuments, newDocument.trim()]);
      setNewDocument('');
    }
  };

  const handleRemoveDocument = (documentToRemove: string) => {
    setVerificationDocuments(verificationDocuments.filter((doc) => doc !== documentToRemove));
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddDocument();
    }
  };

  const onSubmit = (data: Partial<Ambassador>) => {
    onSave({
      ...data,
      verificationDocuments,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {t('user:edit_verification_commission') || 'Edit Verification & Commission'}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {t('user:update_verification_commission') ||
                'Update your verification documents and commission rate.'}
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  {t('user:verification_documents') || 'Verification Documents'}
                </Typography>

                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                  <TextField
                    value={newDocument}
                    onChange={(e) => setNewDocument(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={
                      t('user:enter_document_url') || 'Enter document URL or description'
                    }
                    size="small"
                    sx={{ flexGrow: 1 }}
                  />
                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={handleAddDocument}
                    disabled={!newDocument.trim()}
                  >
                    {t('common:add') || 'Add'}
                  </Button>
                </Stack>

                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {verificationDocuments.map((doc, index) => (
                    <Chip
                      key={index}
                      label={doc}
                      onDelete={() => handleRemoveDocument(doc)}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                  {verificationDocuments.length === 0 && (
                    <Typography variant="body2" color="text.secondary">
                      {t('user:no_verification_documents') ||
                        'No verification documents added yet.'}
                    </Typography>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12} md={6}>
                <RHFTextField
                  name="commissionRate"
                  label={t('user:commission_rate') || 'Commission Rate (%)'}
                  type="number"
                  placeholder="0"
                  helperText={
                    t('user:commission_rate_help') || 'Your commission rate as a percentage'
                  }
                  InputProps={{ inputProps: { min: 0, max: 100, step: 0.1 } }}
                />
              </Grid>
            </Grid>
          </Box>
        </FormProvider>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          {t('common:cancel') || 'Cancel'}
        </Button>
        <Button variant="contained" onClick={handleSubmit(onSubmit)} disabled={loading}>
          {loading ? t('common:saving') || 'Saving...' : t('common:save_changes') || 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditVerificationCommissionDialog;
