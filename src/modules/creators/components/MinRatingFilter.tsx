import React from 'react';
import { Select, OutlinedInput, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface MinRatingFilterProps {
  value: string;
  onChange: (value: string) => void;
  options: number[];
}

const MinRatingFilter: React.FC<MinRatingFilterProps> = ({ value, onChange, options }) => {
  const { t } = useTranslation(['user', 'common', 'list']);
  return (
    <Select
      label={t('list:rating')}
      displayEmpty
      value={value}
      onChange={(e) => onChange(e.target.value as string)}
      size="small"
      sx={{ minWidth: 120 }}
      input={<OutlinedInput size="small" label={t('list:rating')} />}
      renderValue={(selected) => (selected ? `${t('list:rating')}: ${selected}` : t('list:rating'))}
    >
      <MenuItem value="">{t('common:all')}</MenuItem>
      {options.map((rating) => (
        <MenuItem key={rating} value={rating}>
          {rating}+
        </MenuItem>
      ))}
    </Select>
  );
};

export default MinRatingFilter;
