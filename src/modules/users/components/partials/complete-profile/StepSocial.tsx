import { Card, CardContent, Stack, Avatar, Typography, Grid, Fade, Box } from '@mui/material';
import { Share } from '@mui/icons-material';
import { RHFTextField } from '@common/components/lib/react-hook-form';
import { TFunction } from 'i18next';

const StepSocial = ({ methods, t }: { methods: any; t: TFunction }) => {
  return (
    <Fade in timeout={500}>
      <Card elevation={0} sx={{ border: (theme) => `1px solid ${theme.palette.divider}` }}>
        <CardContent sx={{ p: 4 }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
            <Avatar sx={{ bgcolor: 'success.main' }}>
              <Share />
            </Avatar>
            <Typography variant="h5" fontWeight={600}>
              {t('user:social_media_links')}
            </Typography>
          </Stack>
          <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
            {t('user:social_media_links_help')}
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <RHFTextField
                name="socialMediaLinks.facebook"
                label="Facebook"
                placeholder={t('user:enter_facebook_url')}
                helperText={t('user:facebook_url_help')}
                InputProps={{
                  startAdornment: (
                    <Box component="span" sx={{ mr: 1, color: '#1877f2' }}>
                      📘
                    </Box>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFTextField
                name="socialMediaLinks.twitter"
                label="Twitter"
                placeholder={t('user:enter_twitter_url')}
                helperText={t('user:twitter_url_help')}
                InputProps={{
                  startAdornment: (
                    <Box component="span" sx={{ mr: 1, color: '#1da1f2' }}>
                      🐦
                    </Box>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFTextField
                name="socialMediaLinks.linkedin"
                label="LinkedIn"
                placeholder={t('user:enter_linkedin_url')}
                helperText={t('user:linkedin_url_help')}
                InputProps={{
                  startAdornment: (
                    <Box component="span" sx={{ mr: 1, color: '#0077b5' }}>
                      💼
                    </Box>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFTextField
                name="socialMediaLinks.instagram"
                label="Instagram"
                placeholder={t('user:enter_instagram_url')}
                helperText={t('user:instagram_url_help')}
                InputProps={{
                  startAdornment: (
                    <Box component="span" sx={{ mr: 1, color: '#e4405f' }}>
                      📷
                    </Box>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Fade>
  );
};

export default StepSocial;
