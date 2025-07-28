import React from 'react';
import { Typography, Stack } from '@mui/material';
import LanguageChips from '@modules/projects/components/partials/LanguageChips';
import { TFunction } from 'next-i18next';
import { LanguageOptions } from '@modules/creators/defs/enums';
import SectionCard from '@modules/users/components/SectionCard';

interface Language {
  language: string;
  proficiency: string;
}

interface UserLanguagesProps {
  languages: Language[];
  onEdit?: () => void;
  fallbackText?: string;
  t?: TFunction;
  titleSize?: 'h6' | 'h5' | 'h4' | 'h3' | 'h2' | 'h1';
  readOnly?: boolean;
}

const UserLanguages: React.FC<UserLanguagesProps> = ({
  languages,
  onEdit,
  t,
  fallbackText = 'No languages added yet',
  titleSize = 'h6',
  readOnly = false,
}) => {
  languages = languages.map((lang) => ({
    language: LanguageOptions.find((l) => l.value === lang.language)?.label || lang.language,
    proficiency: lang.proficiency,
  }));
  return (
    <>
      <SectionCard
        title={t ? t('user:languages') : 'Languages'}
        readOnly={readOnly}
        onEdit={onEdit}
        titleSize={titleSize}
      >
        <Stack spacing={1}>
          {languages && languages.length > 0 ? (
            <LanguageChips languages={languages} />
          ) : (
            <Typography variant="body2" color="text.secondary">
              {fallbackText}
            </Typography>
          )}
        </Stack>
      </SectionCard>
    </>
  );
};

export default UserLanguages;
