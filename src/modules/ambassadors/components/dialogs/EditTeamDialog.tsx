import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Chip,
  Stack,
  IconButton,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import FormProvider, { RHFTextField } from '@common/components/lib/react-hook-form';
import { Add, Close } from '@mui/icons-material';
import { TFunction } from 'i18next';
import { Ambassador } from '../../defs/types';

interface EditTeamDialogProps {
  ambassador: Ambassador;
  onSave: (data: Partial<Ambassador>) => void;
  loading?: boolean;
  open: boolean;
  onClose: () => void;
  t: TFunction;
}

const EditTeamDialog = ({
  ambassador,
  onSave,
  loading = false,
  open,
  onClose,
  t,
}: EditTeamDialogProps) => {
  const [teamMembers, setTeamMembers] = useState<string[]>(
    ambassador.teamMembers?.map(String) || []
  );
  const [newMember, setNewMember] = useState('');

  const TeamSchema = Yup.object().shape({
    teamName: Yup.string().required(t('user:team_name_required') || 'Team name is required'),
  });

  const methods = useForm({
    resolver: yupResolver(TeamSchema),
    defaultValues: {
      teamName: ambassador.teamName || '',
    },
  });

  const { handleSubmit } = methods;

  const handleAddMember = () => {
    if (newMember.trim() && !teamMembers.includes(newMember.trim())) {
      setTeamMembers([...teamMembers, newMember.trim()]);
      setNewMember('');
    }
  };

  const handleRemoveMember = (memberToRemove: string) => {
    setTeamMembers(teamMembers.filter((member) => member !== memberToRemove));
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddMember();
    }
  };

  const onSubmit = (data: Partial<Ambassador>) => {
    onSave({
      ...data,
      teamMembers: teamMembers.map(Number),
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {t('user:edit_team') || 'Edit Team'}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {t('user:update_team_info') || 'Update your team information and members.'}
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <RHFTextField
                  name="teamName"
                  label={t('user:team_name') || 'Team Name'}
                  placeholder={t('user:enter_team_name') || 'Enter your team name'}
                  helperText={t('user:team_name_help') || 'The name of your team or organization'}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  {t('user:team_members') || 'Team Members'}
                </Typography>

                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                  <TextField
                    value={newMember}
                    onChange={(e) => setNewMember(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={t('user:add_team_member') || 'Add team member ID'}
                    size="small"
                    sx={{ flexGrow: 1 }}
                  />
                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={handleAddMember}
                    disabled={!newMember.trim()}
                  >
                    {t('common:add') || 'Add'}
                  </Button>
                </Stack>

                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {teamMembers.map((member, index) => (
                    <Chip
                      key={index}
                      label={member}
                      onDelete={() => handleRemoveMember(member)}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </FormProvider>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          {t('common:cancel') || 'Cancel'}
        </Button>
        <Button variant="contained" onClick={handleSubmit(onSubmit)} disabled={loading}>
          {loading ? t('common:saving') || 'Saving...' : t('common:save_changes') || 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditTeamDialog;
