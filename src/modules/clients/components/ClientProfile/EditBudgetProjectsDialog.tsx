import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import FormProvider from '@common/components/lib/react-hook-form';
import { Any } from '@common/defs/types';
import useCreators from '@modules/creators/hooks/useCreators';
import Link from 'next/link';
import { Creator } from '@modules/creators/defs/types';

interface EditBudgetProjectsDialogProps {
  user: Any;
  onSave: (data: Any) => void;
  loading?: boolean;
  open: boolean;
  onClose: () => void;
}

const EditBudgetProjectsDialog = ({
  user,
  onSave,
  loading = false,
  open,
  onClose,
}: EditBudgetProjectsDialogProps) => {
  const BudgetProjectsSchema = Yup.object().shape({
    budget: Yup.string().required('Budget is required'),
    projectCount: Yup.number().min(0, 'Must be 0 or more').required('Project count is required'),
    preferredCreators: Yup.array().of(Yup.string()),
  });

  const { readOne: readCreator } = useCreators();
  const [preferredCreatorsData, setPreferredCreatorsData] = useState<Creator[]>([]);

  useEffect(() => {
    const fetchPreferredCreators = async () => {
      if (!user?.client?.preferredCreators || user.client.preferredCreators.length === 0) {
        setPreferredCreatorsData([]);
        return;
      }
      const results = await Promise.all(
        user.client.preferredCreators.map(async (id: number) => {
          try {
            const res = await readCreator(id);
            // Assuming res.data.item is the creator object
            return res.data?.item;
          } catch {
            return null;
          }
        })
      );
      setPreferredCreatorsData(results.filter(Boolean));
    };
    fetchPreferredCreators();
  }, [user?.client?.preferredCreators]);

  const getCreator = (id: number) => {
    const creator = preferredCreatorsData.find((c) => c.id === id);
    return { firstName: creator?.user?.firstName, lastName: creator?.user?.lastName };
  };

  const methods = useForm({
    resolver: yupResolver(BudgetProjectsSchema),
    defaultValues: {
      budget: user?.client?.budget || '',
      projectCount: user?.client?.projectCount || 0,
      preferredCreators: user?.client?.preferredCreators || [],
    },
  });

  const { handleSubmit } = methods;

  const onSubmit = (data: Any) => {
    onSave(data);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm">
      <DialogTitle>Edit Budget & Projects</DialogTitle>
      <DialogContent>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Update your budget, project count, and preferred creators.
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="budget-label">Budget</InputLabel>
                  <Select
                    labelId="budget-label"
                    id="budget"
                    // name="budget"
                    label="Budget"
                    defaultValue={user?.client?.budget || ''}
                    {...methods.register('budget')}
                  >
                    <MenuItem value="SMALL">Small (&lt; $5,000)</MenuItem>
                    <MenuItem value="MEDIUM">Medium ($5,000 - $25,000)</MenuItem>
                    <MenuItem value="LARGE">Large ($25,000 - $100,000)</MenuItem>
                    <MenuItem value="ENTERPRISE">Enterprise (&gt; $100,000)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {/* <Grid item xs={12} md={6}>
                <RHFTextField
                  name="projectCount"
                  label="Total Projects"
                  type="number"
                  placeholder="Number of projects"
                  helperText="How many projects have you completed?"
                />
              </Grid> */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                  Preferred Creators
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {(user?.client?.preferredCreators || []).length === 0 && (
                    <Typography variant="body2" color="text.secondary">
                      No preferred creators selected.
                    </Typography>
                  )}
                  {(user?.client?.preferredCreators || []).map((creatorId: number) => {
                    const creator = getCreator(creatorId);
                    return (
                      <Link
                        key={creatorId}
                        href={`/creators/${creatorId}`}
                        style={{ textDecoration: 'none' }}
                      >
                        <Chip
                          label={
                            creator && creator.firstName && creator.lastName
                              ? `${creator.firstName} ${creator.lastName}`
                              : `Creator #${creatorId}`
                          }
                          clickable
                          color="primary"
                          sx={{ mb: 1 }}
                        />
                      </Link>
                    );
                  })}
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
        <Button variant="contained" onClick={handleSubmit(onSubmit)} disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditBudgetProjectsDialog;
