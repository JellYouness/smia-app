import React from 'react';
import {
  Box,
  Button,
  Stack,
  Typography,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import FormProvider, { RHFTextField } from '@common/components/lib/react-hook-form';
import { Any } from '@common/defs/types';

interface EditMediaTypesDialogProps {
  user: Any;
  onSave: (data: Any) => Promise<void>;
  loading?: boolean;
  open: boolean;
  onClose: () => void;
}

interface MediaTypesFormData {
  mediaTypes: string[];
  newMediaType: string;
}

const MEDIA_TYPE_OPTIONS = [
  'VIDEO',
  'PHOTO',
  'AUDIO',
  'ANIMATION',
  'GRAPHIC_DESIGN',
  'WRITING',
  'TRANSLATION',
  'CONSULTING',
  'OTHER',
];

const EditMediaTypesDialog = ({
  user,
  onSave,
  loading,
  open,
  onClose,
}: EditMediaTypesDialogProps) => {
  const MediaTypesSchema = Yup.object().shape({
    mediaTypes: Yup.array().of(Yup.string()),
    newMediaType: Yup.string().when('mediaTypes', {
      is: (mediaTypes: string[]) => mediaTypes.length === 0,
      then: (schema) => schema.required('At least one media type is required'),
      otherwise: (schema) => schema,
    }),
  });

  const methods = useForm<MediaTypesFormData>({
    resolver: yupResolver(MediaTypesSchema),
    defaultValues: {
      mediaTypes: user?.creator?.mediaTypes || [],
      newMediaType: '',
    },
  });

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = methods;

  const mediaTypes = watch('mediaTypes');
  const newMediaType = watch('newMediaType');

  const handleAddItem = () => {
    if (newMediaType && !mediaTypes.includes(newMediaType)) {
      setValue('mediaTypes', [...mediaTypes, newMediaType]);
      setValue('newMediaType', '');
    }
  };

  const handleRemoveItem = (mediaType: string) => {
    setValue(
      'mediaTypes',
      mediaTypes.filter((type) => type !== mediaType)
    );
  };

  const handleAddFromOptions = (mediaType: string) => {
    if (!mediaTypes.includes(mediaType)) {
      setValue('mediaTypes', [...mediaTypes, mediaType]);
    }
  };

  const onSubmit = async (data: MediaTypesFormData) => {
    await onSave(data.mediaTypes);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Media Types</DialogTitle>
      <DialogContent>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Edit Media Types
            </Typography>

            <Stack spacing={3}>
              {/* Current Media Types */}
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                  Current Media Types
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {mediaTypes.map((mediaType) => (
                    <Chip
                      key={mediaType}
                      label={mediaType}
                      onDelete={() => handleRemoveItem(mediaType)}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                  {mediaTypes.length === 0 && (
                    <Typography variant="body2" color="text.secondary">
                      No media types added yet
                    </Typography>
                  )}
                </Box>
              </Box>

              {/* Add Custom Media Type */}
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                  Add Custom Media Type
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <RHFTextField
                    name="newMediaType"
                    placeholder="Enter custom media type"
                    size="small"
                    sx={{ flexGrow: 1 }}
                    error={!!errors.newMediaType}
                    helperText={errors.newMediaType?.message}
                  />
                  <Button
                    onClick={handleAddItem}
                    variant="outlined"
                    size="small"
                    disabled={!newMediaType}
                  >
                    Add
                  </Button>
                </Box>
              </Box>

              {/* Quick Add Options */}
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                  Quick Add Options
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {MEDIA_TYPE_OPTIONS.map((option) => (
                    <Chip
                      key={option}
                      label={option}
                      onClick={() => handleAddFromOptions(option)}
                      variant="outlined"
                      color={mediaTypes.includes(option) ? 'primary' : 'default'}
                      disabled={mediaTypes.includes(option)}
                    />
                  ))}
                </Box>
              </Box>
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

export default EditMediaTypesDialog;
