import React from 'react';
import {
  Box,
  Button,
  Stack,
  Typography,
  IconButton,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import FormProvider, { RHFTextField } from '@common/components/lib/react-hook-form';
import { Any } from '@common/defs/types';

interface EditEmploymentDialogProps {
  user: Any;
  onSave: (data: Any) => Promise<void>;
  loading?: boolean;
  open: boolean;
  onClose: () => void;
}

interface EmploymentItem {
  title: string;
  company: string;
  duration: string;
  description: string;
}

interface EmploymentFormData {
  employmentItems: EmploymentItem[];
}

const EditEmploymentDialog = ({
  user,
  onSave,
  loading,
  open,
  onClose,
}: EditEmploymentDialogProps) => {
  const EmploymentSchema = Yup.object().shape({
    employmentItems: Yup.array().of(
      Yup.object().shape({
        title: Yup.string().required('Job title is required'),
        company: Yup.string().required('Company is required'),
        duration: Yup.string().required('Duration is required'),
        description: Yup.string().required('Description is required'),
      })
    ),
  });

  const methods = useForm<EmploymentFormData>({
    resolver: yupResolver(EmploymentSchema),
    defaultValues: {
      employmentItems: user?.creator?.professionalBackground || [],
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'employmentItems',
  });

  const handleAddItem = () => {
    append({ title: '', company: '', duration: '', description: '' });
  };

  const handleRemoveItem = (index: number) => {
    remove(index);
  };

  const onSubmit = async (data: EmploymentFormData) => {
    await onSave(data.employmentItems);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Employment History</DialogTitle>
      <DialogContent>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Edit Employment History
            </Typography>

            <Stack spacing={3}>
              {fields.map((field, index) => (
                <Card key={field.id} variant="outlined">
                  <CardContent>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2,
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Position {index + 1}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveItem(index)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </Box>

                    <Stack spacing={2}>
                      <RHFTextField
                        name={`employmentItems.${index}.title`}
                        label="Job Title"
                        fullWidth
                        size="small"
                        error={!!errors.employmentItems?.[index]?.title}
                        helperText={errors.employmentItems?.[index]?.title?.message}
                      />
                      <RHFTextField
                        name={`employmentItems.${index}.company`}
                        label="Company"
                        fullWidth
                        size="small"
                        error={!!errors.employmentItems?.[index]?.company}
                        helperText={errors.employmentItems?.[index]?.company?.message}
                      />
                      <RHFTextField
                        name={`employmentItems.${index}.duration`}
                        label="Duration"
                        fullWidth
                        size="small"
                        placeholder="e.g., 2 years, 2018-2020"
                        error={!!errors.employmentItems?.[index]?.duration}
                        helperText={errors.employmentItems?.[index]?.duration?.message}
                      />
                      <RHFTextField
                        name={`employmentItems.${index}.description`}
                        label="Description"
                        fullWidth
                        multiline
                        rows={3}
                        size="small"
                        placeholder="Describe your role and responsibilities"
                        error={!!errors.employmentItems?.[index]?.description}
                        helperText={errors.employmentItems?.[index]?.description?.message}
                      />
                    </Stack>
                  </CardContent>
                </Card>
              ))}

              <Button
                startIcon={<Add />}
                onClick={handleAddItem}
                variant="outlined"
                sx={{ alignSelf: 'flex-start' }}
              >
                Add Position
              </Button>
            </Stack>
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
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditEmploymentDialog;
