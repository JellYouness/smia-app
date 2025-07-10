import {
  Box,
  Grid,
  Typography,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import FormProvider, { RHFTextField } from '@common/components/lib/react-hook-form';
import { Add, Close } from '@mui/icons-material';
import { Any } from '@common/defs/types';
import { useState } from 'react';

interface EditSkillsDialogProps {
  user: Any;
  onSave: (data: Any) => void;
  loading?: boolean;
  open: boolean;
  onClose: () => void;
}

const EditSkillsDialog = ({
  user,
  onSave,
  loading = false,
  open,
  onClose,
}: EditSkillsDialogProps) => {
  const [newSkill, setNewSkill] = useState('');
  const [skills, setSkills] = useState<string[]>(user?.creator?.skills || []);

  const SkillsSchema = Yup.object().shape({
    skills: Yup.array().of(Yup.string()),
  });

  const methods = useForm({
    resolver: yupResolver(SkillsSchema),
    defaultValues: {
      skills,
    },
  });

  const { handleSubmit } = methods;

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      const updatedSkills = [...skills, newSkill.trim()];
      setSkills(updatedSkills);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updatedSkills = skills.filter((skill) => skill !== skillToRemove);
    setSkills(updatedSkills);
  };

  const onSubmit = () => {
    onSave(skills);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Skills</DialogTitle>
      <DialogContent>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Add your skills to showcase your expertise to potential clients.
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <RHFTextField
                    name="newSkill"
                    label="Add Skill"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="e.g., JavaScript, Photoshop, Project Management"
                    sx={{ flexGrow: 1 }}
                  />
                  <Button
                    variant="outlined"
                    onClick={handleAddSkill}
                    disabled={!newSkill.trim()}
                    startIcon={<Add />}
                    sx={{ minWidth: 'auto', px: 2 }}
                  >
                    Add
                  </Button>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Your Skills ({skills.length})
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {skills.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      onDelete={() => handleRemoveSkill(skill)}
                      deleteIcon={<Close />}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                  {skills.length === 0 && (
                    <Typography variant="body2" color="text.secondary">
                      No skills added yet. Add your first skill above.
                    </Typography>
                  )}
                </Box>
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
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditSkillsDialog;
