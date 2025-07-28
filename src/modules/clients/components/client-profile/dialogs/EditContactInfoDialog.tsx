import React from 'react';
import {
  Box,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import FormProvider, { RHFTextField } from '@common/components/lib/react-hook-form';
import { Any } from '@common/defs/types';

interface EditContactInfoDialogProps {
  user: Any;
  onSave: (data: Any) => void;
  loading?: boolean;
  open: boolean;
  onClose: () => void;
}

const EditContactInfoDialog = ({
  user,
  onSave,
  loading = false,
  open,
  onClose,
}: EditContactInfoDialogProps) => {
  const ContactInfoSchema = Yup.object().shape({
    contactPhone: Yup.string().max(30, 'Phone number is too long'),
    contactEmail: Yup.string().email('Invalid email address'),
  });

  const methods = useForm({
    resolver: yupResolver(ContactInfoSchema),
    defaultValues: {
      contactPhone: user?.profile?.contactPhone || '',
      contactEmail: user?.profile?.contactEmail || '',
    },
  });

  const { handleSubmit } = methods;

  const onSubmit = (data: Any) => {
    onSave(data);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Contact Information</DialogTitle>
      <DialogContent>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Update your contact information.
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <RHFTextField
                  name="contactPhone"
                  label="Phone Number"
                  placeholder="Enter your phone number"
                  helperText="Your contact phone number"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <RHFTextField
                  name="contactEmail"
                  label="Email Address"
                  placeholder="Enter your email address"
                  helperText="Your contact email address"
                />
              </Grid>
            </Grid>
          </Box>
        </FormProvider>
      </DialogContent>
      <DialogActions>
        <Button variant="gradient" color="error" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="gradient"
          color="primary"
          onClick={handleSubmit(onSubmit)}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditContactInfoDialog;
