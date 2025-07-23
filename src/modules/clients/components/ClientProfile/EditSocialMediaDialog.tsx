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

interface EditSocialMediaDialogProps {
  user: Any;
  onSave: (data: Any) => void;
  loading?: boolean;
  open: boolean;
  onClose: () => void;
}

const EditSocialMediaDialog = ({
  user,
  onSave,
  loading = false,
  open,
  onClose,
}: EditSocialMediaDialogProps) => {
  const SocialMediaSchema = Yup.object().shape({
    linkedin: Yup.string().url('Invalid LinkedIn URL').nullable(),
    twitter: Yup.string().url('Invalid Twitter URL').nullable(),
    facebook: Yup.string().url('Invalid Facebook URL').nullable(),
  });

  const methods = useForm({
    resolver: yupResolver(SocialMediaSchema),
    defaultValues: {
      linkedin: user?.profile?.socialMediaLinks?.linkedin || '',
      twitter: user?.profile?.socialMediaLinks?.twitter || '',
      facebook: user?.profile?.socialMediaLinks?.facebook || '',
    },
  });

  const { handleSubmit } = methods;

  const onSubmit = (data: Any) => {
    onSave({ socialMediaLinks: data });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Social Media Links</DialogTitle>
      <DialogContent>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Add or update your social media links. Leave blank if you don't want to display a
              link.
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <RHFTextField
                  name="linkedin"
                  label="LinkedIn URL"
                  placeholder="https://linkedin.com/in/yourprofile"
                  helperText="Your LinkedIn profile link"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <RHFTextField
                  name="twitter"
                  label="Twitter URL"
                  placeholder="https://twitter.com/yourprofile"
                  helperText="Your Twitter profile link"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <RHFTextField
                  name="facebook"
                  label="Facebook URL"
                  placeholder="https://facebook.com/yourprofile"
                  helperText="Your Facebook profile link"
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

export default EditSocialMediaDialog;
