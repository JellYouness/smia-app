import {
  Modal,
  Box,
  Typography,
  IconButton,
  Button,
  CircularProgress,
  Grid,
  MenuItem,
  Chip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import dayjs from 'dayjs';
import RHFTextField from '@common/components/lib/react-hook-form/RHFTextField';
import { RHFSelect } from '@common/components/lib/react-hook-form/RHFSelect';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import useMedia from '../hooks/useMedia';
import { MEDIA_POST_PRIORITY, MEDIA_POST_STATUS } from '../defs/types';
import { useState } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

interface Props {
  open: boolean;
  onClose: () => void;
  projectId: number;
  onCreated: () => void;
}

const PRIORITY_OPTIONS = [
  { label: 'High', value: MEDIA_POST_PRIORITY.HIGH },
  { label: 'Medium', value: MEDIA_POST_PRIORITY.MED },
  { label: 'Low', value: MEDIA_POST_PRIORITY.LOW },
];

const PRIORITY_COLOR_MAP: Record<MEDIA_POST_PRIORITY, string> = {
  [MEDIA_POST_PRIORITY.HIGH]: '#EF4444',
  [MEDIA_POST_PRIORITY.MED]: '#F59E0B',
  [MEDIA_POST_PRIORITY.LOW]: '#10B981',
};

const schema = yup.object({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
  priority: yup.string().oneOf(Object.values(MEDIA_POST_PRIORITY)).required('Priority is required'),
  dueDate: yup.date().required('Due date is required'),
});

type FormValues = {
  title: string;
  description: string;
  priority: MEDIA_POST_PRIORITY;
  dueDate: Date | null;
};

const CreateMediaPostModal = ({ open, onClose, projectId, onCreated }: Props) => {
  const methods = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      priority: MEDIA_POST_PRIORITY.MED,
      dueDate: null,
    },
  });
  const { createOne } = useMedia();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    const res = await createOne({
      title: values.title,
      description: values.description,
      priority: values.priority,
      dueDate: values.dueDate ? dayjs(values.dueDate).format('YYYY-MM-DD') : undefined,
      status: MEDIA_POST_STATUS.BACKLOG,
      projectId,
    });
    setLoading(false);
    if (res.success) {
      onCreated();
      methods.reset();
    }
  };

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Modal open={open} onClose={onClose}>
          <Box
            component="form"
            onSubmit={methods.handleSubmit(onSubmit)}
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100%',
              maxWidth: 500,
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: 24,
              p: 3,
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <IconButton
              size="small"
              onClick={onClose}
              sx={{ position: 'absolute', top: 8, right: 8 }}
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" mb={2} fontWeight={700} textAlign="left">
              Create Media Post
            </Typography>
            <FormProvider {...methods}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <RHFTextField name="title" label="Title" fullWidth autoFocus />
                </Grid>
                <Grid item xs={12}>
                  <RHFTextField
                    name="description"
                    label="Description"
                    fullWidth
                    multiline
                    rows={4}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <RHFSelect name="priority" label="Priority">
                    {PRIORITY_OPTIONS.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        <Chip
                          size="small"
                          label=" "
                          sx={{
                            mr: 1,
                            backgroundColor: PRIORITY_COLOR_MAP[opt.value],
                            width: 16,
                            height: 16,
                            minWidth: 16,
                            borderRadius: '50%',
                          }}
                        />
                        {opt.label}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Due Date"
                    value={methods.watch('dueDate')}
                    onChange={(date) => methods.setValue('dueDate', date)}
                    slotProps={{ textField: { fullWidth: true, name: 'dueDate' } }}
                    disablePast
                  />
                </Grid>
              </Grid>
              <Box mt={4} display="flex" justifyContent="flex-end" gap={1}>
                <Button variant="outlined" onClick={onClose} disabled={loading}>
                  Cancel
                </Button>
                <Button variant="contained" type="submit" disabled={loading}>
                  {loading ? <CircularProgress size={20} /> : 'Create'}
                </Button>
              </Box>
            </FormProvider>
          </Box>
        </Modal>
      </LocalizationProvider>
    </>
  );
};

export default CreateMediaPostModal;
