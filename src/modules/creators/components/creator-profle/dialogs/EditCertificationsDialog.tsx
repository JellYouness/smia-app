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

interface EditCertificationsDialogProps {
  user: Any;
  onSave: (data: Any) => Promise<void>;
  loading?: boolean;
  open: boolean;
  onClose: () => void;
}

interface CertificationItem {
  title: string;
  issuer: string;
  date: string;
}

interface CertificationsFormData {
  certifications: CertificationItem[];
}

const EditCertificationsDialog = ({
  user,
  onSave,
  loading,
  open,
  onClose,
}: EditCertificationsDialogProps) => {
  const CertificationsSchema = Yup.object().shape({
    certifications: Yup.array().of(
      Yup.object().shape({
        title: Yup.string().required('Certification title is required'),
        issuer: Yup.string().required('Issuing organization is required'),
        date: Yup.string().required('Date obtained is required'),
      })
    ),
  });

  const methods = useForm<CertificationsFormData>({
    resolver: yupResolver(CertificationsSchema),
    defaultValues: {
      certifications: user?.creator?.certifications || [],
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'certifications',
  });

  const handleAddItem = () => {
    append({ title: '', issuer: '', date: '' });
  };

  const handleRemoveItem = (index: number) => {
    remove(index);
  };

  const onSubmit = async (data: CertificationsFormData) => {
    await onSave(data.certifications);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Certifications</DialogTitle>
      <DialogContent>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Edit Certifications
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
                        Certification {index + 1}
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
                        name={`certifications.${index}.title`}
                        label="Certification Title"
                        fullWidth
                        size="small"
                        error={!!errors.certifications?.[index]?.title}
                        helperText={errors.certifications?.[index]?.title?.message}
                      />
                      <RHFTextField
                        name={`certifications.${index}.issuer`}
                        label="Issuing Organization"
                        fullWidth
                        size="small"
                        error={!!errors.certifications?.[index]?.issuer}
                        helperText={errors.certifications?.[index]?.issuer?.message}
                      />
                      <RHFTextField
                        name={`certifications.${index}.date`}
                        label="Date Obtained"
                        fullWidth
                        size="small"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.certifications?.[index]?.date}
                        helperText={errors.certifications?.[index]?.date?.message}
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
                Add Certification
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

export default EditCertificationsDialog;
