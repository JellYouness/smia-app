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
  const AboutSchema = Yup.object().shape({
    title: Yup.string().max(255, 'Title is too long'),
    bio: Yup.string().max(1000, 'Bio is too long'),
    shortBio: Yup.string().max(255, 'Short bio is too long'),
  });

  const methods = useForm({
    resolver: yupResolver(AboutSchema),
    defaultValues: {
      title: user?.profile?.title || '',
      bio: user?.profile?.bio || '',
      shortBio: user?.profile?.shortBio || '',
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
              <Grid item xs={12}>
                <RHFTextField
                  name="title"
                  label="Profile Title"
                  placeholder="e.g., Senior Web Developer, Creative Designer"
                  helperText="A brief title that describes your role or expertise"
                />
              </Grid>
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
              <Grid item xs={12}>
                <RHFTextField
                  name="shortBio"
                  label="Short Bio"
                  placeholder="Tell us about yourself, your experience, and what you do..."
                  helperText="Share your story, experience, and what makes you unique"
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
        <Button onClick={handleSubmit(onSubmit)} variant="contained" disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditAboutDialog;
