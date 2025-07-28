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

interface EditAboutDialogProps {
  user: Any;
  onSave: (data: Any) => void;
  loading?: boolean;
  open: boolean;
  onClose: () => void;
}

const EditAboutDialog = ({
  user,
  onSave,
  loading = false,
  open,
  onClose,
}: EditAboutDialogProps) => {
  const isClient = user?.client;
  const AboutSchema = Yup.object().shape({
    title: Yup.string().max(255, 'Title is too long'),
    bio: Yup.string().max(1000, 'Bio is too long'),
    shortBio: Yup.string().max(255, 'Short bio is too long'),
    hourlyRate: Yup.number()
      .typeError('Hourly rate must be a number')
      .min(0, 'Hourly rate must be at least 0')
      .nullable(),
  });

  const methods = useForm({
    resolver: yupResolver(AboutSchema),
    defaultValues: {
      title: user?.profile?.title || '',
      bio: user?.profile?.bio || '',
      shortBio: user?.profile?.shortBio || '',
      hourlyRate: isClient ? user?.client?.hourlyRate : user?.creator?.hourlyRate ?? '',
    },
  });

  const { handleSubmit } = methods;

  const onSubmit = (data: Any) => {
    onSave(data);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>About</DialogTitle>
      <DialogContent>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Update your profile title and bio to help others understand who you are.
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={isClient ? 12 : 6}>
                <RHFTextField
                  name="title"
                  label="Profile Title"
                  placeholder="e.g., Senior Web Developer, Creative Designer"
                  helperText="A brief title that describes your role or expertise"
                />
              </Grid>
              {!isClient && (
                <Grid item xs={12} sm={6}>
                  <RHFTextField
                    name="hourlyRate"
                    label="Hourly Rate (USD)"
                    type="number"
                    placeholder="e.g., 50"
                    helperText="Your hourly rate in USD (optional)"
                    InputProps={{ inputProps: { min: 0 } }}
                  />
                </Grid>
              )}
              <Grid item xs={12}>
                <RHFTextField
                  name="bio"
                  label="Bio"
                  multiline
                  rows={6}
                  placeholder="Tell us about yourself, your experience, and what you do..."
                  helperText="Share your story, experience, and what makes you unique"
                />
              </Grid>
              {/* <Grid item xs={12}>
                <RHFTextField
                  name="shortBio"
                  label="Short Bio"
                  placeholder="Tell us about yourself, your experience, and what you do..."
                  helperText="Share your story, experience, and what makes you unique"
                />
              </Grid> */}
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
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditAboutDialog;
