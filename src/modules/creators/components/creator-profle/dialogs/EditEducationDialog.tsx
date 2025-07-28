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

interface EditEducationDialogProps {
  user: Any;
  onSave: (data: Any) => Promise<void>;
  loading?: boolean;
  open: boolean;
  onClose: () => void;
}

interface EducationItem {
  year: string;
  field: string;
  degree: string;
  institution: string;
}

interface EducationFormData {
  educationItems: EducationItem[];
}

const EditEducationDialog = ({
  user,
  onSave,
  loading,
  open,
  onClose,
}: EditEducationDialogProps) => {
  const EducationSchema = Yup.object().shape({
    educationItems: Yup.array().of(
      Yup.object().shape({
        institution: Yup.string().required('Institution is required'),
        degree: Yup.string().required('Degree is required'),
        field: Yup.string().required('Field of study is required'),
        year: Yup.string().required('Year is required'),
      })
    ),
  });

  const methods = useForm<EducationFormData>({
    resolver: yupResolver(EducationSchema),
    defaultValues: {
      educationItems: user?.creator?.education || [],
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'educationItems',
  });

  const handleAddItem = () => {
    append({ year: '', field: '', degree: '', institution: '' });
  };

  const handleRemoveItem = (index: number) => {
    remove(index);
  };

  const onSubmit = async (data: EducationFormData) => {
    await onSave(data.educationItems);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Education</DialogTitle>
      <DialogContent>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ p: 2 }}>
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
                        Education {index + 1}
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
                        name={`educationItems.${index}.institution`}
                        label="Institution"
                        fullWidth
                        size="small"
                        error={!!errors.educationItems?.[index]?.institution}
                        helperText={errors.educationItems?.[index]?.institution?.message}
                      />
                      <RHFTextField
                        name={`educationItems.${index}.degree`}
                        label="Degree"
                        fullWidth
                        size="small"
                        placeholder="e.g., Bachelor's, Master's, PhD"
                        error={!!errors.educationItems?.[index]?.degree}
                        helperText={errors.educationItems?.[index]?.degree?.message}
                      />
                      <RHFTextField
                        name={`educationItems.${index}.field`}
                        label="Field of Study"
                        fullWidth
                        size="small"
                        placeholder="e.g., Computer Science, Journalism"
                        error={!!errors.educationItems?.[index]?.field}
                        helperText={errors.educationItems?.[index]?.field?.message}
                      />
                      <RHFTextField
                        name={`educationItems.${index}.year`}
                        label="Year"
                        fullWidth
                        size="small"
                        placeholder="e.g., 2020"
                        error={!!errors.educationItems?.[index]?.year}
                        helperText={errors.educationItems?.[index]?.year?.message}
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
                Add Education
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

export default EditEducationDialog;
