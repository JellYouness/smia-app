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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import FormProvider, { RHFTextField } from '@common/components/lib/react-hook-form';
import { Any } from '@common/defs/types';

interface EditCompanyDialogProps {
  user: Any;
  onSave: (data: Any) => void;
  loading?: boolean;
  open: boolean;
  onClose: () => void;
}

const EditCompanyDialog = ({
  user,
  onSave,
  loading = false,
  open,
  onClose,
}: EditCompanyDialogProps) => {
  const CompanySchema = Yup.object().shape({
    companyName: Yup.string().required('Company name is required'),
    companySize: Yup.string().required('Company size is required'),
    industry: Yup.string().required('Industry is required'),
    websiteUrl: Yup.string().url('Must be a valid URL').nullable(),
  });

  const methods = useForm({
    resolver: yupResolver(CompanySchema),
    defaultValues: {
      companyName: user?.client?.companyName || '',
      companySize: user?.client?.companySize || '',
      industry: user?.client?.industry || '',
      websiteUrl: user?.client?.websiteUrl || '',
    },
  });

  const { handleSubmit } = methods;

  const onSubmit = (data: Any) => {
    onSave(data);
  };

  const companySizes = ['INDIVIDUAL', 'SMALL', 'MEDIUM', 'LARGE', 'ENTERPRISE'];
  const industries = [
    'MEDIA',
    'EDUCATION',
    'HEALTHCARE',
    'TECHNOLOGY',
    'FINANCE',
    'ENTERTAINMENT',
    'OTHER',
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Company Information</DialogTitle>
      <DialogContent>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Update your company information to help creators understand your business better.
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <RHFTextField
                  name="companyName"
                  label="Company Name"
                  placeholder="Enter your company name"
                  helperText="The official name of your company"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Company Size</InputLabel>
                  <Select
                    {...methods.register('companySize')}
                    label="Company Size"
                    defaultValue={user?.client?.companySize || ''}
                  >
                    {companySizes.map((size) => (
                      <MenuItem key={size} value={size}>
                        {size}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Industry</InputLabel>
                  <Select
                    {...methods.register('industry')}
                    label="Industry"
                    defaultValue={user?.client?.industry || ''}
                  >
                    {industries.map((industry) => (
                      <MenuItem key={industry} value={industry}>
                        {industry}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <RHFTextField
                  name="websiteUrl"
                  label="Website URL"
                  placeholder="https://yourcompany.com"
                  helperText="Your company's website (optional)"
                />
              </Grid>
            </Grid>
          </Box>
        </FormProvider>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit(onSubmit)} disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditCompanyDialog;
