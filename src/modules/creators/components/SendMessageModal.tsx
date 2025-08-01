import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  Modal,
  Stack,
  Typography,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { RHFTextField } from '@common/components/lib/react-hook-form';
import { Creator } from '@modules/creators/defs/types';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { User } from '@modules/users/defs/types';
import UserAvatar from '@common/components/lib/partials/UserAvatar';

interface SendMessageModalProps {
  open: boolean;
  creator: Creator | null;
  onClose: () => void;
  onSubmit: (message: string) => Promise<void>;
  loading?: boolean;
}

type FormValues = { message: string };

const schema = (t: TFunction) =>
  yup.object({
    message: yup.string().required(t('common:field_required')),
  });

const SendMessageModal = ({ open, creator, onClose, onSubmit, loading }: SendMessageModalProps) => {
  const { t } = useTranslation(['user', 'common']);

  const methods = useForm<FormValues>({
    resolver: yupResolver(schema(t)),
    defaultValues: { message: '' },
  });
  const { handleSubmit, reset } = methods;

  if (!creator) {
    return null;
  }

  const handleFormSubmit = handleSubmit(async ({ message }) => {
    await onSubmit(message);
    reset();
    onClose();
  });

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        component="form"
        onSubmit={handleFormSubmit}
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          maxWidth: 600,
          width: '100%',
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 3,
        }}
      >
        <FormProvider {...methods}>
          <IconButton
            size="small"
            onClick={onClose}
            sx={{ position: 'absolute', top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>

          <Typography variant="h5" mb={3} fontWeight={700}>
            {t('user:send_message', 'Send Message')}
          </Typography>

          <Stack direction="row" alignItems="center" spacing={2} mb={3}>
            <UserAvatar user={creator.user as User} size="medium" />
            <Box>
              <Typography fontWeight={600} color="primary.main">
                {creator.user?.firstName} {creator.user?.lastName}
              </Typography>
            </Box>
          </Stack>

          <Divider sx={{ mb: 2 }} />

          <RHFTextField
            name="message"
            multiline
            rows={6}
            fullWidth
            sx={{
              '& .MuiInputBase-root': {
                fontSize: 13,
              },
            }}
          />

          {/* footer actions */}
          <Box mt={4} display="flex" justifyContent="flex-end" gap={1}>
            <Button onClick={onClose}>{t('common:cancel')}</Button>
            <Button variant="contained" type="submit" disabled={loading}>
              {loading ? <CircularProgress size={20} /> : t('user:send', 'Send')}
            </Button>
          </Box>
        </FormProvider>
      </Box>
    </Modal>
  );
};

export default SendMessageModal;
