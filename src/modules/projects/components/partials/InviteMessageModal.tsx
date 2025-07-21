import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  Link,
  Modal,
  Stack,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useForm, FormProvider, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { RHFTextField } from '@common/components/lib/react-hook-form';
import { Creator } from '@modules/creators/defs/types';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import Routes from '@common/defs/routes';

interface InviteMessageModalProps {
  open: boolean;
  creator: Creator | null;
  onClose: () => void;
  onSubmit: (message: string) => void;
}

type FormValues = { message: string };

const schema = (t: TFunction) =>
  yup.object({
    message: yup.string().required(t('common:field_required')),
  });

const InviteMessageModal = ({ open, creator, onClose, onSubmit }: InviteMessageModalProps) => {
  const { t } = useTranslation(['project', 'common']);

  const defaultMsg = creator
    ? t('project:invite_message_default', {
        creator: creator.user?.firstName,
      })
    : '';

  const methods = useForm<FormValues>({
    resolver: yupResolver(schema(t)),
    defaultValues: { message: defaultMsg },
  });
  const { control, handleSubmit, reset, setValue } = methods;

  const message = useWatch({ control, name: 'message' });

  if (!creator) {
    return null;
  }

  const handleFormSubmit = handleSubmit(({ message }) => {
    onSubmit(message);
    reset();
    onClose();
  });

  const summary = creator.skills
    .slice(0, 5)
    .map((s) =>
      s
        .toLowerCase()
        .split('_')
        .map((w) => w[0].toUpperCase() + w.slice(1))
        .join(' ')
    )
    .join(' | ');

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
            {t('project:invite_to_project')}
          </Typography>

          <Stack direction="row" alignItems="center" spacing={2} mb={3}>
            <Avatar src={creator.user?.profileImage ?? undefined} sx={{ width: 56, height: 56 }}>
              {creator.user?.firstName[0]}
            </Avatar>
            <Box>
              <Link
                href={Routes.Creators.ReadOne.replace('{id}', creator.id.toString())}
                underline="none"
                sx={{ fontWeight: 600, color: 'primary.main' }}
              >
                {creator.user?.firstName} {creator.user?.lastName}
              </Link>
              <Typography variant="body2" color="text.secondary">
                {summary}
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

          {message !== defaultMsg && (
            <Box mt={1.5}>
              <Button
                component="button"
                type="button"
                variant="text"
                color="success"
                onClick={() => setValue('message', defaultMsg, { shouldValidate: true })}
              >
                {t('project:revert_to_default_message')}
              </Button>
            </Box>
          )}

          {/* footer actions */}
          <Box mt={4} display="flex" justifyContent="flex-end" gap={1}>
            <Button onClick={onClose}>{t('common:cancel')}</Button>
            <Button variant="contained" type="submit">
              {t('project:send_invitation')}
            </Button>
          </Box>
        </FormProvider>
      </Box>
    </Modal>
  );
};

export default InviteMessageModal;
