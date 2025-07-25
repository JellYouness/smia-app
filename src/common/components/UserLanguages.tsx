import React from 'react';
import { Box, Typography, Stack, IconButton } from '@mui/material';
import { Edit } from '@mui/icons-material';
import LanguageChips from '@modules/projects/components/partials/LanguageChips';
import { TFunction } from 'next-i18next';
import { LanguageOptions } from '@modules/creators/defs/enums';

interface Language {
  language: string;
  proficiency: string;
}

interface UserLanguagesProps {
  languages: Language[];
  onEdit?: () => void;
  editable?: boolean;
  fallbackText?: string;
  t?: TFunction;
  titleSize?: 'h6' | 'h5' | 'h4' | 'h3' | 'h2' | 'h1';
  borderBottom?: boolean;
}

const UserLanguages: React.FC<UserLanguagesProps> = ({
  languages,
  onEdit,
  t,
  editable = false,
  fallbackText = 'No languages added yet',
  titleSize = 'h6',
  borderBottom = false,
}) => {
  languages = languages.map((lang) => ({
    language: LanguageOptions.find((l) => l.value === lang.language)?.label || lang.language,
    proficiency: lang.proficiency,
  }));
  return (
    <Box sx={{ p: 2, borderBottom: borderBottom ? '1px solid' : 'none', borderColor: 'divider' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
          mb: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant={titleSize} sx={{ fontWeight: 600 }}>
            {t ? t('user:languages') : 'Languages'}
          </Typography>
        </Box>
        {editable && onEdit && (
          <IconButton size="small" onClick={onEdit} sx={{ color: 'primary.main' }}>
            <Edit sx={{ fontSize: 16 }} />
          </IconButton>
        )}
      </Box>
      <Stack spacing={1}>
        {languages && languages.length > 0 ? (
          <LanguageChips languages={languages} />
        ) : (
          <Typography variant="body2" color="text.secondary">
            {fallbackText}
          </Typography>
        )}
      </Stack>
    </Box>
  );
};

export default UserLanguages;
