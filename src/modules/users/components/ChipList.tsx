import React from 'react';
import { Chip } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import JsonDataRenderer from './JsonDataRenderer';

interface ChipListProps {
  items: string[] | string;
  color?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  variant?: 'filled' | 'outlined';
  fallback?: React.ReactNode;
}

const ChipList: React.FC<ChipListProps> = ({
  items,
  color = 'default',
  variant = 'filled',
  fallback = <Skeleton variant="rectangular" height={40} sx={{ borderRadius: 2 }} />,
}) => {
  // lowercase the items & add uppercase first letter
  return (
    <JsonDataRenderer
      data={items}
      renderItem={(item, index) => (
        <Chip key={index} label={item} color={color} variant={variant} sx={{ fontWeight: 500 }} />
      )}
      fallback={fallback}
    />
  );
};

export default ChipList;
