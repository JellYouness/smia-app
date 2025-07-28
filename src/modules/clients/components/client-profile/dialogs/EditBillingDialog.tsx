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

interface EditBillingDialogProps {
  user: Any;
  onSave: (data: Any) => void;
  loading?: boolean;
  open: boolean;
  onClose: () => void;
}

const EditBillingDialog = ({
  user,
  onSave,
  loading = false,
  open,
  onClose,
}: EditBillingDialogProps) => {
  const BillingSchema = Yup.object().shape({
    billingStreet: Yup.string().required('Billing street is required'),
    billingCity: Yup.string().required('Billing city is required'),
    billingState: Yup.string().required('Billing state is required'),
    billingPostalCode: Yup.string().required('Billing postal code is required'),
    billingCountry: Yup.string().required('Billing country is required'),
    taxIdentifier: Yup.string().nullable(),
  });

  const methods = useForm({
    resolver: yupResolver(BillingSchema),
    defaultValues: {
      billingStreet: user?.client?.billingStreet || '',
      billingCity: user?.client?.billingCity || '',
      billingState: user?.client?.billingState || '',
      billingPostalCode: user?.client?.billingPostalCode || '',
      billingCountry: user?.client?.billingCountry || '',
      taxIdentifier: user?.client?.taxIdentifier || '',
    },
  });

  const { handleSubmit } = methods;

  const onSubmit = (data: Any) => {
    onSave(data);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Billing Information</DialogTitle>
      <DialogContent>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Update your billing address and tax information for invoicing purposes.
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <RHFTextField
                  name="billingStreet"
                  label="Billing Street Address"
                  placeholder="Enter your billing street address"
                  helperText="The street address for billing purposes"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <RHFTextField
                  name="billingCity"
                  label="Billing City"
                  placeholder="Enter your billing city"
                  helperText="The city for billing purposes"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <RHFTextField
                  name="billingState"
                  label="Billing State/Province"
                  placeholder="Enter your billing state or province"
                  helperText="The state or province for billing purposes"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <RHFTextField
                  name="billingPostalCode"
                  label="Billing Postal Code"
                  placeholder="Enter your billing postal code"
                  helperText="The postal code for billing purposes"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <RHFTextField
                  name="billingCountry"
                  label="Billing Country"
                  placeholder="Enter your billing country"
                  helperText="The country for billing purposes"
                />
              </Grid>
              <Grid item xs={12}>
                <RHFTextField
                  name="taxIdentifier"
                  label="Tax Identifier (Optional)"
                  placeholder="VAT number, tax ID, etc."
                  helperText="Your tax identification number (optional)"
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

export default EditBillingDialog;
