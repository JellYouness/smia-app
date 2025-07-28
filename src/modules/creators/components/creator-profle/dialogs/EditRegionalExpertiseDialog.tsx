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
  MenuItem,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import FormProvider, { RHFTextField, RHFSelect } from '@common/components/lib/react-hook-form';
import { Any } from '@common/defs/types';

interface EditRegionalExpertiseDialogProps {
  user: Any;
  onSave: (data: Any) => Promise<void>;
  loading?: boolean;
  open: boolean;
  onClose: () => void;
}

interface RegionalExpertiseItem {
  region: string;
  expertiseLevel: string;
}

interface RegionalExpertiseFormData {
  expertiseItems: RegionalExpertiseItem[];
}

const EXPERTISE_LEVELS = ['BEGINNER', 'INTERMEDIATE', 'EXPERT', 'NATIVE'];

const EditRegionalExpertiseDialog = ({
  user,
  onSave,
  loading,
  open,
  onClose,
}: EditRegionalExpertiseDialogProps) => {
  const RegionalExpertiseSchema = Yup.object().shape({
    expertiseItems: Yup.array().of(
      Yup.object().shape({
        region: Yup.string().required('Region/Country is required'),
        expertiseLevel: Yup.string().required('Expertise level is required'),
      })
    ),
  });

  const methods = useForm<RegionalExpertiseFormData>({
    resolver: yupResolver(RegionalExpertiseSchema),
    defaultValues: {
      expertiseItems: user?.creator?.regionalExpertise || [],
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'expertiseItems',
  });

  const handleAddItem = () => {
    append({ region: '', expertiseLevel: 'BEGINNER' });
  };

  const handleRemoveItem = (index: number) => {
    remove(index);
  };

  const onSubmit = async (data: RegionalExpertiseFormData) => {
    await onSave({ regionalExpertise: data.expertiseItems });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Regional Expertise</DialogTitle>
      <DialogContent>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Edit Regional Expertise
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
                        Region {index + 1}
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
                        name={`expertiseItems.${index}.region`}
                        label="Region/Country"
                        fullWidth
                        size="small"
                        placeholder="e.g., United States, Europe, Asia"
                        error={!!errors.expertiseItems?.[index]?.region}
                        helperText={errors.expertiseItems?.[index]?.region?.message}
                      />
                      <RHFSelect
                        name={`expertiseItems.${index}.expertiseLevel`}
                        label="Expertise Level"
                        error={!!errors.expertiseItems?.[index]?.expertiseLevel}
                        helperText={errors.expertiseItems?.[index]?.expertiseLevel?.message}
                      >
                        {EXPERTISE_LEVELS.map((level) => (
                          <MenuItem key={level} value={level}>
                            {level}
                          </MenuItem>
                        ))}
                      </RHFSelect>
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
                Add Region
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

export default EditRegionalExpertiseDialog;
