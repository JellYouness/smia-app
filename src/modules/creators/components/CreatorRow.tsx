import React from 'react';
import {
  Box,
  Typography,
  Chip,
  Avatar,
  Rating,
  Button,
  Stack,
  Divider,
  Tooltip,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CancelIcon from '@mui/icons-material/Cancel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Creator, AvailabilityStatus } from '@modules/creators/defs/types';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'next-i18next';
import LanguageChips from '@modules/projects/components/partials/LanguageChips';
import { LanguageOptions } from '@modules/creators/defs/enums';

const getAvailabilityChipProps = (status: AvailabilityStatus, t: TFunction) => {
  switch (status) {
    case 'AVAILABLE':
      return {
        color: 'success',
        icon: <CheckCircleIcon fontSize="small" />,
        label: t('user:available'),
      };
    case 'LIMITED':
      return {
        color: 'warning',
        icon: <WarningAmberIcon fontSize="small" />,
        label: t('user:limited'),
      };
    case 'UNAVAILABLE':
      return {
        color: 'error',
        icon: <CancelIcon fontSize="small" />,
        label: t('user:unavailable'),
      };
    case 'BUSY':
      return { color: 'info', icon: <AccessTimeIcon fontSize="small" />, label: t('user:busy') };
    default:
      return { color: 'default', icon: null, label: status };
  }
};

const CreatorRow = ({ creator }: { creator: Creator }) => {
  const router = useRouter();
  const { t } = useTranslation(['user', 'common']);
  const skills = creator.skills || [];
  const languages = creator.languages.map((lang) => ({
    language: LanguageOptions.find((l) => l.value === lang.language)?.label || lang.language,
    proficiency: lang.proficiency,
  }));

  const maxSkillChips = 5;
  // const maxLangChips = 3;
  const skillOverflow = skills.length > maxSkillChips ? skills.slice(maxSkillChips) : [];
  // const langOverflow = languages.length > maxLangChips ? languages.slice(maxLangChips) : [];
  const availabilityProps = getAvailabilityChipProps(creator.availability, t);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'flex-start', sm: 'center' },
        gap: 3,
        p: { xs: 3, sm: 4 },
        borderRadius: 3,
        boxShadow: 2,
        mb: 3,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        transition: 'box-shadow 0.2s, transform 0.2s',
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        '&:hover': {
          boxShadow: 6,
          transform: 'translateY(-2px) scale(1.01)',
          borderColor: 'primary.light',
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 100 }}>
        <Avatar
          src={creator.user?.profilePicture}
          sx={{ width: 80, height: 80, mb: 1, boxShadow: 1 }}
        />
      </Box>
      <Box flex={1} minWidth={0}>
        <Typography variant="h6" noWrap>
          {creator.user?.firstName} {creator.user?.lastName}
        </Typography>
        {creator.user?.title || creator.user?.profile?.title ? (
          <Typography variant="h5" color="text.secondary" noWrap>
            {creator.user?.title || creator.user?.profile?.title}
          </Typography>
        ) : null}
        <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
          <Typography variant="subtitle2" color="text.secondary" noWrap>
            {t('user:skills')}:
          </Typography>
          {skills.slice(0, maxSkillChips).map((skill) => (
            <Chip
              key={skill}
              label={skill}
              size="small"
              variant="outlined"
              color="primary"
              sx={{ bgcolor: 'white', p: 1 }}
              icon={<StarIcon fontSize="small" />}
            />
          ))}
          {skillOverflow.length > 0 && (
            <Tooltip title={skillOverflow.join(', ')}>
              <Chip label={`+${skillOverflow.length}`} size="small" variant="outlined" />
            </Tooltip>
          )}
        </Stack>
        <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
          <Typography variant="subtitle2" color="text.secondary" noWrap>
            {t('user:languages')}:
          </Typography>
          <LanguageChips languages={languages} bgColor="white" size="xs" direction="row" />
          {/* {languages.slice(0, maxLangChips).map((lang, idx) => (
            <Chip
              key={lang.language + idx}
              label={lang.language}
              size="small"
              variant="outlined"
              color="secondary"
              icon={<LanguageIcon fontSize="small" />}
            />
          ))}
          {langOverflow.length > 0 && (
            <Tooltip title={langOverflow.map((l) => l.language).join(', ')}>
              <Chip label={`+${langOverflow.length}`} size="small" variant="outlined" />
            </Tooltip>
          )} */}
        </Stack>
      </Box>
      <Divider
        orientation="vertical"
        flexItem
        sx={{ display: { xs: 'none', sm: 'block' }, mx: 2, borderColor: 'grey.200' }}
      />
      <Stack
        direction="column"
        alignItems="flex-end"
        minWidth={140}
        spacing={1}
        sx={{ mt: { xs: 2, sm: 0 } }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <Rating
            value={Number(creator.averageRating) || 0}
            precision={0.1}
            readOnly
            size="medium"
          />
          <Typography variant="body2">({creator.ratingCount || 0})</Typography>
        </Box>
        <Chip
          label={availabilityProps.label}
          color={
            availabilityProps.color as
              | 'success'
              | 'warning'
              | 'error'
              | 'info'
              | 'default'
              | 'primary'
              | 'secondary'
          }
          icon={availabilityProps.icon ? availabilityProps.icon : undefined}
          size="small"
          sx={{ fontWeight: 600, letterSpacing: 0.5, color: 'white' }}
        />
        <Typography variant="body2" color="text.secondary">
          {creator.experience} {t('user:years_of_experience')}
        </Typography>
        <Button
          variant="contained"
          size="medium"
          sx={{ mt: 1, textTransform: 'none', fontWeight: 600, borderRadius: 2, px: 3 }}
          onClick={() => router.push(`/creators/${creator.id}`)}
        >
          {t('user:view_profile')}
        </Button>
      </Stack>
    </Box>
  );
};

export default CreatorRow;
