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

interface EditAchievementsDialogProps {
  user: Any;
  onSave: (data: Any) => Promise<void>;
  loading?: boolean;
  open: boolean;
  onClose: () => void;
}

interface AchievementItem {
  description: string;
}

interface AchievementsFormData {
  achievements: AchievementItem[];
}

const EditAchievementsDialog = ({
  user,
  onSave,
  loading,
  open,
  onClose,
}: EditAchievementsDialogProps) => {
  const AchievementsSchema = Yup.object().shape({
    achievements: Yup.array().of(
      Yup.object().shape({
        description: Yup.string().required('Achievement description is required'),
      })
    ),
  });

  const methods = useForm<AchievementsFormData>({
    resolver: yupResolver(AchievementsSchema),
    defaultValues: {
      achievements: (user?.creator?.achievements || []).map((achievement: string) => ({
        description: achievement,
      })),
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'achievements',
  });

  const handleAddItem = () => {
    append({ description: '' });
  };

  const handleRemoveItem = (index: number) => {
    remove(index);
  };

  const onSubmit = async (data: AchievementsFormData) => {
    const achievements = data.achievements.map((item) => item.description);
    await onSave(achievements);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Achievements</DialogTitle>
      <DialogContent>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Edit Achievements
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
                        Achievement {index + 1}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveItem(index)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </Box>

                    <RHFTextField
                      name={`achievements.${index}.description`}
                      label="Achievement Description"
                      fullWidth
                      multiline
                      rows={2}
                      size="small"
                      placeholder="Describe your achievement or accomplishment"
                      error={!!errors.achievements?.[index]?.description}
                      helperText={errors.achievements?.[index]?.description?.message}
                    />
                  </CardContent>
                </Card>
              ))}

              <Button
                startIcon={<Add />}
                onClick={handleAddItem}
                variant="outlined"
                sx={{ alignSelf: 'flex-start' }}
              >
                Add Achievement
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

export default EditAchievementsDialog;
