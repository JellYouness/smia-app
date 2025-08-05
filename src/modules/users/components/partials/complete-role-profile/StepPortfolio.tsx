import {
  Card,
  CardContent,
  Stack,
  Avatar,
  Typography,
  Grid,
  Fade,
  Box,
  IconButton,
} from '@mui/material';
import { Star, Add, Delete } from '@mui/icons-material';
import { RHFTextField } from '@common/components/lib/react-hook-form';
import { useFieldArray } from 'react-hook-form';
import { TFunction } from 'i18next';
import { Any } from '@common/defs/types';

interface StepPortfolioProps {
  methods: Any;
  t: TFunction;
}

const StepPortfolio = ({ methods, t }: StepPortfolioProps) => {
  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: 'portfolio',
  });

  return (
    <Fade in timeout={500}>
      <Card elevation={0} sx={{ border: (theme) => `1px solid ${theme.palette.divider}` }}>
        <CardContent sx={{ p: 4 }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <Star />
            </Avatar>
            <Typography variant="h5" fontWeight={600}>
              {t('creator:portfolio')}
            </Typography>
          </Stack>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {t('creator:portfolio_description')}
          </Typography>

          {fields.map((field, index) => (
            <Box
              key={field.id}
              sx={{
                p: 3,
                border: (theme) => `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                mb: 2,
                position: 'relative',
              }}
            >
              <IconButton
                onClick={() => remove(index)}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  color: 'error.main',
                }}
              >
                <Delete />
              </IconButton>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <RHFTextField
                    name={`portfolio.${index}.title`}
                    label={t('creator:portfolio_item_title')}
                    placeholder={t('creator:enter_portfolio_item_title')}
                    helperText={t('creator:portfolio_item_title_help')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <RHFTextField
                    name={`portfolio.${index}.description`}
                    label={t('creator:portfolio_item_description')}
                    multiline
                    rows={3}
                    placeholder={t('creator:enter_portfolio_item_description')}
                    helperText={t('creator:portfolio_item_description_help')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <RHFTextField
                    name={`portfolio.${index}.url`}
                    label={t('creator:portfolio_item_url')}
                    placeholder={t('creator:enter_portfolio_item_url')}
                    helperText={t('creator:portfolio_item_url_help')}
                  />
                </Grid>
              </Grid>
            </Box>
          ))}

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <IconButton
              onClick={() => append({ title: '', description: '', url: '' })}
              sx={{
                border: (theme) => `2px dashed ${theme.palette.divider}`,
                borderRadius: 2,
                p: 2,
                '&:hover': {
                  borderColor: 'primary.main',
                  color: 'primary.main',
                },
              }}
            >
              <Add />
            </IconButton>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {t('creator:add_portfolio_item')}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Fade>
  );
};

export default StepPortfolio;
