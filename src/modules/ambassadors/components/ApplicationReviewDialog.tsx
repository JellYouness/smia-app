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
} from '@mui/material';
import { CheckCircle, Cancel, VerifiedUser, Visibility } from '@mui/icons-material';
import { Ambassador } from '@modules/ambassadors/defs/types';
import { useTranslation } from 'react-i18next';
import useAmbassadorApplications from '@modules/ambassadors/hooks/useAmbassadorApplications';
import UserAvatar from '@common/components/lib/partials/UserAvatar';
import { User } from '@modules/users/defs/types';

interface ApplicationReviewDialogProps {
  open: boolean;
  onClose: () => void;
  application: Ambassador;
  onReviewComplete: () => void;
}

const ApplicationReviewDialog: React.FC<ApplicationReviewDialogProps> = ({
  open,
  onClose,
  application,
  onReviewComplete,
}) => {
  const { t } = useTranslation(['user']);
  const [status, setStatus] = useState<'PENDING' | 'APPROVED' | 'REJECTED'>(
    (application.applicationStatus as any) || 'PENDING'
  );
  const [notes, setNotes] = useState(application.reviewNotes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { updateApplicationStatus } = useAmbassadorApplications({ fetchItems: false });

  // Reset state when application changes
  useEffect(() => {
    if (application) {
      setStatus((application.applicationStatus as any) || 'PENDING');
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
      case 'APPROVED':
        return <CheckCircle color="success" />;
      case 'PENDING':
        return <VerifiedUser color="warning" />;
      case 'REJECTED':
        return <Cancel color="error" />;
      default:
        return <Visibility />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'REJECTED':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {t('user:review_application_title', 'Review Ambassador Application')}
      </DialogTitle>
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
                  icon={getStatusIcon(application.applicationStatus)}
                  label={t(
                    `user:status.${application.applicationStatus?.toLowerCase()}`,
                    application.applicationStatus
                  )}
                  color={getStatusColor(application.applicationStatus) as any}
                  size="small"
                />
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom>
              {t('user:team_name', 'Team Name')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {application.teamName}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom>
              {t('user:client_count', 'Client Count')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {application.clientCount}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              {t('user:specializations', 'Specializations')}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {application.specializations?.map((spec, index) => (
                <Chip key={index} label={spec} size="small" variant="outlined" />
              ))}
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              {t('user:service_offerings', 'Service Offerings')}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {application.serviceOfferings?.map((service, index) => (
                <Chip key={index} label={service} size="small" variant="outlined" />
              ))}
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              {t('user:team_description', 'Team Description')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {application.teamDescription}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              {t('user:business_address', 'Business Address')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {application.businessStreet}, {application.businessCity}, {application.businessState}{' '}
              {application.businessPostalCode}, {application.businessCountry}
            </Typography>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3 }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>{t('user:application_status', 'Application Status')}</InputLabel>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'PENDING' | 'APPROVED' | 'REJECTED')}
              label={t('user:application_status', 'Application Status')}
            >
              <MenuItem value="PENDING">{t('user:status.pending', 'Pending')}</MenuItem>
              <MenuItem value="APPROVED">{t('user:status.approved', 'Approved')}</MenuItem>
              <MenuItem value="REJECTED">{t('user:status.rejected', 'Rejected')}</MenuItem>
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
