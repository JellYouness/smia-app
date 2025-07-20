import { Box, Chip, Popover, Typography, useTheme, Stack } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Language {
  language: string;
  proficiency: string;
}

interface LanguageChipsProps {
  languages: Language[];
}

const LanguageChips: React.FC<LanguageChipsProps> = ({ languages }) => {
  const { t } = useTranslation(['common']);
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const moreCount = languages.length - 2;

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const proficiencyConfig = {
    NATIVE: {
      level: 5,
      label: 'Native',
      color: theme.palette.success.dark,
    },
    FLUENT: {
      level: 4,
      label: 'Fluent',
      color: theme.palette.info.dark,
    },
    CONVERSATIONAL: {
      level: 3,
      label: 'Conversational',
      color: theme.palette.warning.dark,
    },
    BASIC: {
      level: 2,
      label: 'Basic',
      color: theme.palette.grey[600],
    },
  };

  const renderProficiencyIndicator = (proficiency: string) => {
    const config =
      proficiencyConfig[proficiency as keyof typeof proficiencyConfig] || proficiencyConfig.BASIC;

    return (
      <Box display="flex" alignItems="center" ml={0.5} gap={0.5}>
        {[...Array(5)].map((_, i) => (
          <Box
            key={i}
            sx={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              bgcolor: i < config.level ? config.color : theme.palette.grey[300],
            }}
          />
        ))}
      </Box>
    );
  };

  return (
    <Box display="flex" alignItems="center" flexWrap="wrap" gap={1}>
      {languages.slice(0, 2).map((lang) => {
        return (
          <Chip
            key={lang.language}
            label={
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="body2" fontWeight={500}>
                  {lang.language.charAt(0).toUpperCase() + lang.language.slice(1).toLowerCase()}
                </Typography>
                {renderProficiencyIndicator(lang.proficiency)}
              </Box>
            }
            size="small"
            variant="outlined"
            sx={{
              p: 2,
              borderColor: theme.palette.divider,
              backgroundColor: 'transparent',
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
              position: 'relative',
              overflow: 'visible',
            }}
          />
        );
      })}

      {moreCount > 0 && (
        <>
          <Chip
            label={`+${moreCount}`}
            size="small"
            onClick={handleOpen}
            sx={{
              p: 2,
              cursor: 'pointer',
              backgroundColor: theme.palette.grey[100],
              borderColor: theme.palette.divider,
              '&:hover': {
                backgroundColor: theme.palette.grey[200],
              },
            }}
          />
          <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            PaperProps={{
              sx: {
                borderRadius: 2,
                boxShadow: theme.shadows[4],
                minWidth: 220,
                p: 2,
                border: `1px solid ${theme.palette.divider}`,
              },
            }}
          >
            <Typography variant="subtitle2" fontWeight={600} mb={2}>
              {t('common:language_proficiency')}
            </Typography>
            <Stack gap={1.5}>
              {languages.map((lang) => {
                const config =
                  proficiencyConfig[lang.proficiency as keyof typeof proficiencyConfig] ||
                  proficiencyConfig.BASIC;

                return (
                  <Box
                    key={lang.language}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ minWidth: 200 }}
                  >
                    <Typography variant="body2" fontWeight={500}>
                      {lang.language}
                    </Typography>
                    <Box display="flex" alignItems="center">
                      <Box display="flex" mr={1.5} gap={0.5}>
                        {[...Array(5)].map((_, i) => (
                          <Box
                            key={i}
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              bgcolor: i < config.level ? config.color : theme.palette.grey[300],
                            }}
                          />
                        ))}
                      </Box>
                      <Typography variant="caption" fontWeight={500} color="text.secondary">
                        {config.label}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </Stack>
          </Popover>
        </>
      )}
    </Box>
  );
};

export default LanguageChips;
