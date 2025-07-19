import {
  Modal,
  Box,
  Typography,
  IconButton,
  Divider,
  Grid,
  Button,
  CircularProgress,
  Chip,
  Stack,
  InputAdornment,
  Tooltip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';
import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, FormProvider, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import dayjs from 'dayjs';

import useProjects from '@modules/projects/hooks/useProjects';
import { Id } from '@common/defs/types';
import RHFTextField from '@common/components/lib/react-hook-form/RHFTextField';
import { ProjectInvite } from '@modules/projects/defs/types';
import { CheckCircle, ErrorOutline } from '@mui/icons-material';

interface Props {
  open: boolean;
  inviteId: Id;
  onClose: () => void;
  onSuccess?: () => void;
  invite: ProjectInvite;
}

type FormValues = {
  amount: number | '';
  currency: string;
  duration_days: number | '';
  cover_letter: string;
};

const ProposalWizardDialog: React.FC<Props> = ({ open, inviteId, onClose, onSuccess, invite }) => {
  const { t } = useTranslation(['proposal', 'common']);

  const { acceptInvite } = useProjects();
  const [loading, setLoading] = useState(false);

  const schema = yup.object({
    amount: yup
      .number()
      .typeError(t('common:field_required'))
      .required(t('common:field_required'))
      .min(0, t('proposal:amount_min', { min: 0 })),
    currency: yup
      .string()
      .required(t('common:field_required'))
      .length(3, t('proposal:currency_length', { length: 3 })),
    duration_days: yup
      .number()
      .typeError(t('common:field_required'))
      .required(t('common:field_required'))
      .integer(t('proposal:integer_required'))
      .min(1, t('proposal:duration_min', { min: 1 })),
    cover_letter: yup.string().required(t('common:field_required')),
  });

  const methods = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      amount: '',
      currency: 'USD',
      duration_days: '',
      cover_letter: '',
    },
  });

  const { daysRemaining, isEndDatePassed } = useMemo(() => {
    const today = dayjs();
    const endDate = dayjs(invite.project?.endDate);
    const daysRemaining = endDate?.diff(today, 'day');

    return {
      daysRemaining: daysRemaining > 0 ? daysRemaining : 0,
      isEndDatePassed: endDate?.isBefore(today),
    };
  }, [invite.project?.endDate]);

  const { handleSubmit, control } = methods;

  const durationRaw = useWatch({ control, name: 'duration_days' });

  const durationNum = Number(durationRaw);
  const hasDurationValue = durationRaw !== '' && !Number.isNaN(durationNum);
  const isDurationTooLong =
    hasDurationValue && daysRemaining != null && durationNum > daysRemaining;

  const onSubmit = handleSubmit(async (values) => {
    setLoading(true);
    const res = await acceptInvite(inviteId, {
      amount: values.amount ? Number(values.amount) : undefined,
      currency: values.currency,
      duration_days: values.duration_days ? Number(values.duration_days) : undefined,
      cover_letter: values.cover_letter,
    });
    setLoading(false);
    if (res.success) {
      onClose();
      onSuccess?.();
    }
  });

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        component="form"
        onSubmit={onSubmit}
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          maxWidth: 1000,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 3,
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <IconButton size="small" onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8 }}>
          <CloseIcon />
        </IconButton>

        <Typography variant="h5" mb={2} fontWeight={700}>
          {t('proposal:create_proposal_for')} {invite.project?.title}
        </Typography>

        <Box mb={3} p={3} bgcolor="action.hover" borderRadius={2} boxShadow={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box mb={1}>
                <Typography variant="overline" color="text.secondary" fontWeight={500}>
                  {t('proposal:client_info')}
                </Typography>
              </Box>
              <Typography variant="body1" fontWeight={500}>
                {invite.project?.client?.companyName}
              </Typography>
            </Grid>

            {/* Project Budget */}
            <Grid item xs={12} md={6}>
              <Box mb={1}>
                <Typography variant="overline" color="text.secondary" fontWeight={500}>
                  {t('proposal:project_budget')}
                </Typography>
              </Box>
              <Typography variant="body1" fontWeight={500}>
                ${parseFloat(invite.project?.budget?.toString() ?? '0').toLocaleString()} USD
              </Typography>
            </Grid>

            {/* Project End Date */}
            <Grid item xs={12}>
              <Box mb={1}>
                <Typography variant="overline" color="text.secondary" fontWeight={500}>
                  {t('proposal:project_end_date')}
                </Typography>
              </Box>
              <Stack direction="row" alignItems="center" gap={1}>
                <Typography variant="body1" fontWeight={500}>
                  {dayjs(invite.project?.endDate).format('DD MMM YYYY')}
                </Typography>
                <Chip
                  label={
                    isEndDatePassed
                      ? t('proposal:deadline_passed')
                      : `${daysRemaining} ${t('proposal:days_remaining')}`
                  }
                  size="small"
                  color={isEndDatePassed ? 'error' : 'primary'}
                  sx={{ fontWeight: 600 }}
                />
              </Stack>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <FormProvider {...methods}>
          <Grid container spacing={3}>
            {/* Amount Field */}
            <Grid item xs={12} md={6}>
              <RHFTextField
                name="amount"
                label={t('proposal:your_proposal_amount')}
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  inputProps: { min: 0, step: '0.01' },
                }}
              />
            </Grid>

            {/* Duration Field */}
            <Grid item xs={12} md={6}>
              <RHFTextField
                name="duration_days"
                label={
                  <Stack direction="row" alignItems="center" gap={0.5}>
                    {t('proposal:estimated_duration')}
                    <Tooltip title={t('proposal:duration_tooltip')}>
                      <InfoIcon fontSize="small" color="action" />
                    </Tooltip>
                  </Stack>
                }
                type="number"
                error={isDurationTooLong}
                helperText={
                  isDurationTooLong
                    ? t('proposal:duration_exceeds_deadline', { days: daysRemaining })
                    : undefined
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end" sx={{ display: 'flex', alignItems: 'center' }}>
                      {hasDurationValue &&
                        (isDurationTooLong ? (
                          <ErrorOutline fontSize="small" color="error" />
                        ) : (
                          <CheckCircle fontSize="small" color="success" />
                        ))}
                      <Box component="span" sx={{ ml: 0.5 }}>
                        {t('common:days')}
                      </Box>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Cover Letter Field */}
            <Grid item xs={12}>
              <RHFTextField
                name="cover_letter"
                label={t('proposal:your_proposal')}
                multiline
                rows={6}
                placeholder={t('proposal:cover_letter_placeholder')}
              />
            </Grid>
          </Grid>
        </FormProvider>

        <Box mt={4} display="flex" justifyContent="flex-end" gap={1}>
          <Button variant="outlined" onClick={onClose}>
            {t('common:cancel')}
          </Button>
          <Button variant="contained" type="submit" disabled={loading || isEndDatePassed}>
            {loading ? <CircularProgress size={20} /> : t('proposal:submit_proposal')}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ProposalWizardDialog;
