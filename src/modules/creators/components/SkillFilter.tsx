import React from 'react';
import { Select, OutlinedInput, MenuItem, Checkbox, ListItemText } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface SkillFilterProps {
  value: string[];
  onChange: (value: string[]) => void;
  options: string[];
}

const SkillFilter: React.FC<SkillFilterProps> = ({ value, onChange, options }) => {
  const { t } = useTranslation(['user', 'common']);
  return (
    <Select
      label={t('user:skills')}
      multiple
      displayEmpty
      value={value}
      onChange={(e) => {
        const val =
          typeof e.target.value === 'string'
            ? e.target.value.split(',')
            : (e.target.value as string[]);
        onChange(val);
      }}
      input={<OutlinedInput size="small" label={t('user:skills')} />}
      renderValue={(selected) =>
        selected.length === 0 ? t('user:skills') : (selected as string[]).join(', ')
      }
      size="small"
      sx={{ minWidth: 180 }}
    >
      {options.map((skill) => (
        <MenuItem key={skill} value={skill}>
          <Checkbox checked={value.indexOf(skill) > -1} size="small" />
          <ListItemText primary={skill} />
        </MenuItem>
      ))}
    </Select>
  );
};

export default SkillFilter;
