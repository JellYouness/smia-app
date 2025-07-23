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
import FormProvider from '@common/components/lib/react-hook-form';
import { Any } from '@common/defs/types';

interface EditDefaultProjectSettingsDialogProps {
  user: Any;
  onSave: (data: Any) => void;
  loading?: boolean;
  open: boolean;
  onClose: () => void;
}

const EditDefaultProjectSettingsDialog = ({
  user,
  onSave,
  loading = false,
  open,
  onClose,
}: EditDefaultProjectSettingsDialogProps) => {
  const DefaultProjectSettingsSchema = Yup.object().shape({
    notificationFrequency: Yup.string().required('Notification frequency is required'),
    timeline: Yup.string().required('Timeline is required'),
    communicationPreference: Yup.string().required('Communication preference is required'),
  });

  const methods = useForm({
    resolver: yupResolver(DefaultProjectSettingsSchema),
    defaultValues: {
      notificationFrequency: user?.client?.defaultProjectSettings?.notificationFrequency || '',
      timeline: user?.client?.defaultProjectSettings?.timeline || '',
      communicationPreference: user?.client?.defaultProjectSettings?.communicationPreference || '',
    },
  });

  const { handleSubmit } = methods;

  const onSubmit = (data: Any) => {
    onSave(data);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Default Project Settings</DialogTitle>
      <DialogContent>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Update your default project settings for new projects.
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel id="notification-frequency-label">Notification Frequency</InputLabel>
                  <Select
                    labelId="notification-frequency-label"
                    id="notificationFrequency"
                    label="Notification Frequency"
                    defaultValue={user?.client?.defaultProjectSettings?.notificationFrequency || ''}
                    {...methods.register('notificationFrequency')}
                  >
                    <MenuItem value="Immediate">Immediate</MenuItem>
                    <MenuItem value="Hourly">Hourly</MenuItem>
                    <MenuItem value="Daily">Daily</MenuItem>
                    <MenuItem value="Weekly">Weekly</MenuItem>
                    <MenuItem value="Monthly">Monthly</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel id="timeline-label">Timeline</InputLabel>
                  <Select
                    labelId="timeline-label"
                    id="timeline"
                    label="Timeline"
                    defaultValue={user?.client?.defaultProjectSettings?.timeline || ''}
                    {...methods.register('timeline')}
                  >
                    <MenuItem value="1 week">1 week</MenuItem>
                    <MenuItem value="2 weeks">2 weeks</MenuItem>
                    <MenuItem value="1 month">1 month</MenuItem>
                    <MenuItem value="3 months">3 months</MenuItem>
                    <MenuItem value="6 months">6 months</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel id="communication-preference-label">
                    Communication Preference
                  </InputLabel>
                  <Select
                    labelId="communication-preference-label"
                    id="communicationPreference"
                    label="Communication Preference"
                    defaultValue={
                      user?.client?.defaultProjectSettings?.communicationPreference || ''
                    }
                    {...methods.register('communicationPreference')}
                  >
                    <MenuItem value="Email">Email</MenuItem>
                    <MenuItem value="Phone">Phone</MenuItem>
                    <MenuItem value="Slack">Slack</MenuItem>
                    <MenuItem value="Teams">Teams</MenuItem>
                    <MenuItem value="Zoom">Zoom</MenuItem>
                  </Select>
                </FormControl>
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

export default EditDefaultProjectSettingsDialog;
