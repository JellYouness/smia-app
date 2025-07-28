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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import FormProvider, { RHFTextField } from '@common/components/lib/react-hook-form';
import { Add, Close } from '@mui/icons-material';
import { TFunction } from 'i18next';
import { RegionalExpertise } from '../../defs/types';
import { Any } from '@common/defs/types';

interface ApplyForAmbassadorDialogProps {
  onSave: (data: Any) => void;
  loading?: boolean;
  open: boolean;
  onClose: () => void;
  t: TFunction;
}

const ApplyForAmbassadorDialog = ({
  onSave,
  loading = false,
  open,
  onClose,
  t,
}: ApplyForAmbassadorDialogProps) => {
  const [teamMembers, setTeamMembers] = useState<string[]>([]);
  const [newMember, setNewMember] = useState('');
  const [regionalExpertise, setRegionalExpertise] = useState<RegionalExpertise[]>([]);
  const [newRegion, setNewRegion] = useState('');
  const [newProficiencyLevel, setNewProficiencyLevel] = useState<
    'BEGINNER' | 'INTERMEDIATE' | 'EXPERT'
  >('INTERMEDIATE');
  const [newSpecialization, setNewSpecialization] = useState('');
  const [newServiceOffering, setNewServiceOffering] = useState('');

  const ApplicationSchema = Yup.object().shape({
    teamName: Yup.string().required(t('user:team_name_required') || 'Team name is required'),
    teamDescription: Yup.string().required(
      t('user:team_description_required') || 'Team description is required'
    ),
    specializations: Yup.array().min(
      1,
      t('user:at_least_one_specialization') || 'At least one specialization is required'
    ),
    serviceOfferings: Yup.array().min(
      1,
      t('user:at_least_one_service') || 'At least one service offering is required'
    ),
    yearsInBusiness: Yup.number()
      .required(t('user:years_in_business_required') || 'Years in business is required')
      .min(0, t('user:years_in_business_min') || 'Years in business must be at least 0')
      .max(50, t('user:years_in_business_max') || 'Years in business cannot exceed 50'),
    businessStreet: Yup.string().required(
      t('user:business_street_required') || 'Business street is required'
    ),
    businessCity: Yup.string().required(
      t('user:business_city_required') || 'Business city is required'
    ),
    businessState: Yup.string().required(
      t('user:business_state_required') || 'Business state is required'
    ),
    businessCountry: Yup.string().required(
      t('user:business_country_required') || 'Business country is required'
    ),
    businessPostalCode: Yup.string().required(
      t('user:business_postal_code_required') || 'Business postal code is required'
    ),
  });

  const methods = useForm({
    resolver: yupResolver(ApplicationSchema),
    defaultValues: {
      teamName: '',
      teamDescription: '',
      specializations: [],
      serviceOfferings: [],
      yearsInBusiness: 0,
      businessStreet: '',
      businessCity: '',
      businessState: '',
      businessCountry: '',
      businessPostalCode: '',
    },
  });

  const { handleSubmit, setValue, watch } = methods;
  const specializations = watch('specializations') || [];
  const serviceOfferings = watch('serviceOfferings') || [];

  const handleAddMember = () => {
    if (newMember.trim() && !teamMembers.includes(newMember.trim())) {
      setTeamMembers([...teamMembers, newMember.trim()]);
      setNewMember('');
    }
  };

  const handleRemoveMember = (memberToRemove: string) => {
    setTeamMembers(teamMembers.filter((member) => member !== memberToRemove));
  };

  const handleAddSpecialization = () => {
    if (newSpecialization.trim() && !specializations.includes(newSpecialization.trim() as never)) {
      setValue('specializations', [...specializations, newSpecialization.trim() as never]);
      setNewSpecialization('');
    }
  };

  const handleRemoveSpecialization = (specializationToRemove: string) => {
    setValue(
      'specializations',
      specializations.filter((spec) => spec !== specializationToRemove)
    );
  };

  const handleAddServiceOffering = () => {
    if (
      newServiceOffering.trim() &&
      !serviceOfferings.includes(newServiceOffering.trim() as never)
    ) {
      setValue('serviceOfferings', [...serviceOfferings, newServiceOffering.trim() as never]);
      setNewServiceOffering('');
    }
  };

  const handleRemoveServiceOffering = (serviceToRemove: string) => {
    setValue(
      'serviceOfferings',
      serviceOfferings.filter((service) => service !== serviceToRemove)
    );
  };

  const handleAddRegionalExpertise = () => {
    if (newRegion.trim()) {
      const expertise: RegionalExpertise = {
        region: newRegion.trim(),
        proficiencyLevel: newProficiencyLevel,
      };
      setRegionalExpertise([...regionalExpertise, expertise]);
      setNewRegion('');
      setNewProficiencyLevel('INTERMEDIATE');
    }
  };

  const handleRemoveRegionalExpertise = (regionToRemove: string) => {
    setRegionalExpertise(regionalExpertise.filter((exp) => exp.region !== regionToRemove));
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddMember();
    }
  };

  const handleSpecializationKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddSpecialization();
    }
  };

  const handleServiceOfferingKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddServiceOffering();
    }
  };

  const onSubmit = (data: Any) => {
    onSave({
      ...data,
      teamMembers: teamMembers.map(Number),
      regionalExpertise,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {t('user:apply_for_ambassador') || 'Apply for Ambassador Status'}
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
              {t('user:ambassador_application_description') ||
                'Complete this form to apply for Ambassador status. Provide detailed information about your team and regional expertise.'}
            </Typography>

            <Grid container spacing={3}>
              {/* Team Information */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  {t('user:team_information') || 'Team Information'}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <RHFTextField
                  name="teamName"
                  label={t('user:team_name') || 'Team Name'}
                  placeholder={t('user:enter_team_name') || 'Enter your team name'}
                  helperText={t('user:team_name_help') || 'The name of your team or organization'}
                />
              </Grid>

              <Grid item xs={12}>
                <RHFTextField
                  name="teamDescription"
                  label={t('user:team_description') || 'Team Description'}
                  placeholder={
                    t('user:enter_team_description') || 'Describe your team and its capabilities'
                  }
                  multiline
                  rows={3}
                  helperText={
                    t('user:team_description_help') || 'Provide a detailed description of your team'
                  }
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

              {/* Specializations */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  {t('user:specializations') || 'Specializations'}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                  <TextField
                    value={newSpecialization}
                    onChange={(e) => setNewSpecialization(e.target.value)}
                    onKeyPress={handleSpecializationKeyPress}
                    placeholder={t('user:enter_specialization') || 'Enter specialization'}
                    size="small"
                    sx={{ flexGrow: 1 }}
                  />
                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={handleAddSpecialization}
                    disabled={!newSpecialization.trim()}
                  >
                    {t('common:add') || 'Add'}
                  </Button>
                </Stack>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {specializations.map((spec, index) => (
                    <Chip
                      key={index}
                      label={spec}
                      onDelete={() => handleRemoveSpecialization(spec)}
                      color="secondary"
                      variant="outlined"
                    />
                  ))}
                </Stack>
              </Grid>

              {/* Service Offerings */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  {t('user:service_offerings') || 'Service Offerings'}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                  <TextField
                    value={newServiceOffering}
                    onChange={(e) => setNewServiceOffering(e.target.value)}
                    onKeyPress={handleServiceOfferingKeyPress}
                    placeholder={t('user:enter_service_offering') || 'Enter service offering'}
                    size="small"
                    sx={{ flexGrow: 1 }}
                  />
                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={handleAddServiceOffering}
                    disabled={!newServiceOffering.trim()}
                  >
                    {t('common:add') || 'Add'}
                  </Button>
                </Stack>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {serviceOfferings.map((service, index) => (
                    <Chip
                      key={index}
                      label={service}
                      onDelete={() => handleRemoveServiceOffering(service)}
                      color="info"
                      variant="outlined"
                    />
                  ))}
                </Stack>
              </Grid>

              {/* Regional Expertise */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  {t('user:regional_expertise') || 'Regional Expertise'}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                  <TextField
                    value={newRegion}
                    onChange={(e) => setNewRegion(e.target.value)}
                    placeholder={t('user:enter_region') || 'Enter region'}
                    size="small"
                    sx={{ flexGrow: 1 }}
                  />
                  <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel>{t('user:proficiency_level') || 'Level'}</InputLabel>
                    <Select
                      value={newProficiencyLevel}
                      onChange={(e) => setNewProficiencyLevel(e.target.value as Any)}
                      label={t('user:proficiency_level') || 'Level'}
                    >
                      <MenuItem value="BEGINNER">{t('user:beginner') || 'Beginner'}</MenuItem>
                      <MenuItem value="INTERMEDIATE">
                        {t('user:intermediate') || 'Intermediate'}
                      </MenuItem>
                      <MenuItem value="EXPERT">{t('user:expert') || 'Expert'}</MenuItem>
                    </Select>
                  </FormControl>
                  <Button
                    variant="outlined"
                    onClick={handleAddRegionalExpertise}
                    disabled={!newRegion.trim()}
                  >
                    {t('common:add') || 'Add'}
                  </Button>
                </Stack>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {regionalExpertise.map((expertise, index) => (
                    <Chip
                      key={index}
                      label={`${expertise.region} (${expertise.proficiencyLevel})`}
                      onDelete={() => handleRemoveRegionalExpertise(expertise.region)}
                      color="success"
                      variant="outlined"
                    />
                  ))}
                </Stack>
              </Grid>

              {/* Business Information */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  {t('user:business_information') || 'Business Information'}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <RHFTextField
                  name="yearsInBusiness"
                  label={t('user:years_in_business') || 'Years in Business'}
                  type="number"
                  placeholder="0"
                  helperText={
                    t('user:years_in_business_help') ||
                    'Number of years your business has been operating'
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <RHFTextField
                  name="businessStreet"
                  label={t('user:business_street') || 'Business Street Address'}
                  placeholder={t('user:enter_business_street') || 'Enter business street address'}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <RHFTextField
                  name="businessCity"
                  label={t('user:business_city') || 'Business City'}
                  placeholder={t('user:enter_business_city') || 'Enter business city'}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <RHFTextField
                  name="businessState"
                  label={t('user:business_state') || 'Business State/Province'}
                  placeholder={t('user:enter_business_state') || 'Enter business state or province'}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <RHFTextField
                  name="businessCountry"
                  label={t('user:business_country') || 'Business Country'}
                  placeholder={t('user:enter_business_country') || 'Enter business country'}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <RHFTextField
                  name="businessPostalCode"
                  label={t('user:business_postal_code') || 'Business Postal Code'}
                  placeholder={t('user:enter_business_postal_code') || 'Enter business postal code'}
                />
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
          {loading
            ? t('common:submitting') || 'Submitting...'
            : t('user:submit_application') || 'Submit Application'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ApplyForAmbassadorDialog;
