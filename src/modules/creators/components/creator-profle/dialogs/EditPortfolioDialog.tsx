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

interface EditPortfolioDialogProps {
  user: Any;
  onSave: (data: Any) => Promise<void>;
  loading?: boolean;
  open: boolean;
  onClose: () => void;
}

interface PortfolioItem {
  title: string;
  description: string;
  url: string;
}

interface PortfolioFormData {
  portfolioItems: PortfolioItem[];
}

const EditPortfolioDialog = ({
  user,
  onSave,
  loading,
  open,
  onClose,
}: EditPortfolioDialogProps) => {
  const PortfolioSchema = Yup.object().shape({
    portfolioItems: Yup.array().of(
      Yup.object().shape({
        title: Yup.string().required('Project title is required'),
        description: Yup.string().required('Project description is required'),
        url: Yup.string().required('Project URL is required').url('Please enter a valid URL'),
      })
    ),
  });

  const methods = useForm<PortfolioFormData>({
    resolver: yupResolver(PortfolioSchema),
    defaultValues: {
      portfolioItems: user?.creator?.portfolio || [],
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'portfolioItems',
  });

  const handleAddItem = () => {
    append({ title: '', description: '', url: '' });
  };

  const handleRemoveItem = (index: number) => {
    remove(index);
  };

  const onSubmit = async (data: PortfolioFormData) => {
    await onSave(data.portfolioItems);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Portfolio</DialogTitle>
      <DialogContent>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Edit Portfolio
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
                        Project {index + 1}
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
                        name={`portfolioItems.${index}.title`}
                        label="Project Title"
                        fullWidth
                        size="small"
                        error={!!errors.portfolioItems?.[index]?.title}
                        helperText={errors.portfolioItems?.[index]?.title?.message}
                      />
                      <RHFTextField
                        name={`portfolioItems.${index}.description`}
                        label="Description"
                        fullWidth
                        multiline
                        rows={3}
                        size="small"
                        error={!!errors.portfolioItems?.[index]?.description}
                        helperText={errors.portfolioItems?.[index]?.description?.message}
                      />
                      <RHFTextField
                        name={`portfolioItems.${index}.url`}
                        label="Project URL"
                        fullWidth
                        size="small"
                        placeholder="https://example.com"
                        error={!!errors.portfolioItems?.[index]?.url}
                        helperText={errors.portfolioItems?.[index]?.url?.message}
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
                Add Project
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

export default EditPortfolioDialog;
