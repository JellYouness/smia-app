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
  IconButton,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import FormProvider, { RHFTextField } from '@common/components/lib/react-hook-form';
import { Close } from '@mui/icons-material';
import { TFunction } from 'i18next';
import { Ambassador } from '../../defs/types';

interface EditBusinessInfoDialogProps {
  ambassador: Ambassador;
  onSave: (data: Partial<Ambassador>) => void;
  loading?: boolean;
  open: boolean;
  onClose: () => void;
  t: TFunction;
}

const EditBusinessInfoDialog = ({
  ambassador,
  onSave,
  loading = false,
  open,
  onClose,
  t,
}: EditBusinessInfoDialogProps) => {
  const BusinessInfoSchema = Yup.object().shape({
    yearsInBusiness: Yup.number()
      .typeError(t('user:years_must_be_number') || 'Years must be a number')
      .min(0, t('user:years_must_be_positive') || 'Years must be positive')
      .max(100, t('user:years_too_high') || 'Years cannot exceed 100'),
    businessStreet: Yup.string().required(
      t('user:business_street_required') || 'Business street is required'
    ),
    businessCity: Yup.string().required(
      t('user:business_city_required') || 'Business city is required'
    ),
    businessState: Yup.string().required(
      t('user:business_state_required') || 'Business state is required'
    ),
    businessPostalCode: Yup.string().required(
      t('user:business_postal_code_required') || 'Business postal code is required'
    ),
    businessCountry: Yup.string().required(
      t('user:business_country_required') || 'Business country is required'
    ),
  });

  const methods = useForm({
    resolver: yupResolver(BusinessInfoSchema),
    defaultValues: {
      yearsInBusiness: ambassador.yearsInBusiness || 0,
      businessStreet: ambassador.businessStreet || '',
      businessCity: ambassador.businessCity || '',
      businessState: ambassador.businessState || '',
      businessPostalCode: ambassador.businessPostalCode || '',
      businessCountry: ambassador.businessCountry || '',
    },
  });

  const { handleSubmit } = methods;

  const onSubmit = (data: Partial<Ambassador>) => {
    onSave(data);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {t('user:edit_business_info') || 'Edit Business Information'}
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
              {t('user:update_business_info') || 'Update your business information and address.'}
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <RHFTextField
                  name="yearsInBusiness"
                  label={t('user:years_in_business') || 'Years in Business'}
                  type="number"
                  placeholder="0"
                  helperText={
                    t('user:years_in_business_help') ||
                    'Number of years your business has been operating'
                  }
                  InputProps={{ inputProps: { min: 0, max: 100 } }}
                />
              </Grid>

              <Grid item xs={12}>
                <RHFTextField
                  name="businessStreet"
                  label={t('user:business_street') || 'Business Street Address'}
                  placeholder={
                    t('user:enter_business_street') || 'Enter your business street address'
                  }
                  helperText={
                    t('user:business_street_help') || 'The street address of your business'
                  }
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <RHFTextField
                  name="businessCity"
                  label={t('user:business_city') || 'Business City'}
                  placeholder={t('user:enter_business_city') || 'Enter your business city'}
                  helperText={
                    t('user:business_city_help') || 'The city where your business is located'
                  }
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <RHFTextField
                  name="businessState"
                  label={t('user:business_state') || 'Business State/Province'}
                  placeholder={
                    t('user:enter_business_state') || 'Enter your business state or province'
                  }
                  helperText={
                    t('user:business_state_help') ||
                    'The state or province where your business is located'
                  }
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <RHFTextField
                  name="businessPostalCode"
                  label={t('user:business_postal_code') || 'Business Postal Code'}
                  placeholder={
                    t('user:enter_business_postal_code') || 'Enter your business postal code'
                  }
                  helperText={
                    t('user:business_postal_code_help') || 'The postal code of your business'
                  }
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <RHFTextField
                  name="businessCountry"
                  label={t('user:business_country') || 'Business Country'}
                  placeholder={t('user:enter_business_country') || 'Enter your business country'}
                  helperText={
                    t('user:business_country_help') || 'The country where your business is located'
                  }
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

export default EditBusinessInfoDialog;
