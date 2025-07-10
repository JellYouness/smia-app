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
import { useForm } from 'react-hook-form';
import FormProvider, { RHFTextField, RHFSelect } from '@common/components/lib/react-hook-form';
import { Add, Delete } from '@mui/icons-material';
import { Any } from '@common/defs/types';
import { useState } from 'react';

interface Language {
  language: string;
  proficiency: string;
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
  const [languages, setLanguages] = useState<Language[]>(user?.creator?.languages || []);
  const proficiencyLevels = ['Beginner', 'Elementary', 'Intermediate', 'Advanced', 'Native/Fluent'];

  const methods = useForm({
    defaultValues: {
      languages,
    },
  });

  const { handleSubmit } = methods;

  const handleAddLanguage = () => {
    const newLanguage: Language = { language: '', proficiency: '' };
    setLanguages([...languages, newLanguage]);
  };

  const handleRemoveLanguage = (index: number) => {
    const updatedLanguages = languages.filter((_, i) => i !== index);
    setLanguages(updatedLanguages);
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
              {languages.map((language, index) => (
                <Grid item xs={12} key={index}>
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
                          <RHFTextField
                            name={`languages.${index}.language`}
                            label="Language"
                            value={language.language}
                            onChange={(e) =>
                              handleLanguageChange(index, 'language', e.target.value)
                            }
                            placeholder="e.g., English, Spanish, French"
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <RHFSelect
                            name={`languages.${index}.proficiency`}
                            label="Proficiency Level"
                            value={language.proficiency}
                            onChange={(e) =>
                              handleLanguageChange(index, 'proficiency', e.target.value)
                            }
                          >
                            {proficiencyLevels.map((level) => (
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
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleSubmit(onSubmit)} variant="contained" disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditLanguagesDialog;
