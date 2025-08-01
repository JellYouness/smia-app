import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box,
  Typography,
  Chip,
  Grid,
  Avatar,
} from '@mui/material';
import { CheckCircle, Cancel, VerifiedUser, Visibility } from '@mui/icons-material';
import { Creator } from '@modules/creators/defs/types';
import { useTranslation } from 'react-i18next';
import useCreatorApplications from '@modules/creators/hooks/useCreatorApplications';
import UserAvatar from '@common/components/lib/partials/UserAvatar';
import { User } from '@modules/users/defs/types';

interface ApplicationReviewDialogProps {
  open: boolean;
  onClose: () => void;
  application: Creator;
  onReviewComplete: () => void;
}

const ApplicationReviewDialog: React.FC<ApplicationReviewDialogProps> = ({
  open,
  onClose,
  application,
  onReviewComplete,
}) => {
  const { t } = useTranslation(['user']);
  const [status, setStatus] = useState<'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'FEATURED'>(
    (application.verificationStatus as any) || 'PENDING'
  );
  const [notes, setNotes] = useState(application.reviewNotes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { updateApplicationStatus } = useCreatorApplications({ fetchItems: false });

  // Reset state when application changes
  useEffect(() => {
    if (application) {
      setStatus(application.verificationStatus || 'PENDING');
      setNotes(application.reviewNotes || '');
    }
  }, [application]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await updateApplicationStatus(application.id, status, notes);
      onReviewComplete();
      onClose();
    } catch (error) {
      console.error('Error updating application status:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return <CheckCircle color="success" />;
      case 'PENDING':
        return <VerifiedUser color="warning" />;
      case 'UNVERIFIED':
        return <Cancel color="error" />;
      default:
        return <Visibility />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'UNVERIFIED':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{t('user:review_application_title', 'Review Creator Application')}</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <UserAvatar user={application.user as User} size="medium" width={60} height={60} />
            </Grid>
            <Grid item xs>
              <Typography variant="h6">
                {application.user?.firstName} {application.user?.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {application.user?.email}
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Chip
                  icon={getStatusIcon(application.verificationStatus)}
                  label={t(
                    `user:status.${application.verificationStatus?.toLowerCase()}`,
                    application.verificationStatus
                  )}
                  color={getStatusColor(application.verificationStatus) as any}
                  size="small"
                />
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom>
              {t('user:experience', 'Experience')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {application.experience} {t('user:years', 'years')}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom>
              {t('user:hourly_rate', 'Hourly Rate')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ${application.hourlyRate}/hr
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              {t('user:skills', 'Skills')}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {application.skills?.map((skill, index) => (
                <Chip key={index} label={skill} size="small" variant="outlined" />
              ))}
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              {t('user:bio', 'Bio')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {application.user?.bio || t('user:no_bio', 'No bio provided')}
            </Typography>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3 }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>{t('user:verification_status', 'Verification Status')}</InputLabel>
            <Select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'FEATURED')
              }
              label={t('user:verification_status', 'Verification Status')}
            >
              <MenuItem value="PENDING">{t('user:status.pending', 'Pending')}</MenuItem>
              <MenuItem value="VERIFIED">{t('user:status.verified', 'Verified')}</MenuItem>
              <MenuItem value="UNVERIFIED">{t('user:status.unverified', 'Unverified')}</MenuItem>
              <MenuItem value="FEATURED">{t('user:status.featured', 'Featured')}</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            multiline
            rows={4}
            label={t('user:review_notes', 'Review Notes')}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t('user:review_notes_placeholder', 'Add your review notes here...')}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isSubmitting}>
          {t('common:cancel', 'Cancel')}
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={isSubmitting} color="primary">
          {isSubmitting ? t('common:updating', 'Updating...') : t('common:update', 'Update')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ApplicationReviewDialog;
