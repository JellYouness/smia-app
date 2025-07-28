import {
  Box,
  Grid,
  Typography,
  Button,
  IconButton,
  Card,
  CardContent,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import FormProvider, { RHFSelect } from '@common/components/lib/react-hook-form';
import { Add, Delete } from '@mui/icons-material';
import { Any } from '@common/defs/types';
import { useState, useEffect } from 'react';
import { LanguageOptions, LanguageProficiency } from '@modules/creators/defs/enums';

interface Language {
  language: string;
  proficiency: string;
}

interface LanguagesFormData {
  languages: Language[];
}

interface EditLanguagesDialogProps {
  user: Any;
  open: boolean;
  onClose: () => void;
  onSave: (data: Any) => void;
  loading?: boolean;
}

const EditLanguagesDialog = ({
  user,
  open,
  onClose,
  onSave,
  loading,
}: EditLanguagesDialogProps) => {
  const [languages, setLanguages] = useState<Language[]>(() => {
    if (user?.creator?.languages) {
      try {
        if (Array.isArray(user.creator.languages)) {
          return user.creator.languages;
        }
        return JSON.parse(user.creator.languages);
      } catch {
        return [];
      }
    }
    return [];
  });

  const LanguagesSchema = Yup.object().shape({
    languages: Yup.array().of(
      Yup.object().shape({
        language: Yup.string().required('Language is required'),
        proficiency: Yup.string().required('Proficiency level is required'),
      })
    ),
  });

  const methods = useForm<LanguagesFormData>({
    resolver: yupResolver(LanguagesSchema),
    defaultValues: {
      languages,
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'languages',
  });

  useEffect(() => {
    setValue('languages', languages);
  }, [languages, setValue]);

  const handleAddLanguage = () => {
    const newLanguage: Language = { language: '', proficiency: '' };
    setLanguages([...languages, newLanguage]);
    append(newLanguage);
  };

  const handleRemoveLanguage = (index: number) => {
    const updatedLanguages = languages.filter((_, i) => i !== index);
    setLanguages(updatedLanguages);
    remove(index);
  };

  const handleLanguageChange = (index: number, field: keyof Language, value: string) => {
    const updatedLanguages = languages.map((lang, i) =>
      i === index ? { ...lang, [field]: value } : lang
    );
    setLanguages(updatedLanguages);
  };

  const onSubmit = () => {
    const filtered = languages.filter(
      (lang) => lang.language.trim() !== '' && lang.proficiency.trim() !== ''
    );
    onSave(filtered);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Languages</DialogTitle>
      <DialogContent>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Add the languages you speak and your proficiency level in each.
            </Typography>

            <Grid container spacing={3}>
              {fields.map((field, index) => (
                <Grid item xs={12} key={field.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          mb: 2,
                        }}
                      >
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          Language #{index + 1}
                        </Typography>
                        <IconButton
                          onClick={() => handleRemoveLanguage(index)}
                          color="error"
                          size="small"
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <RHFSelect
                            name={`languages.${index}.language`}
                            label="Language"
                            value={languages[index]?.language || ''}
                            onChange={(e) =>
                              handleLanguageChange(index, 'language', e.target.value)
                            }
                            error={!!errors.languages?.[index]?.language}
                            helperText={errors.languages?.[index]?.language?.message}
                          >
                            {LanguageOptions.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </RHFSelect>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <RHFSelect
                            name={`languages.${index}.proficiency`}
                            label="Proficiency Level"
                            value={languages[index]?.proficiency || ''}
                            onChange={(e) =>
                              handleLanguageChange(index, 'proficiency', e.target.value)
                            }
                            error={!!errors.languages?.[index]?.proficiency}
                            helperText={errors.languages?.[index]?.proficiency?.message}
                          >
                            {Object.values(LanguageProficiency).map((level) => (
                              <MenuItem key={level} value={level}>
                                {level}
                              </MenuItem>
                            ))}
                          </RHFSelect>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              ))}

              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  onClick={handleAddLanguage}
                  startIcon={<Add />}
                  fullWidth
                >
                  Add Language
                </Button>
              </Grid>
            </Grid>
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

export default EditLanguagesDialog;
